export interface Batter {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  sr: string;
  isStriker: boolean;
}

export interface Bowler {
  name: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  econ: string;
}

export interface OverData {
  overNumber: number;
  runs: number;
  wickets: number;
  bowler: string;
  balls: string[];
}

export interface MatchState {
  team1: string;
  team2: string;
  score: string;
  wickets: number;
  overs: string;
  target?: string;
  battingTeam: string;
  bowlingTeam: string;
  crr: string;
  rrr?: string;
  batters: Batter[];
  bowlers: Bowler[];
  recentBalls: string[];
  lastWicket: string;
  partnership: string;
  oversData: OverData[];
  toss: string;
  venue: string;
  playingXI: {
    team1: string[];
    team2: string[];
  };
}
