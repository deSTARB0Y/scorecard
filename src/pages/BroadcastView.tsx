import { useBroadcastChannel } from '../hooks/useBroadcastChannel';
import MiniScorecard from '../components/MiniScorecard';
import FullScorecard from '../components/FullScorecard';
import PlayingXIOverlay from '../components/PlayingXIOverlay';
import ManhattanGraph from '../components/ManhattanGraph';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { AnimatePresence, motion } from 'framer-motion';

export default function BroadcastView() {
  const { state } = useBroadcastChannel();

  if (!state) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-display uppercase tracking-widest text-2xl">
      Waiting for Admin Connection...
    </div>
  );

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden font-display transition-colors duration-500 ${
        state.isTransparent ? 'bg-transparent' : 'bg-slate-900'
      }`}
      style={state.bgImage && !state.isTransparent ? {
        backgroundImage: `url(${state.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      <AnimatePresence mode="wait">
        {state.scene === 'mini-scorecard' && (
          <MiniScorecard key="mini" state={state} />
        )}

        {state.scene === 'full-scorecard' && (
          <FullScorecard key="full" state={state} />
        )}

        {state.scene === 'playing-xi' && (
          <PlayingXIOverlay key="xi" state={state} />
        )}

        {state.scene === 'manhattan' && (
          <ManhattanGraph key="manhattan" state={state} />
        )}
      </AnimatePresence>

      <CelebrationOverlay type={state.celebration} />

      {/* Global Watermark/Status (optional) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        className="absolute top-8 right-8 text-white/20 text-xl font-bold italic"
      >
        LIVE STREAM
      </motion.div>
    </div>
  );
}
