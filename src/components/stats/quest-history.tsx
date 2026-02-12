'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  History,
  Trophy,
  Calendar,
  Star,
  Coins,
  Banknote,
  CheckCircle2,
  Clock,
  Skull,
  Sword,
  Target,
  Search,
  ChevronDown,
  RotateCcw,
  Pencil,
} from 'lucide-react';
import { Card, Button, Input, useToast } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { QuestWithTasks, CreateQuestInput } from '@/lib/types';
import { QuestForm } from '@/components/quest/quest-form';

interface QuestHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuest?: (quest: QuestWithTasks) => void;
}

export function QuestHistory({ isOpen, onClose, onSelectQuest }: QuestHistoryProps) {
  const [quests, setQuests] = useState<QuestWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const { success, error } = useToast();

  // Edit state
  const [editingQuest, setEditingQuest] = useState<QuestWithTasks | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchHistory = useCallback(async (currentOffset: number, reset: boolean = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await fetch(`/api/quests/history?limit=20&offset=${currentOffset}`);
      if (res.ok) {
        const { data, pagination } = await res.json();
        if (reset) {
          setQuests(data);
        } else {
          setQuests(prev => [...prev, ...data]);
        }
        setHasMore(pagination.hasMore);
        setOffset(currentOffset + data.length);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      try {
        error('Error al cargar el historial');
      } catch (e) {
        console.error('Toast error:', e);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [error]);

  useEffect(() => {
    if (isOpen) {
      setQuests([]);
      setOffset(0);
      fetchHistory(0, true);
    }
  }, [isOpen, fetchHistory]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchHistory(offset);
    }
  };

  const handleRecover = async (e: React.MouseEvent, quest: QuestWithTasks) => {
    e.stopPropagation();

    try {
      const res = await fetch(`/api/quests/${quest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ACTIVE',
          completedAt: null,
          isPaid: false,
        }),
      });

      if (res.ok) {
        success('Misión recuperada a activas');
        setQuests(prev => prev.filter(q => q.id !== quest.id));
      } else {
        throw new Error('Failed to recover quest');
      }
    } catch (err) {
      console.error('Error recovering quest:', err);
      try {
        error('No se pudo recuperar la misión');
      } catch (e) { console.error(e); }
    }
  };

  const handleEdit = (e: React.MouseEvent, quest: QuestWithTasks) => {
    e.stopPropagation();
    setEditingQuest(quest);
    setIsEditModalOpen(true);
  };

  const handleUpdateQuest = async (questData: CreateQuestInput) => {
    if (!editingQuest) return;

    try {
      const res = await fetch(`/api/quests/${editingQuest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questData),
      });

      if (res.ok) {
        const { data: updatedQuest } = await res.json();
        setQuests(prev => prev.map(q => q.id === updatedQuest.id ? updatedQuest : q));
        success('Misión actualizada correctamente');
        setIsEditModalOpen(false);
        setEditingQuest(null);
      } else {
        throw new Error('Failed to update quest');
      }
    } catch (err) {
      console.error('Error updating quest:', err);
      try {
        error('No se pudo actualizar la misión');
      } catch (e) { console.error(e); }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getQuestBillingAmount = (quest: QuestWithTasks) => {
    if (quest.billingType === 'HOURLY') {
      const rate = quest.hourlyRate || 0;
      const hours = quest.hoursWorked || quest.estimatedHours || 0;
      return rate * hours;
    }
    return quest.budgetAmount || 0;
  };

  const filteredQuests = quests.filter(quest =>
    quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quest.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedQuests = filteredQuests.reduce((groups, quest) => {
    const date = quest.completedAt ? new Date(quest.completedAt) : new Date(quest.updatedAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    if (!groups[monthKey]) {
      groups[monthKey] = { label: monthLabel, quests: [] };
    }
    groups[monthKey].quests.push(quest);
    return groups;
  }, {} as Record<string, { label: string; quests: QuestWithTasks[] }>);

  const monthTotals = Object.entries(groupedQuests).map(([key, { label, quests }]) => {
    const totalBilled = quests.reduce((sum, q) => sum + getQuestBillingAmount(q), 0);
    const totalPaid = quests
      .filter(q => q.isPaid)
      .reduce((sum, q) => sum + getQuestBillingAmount(q), 0);
    const totalHours = quests.reduce((sum, q) => sum + (q.hoursWorked || 0), 0);

    return { key, label, quests, totalBilled, totalPaid, totalHours };
  });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Header */}
      <div className="border-b border-primary/20 bg-surface">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 border border-accent/40">
              <History className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Historial de Misiones</h1>
              <p className="text-xs text-gray-400">{quests.length} misiones completadas</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-primary/10 bg-surface-dark">
        <div className="mx-auto max-w-4xl p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar misiones..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-4 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredQuests.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {searchTerm ? 'No se encontraron misiones' : 'No hay misiones completadas aún'}
              </p>
            </div>
          ) : (
            <>
              {monthTotals.map(({ key, label, quests: monthQuests, totalBilled, totalPaid, totalHours }) => (
                <div key={key}>
                  {/* Month Header */}
                  <div className="sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white capitalize">{label}</h2>
                      <div className="flex items-center gap-4 text-sm">
                        {totalHours > 0 && (
                          <span className="text-gray-400">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {totalHours}h
                          </span>
                        )}
                        {totalBilled > 0 && (
                          <span className={cn(
                            "font-semibold",
                            totalPaid >= totalBilled ? "text-success" : "text-emerald-400"
                          )}>
                            {formatCurrency(totalPaid)}
                            {totalPaid < totalBilled && (
                              <span className="text-gray-500">/{formatCurrency(totalBilled)}</span>
                            )}
                          </span>
                        )}
                        <span className="text-gray-500">{monthQuests.length} misiones</span>
                      </div>
                    </div>
                  </div>

                  {/* Month Quests */}
                  <div className="space-y-3">
                    {monthQuests.map((quest, index) => (
                      <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={cn(
                            "p-4 cursor-pointer hover:border-primary/40 transition-all group",
                            quest.isBossBattle && "border-error/30 hover:border-error/50"
                          )}
                          onClick={() => onSelectQuest?.(quest)}
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0",
                              quest.isBossBattle
                                ? "bg-error/20 border border-error/40"
                                : "bg-success/20 border border-success/40"
                            )}>
                              {quest.isBossBattle ? (
                                <Skull className="h-5 w-5 text-error" />
                              ) : quest.type === 'MAIN' ? (
                                <Sword className="h-5 w-5 text-success" />
                              ) : (
                                <Target className="h-5 w-5 text-success" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold text-white truncate">
                                    {quest.title}
                                  </h3>
                                  {quest.isBossBattle && quest.bossName && (
                                    <span className="text-xs text-error">
                                      ⚔️ {quest.bossName} derrotado
                                    </span>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-xs text-gray-400">
                                    <Calendar className="h-3 w-3 inline mr-1" />
                                    {formatDate(quest.completedAt)}
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="mt-2 flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 p-2 text-gray-400 hover:text-white hover:bg-surface-dark"
                                  onClick={(e) => handleEdit(e, quest)}
                                  title="Editar"
                                >
                                  <Pencil className="h-4 w-4 mr-1" />
                                  <span className="text-xs">Editar</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 p-2 text-gray-400 hover:text-emerald-400 hover:bg-surface-dark"
                                  onClick={(e) => handleRecover(e, quest)}
                                  title="Recuperar a activas"
                                >
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                  <span className="text-xs">Recuperar</span>
                                </Button>
                              </div>

                              {/* Stats Row */}
                              <div className="flex items-center gap-4 mt-2 text-xs">
                                <span className="text-gray-400">
                                  <CheckCircle2 className="h-3 w-3 inline mr-1 text-success" />
                                  {quest.tasks.length} tareas
                                </span>
                                <span className="text-accent">
                                  <Star className="h-3 w-3 inline mr-1" />
                                  {quest.xpReward} XP
                                </span>
                                <span className="text-yellow-400">
                                  <Coins className="h-3 w-3 inline mr-1" />
                                  {quest.goldReward}
                                </span>
                              </div>

                              {/* Billing */}
                              {getQuestBillingAmount(quest) > 0 && (
                                <div className={cn(
                                  "mt-2 inline-flex items-center gap-2 px-2 py-1 rounded-lg text-xs",
                                  quest.isPaid
                                    ? "bg-success/20 text-success"
                                    : "bg-warning/20 text-warning"
                                )}>
                                  <Banknote className="h-3 w-3" />
                                  {formatCurrency(getQuestBillingAmount(quest))}
                                  {quest.billingType === 'HOURLY' && (
                                    <span className="text-gray-400">
                                      ({quest.hoursWorked}h)
                                    </span>
                                  )}
                                  {quest.isPaid ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <span className="text-[10px]">pendiente</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="text-center py-4">
                  <Button
                    variant="ghost"
                    onClick={loadMore}
                    isLoading={loadingMore}
                  >
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Cargar más
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingQuest && (
        <QuestForm
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingQuest(null);
          }}
          onSubmit={handleUpdateQuest}
          initialData={editingQuest}
        />
      )}
    </motion.div>
  );
}
