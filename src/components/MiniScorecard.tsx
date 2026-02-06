import { motion } from 'framer-motion';
import type { BroadcastState } from '../types/broadcast';

export default function MiniScorecard({ state }: { state: BroadcastState }) {
  const { match, teamColors } = state;

  return (
    <motion.div
      initial={{ y: 150, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 150, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl h-24 bg-black/90 text-white rounded-lg flex items-center overflow-hidden border-b-4 shadow-2xl"
      style={{ borderBottomColor: teamColors.team1 }}
    >
      {/* Team Info Section */}
      <div
        className="h-full px-8 flex flex-col justify-center min-w-[200px]"
        style={{ backgroundColor: teamColors.team1 }}
      >
        <span className="text-sm font-bold opacity-80 uppercase leading-none">{match.battingTeam}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black">{match.score}</span>
          <span className="text-xl font-bold opacity-80">({match.overs})</span>
        </div>
      </div>

      {/* Batters Section */}
      <div className="flex-1 h-full flex items-center px-8 gap-12 border-l border-white/10 overflow-hidden">
        {match.batters?.length ? match.batters.map((batter, idx) => (
          <div key={idx} className={`flex flex-col ${batter.isStriker ? 'opacity-100' : 'opacity-60'}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {batter.isStriker ? 'Batting •' : 'Batter'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">{batter.name}</span>
              <span className="text-2xl font-black text-white">{batter.runs}</span>
              <span className="text-sm font-bold opacity-60">({batter.balls})</span>
            </div>
          </div>
        )) : (
          <span className="text-white/20 italic font-bold uppercase tracking-widest">Innings Break / Ready</span>
        )}
      </div>

      {/* Bowler Section */}
      <div className="px-8 h-full flex items-center gap-8 border-l border-white/10 bg-white/5">
        {match.bowlers?.[0] && (
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bowler</span>
            <div className="flex items-baseline gap-2 justify-end">
              <span className="text-xl font-bold">{match.bowlers[0].name}</span>
              <span className="text-xl font-black">{match.bowlers[0].wickets}-{match.bowlers[0].runs}</span>
              <span className="text-sm font-bold opacity-60">({match.bowlers[0].overs})</span>
            </div>
          </div>
        )}
      </div>

      {/* Recent Balls */}
      <div className="px-8 h-full flex flex-col justify-center gap-1 bg-white/10 min-w-[200px]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Recent</span>
        <div className="flex gap-2">
          {match.recentBalls?.slice(-6).map((ball, idx) => (
            <div
              key={idx}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-inner
                ${ball === 'W' ? 'bg-red-600 text-white' :
                  ['4', '6'].includes(ball) ? 'bg-yellow-500 text-black' :
                  ball === '•' ? 'bg-slate-700 text-white/50' : 'bg-white/20 text-white'}
              `}
            >
              {ball}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
