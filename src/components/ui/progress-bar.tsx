'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'warning' | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  glow?: boolean;
  className?: string;
}

const colorClasses: Record<string, string> = {
  primary: 'bg-gradient-to-r from-primary via-primary-400 to-primary',
  secondary: 'bg-gradient-to-r from-secondary via-secondary-400 to-secondary',
  accent: 'bg-gradient-to-r from-accent via-yellow-400 to-accent',
  success: 'bg-gradient-to-r from-success via-green-400 to-success',
  error: 'bg-gradient-to-r from-error via-red-400 to-error',
  warning: 'bg-gradient-to-r from-warning via-orange-400 to-warning',
};

const glowClasses: Record<string, string> = {
  primary: 'shadow-[0_0_10px_rgba(0,240,255,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]',
  secondary: 'shadow-[0_0_10px_rgba(255,0,255,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]',
  accent: 'shadow-[0_0_10px_rgba(255,215,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]',
  success: 'shadow-[0_0_10px_rgba(16,185,129,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]',
  error: 'shadow-[0_0_10px_rgba(239,68,68,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]',
};

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-5',
};

export function ProgressBar({
  value,
  max,
  color = 'primary',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
  glow = false,
  className,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  const colorClass = colorClasses[color] || color;
  const glowClass = glow ? glowClasses[color] || '' : '';

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="mb-1.5 flex justify-between text-xs font-medium">
          <span className="text-gray-300 uppercase tracking-wider">{label}</span>
          <span className="text-white tabular-nums">
            {value.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-surface-dark border border-white/5 relative',
          sizeClasses[size]
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:4px_4px]" />
        
        <motion.div
          className={cn('h-full rounded-full relative overflow-hidden', colorClass, glowClass)}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-full" />
          {/* Animated shimmer - uses left position instead of transform for consistent animation */}
          {percentage > 5 && (
            <motion.div 
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              initial={{ left: '-33%' }}
              animate={{ left: '133%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// HP Bar with special styling
export function HPBar({
  current,
  max,
  className,
}: {
  current: number;
  max: number;
  className?: string;
}) {
  const percentage = max > 0 ? (current / max) * 100 : 0;
  const color = percentage > 50 ? 'success' : percentage > 25 ? 'warning' : 'error';

  return (
    <div className={cn('relative', className)}>
      <ProgressBar
        value={current}
        max={max}
        color={color}
        size="lg"
        showLabel
        label="❤️ HP"
        glow
      />
    </div>
  );
}

// Mana Bar with special styling
export function ManaBar({
  current,
  max,
  className,
}: {
  current: number;
  max: number;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <ProgressBar
        value={current}
        max={max}
        color="primary"
        size="lg"
        showLabel
        label="💎 MANÁ"
        glow
      />
    </div>
  );
}

// XP Bar
export function XPBar({
  current,
  required,
  level,
  className,
}: {
  current: number;
  required: number;
  level: number;
  className?: string;
}) {
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-accent">⭐ Nivel {level}</span>
        </div>
        <span className="text-sm text-gray-300 tabular-nums font-medium">
          {current.toLocaleString()} / {required.toLocaleString()} XP
        </span>
      </div>
      <ProgressBar value={current} max={required} color="accent" size="md" glow />
    </div>
  );
}
