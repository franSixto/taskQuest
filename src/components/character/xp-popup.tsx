'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface XPPopupProps {
  amount: number;
  source?: string;
  onComplete?: () => void;
}

export function XPPopup({ amount, source, onComplete }: XPPopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: -30, scale: 1 }}
      exit={{ opacity: 0, y: -60, scale: 0.8 }}
      className="pointer-events-none fixed left-1/2 top-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 backdrop-blur-sm">
        <Star className="h-5 w-5 text-accent" />
        <span className="text-lg font-bold text-accent">+{amount} XP</span>
      </div>
      {source && (
        <p className="mt-1 text-center text-xs text-gray-400">{source}</p>
      )}
    </motion.div>
  );
}

// Level up celebration
interface LevelUpPopupProps {
  newLevel: number;
  newTitle?: string;
  onComplete?: () => void;
}

export function LevelUpPopup({ newLevel, newTitle, onComplete }: LevelUpPopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        className="flex flex-col items-center"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <motion.div
          className="mb-4 text-6xl"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          <Sparkles className="h-16 w-16 text-accent" />
        </motion.div>
        
        <motion.h2
          className="mb-2 text-4xl font-bold text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ¡NIVEL {newLevel}!
        </motion.h2>
        
        {newTitle && (
          <motion.p
            className="text-lg text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Nuevo título: {newTitle}
          </motion.p>
        )}
        
        <motion.div
          className="mt-4 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                delay: i * 0.1,
              }}
            >
              <Star className="h-6 w-6 text-accent" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Gold gain popup
interface GoldPopupProps {
  amount: number;
  onComplete?: () => void;
}

export function GoldPopup({ amount, onComplete }: GoldPopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="pointer-events-none"
    >
      <div className="flex items-center gap-1 text-accent">
        <TrendingUp className="h-4 w-4" />
        <span className="text-sm font-bold">+{amount} oro</span>
      </div>
    </motion.div>
  );
}

// Combined popup manager
export function PopupManager() {
  const [xpPopups, setXpPopups] = useState<{ id: string; amount: number; source?: string }[]>([]);
  const [levelUp, setLevelUp] = useState<{ level: number; title?: string } | null>(null);

  return (
    <>
      <AnimatePresence>
        {xpPopups.map((popup) => (
          <XPPopup
            key={popup.id}
            amount={popup.amount}
            source={popup.source}
            onComplete={() => setXpPopups((prev) => prev.filter((p) => p.id !== popup.id))}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {levelUp && (
          <LevelUpPopup
            newLevel={levelUp.level}
            newTitle={levelUp.title}
            onComplete={() => setLevelUp(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
