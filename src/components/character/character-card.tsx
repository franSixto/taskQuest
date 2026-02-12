'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Star, Flame, Coins, Gem, User, Crown, Sparkles, AlertTriangle, Zap, Heart, Battery } from 'lucide-react';
import { Card, CardContent, HPBar, ManaBar, XPBar } from '@/components/ui';
import { xpForNextLevel, levelProgress } from '@/lib/xp-calculator';
import { cn } from '@/lib/utils';

// Status helper functions
function getVitalStatus(hp: number, maxHp: number, mana: number, maxMana: number) {
  const hpPercent = maxHp > 0 ? (hp / maxHp) * 100 : 0;
  const manaPercent = maxMana > 0 ? (mana / maxMana) * 100 : 0;
  
  const warnings: Array<{ type: 'hp' | 'mana'; severity: 'warning' | 'critical'; message: string }> = [];
  
  if (hpPercent <= 0) {
    warnings.push({ type: 'hp', severity: 'critical', message: '¡K.O.! Necesitas descansar' });
  } else if (hpPercent <= 25) {
    warnings.push({ type: 'hp', severity: 'critical', message: '¡Agotado! -25% XP' });
  } else if (hpPercent <= 50) {
    warnings.push({ type: 'hp', severity: 'warning', message: 'Cansado - Completa tareas' });
  }
  
  if (manaPercent <= 0) {
    warnings.push({ type: 'mana', severity: 'critical', message: 'Sin maná - Sin poderes' });
  } else if (manaPercent <= 30) {
    warnings.push({ type: 'mana', severity: 'warning', message: 'Maná bajo' });
  }
  
  return warnings;
}

interface CharacterCardProps {
  name: string;
  title: string;
  level: number;
  currentXP: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  gold: number;
  gems: number;
  currentStreak: number;
  avatarUrl?: string;
  className?: string;
  overdueTasks?: number; // Number of overdue tasks
}

export function CharacterCard({
  name,
  title,
  level,
  currentXP,
  hp,
  maxHp,
  mana,
  maxMana,
  gold,
  gems,
  currentStreak,
  avatarUrl,
  className,
  overdueTasks = 0,
}: CharacterCardProps) {
  const xpForNext = xpForNextLevel(level);
  const progress = levelProgress(currentXP, level);
  const warnings = getVitalStatus(hp, maxHp, mana, maxMana);
  const hasCriticalWarning = warnings.some(w => w.severity === 'critical');
  const hpPercent = maxHp > 0 ? (hp / maxHp) * 100 : 0;

  return (
    <Card variant="elevated" className={cn('overflow-hidden relative', className)}>
      {/* Animated background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Header with avatar and name */}
      <div className="relative bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 p-5 border-b border-white/5">
        {/* Decorative lines */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-primary/50 bg-gradient-to-br from-surface to-surface-dark shadow-xl shadow-primary/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <User className="h-10 w-10 text-primary" />
                </div>
              )}
            </div>
            {/* Level badge */}
            <motion.div 
              className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-accent bg-gradient-to-br from-accent to-yellow-600 text-sm font-bold text-background shadow-lg shadow-accent/30"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {level}
            </motion.div>
            {/* Crown for high levels */}
            {level >= 10 && (
              <Crown className="absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-5 text-accent drop-shadow-lg" />
            )}
          </motion.div>

          {/* Name and title */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">{name}</h2>
            <p className="text-sm text-primary font-medium flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              {title}
            </p>
          </div>

          {/* Streak */}
          {currentStreak > 0 && (
            <motion.div
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 px-3 py-2 text-orange-400 border border-orange-500/30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Flame className="h-5 w-5" />
              <span className="text-sm font-bold">{currentStreak}</span>
            </motion.div>
          )}
        </div>
      </div>

      <CardContent className="space-y-5 pt-5 relative">
        {/* XP Bar */}
        <XPBar
          current={currentXP}
          required={xpForNext}
          level={level}
        />

        {/* HP and Mana */}
        <div className="grid grid-cols-2 gap-4">
          <HPBar current={hp} max={maxHp} />
          <ManaBar current={mana} max={maxMana} />
        </div>

        {/* Vital Status Warnings */}
        <AnimatePresence>
          {warnings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {warnings.map((warning, idx) => (
                <motion.div
                  key={`${warning.type}-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium',
                    warning.severity === 'critical'
                      ? 'bg-error/20 border border-error/30 text-error'
                      : 'bg-warning/20 border border-warning/30 text-warning'
                  )}
                >
                  {warning.type === 'hp' ? (
                    <Heart className={cn('h-4 w-4', warning.severity === 'critical' && 'animate-pulse')} />
                  ) : (
                    <Battery className={cn('h-4 w-4', warning.severity === 'critical' && 'animate-pulse')} />
                  )}
                  <span>{warning.message}</span>
                  {warning.severity === 'critical' && (
                    <AlertTriangle className="h-3 w-3 ml-auto animate-pulse" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overdue Tasks Warning */}
        <AnimatePresence>
          {overdueTasks > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-medium"
            >
              <AlertTriangle className="h-4 w-4 animate-bounce" />
              <span>¡{overdueTasks} tarea{overdueTasks > 1 ? 's' : ''} vencida{overdueTasks > 1 ? 's' : ''}! (-{overdueTasks * 5} HP/día)</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* XP Penalty indicator */}
        {hpPercent <= 25 && hpPercent > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-error/80 font-medium"
          >
            ⚠️ Penalización activa: -25% XP en todas las recompensas
          </motion.div>
        )}

        {/* Currency */}
        <div className="flex items-center justify-center gap-8 pt-3 border-t border-white/5">
          <motion.div 
            className="flex items-center gap-2.5 bg-accent/10 px-4 py-2 rounded-xl border border-accent/20"
            whileHover={{ scale: 1.05 }}
          >
            <Coins className="h-6 w-6 text-accent" />
            <span className="font-bold text-accent text-lg tabular-nums">{gold.toLocaleString()}</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2.5 bg-secondary/10 px-4 py-2 rounded-xl border border-secondary/20"
            whileHover={{ scale: 1.05 }}
          >
            <Gem className="h-6 w-6 text-secondary" />
            <span className="font-bold text-secondary text-lg tabular-nums">{gems.toLocaleString()}</span>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
