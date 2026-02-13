'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Plus, Trophy, Zap, Clock, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Boss {
  id: string;
  name: string;
  description?: string;
  difficulty: string;
  maxHp: number;
  totalAttempts: number;
  totalDefeats: number;
  bestTime?: number;
  lastAttemptedAt?: string;
  firstDefeatedAt?: string;
  attempts: Array<{
    id: string;
    defeated: boolean;
    timeSpent?: number;
    createdAt: string;
  }>;
}

interface BossesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoss?: () => void;
}

const difficultyColors: Record<string, { bg: string; text: string; border: string }> = {
  TRIVIAL: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
  EASY: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  NORMAL: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  HARD: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  EPIC: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  LEGENDARY: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
};

export function BossesPanel({ isOpen, onClose, onCreateBoss }: BossesPanelProps) {
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBosses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bosses');
      if (res.ok) {
        const { data } = await res.json();
        setBosses(data);
      }
    } catch (error) {
      console.error('Error fetching bosses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBosses();
    }
  }, [isOpen]);

  const handleDeleteBoss = async (bossId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este jefe?')) return;

    try {
      const res = await fetch(`/api/bosses/${bossId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBosses((prev) => prev.filter((b) => b.id !== bossId));
      }
    } catch (error) {
      console.error('Error deleting boss:', error);
    }
  };

  const winRate = (boss: Boss) => {
    if (boss.totalAttempts === 0) return 0;
    return Math.round((boss.totalDefeats / boss.totalAttempts) * 100);
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-surface via-surface-dark to-surface-dark border border-primary/20 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/5 bg-surface/95 backdrop-blur px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-error/20 border border-error/30">
              <Skull className="h-5 w-5 text-error" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Jefes Disponibles</h2>
              <p className="text-sm text-gray-400">Derrota a los jefes para obtener recompensas épicas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Cargando jefes...</div>
          ) : bosses.length === 0 ? (
            <div className="text-center py-12">
              <Skull className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">No hay jefes aún. ¡Crea el primero!</p>
              <Button onClick={onCreateBoss} className="mx-auto">
                <Plus className="h-4 w-4 mr-2" />
                Crear Jefe
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {bosses.map((boss, index) => {
                  const difficulty = difficultyColors[boss.difficulty] || difficultyColors.NORMAL;
                  const wr = winRate(boss);

                  return (
                    <motion.div
                      key={boss.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card variant="elevated" className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Boss icon */}
                            <div className={cn(
                              'flex h-14 w-14 items-center justify-center rounded-xl border flex-shrink-0',
                              difficulty.bg,
                              difficulty.border
                            )}>
                              <Skull className={cn('h-6 w-6', difficulty.text)} />
                            </div>

                            {/* Boss info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-white truncate">{boss.name}</h3>
                                <span className={cn(
                                  'text-xs font-bold px-2 py-1 rounded border',
                                  difficulty.bg,
                                  difficulty.text,
                                  difficulty.border
                                )}>
                                  {boss.difficulty}
                                </span>
                              </div>
                              {boss.description && (
                                <p className="text-sm text-gray-400 mb-2 truncate">{boss.description}</p>
                              )}

                              {/* Stats */}
                              <div className="grid grid-cols-4 gap-2 text-xs">
                                <div className="bg-white/5 rounded px-2 py-1">
                                  <div className="text-gray-500">Intentos</div>
                                  <div className="font-bold text-white">{boss.totalAttempts}</div>
                                </div>
                                <div className="bg-success/10 rounded px-2 py-1">
                                  <div className="text-gray-500">Derrotas</div>
                                  <div className="font-bold text-success">{boss.totalDefeats}</div>
                                </div>
                                <div className="bg-primary/10 rounded px-2 py-1">
                                  <div className="text-gray-500">% Éxito</div>
                                  <div className="font-bold text-primary">{wr}%</div>
                                </div>
                                <div className="bg-accent/10 rounded px-2 py-1">
                                  <div className="text-gray-500">Mejor</div>
                                  <div className="font-bold text-accent text-[11px]">{formatTime(boss.bestTime)}</div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-300"
                                title="Editar"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBoss(boss.id)}
                                className="p-2 rounded-lg hover:bg-error/10 transition-colors text-error/60 hover:text-error"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Create button */}
          {bosses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={onCreateBoss}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Nuevo Jefe
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
