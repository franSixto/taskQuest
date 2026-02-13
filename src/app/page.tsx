'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Sword, 
  Target, 
  Calendar, 
  Trophy,
  Settings,
  RefreshCw,
  Zap,
  BarChart3,
  History,
  Gift,
} from 'lucide-react';
import { Button, Card, ToastContainer, useToast } from '@/components/ui';
import { CharacterCard, AttributesGrid, LevelUpPopup } from '@/components/character';
import { QuestCard, QuestDetail, QuestForm } from '@/components/quest';
import { StatsDashboard, QuestHistory, BossesPanel } from '@/components/stats';
import { RewardShop } from '@/components/rewards';
import type { CharacterWithRelations, QuestWithTasks, CreateQuestInput } from '@/lib/types';

type QuestFilter = 'ALL' | 'MAIN' | 'SIDE' | 'DAILY';

export default function HomePage() {
  const [character, setCharacter] = useState<CharacterWithRelations | null>(null);
  const [quests, setQuests] = useState<QuestWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<QuestWithTasks | null>(null);
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showBosses, setShowBosses] = useState(false);
  const [questFilter, setQuestFilter] = useState<QuestFilter>('ALL');
  const [levelUp, setLevelUp] = useState<{ level: number; title?: string } | null>(null);
  const warningsShownRef = useRef(false);
  const initialLoadRef = useRef(false);
  
  const toast = useToast();

  // Calculate overdue tasks (tasks in quests past deadline)
  const overdueTasks = quests.reduce((count, quest) => {
    if (quest.deadline && new Date(quest.deadline) < new Date() && quest.status === 'ACTIVE') {
      // Count incomplete tasks in overdue quests
      return count + quest.tasks.filter(t => !t.completed).length;
    }
    return count;
  }, 0);

  // Check for low HP/Mana warnings on character load (only once)
  useEffect(() => {
    if (character && !warningsShownRef.current && !loading) {
      warningsShownRef.current = true;
      const hpPercent = character.maxHp > 0 ? (character.hp / character.maxHp) * 100 : 0;
      const manaPercent = character.maxMana > 0 ? (character.mana / character.maxMana) * 100 : 0;
      
      if (hpPercent <= 25 && hpPercent > 0) {
        toast.warning('⚠️ ¡Estás agotado! (-25% XP). Completa tareas para recuperarte.');
      } else if (hpPercent <= 0) {
        toast.error('💀 ¡K.O.! Necesitas descansar o usar pociones.');
      }
      
      if (manaPercent <= 0) {
        toast.warning('🔌 Sin maná. No puedes usar poderes especiales.');
      }
      
      if (overdueTasks > 0) {
        toast.warning(`⏰ ¡${overdueTasks} tarea${overdueTasks > 1 ? 's' : ''} vencida${overdueTasks > 1 ? 's' : ''}!`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, loading]);

  // Fetch character and quests
  const fetchData = useCallback(async () => {
    try {
      const [charRes, questsRes] = await Promise.all([
        fetch('/api/character'),
        fetch('/api/quests?status=ACTIVE'),
      ]);

      if (charRes.ok) {
        const charData = await charRes.json();
        setCharacter(charData.data);
      }

      if (questsRes.ok) {
        const questsData = await questsRes.json();
        setQuests(questsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      fetchData();
    }
  }, [fetchData]);

  // Create quest
  const handleCreateQuest = async (questData: CreateQuestInput) => {
    try {
      const res = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questData),
      });

      if (res.ok) {
        const { data } = await res.json();
        setQuests((prev) => [data, ...prev]);
        toast.success('¡Nueva misión creada!');
      } else {
        throw new Error('Failed to create quest');
      }
    } catch (error) {
      console.error('Error creating quest:', error);
      toast.error('Error al crear la misión');
      throw error;
    }
  };

  // Toggle task completion
  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
      });

      if (res.ok) {
        const { data } = await res.json();
        
        // Update quest in list
        setQuests((prev) =>
          prev.map((q) => {
            if (q.tasks.some((t) => t.id === taskId)) {
              return {
                ...q,
                tasks: q.tasks.map((t) =>
                  t.id === taskId ? { ...t, completed: data.task.completed } : t
                ),
              };
            }
            return q;
          })
        );

        // Update selected quest if open
        if (selectedQuest?.tasks.some((t) => t.id === taskId)) {
          setSelectedQuest((prev) =>
            prev
              ? {
                  ...prev,
                  tasks: prev.tasks.map((t) =>
                    t.id === taskId ? { ...t, completed: data.task.completed } : t
                  ),
                }
              : null
          );
        }

        // Show rewards if task was completed
        if (data.rewards) {
          let rewardMsg = `+${data.rewards.xp} XP, +${data.rewards.gold} oro`;
          if (data.rewards.hpRegen > 0 || data.rewards.manaRegen > 0) {
            const regenParts = [];
            if (data.rewards.hpRegen > 0) regenParts.push(`+${data.rewards.hpRegen} ❤️`);
            if (data.rewards.manaRegen > 0) regenParts.push(`+${data.rewards.manaRegen} 💎`);
            rewardMsg += ` | ${regenParts.join(', ')}`;
          }
          toast.success(rewardMsg);
        }

        // Handle level up
        if (data.levelUp) {
          setLevelUp(data.levelUp);
        }

        // Refresh character data
        fetchData();

        // Handle quest completion
        if (data.questCompleted) {
          toast.success('¡Misión completada!');
          // Remove completed quest from active list after delay
          setTimeout(() => {
            setQuests((prev) => prev.filter((q) => !q.tasks.every((t) => t.completed)));
            setSelectedQuest(null);
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Error al actualizar la tarea');
    }
  };

  // Delete quest
  const handleDeleteQuest = async (questId: string) => {
    try {
      const res = await fetch(`/api/quests/${questId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setQuests((prev) => prev.filter((q) => q.id !== questId));
        toast.success('Misión eliminada');
      }
    } catch (error) {
      console.error('Error deleting quest:', error);
      toast.error('Error al eliminar la misión');
      throw error;
    }
  };

  // Edit quest (title, description, type, difficulty, deadline, boss)
  const handleEditQuest = async (questId: string, data: { 
    title?: string; 
    description?: string; 
    type?: string; 
    difficulty?: string; 
    deadline?: string | null;
    isBossBattle?: boolean;
    bossName?: string | null;
    bossMaxHp?: number;
  }) => {
    try {
      // Get current quest to check if boss battle is being newly enabled
      const currentQuest = quests.find(q => q.id === questId) || selectedQuest;
      const wasAlreadyBossBattle = currentQuest?.isBossBattle;
      
      // Build update payload - only set bossHp if ACTIVATING boss battle for the first time
      const updatePayload: Record<string, unknown> = {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : null,
      };
      
      // Only update boss fields if isBossBattle is being changed or set
      if (data.isBossBattle !== undefined) {
        if (data.isBossBattle) {
          updatePayload.bossMaxHp = data.bossMaxHp || 100;
          // Only reset bossHp if this is a NEW boss battle activation
          if (!wasAlreadyBossBattle) {
            updatePayload.bossHp = data.bossMaxHp || 100;
          }
        } else {
          // Disabling boss battle - reset both to 0
          updatePayload.bossHp = 0;
          updatePayload.bossMaxHp = 0;
        }
      }

      const res = await fetch(`/api/quests/${questId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        const { data: updatedQuest } = await res.json();
        
        // Update quest in list
        setQuests((prev) =>
          prev.map((q) => (q.id === questId ? updatedQuest : q))
        );

        // Update selected quest if open
        if (selectedQuest?.id === questId) {
          setSelectedQuest(updatedQuest);
        }

        toast.success('Misión actualizada');
      } else {
        throw new Error('Failed to update quest');
      }
    } catch (error) {
      console.error('Error editing quest:', error);
      toast.error('Error al editar la misión');
      throw error;
    }
  };

  // Edit task (full edit with all fields)
  const handleEditTask = async (taskId: string, data: { title?: string; xpReward?: number; goldReward?: number; attributeBoost?: string | null }) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const { task } = await res.json();
        
        // Refresh quest data to get updated totals
        await fetchData();

        // Update selected quest if open
        if (selectedQuest?.tasks.some((t) => t.id === taskId)) {
          const questRes = await fetch(`/api/quests/${selectedQuest.id}`);
          if (questRes.ok) {
            const { data: updatedQuest } = await questRes.json();
            setSelectedQuest(updatedQuest);
          }
        }

        toast.success('Tarea actualizada');
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error editing task:', error);
      toast.error('Error al editar la tarea');
      throw error;
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Refresh quest data to get updated totals
        await fetchData();

        // Update selected quest if open
        if (selectedQuest) {
          const questRes = await fetch(`/api/quests/${selectedQuest.id}`);
          if (questRes.ok) {
            const { data: updatedQuest } = await questRes.json();
            setSelectedQuest(updatedQuest);
          }
        }

        toast.success('Tarea eliminada');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar la tarea');
      throw error;
    }
  };

  // Add new task to quest
  const handleAddTask = async (questId: string, data: { title: string; xpReward: number; goldReward: number; attributeBoost: string | null }) => {
    try {
      const res = await fetch(`/api/quests/${questId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // Refresh quest data to get updated totals
        await fetchData();

        // Update selected quest if open
        if (selectedQuest?.id === questId) {
          const questRes = await fetch(`/api/quests/${questId}`);
          if (questRes.ok) {
            const { data: updatedQuest } = await questRes.json();
            setSelectedQuest(updatedQuest);
          }
        }

        toast.success('Tarea agregada');
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Error al agregar la tarea');
      throw error;
    }
  };

  // Filter quests
  const filteredQuests = quests.filter((q) => {
    if (questFilter === 'ALL') return true;
    if (questFilter === 'DAILY') return q.type === 'DAILY' || q.type === 'WEEKLY';
    return q.type === questFilter;
  });

  // Count quests by type
  const questCounts = {
    ALL: quests.length,
    MAIN: quests.filter((q) => q.type === 'MAIN').length,
    SIDE: quests.filter((q) => q.type === 'SIDE').length,
    DAILY: quests.filter((q) => q.type === 'DAILY' || q.type === 'WEEKLY').length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-gray-400">Cargando tu aventura...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Background effects */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-30" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />
      
      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative"
            >
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px] shadow-lg shadow-primary/30">
                <div className="h-full w-full rounded-2xl bg-surface-dark flex items-center justify-center">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success animate-pulse" />
            </motion.div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                <span className="gradient-text">TaskQuest</span>
              </h1>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                Tu aventura productiva comienza aquí
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setShowRewards(true)}
                title="Recompensas"
              >
                <Gift className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setShowBosses(true)}
                title="Jefes"
              >
                <Trophy className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setShowStats(true)}
                title="Estadísticas"
              >
                <BarChart3 className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setShowHistory(true)}
                title="Historial"
              >
                <History className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="relative">
                <Settings className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[380px,1fr]">
          {/* Left column - Character */}
          <div className="space-y-6">
            {character && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CharacterCard
                    name={character.name}
                    title={character.title}
                    level={character.level}
                    currentXP={character.currentXP}
                    hp={character.hp}
                    maxHp={character.maxHp}
                    mana={character.mana}
                    maxMana={character.maxMana}
                    gold={character.gold}
                    gems={character.gems}
                    currentStreak={character.currentStreak}
                    avatarUrl={character.avatarUrl || undefined}
                    overdueTasks={overdueTasks}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card variant="elevated" className="overflow-hidden">
                    <div className="p-5">
                      <h3 className="mb-4 flex items-center gap-3 text-lg font-bold text-white">
                        <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <span>Atributos</span>
                      </h3>
                      <AttributesGrid attributes={character.attributes} />
                    </div>
                  </Card>
                </motion.div>
              </>
            )}
          </div>

          {/* Right column - Quests */}
          <div className="lg:col-span-1">
            {/* Quest filters and add button */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex flex-wrap gap-2">
                {(['ALL', 'MAIN', 'SIDE', 'DAILY'] as const).map((filter, index) => {
                  const icons = {
                    ALL: Trophy,
                    MAIN: Sword,
                    SIDE: Target,
                    DAILY: Calendar,
                  };
                  const Icon = icons[filter];
                  const labels = {
                    ALL: 'Todas',
                    MAIN: 'Principales',
                    SIDE: 'Secundarias',
                    DAILY: 'Diarias',
                  };

                  return (
                    <motion.div
                      key={filter}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant={questFilter === filter ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setQuestFilter(filter)}
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{labels[filter]}</span>
                        <span className="text-xs opacity-70 bg-white/10 px-1.5 py-0.5 rounded-md">
                          {questCounts[filter]}
                        </span>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button onClick={() => setShowQuestForm(true)} className="shadow-lg">
                  <Plus className="h-4 w-4" />
                  <span>Nueva Misión</span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Quest list */}
            {filteredQuests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-10 text-center border-dashed border-2 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Trophy className="mx-auto mb-4 h-16 w-16 text-primary/50" />
                  </motion.div>
                  <h3 className="mb-2 text-xl font-bold text-white">
                    ¡Comienza tu aventura!
                  </h3>
                  <p className="mb-6 text-gray-400 max-w-sm mx-auto">
                    No hay misiones activas. Crea tu primera misión y empieza a ganar XP y recompensas.
                  </p>
                  <Button onClick={() => setShowQuestForm(true)} size="lg" className="shadow-lg">
                    <Plus className="h-5 w-5" />
                    Crear Primera Misión
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <AnimatePresence>
                  {filteredQuests.map((quest) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <QuestCard
                        quest={quest}
                        onClick={() => setSelectedQuest(quest)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quest detail modal */}
      <AnimatePresence>
        {selectedQuest && (
          <QuestDetail
            quest={selectedQuest}
            onClose={() => setSelectedQuest(null)}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onAddTask={handleAddTask}
            onEditQuest={handleEditQuest}
            onDeleteQuest={handleDeleteQuest}
          />
        )}
      </AnimatePresence>

      {/* Quest form modal */}
      <QuestForm
        isOpen={showQuestForm}
        onClose={() => setShowQuestForm(false)}
        onSubmit={handleCreateQuest}
      />

      {/* Stats dashboard modal */}
      <StatsDashboard
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />

      {/* Quest history modal */}
      <QuestHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectQuest={(quest) => {
          setShowHistory(false);
          setSelectedQuest(quest);
        }}
      />

      {/* Bosses panel modal */}
      <BossesPanel
        isOpen={showBosses}
        onClose={() => setShowBosses(false)}
        onCreateBoss={() => {
          console.log('Create boss - Will open boss creation form');
        }}
      />

      {/* Reward shop modal */}
      <RewardShop
        isOpen={showRewards}
        onClose={() => setShowRewards(false)}
        currentGold={character?.gold || 0}
        onGoldChange={(newGold) => {
          if (character) {
            setCharacter({ ...character, gold: newGold });
          }
        }}
      />

      {/* Level up popup */}
      <AnimatePresence>
        {levelUp && (
          <LevelUpPopup
            newLevel={levelUp.level}
            newTitle={levelUp.title}
            onComplete={() => setLevelUp(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </>
  );
}
