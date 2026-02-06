import { motion } from 'framer-motion';
import type { BroadcastState } from '../types/broadcast';

export default function ManhattanGraph({ state }: { state: BroadcastState }) {
  const { match, teamColors } = state;
  const oversData = match.oversData || [];

  const maxRuns = Math.max(...oversData.map(o => o.runs), 10);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-20"
    >
      <div className="w-full max-w-5xl bg-slate-900/95 p-12 rounded-3xl shadow-2xl border border-white/10">
        <h2 className="text-3xl font-black uppercase text-white mb-12 flex items-center gap-4">
          <span className="w-2 h-8" style={{ backgroundColor: teamColors.team1 }}></span>
          Manhattan Graph • {match.battingTeam} Innings
        </h2>

        <div className="h-80 flex items-end gap-2 border-l-2 border-b-2 border-white/20 pl-4 pb-4">
          {oversData.map((over, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center group relative">
              {over.wickets > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 + 0.5 }}
                  className="absolute bottom-full mb-2 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                >
                  W
                </motion.div>
              )}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(over.runs / maxRuns) * 100}%` }}
                transition={{ duration: 1, delay: idx * 0.05, ease: 'easeOut' }}
                className="w-full min-w-[20px] rounded-t-sm relative group-hover:brightness-125 transition-all"
                style={{ backgroundColor: teamColors.team1 }}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {over.runs}
                </span>
              </motion.div>
              <span className="mt-4 text-[10px] font-black text-slate-500">{over.overNumber}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: teamColors.team1 }}></div>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Runs</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Wicket</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
