'use client';

import { motion } from 'framer-motion';
import {
  Sword,
  Target,
  Clock,
  Star,
  Coins,
  ChevronRight,
  Skull,
  Calendar,
  Repeat,
  Sparkles,
  Banknote,
  CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { QuestWithTasks } from '@/lib/types';

interface QuestCardProps {
  quest: QuestWithTasks;
  onClick?: () => void;
  className?: string;
}

const difficultyColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  TRIVIAL: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', glow: '' },
  EASY: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', glow: 'shadow-green-500/20' },
  NORMAL: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
  HARD: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
  EPIC: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', glow: 'shadow-orange-500/30' },
  LEGENDARY: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/30' },
};

const typeIcons: Record<string, React.ElementType> = {
  MAIN: Sword,
  SIDE: Target,
  DAILY: Repeat,
  WEEKLY: Calendar,
  BOSS: Skull,
};

const typeLabels: Record<string, string> = {
  MAIN: 'Principal',
  SIDE: 'Secundaria',
  DAILY: 'Diaria',
  WEEKLY: 'Semanal',
};

export function QuestCard({ quest, onClick, className }: QuestCardProps) {
  const completedTasks = quest.tasks.filter((t) => t.completed).length;
  const totalTasks = quest.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isComplete = progress === 100;

  const difficultyStyle = difficultyColors[quest.difficulty] || difficultyColors.NORMAL;
  const TypeIcon = typeIcons[quest.type] || Target;

  // Check if quest has billing configured
  const isHourlyBilling = quest.billingType === 'HOURLY';
  const hasBilling = isHourlyBilling
    ? (quest.hourlyRate !== null && quest.hourlyRate !== undefined && quest.hourlyRate > 0)
    : (quest.budgetAmount !== null && quest.budgetAmount !== undefined && quest.budgetAmount > 0);

  // Calculate billing amounts for hourly billing
  const estimatedAmount = isHourlyBilling
    ? ((quest.hourlyRate || 0) * (quest.estimatedHours || 0))
    : 0;
  const workedAmount = isHourlyBilling
    ? ((quest.hourlyRate || 0) * (quest.hoursWorked || 0))
    : 0;

  // Primary billing amount (worked hours take priority, then estimated, then fixed)
  const billingAmount = isHourlyBilling
    ? (workedAmount > 0 ? workedAmount : estimatedAmount)
    : (quest.budgetAmount || 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Card
        variant={quest.isBossBattle ? 'boss' : 'quest'}
        className={cn(
          'cursor-pointer transition-all duration-300 group relative overflow-hidden h-full flex flex-col',
          isComplete && 'opacity-70',
          !isComplete && `hover:shadow-xl ${difficultyStyle.glow}`,
          className
        )}
        onClick={onClick}
      >
        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Complete badge */}
        {isComplete && (
          <div className="absolute top-3 right-3 z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-success/90 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg"
            >
              <Sparkles className="h-3 w-3" />
              ¡Completa!
            </motion.div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Type icon */}
              <motion.div
                whileHover={{ rotate: 15 }}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl border transition-colors',
                  quest.isBossBattle
                    ? 'bg-error/10 border-error/30'
                    : 'bg-primary/20 border-primary/40 group-hover:bg-primary/30'
                )}
              >
                <TypeIcon
                  className={cn(
                    'h-5 w-5',
                    quest.isBossBattle ? 'text-error' : 'text-primary'
                  )}
                />
              </motion.div>
              <div className="min-w-0">
                <CardTitle className="text-base truncate pr-2">{quest.title}</CardTitle>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">{typeLabels[quest.type]}</span>
                  {quest.isBossBattle && quest.bossName && (
                    <span className="text-xs text-error flex items-center gap-1">
                      <Skull className="h-3 w-3" />
                      {quest.bossName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Difficulty badge */}
            <span
              className={cn(
                'rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider flex-shrink-0 border',
                difficultyStyle.bg,
                difficultyStyle.text,
                difficultyStyle.border
              )}
            >
              {quest.difficulty}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-full">
          {/* Progress */}
          <div className="mb-4">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-gray-400 font-medium">Progreso</span>
              <span className="text-white font-bold">
                {completedTasks}/{totalTasks} tareas
              </span>
            </div>
            <ProgressBar
              value={completedTasks}
              max={totalTasks}
              color={isComplete ? 'success' : 'primary'}
              size="sm"
              glow={isComplete}
            />
          </div>

          {/* Boss HP (always reserve space for consistent height) */}
          <div className={cn(
            "mb-4 min-h-[54px] transition-opacity duration-300",
            quest.isBossBattle && quest.bossHp !== null && quest.bossMaxHp !== null 
              ? "opacity-100" 
              : "opacity-0 pointer-events-none"
          )}>
            {quest.isBossBattle && quest.bossHp !== null && quest.bossMaxHp !== null && (
              <>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-error font-medium flex items-center gap-1">
                    <Skull className="h-3 w-3" />
                    HP del Jefe
                  </span>
                  <span className="text-white font-bold">
                    {quest.bossHp}/{quest.bossMaxHp}
                  </span>
                </div>
                <ProgressBar
                  value={quest.bossHp}
                  max={quest.bossMaxHp}
                  color="error"
                  size="sm"
                  glow
                />
              </>
            )}
          </div>

          {/* Spacer to push footer to bottom */}
          <div className="flex-grow" />

          {/* Billing indicator for MAIN quests */}
          <div className={cn(
            "mb-3 min-h-[68px] transition-opacity duration-300 flex items-center",
            hasBilling 
              ? "opacity-100" 
              : "opacity-0 pointer-events-none"
          )}>
            {hasBilling && (
              <div className={cn(
                "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                quest.isPaid
                  ? "bg-success/10 border border-success/30"
                  : "bg-emerald-500/10 border border-emerald-500/30"
              )}>
                <span className="flex items-center gap-2">
                  <Banknote className={cn("h-4 w-4", quest.isPaid ? "text-success" : "text-emerald-400")} />
                  <span className="flex flex-col">
                    <span className={cn("font-semibold", quest.isPaid ? "text-success" : "text-emerald-400")}>
                      {formatCurrency(billingAmount)}
                    </span>
                    {isHourlyBilling && (
                      <span className="text-[10px] text-gray-400">
                        ${quest.hourlyRate}/hr × {quest.hoursWorked || 0}h{quest.estimatedHours ? ` (est: ${quest.estimatedHours}h)` : ''}
                      </span>
                    )}
                  </span>
                </span>
                {quest.isPaid ? (
                  <span className="flex items-center gap-1 text-xs text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Cobrado
                  </span>
                ) : (
                  <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    Pendiente
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Rewards and deadline */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-accent font-semibold">
                <Star className="h-4 w-4" />
                {quest.xpReward}
              </span>
              <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                <Coins className="h-4 w-4" />
                {quest.goldReward}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {quest.deadline && (
                <span className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg">
                  <Clock className="h-3 w-3" />
                  {new Date(quest.deadline).toLocaleDateString('es-ES')}
                </span>
              )}

              <motion.div
                whileHover={{ x: 3 }}
                className="text-primary"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
