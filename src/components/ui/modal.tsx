'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'md',
}: ModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with animated gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse" />
          </motion.div>

          {/* Modal Container - Centered with proper scroll */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={cn(
                'w-full pointer-events-auto',
                sizeClasses[size]
              )}
            >
              {/* Modal Content */}
              <div
                className={cn(
                  'relative rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-surface to-surface-dark',
                  'shadow-2xl shadow-primary/20 max-h-[85vh] flex flex-col',
                  'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-primary/10 before:via-transparent before:to-secondary/10 before:pointer-events-none',
                  className
                )}
              >
                {/* Decorative corner accents */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-secondary rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-secondary rounded-br-lg" />

                {/* Header */}
                {title && (
                  <div className="relative flex items-center justify-between border-b border-primary/30 px-6 py-4 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 rounded-t-2xl flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                        <div className="absolute inset-0 blur-sm bg-primary/50 rounded-full" />
                      </div>
                      <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="relative rounded-xl p-2 text-gray-400 transition-all hover:bg-error/20 hover:text-error group"
                    >
                      <X className="h-5 w-5 relative z-10" />
                      <div className="absolute inset-0 rounded-xl bg-error/0 group-hover:bg-error/10 transition-colors" />
                    </motion.button>
                  </div>
                )}

                {/* Content with scroll */}
                <div className="px-6 py-5 overflow-y-auto flex-1 custom-scrollbar">{children}</div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
