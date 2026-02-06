import { motion } from 'framer-motion';
import type { BroadcastState } from '../types/broadcast';

export default function FullScorecard({ state }: { state: BroadcastState }) {
  const { match, teamColors } = state;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-20 bg-black/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-5xl bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header */}
        <div
          className="p-8 flex justify-between items-center"
          style={{ backgroundColor: teamColors.team1 }}
        >
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter">{match.battingTeam}</h2>
            <p className="text-lg font-bold opacity-80">{match.venue} • {match.toss}</p>
          </div>
          <div className="text-right">
            <span className="text-6xl font-black">{match.score}</span>
            <span className="text-2xl font-bold opacity-80 block">Overs: {match.overs}</span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-2 gap-12">
          {/* Batting Stats */}
          <div>
            <h3 className="text-xl font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-white/10 pb-2">Batting</h3>
            <div className="space-y-4">
              {match.batters?.map((batter, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold group-hover:text-yellow-500 transition-colors">{batter.name}</span>
                    <span className="text-xs text-slate-500 uppercase font-bold">{batter.sr} SR</span>
                  </div>
                  <div className="flex gap-8 items-center">
                    <div className="text-right">
                      <span className="block text-2xl font-black">{batter.runs}</span>
                      <span className="block text-xs font-bold text-slate-500">{batter.balls} balls</span>
                    </div>
                    <div className="w-24 text-right flex gap-2 justify-end">
                      <div className="text-center">
                        <span className="block text-sm font-bold">{batter.fours}</span>
                        <span className="block text-[10px] text-slate-500 font-bold uppercase">4s</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-sm font-bold">{batter.sixes}</span>
                        <span className="block text-[10px] text-slate-500 font-bold uppercase">6s</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bowling Stats */}
          <div>
            <h3 className="text-xl font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-white/10 pb-2">Bowling</h3>
            <div className="space-y-4">
              {match.bowlers?.map((bowler, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold group-hover:text-yellow-500 transition-colors">{bowler.name}</span>
                    <span className="text-xs text-slate-500 uppercase font-bold">{bowler.econ} ECON</span>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-center min-w-[40px]">
                      <span className="block text-2xl font-black text-yellow-500">{bowler.wickets}</span>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">Wkts</span>
                    </div>
                    <div className="text-center min-w-[40px]">
                      <span className="block text-2xl font-black">{bowler.runs}</span>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">Runs</span>
                    </div>
                    <div className="text-center min-w-[40px]">
                      <span className="block text-2xl font-black">{bowler.overs}</span>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">Ovs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Recent Balls */}
        <div className="bg-black/20 p-6 flex items-center justify-between border-t border-white/5">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Run Rate</span>
              <span className="text-xl font-bold">{match.crr}</span>
           </div>
           <div className="flex gap-3">
              {match.recentBalls?.slice(-12).map((ball, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black
                    ${ball === 'W' ? 'bg-red-600 text-white' :
                      ['4', '6'].includes(ball) ? 'bg-yellow-500 text-black' :
                      ball === '•' ? 'bg-white/10 text-white/40' : 'bg-white/20 text-white'}
                  `}
                >
                  {ball}
                </div>
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
