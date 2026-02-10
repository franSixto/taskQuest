'use client';

import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ProgressBar } from '@/components/ui';
import { attributeXPForLevel } from '@/lib/xp-calculator';
import { cn } from '@/lib/utils';

interface AttributeBarProps {
  name: string;
  displayName: string;
  level: number;
  currentXP: number;
  color: string;
  icon: string;
  compact?: boolean;
  className?: string;
}

export function AttributeBar({
  name,
  displayName,
  level,
  currentXP,
  color,
  icon,
  compact = false,
  className,
}: AttributeBarProps) {
  const xpForNextLevel = attributeXPForLevel(level + 1);
  const xpCurrentLevel = attributeXPForLevel(level);
  const progressXP = currentXP - xpCurrentLevel;
  const requiredXP = xpForNextLevel - xpCurrentLevel;
  const percentage = requiredXP > 0 ? Math.round((progressXP / requiredXP) * 100) : 0;

  // Get the icon dynamically
  const IconComponent: LucideIcon = (LucideIcons as unknown as Record<string, LucideIcon>)[icon] || LucideIcons.Circle;

  if (compact) {
    return (
      <motion.div
        className={cn(
          'flex items-center gap-2 rounded-lg bg-surface-dark/50 px-3 py-2',
          className
        )}
        whileHover={{ scale: 1.02 }}
      >
        <IconComponent className="h-4 w-4 flex-shrink-0" style={{ color }} />
        <span className="text-xs font-medium text-gray-400 truncate">{displayName}</span>
        <span className="text-xs font-bold ml-auto" style={{ color }}>Nv.{level}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        'rounded-xl bg-gradient-to-br from-surface-dark to-surface-dark/50 p-4 border border-white/5',
        className
      )}
      whileHover={{ scale: 1.02, borderColor: `${color}40` }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      {/* Header with icon and level */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl border"
            style={{ 
              backgroundColor: `${color}15`,
              borderColor: `${color}30`
            }}
          >
            <IconComponent className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{displayName}</h4>
            <p className="text-xs text-gray-500">{progressXP} / {requiredXP} XP</p>
          </div>
        </div>
        <div
          className="flex items-center justify-center h-9 w-9 rounded-lg font-bold text-sm"
          style={{ 
            backgroundColor: `${color}20`,
            color: color
          }}
        >
          {level}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <ProgressBar
          value={progressXP}
          max={requiredXP}
          color={color}
          size="sm"
          animated
        />
        <p className="text-right text-xs text-gray-500">{percentage}%</p>
      </div>
    </motion.div>
  );
}

// Grid of all attributes
interface AttributesGridProps {
  attributes: {
    name: string;
    displayName: string;
    level: number;
    currentXP: number;
    color: string;
    icon: string;
  }[];
  compact?: boolean;
  className?: string;
}

export function AttributesGrid({ attributes, compact = false, className }: AttributesGridProps) {
  if (compact) {
    return (
      <div className={cn('grid grid-cols-2 gap-2', className)}>
        {attributes.map((attr) => (
          <AttributeBar
            key={attr.name}
            {...attr}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 gap-3', className)}>
      {attributes.map((attr, index) => (
        <motion.div
          key={attr.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <AttributeBar {...attr} />
        </motion.div>
      ))}
    </div>
  );
}
