'use client';

import { motion } from 'framer-motion';

const dot = {
  initial: { y: 0 },
  animate: { y: [-4, 0, -4] },
};

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <span className="text-xs text-slate-400 dark:text-slate-500 mr-1 font-medium">
        MediBot is thinking
      </span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"
          variants={dot}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.18,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
