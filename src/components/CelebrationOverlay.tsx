import { motion, AnimatePresence } from 'framer-motion';

const CELEBRATIONS = {
  four: {
    text: 'FOUR',
    bg: 'bg-yellow-500',
    textCol: 'text-black',
    sub: 'BOUNDARY'
  },
  six: {
    text: 'SIX',
    bg: 'bg-purple-600',
    textCol: 'text-white',
    sub: 'MAXIMUM'
  },
  wicket: {
    text: 'WICKET',
    bg: 'bg-red-600',
    textCol: 'text-white',
    sub: 'OUT'
  }
} as const;

export default function CelebrationOverlay({ type }: { type?: 'four' | 'six' | 'wicket' | null }) {
  if (!type) return null;

  const config = CELEBRATIONS[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        {/* Background Flash */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1.2, rotate: 0 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className={`absolute w-[120%] h-40 ${config.bg} shadow-[0_0_100px_rgba(0,0,0,0.5)]`}
        />

        {/* Text Animation */}
        <div className="relative flex flex-col items-center">
           <motion.span
             initial={{ y: 100, opacity: 0, skewX: 20 }}
             animate={{ y: 0, opacity: 1, skewX: -10 }}
             exit={{ y: -100, opacity: 0 }}
             transition={{ type: 'spring', damping: 12 }}
             className={`text-[12rem] font-black italic leading-none ${config.textCol} drop-shadow-2xl`}
           >
             {config.text}
           </motion.span>
           <motion.span
             initial={{ opacity: 0, letterSpacing: '1em' }}
             animate={{ opacity: 1, letterSpacing: '0.2em' }}
             className={`text-2xl font-black uppercase ${config.textCol} opacity-80`}
           >
             {config.sub}
           </motion.span>
        </div>

        {/* Particle Effects */}
        <div className="absolute inset-0 overflow-hidden">
           {[...Array(20)].map((_, i) => (
             <motion.div
               key={i}
               initial={{
                 x: '50%',
                 y: '50%',
                 scale: 0
               }}
               animate={{
                 x: `${Math.random() * 100}%`,
                 y: `${Math.random() * 100}%`,
                 scale: Math.random() * 2,
                 opacity: 0
               }}
               transition={{ duration: 1, ease: 'easeOut' }}
               className={`absolute w-4 h-4 rounded-full ${config.bg}`}
             />
           ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
