import { motion } from 'framer-motion';
import type { BroadcastState } from '../types/broadcast';

export default function PlayingXIOverlay({ state }: { state: BroadcastState }) {
  const { match, teamColors } = state;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <div className="w-full max-w-6xl grid grid-cols-2 gap-px bg-white/10 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        {/* Team 1 */}
        <div className="bg-slate-900/90 p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-4 h-12" style={{ backgroundColor: teamColors.team1 }}></div>
            <h2 className="text-4xl font-black uppercase text-white">{match.team1}</h2>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-3"
          >
            {match.playingXI?.team1.map((player, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="flex items-baseline gap-4 text-white/80 border-b border-white/5 pb-1"
              >
                <span className="text-sm font-bold text-slate-500 w-6">{(idx + 1).toString().padStart(2, '0')}</span>
                <span className="text-xl font-bold uppercase tracking-tight">{player}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Team 2 */}
        <div className="bg-slate-900/90 p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-4 h-12" style={{ backgroundColor: teamColors.team2 }}></div>
            <h2 className="text-4xl font-black uppercase text-white">{match.team2}</h2>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-3"
          >
            {match.playingXI?.team2.map((player, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="flex items-baseline gap-4 text-white/80 border-b border-white/5 pb-1"
              >
                <span className="text-sm font-bold text-slate-500 w-6">{(idx + 1).toString().padStart(2, '0')}</span>
                <span className="text-xl font-bold uppercase tracking-tight">{player}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
