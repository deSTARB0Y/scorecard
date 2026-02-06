import type { MatchState, OverData } from '../types/match';

const ROLES = ['batter', 'bowler', 'allrounder', 'wicketkeeper', 'captain', 'opening', 'middle-order'];

export function parseMatchData(text: string): Partial<MatchState> {
  const state: Partial<MatchState> = {
    batters: [],
    bowlers: [],
    recentBalls: [],
    oversData: [],
    playingXI: { team1: [], team2: [] }
  };

  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  // 1. Teams and Venue
  for (const line of lines) {
    const match = line.match(/^(.+)\s+vs\s+(.+),\s+at\s+([^,]+),/);
    if (match) {
      state.team1 = match[1].trim();
      state.team2 = match[2].trim();
      state.venue = match[3].trim();
      break;
    }
  }

  // 2. Score and Overs
  for (const line of lines) {
    const match = line.match(/^([A-Za-z\s.]+)\s+\((\d+\/\d+)\sov\)\s+(\d+\/\d+)/);
    if (match) {
      state.battingTeam = match[1].trim();
      state.overs = match[2];
      state.score = match[3];
      state.wickets = parseInt(match[3].split('/')[1] || '0');
    }

    if (line.includes('chose to')) {
      state.toss = line;
    }

    if (line.includes('Current RR:')) {
      state.crr = line.split(':')[1].trim().split(' ')[0];
    }
  }

  // 3. Batters
  const battersHeaderIndex = lines.findIndex(l => l.includes('Batters') && l.includes('SR'));
  if (battersHeaderIndex !== -1) {
    for (let i = battersHeaderIndex + 1; i < lines.length; i++) {
      const nameLine = lines[i];
      if (nameLine.includes('Bowlers') || nameLine.includes('Last Bat')) break;
      const statsLine = lines[i+1];
      if (!nameLine || !statsLine || !/^\d+/.test(statsLine)) continue;

      const stats = statsLine.split(/\s+/);
      state.batters?.push({
        name: nameLine.replace(/\*|rhb|lhb/g, '').trim(),
        runs: parseInt(stats[0]),
        balls: parseInt(stats[1]),
        fours: parseInt(stats[2]),
        sixes: parseInt(stats[3]),
        sr: stats[4],
        isStriker: nameLine.includes('*')
      });
      i++;
    }
  }

  // 4. Bowlers
  const bowlersHeaderIndex = lines.findIndex(l => l.includes('Bowlers') && l.includes('Econ'));
  if (bowlersHeaderIndex !== -1) {
    for (let i = bowlersHeaderIndex + 1; i < lines.length; i++) {
      const nameLine = lines[i];
      if (nameLine.includes('Last Bat') || nameLine.includes('FOW') || nameLine.includes('Highlight')) break;
      const statsLine = lines[i+1];
      if (!nameLine || !statsLine || !/^\d+\.?\d*/.test(statsLine)) continue;

      const stats = statsLine.split(/\s+/);
      state.bowlers?.push({
        name: nameLine.replace(/lmf|sla|rf|rm|ls|ob/g, '').trim(),
        overs: stats[0],
        maidens: parseInt(stats[1]),
        runs: parseInt(stats[2]),
        wickets: parseInt(stats[3]),
        econ: stats[4]
      });
      i++;
    }
  }

  // 5. Recent Balls
  const fowIndex = lines.findIndex(l => l.includes('FOW:'));
  if (fowIndex !== -1) {
    const balls = [];
    for (let i = fowIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('Runs') || line.includes('Bowler') || line.includes('th')) break;
      if (line.length <= 4 && /^[0-9Ww•lb!]+$/.test(line)) {
        balls.push(line);
      }
    }
    if (balls.length > 0) state.recentBalls = balls;
  }

  // 6. Impactful Overs
  const impactfulIndex = lines.findIndex(l => l.includes('Highlight:') || l.includes('Impactful Overs'));
  if (impactfulIndex !== -1) {
    let i = impactfulIndex + 1;
    if (lines[i]?.includes('Ovs')) i++;

    while (i < lines.length) {
      const line = lines[i];
      const overMatch = line.match(/^(\d+)$/);
      if (!overMatch) { i++; continue; }

      const overNum = parseInt(overMatch[1]);
      const scoreLine = lines[i+1];
      if (!scoreLine || !scoreLine.includes('runs')) { i++; continue; }

      const runsMatch = scoreLine.match(/(\d+)\s+runs/);
      const wktMatch = scoreLine.match(/(\d+)\s+wkt/);

      const overData: OverData = {
        overNumber: overNum,
        runs: runsMatch ? parseInt(runsMatch[1]) : 0,
        wickets: wktMatch ? parseInt(wktMatch[1]) : 0,
        bowler: '',
        balls: []
      };

      i += 2;
      if (lines[i]?.startsWith('Bowler:')) {
        overData.bowler = lines[i].replace('Bowler:', '').trim();
        i++;
      }

      while (i < lines.length && !lines[i].includes('CRR:') && (isNaN(parseInt(lines[i])) || lines[i].includes('/') || lines[i].length > 2)) {
         if (lines[i].length <= 3 && /^[0-9•Wwlb]+$/.test(lines[i])) {
            overData.balls.push(lines[i]);
         }
         i++;
      }
      state.oversData?.push(overData);
    }
  }

  // 7. Playing XI
  const xiHeaderIndex = lines.findIndex(l => l.includes('Italy') && l.includes('United Arab Emirates') && !l.includes('vs'));
  if (xiHeaderIndex !== -1) {
    let i = xiHeaderIndex + 1;
    while (i < lines.length && state.playingXI!.team1.length < 15) {
      if (!/^\d+$/.test(lines[i])) { i++; continue; }
      i++; // Skip the number

      const p1 = lines[i];
      if (p1 && !ROLES.some(r => p1.toLowerCase().includes(r))) {
        state.playingXI?.team1.push(p1.replace('†', '').trim());
        i++;
      }

      const p2 = lines[i];
      if (p2 && !ROLES.some(r => p2.toLowerCase().includes(r))) {
        state.playingXI?.team2.push(p2.replace('†', '').trim());
        i++;
      }

      // Skip any remaining roles until next number
      while (i < lines.length && !/^\d+$/.test(lines[i]) && !lines[i].includes('Match Details')) {
        i++;
      }
    }
  }

  return state;
}
