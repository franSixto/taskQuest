'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sword, 
  Target, 
  Clock, 
  Star, 
  Coins,
  Skull,
  Trophy,
  ArrowLeft,
  Trash2,
  Pencil,
  Save,
  Calendar,
  Banknote,
  CheckCircle2
} from 'lucide-react';
import { Button, Card, ProgressBar, Modal, Input } from '@/components/ui';
import { TaskList, type TaskUpdateData } from './task-item';
import { cn } from '@/lib/utils';
import type { QuestWithTasks } from '@/lib/types';

export interface QuestUpdateData {
  title?: string;
  description?: string;
  type?: string;
  difficulty?: string;
  deadline?: string | null;
  isBossBattle?: boolean;
  bossName?: string | null;
  bossMaxHp?: number;
  // Billing fields
  billingType?: 'FIXED' | 'HOURLY';
  budgetAmount?: number | null;
  hourlyRate?: number | null;
  estimatedHours?: number | null;
  hoursWorked?: number | null;
  isPaid?: boolean;
}

interface QuestDetailProps {
  quest: QuestWithTasks;
  onClose: () => void;
  onToggleTask: (taskId: string) => Promise<void>;
  onEditTask?: (taskId: string, data: TaskUpdateData) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
  onAddTask?: (questId: string, data: { title: string; xpReward: number; goldReward: number; attributeBoost: string | null }) => Promise<void>;
  onEditQuest?: (questId: string, data: QuestUpdateData) => Promise<void>;
  onDeleteQuest: (questId: string) => Promise<void>;
}

const difficultyInfo: Record<string, { label: string; color: string; xpMult: string }> = {
  TRIVIAL: { label: 'Trivial', color: 'text-gray-400', xpMult: '0.5x' },
  EASY: { label: 'Fácil', color: 'text-green-400', xpMult: '0.75x' },
  NORMAL: { label: 'Normal', color: 'text-blue-400', xpMult: '1x' },
  HARD: { label: 'Difícil', color: 'text-purple-400', xpMult: '1.5x' },
  EPIC: { label: 'Épico', color: 'text-orange-400', xpMult: '2x' },
  LEGENDARY: { label: 'Legendario', color: 'text-yellow-400', xpMult: '3x' },
};

const typeOptions = [
  { value: 'MAIN', label: 'Principal', icon: Sword },
  { value: 'SIDE', label: 'Secundaria', icon: Target },
  { value: 'DAILY', label: 'Diaria', icon: Calendar },
  { value: 'WEEKLY', label: 'Semanal', icon: Calendar },
];

const difficultyOptions = [
  { value: 'TRIVIAL', label: 'Trivial' },
  { value: 'EASY', label: 'Fácil' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HARD', label: 'Difícil' },
  { value: 'EPIC', label: 'Épico' },
  { value: 'LEGENDARY', label: 'Legendario' },
];

export function QuestDetail({
  quest,
  onClose,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onEditQuest,
  onDeleteQuest,
}: QuestDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingQuest, setIsEditingQuest] = useState(false);
  const [editedTitle, setEditedTitle] = useState(quest.title);
  const [editedDescription, setEditedDescription] = useState(quest.description || '');
  const [editedType, setEditedType] = useState(quest.type);
  const [editedDifficulty, setEditedDifficulty] = useState(quest.difficulty);
  const [editedDeadline, setEditedDeadline] = useState(
    quest.deadline ? new Date(quest.deadline).toISOString().split('T')[0] : ''
  );
  const [editedIsBossBattle, setEditedIsBossBattle] = useState(quest.isBossBattle || false);
  const [editedBossName, setEditedBossName] = useState(quest.bossName || '');
  // Billing states
  const [editedBillingType, setEditedBillingType] = useState<'FIXED' | 'HOURLY'>(
    (quest.billingType as 'FIXED' | 'HOURLY') || 'FIXED'
  );
  const [editedBudgetAmount, setEditedBudgetAmount] = useState<string>(
    quest.budgetAmount !== null && quest.budgetAmount !== undefined ? String(quest.budgetAmount) : ''
  );
  const [editedHourlyRate, setEditedHourlyRate] = useState<string>(
    quest.hourlyRate !== null && quest.hourlyRate !== undefined ? String(quest.hourlyRate) : ''
  );
  const [editedEstimatedHours, setEditedEstimatedHours] = useState<string>(
    quest.estimatedHours !== null && quest.estimatedHours !== undefined ? String(quest.estimatedHours) : ''
  );
  const [editedHoursWorked, setEditedHoursWorked] = useState<string>(
    quest.hoursWorked !== null && quest.hoursWorked !== undefined ? String(quest.hoursWorked) : ''
  );
  const [editedIsPaid, setEditedIsPaid] = useState(quest.isPaid || false);
  const [isSaving, setIsSaving] = useState(false);

  // Block body scroll when detail view is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const completedTasks = quest.tasks.filter((t) => t.completed).length;
  const totalTasks = quest.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isComplete = progress === 100;

  const difficulty = difficultyInfo[quest.difficulty] || difficultyInfo.NORMAL;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteQuest(quest.id);
      onClose();
    } catch (error) {
      console.error('Error deleting quest:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSaveQuest = async () => {
    if (!onEditQuest || !editedTitle.trim()) return;

    const currentBudget = quest.budgetAmount !== null && quest.budgetAmount !== undefined ? String(quest.budgetAmount) : '';
    const currentHourlyRate = quest.hourlyRate !== null && quest.hourlyRate !== undefined ? String(quest.hourlyRate) : '';
    const currentEstimatedHours = quest.estimatedHours !== null && quest.estimatedHours !== undefined ? String(quest.estimatedHours) : '';
    const currentHoursWorked = quest.hoursWorked !== null && quest.hoursWorked !== undefined ? String(quest.hoursWorked) : '';
    
    const hasChanges = 
      editedTitle.trim() !== quest.title ||
      editedDescription !== (quest.description || '') ||
      editedType !== quest.type ||
      editedDifficulty !== quest.difficulty ||
      editedDeadline !== (quest.deadline ? new Date(quest.deadline).toISOString().split('T')[0] : '') ||
      editedIsBossBattle !== (quest.isBossBattle || false) ||
      editedBossName !== (quest.bossName || '') ||
      editedBillingType !== (quest.billingType || 'FIXED') ||
      editedBudgetAmount !== currentBudget ||
      editedHourlyRate !== currentHourlyRate ||
      editedEstimatedHours !== currentEstimatedHours ||
      editedHoursWorked !== currentHoursWorked ||
      editedIsPaid !== (quest.isPaid || false);

    if (!hasChanges) {
      setIsEditingQuest(false);
      return;
    }

    setIsSaving(true);
    try {
      await onEditQuest(quest.id, {
        title: editedTitle.trim(),
        description: editedDescription.trim() || undefined,
        type: editedType,
        difficulty: editedDifficulty,
        deadline: editedDeadline || null,
        isBossBattle: editedIsBossBattle,
        bossName: editedIsBossBattle ? (editedBossName.trim() || editedTitle.trim()) : null,
        bossMaxHp: editedIsBossBattle ? (quest.bossMaxHp || 100) : undefined,
        billingType: editedBillingType,
        budgetAmount: editedBillingType === 'FIXED' && editedBudgetAmount ? parseFloat(editedBudgetAmount) : null,
        hourlyRate: editedBillingType === 'HOURLY' && editedHourlyRate ? parseFloat(editedHourlyRate) : null,
        estimatedHours: editedBillingType === 'HOURLY' && editedEstimatedHours ? parseFloat(editedEstimatedHours) : null,
        hoursWorked: editedBillingType === 'HOURLY' && editedHoursWorked ? parseFloat(editedHoursWorked) : null,
        isPaid: editedIsPaid,
      });
      setIsEditingQuest(false);
    } catch (error) {
      console.error('Error saving quest:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEditQuest = () => {
    setIsEditingQuest(false);
    setEditedTitle(quest.title);
    setEditedDescription(quest.description || '');
    setEditedType(quest.type);
    setEditedDifficulty(quest.difficulty);
    setEditedDeadline(quest.deadline ? new Date(quest.deadline).toISOString().split('T')[0] : '');
    setEditedIsBossBattle(quest.isBossBattle || false);
    setEditedBossName(quest.bossName || '');
    setEditedBillingType((quest.billingType as 'FIXED' | 'HOURLY') || 'FIXED');
    setEditedBudgetAmount(quest.budgetAmount !== null && quest.budgetAmount !== undefined ? String(quest.budgetAmount) : '');
    setEditedHourlyRate(quest.hourlyRate !== null && quest.hourlyRate !== undefined ? String(quest.hourlyRate) : '');
    setEditedEstimatedHours(quest.estimatedHours !== null && quest.estimatedHours !== undefined ? String(quest.estimatedHours) : '');
    setEditedHoursWorked(quest.hoursWorked !== null && quest.hoursWorked !== undefined ? String(quest.hoursWorked) : '');
    setEditedIsPaid(quest.isPaid || false);
  };

  // Currency formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        {/* Header */}
        <div className="border-b border-primary/20 bg-surface">
          <div className="mx-auto flex max-w-2xl items-center justify-between p-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </button>
            <div className="flex items-center gap-2">
              {quest.status !== 'COMPLETED' && onEditQuest && !isEditingQuest && (
                <button
                  onClick={() => setIsEditingQuest(true)}
                  className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
                  title="Editar misión"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-gray-400 hover:text-error rounded-lg hover:bg-error/10 transition-colors"
                title="Eliminar misión"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-2xl p-4">
            {/* Quest header - Edit Mode */}
            <AnimatePresence mode="wait">
              {isEditingQuest ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-6"
                >
                  <Card className="p-4 border-primary/40">
                    <h3 className="text-sm font-semibold text-primary mb-4">Editar Misión</h3>
                    
                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Título</label>
                        <Input
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          placeholder="Nombre de la misión"
                          autoFocus
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Descripción</label>
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          placeholder="Descripción opcional..."
                          rows={3}
                          className="w-full rounded-lg border border-primary/30 bg-surface-dark px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                      </div>

                      {/* Type and Difficulty */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Tipo</label>
                          <select
                            value={editedType}
                            onChange={(e) => setEditedType(e.target.value)}
                            className="h-10 w-full rounded-lg border border-primary/30 bg-surface-dark px-3 text-sm text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            {typeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Dificultad</label>
                          <select
                            value={editedDifficulty}
                            onChange={(e) => setEditedDifficulty(e.target.value)}
                            className="h-10 w-full rounded-lg border border-primary/30 bg-surface-dark px-3 text-sm text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            {difficultyOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Fecha límite (opcional)</label>
                        <Input
                          type="date"
                          value={editedDeadline}
                          onChange={(e) => setEditedDeadline(e.target.value)}
                        />
                      </div>

                      {/* Boss Battle */}
                      <div className={cn(
                        "rounded-lg border p-4 transition-colors",
                        editedIsBossBattle 
                          ? "border-error/40 bg-error/5" 
                          : "border-primary/20 bg-surface-dark"
                      )}>
                        <label className="flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={editedIsBossBattle}
                            onChange={(e) => setEditedIsBossBattle(e.target.checked)}
                            className="h-5 w-5 rounded border-primary/30 bg-surface-dark text-error focus:ring-error"
                          />
                          <div>
                            <span className="font-medium text-white flex items-center gap-2">
                              <Skull className={cn("h-4 w-4", editedIsBossBattle ? "text-error" : "text-gray-400")} />
                              Batalla de Jefe
                            </span>
                            <p className="text-xs text-gray-400">
                              Añade un jefe con barra de HP que disminuye al completar tareas
                            </p>
                          </div>
                        </label>

                        {editedIsBossBattle && (
                          <div className="mt-3">
                            <label className="text-xs text-gray-400 mb-1 block">Nombre del jefe</label>
                            <Input
                              value={editedBossName}
                              onChange={(e) => setEditedBossName(e.target.value)}
                              placeholder="Ej: Dragón del Deadline"
                            />
                          </div>
                        )}
                      </div>

                      {/* Billing Section (for all quests) */}
                      <div className={cn(
                          "rounded-lg border p-4 transition-colors",
                          (editedBudgetAmount || editedHourlyRate)
                            ? "border-emerald-500/40 bg-emerald-500/5" 
                            : "border-primary/20 bg-surface-dark"
                        )}>
                          <div className="flex items-center gap-2 mb-3">
                            <Banknote className={cn("h-5 w-5", (editedBudgetAmount || editedHourlyRate) ? "text-emerald-400" : "text-gray-400")} />
                            <span className="font-medium text-white">Facturación del Proyecto</span>
                          </div>
                          
                          <div className="space-y-3">
                            {/* Billing Type Toggle */}
                            <div>
                              <label className="text-xs text-gray-400 mb-2 block">Tipo de cobro</label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditedBillingType('FIXED')}
                                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                    editedBillingType === 'FIXED'
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-surface-dark text-gray-400 hover:text-white border border-primary/20'
                                  }`}
                                >
                                  💰 Monto Fijo
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditedBillingType('HOURLY')}
                                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                    editedBillingType === 'HOURLY'
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-surface-dark text-gray-400 hover:text-white border border-primary/20'
                                  }`}
                                >
                                  ⏱️ Por Hora
                                </button>
                              </div>
                            </div>

                            {editedBillingType === 'FIXED' ? (
                              <div>
                                <label className="text-xs text-gray-400 mb-1 block">Monto a cobrar (USD)</label>
                                <Input
                                  type="number"
                                  value={editedBudgetAmount}
                                  onChange={(e) => setEditedBudgetAmount(e.target.value)}
                                  placeholder="0.00"
                                  min="0"
                                  step="100"
                                />
                              </div>
                            ) : (
                              <>
                                <div>
                                  <label className="text-xs text-gray-400 mb-1 block">Tarifa por hora (USD)</label>
                                  <Input
                                    type="number"
                                    value={editedHourlyRate}
                                    onChange={(e) => setEditedHourlyRate(e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="10"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-xs text-gray-400 mb-1 block">📋 Horas estimadas</label>
                                    <Input
                                      type="number"
                                      value={editedEstimatedHours}
                                      onChange={(e) => setEditedEstimatedHours(e.target.value)}
                                      placeholder="0"
                                      min="0"
                                      step="0.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-400 mb-1 block">✅ Horas trabajadas</label>
                                    <Input
                                      type="number"
                                      value={editedHoursWorked}
                                      onChange={(e) => setEditedHoursWorked(e.target.value)}
                                      placeholder="0"
                                      min="0"
                                      step="0.5"
                                    />
                                  </div>
                                </div>
                                {editedHourlyRate && (editedEstimatedHours || editedHoursWorked) && (
                                  <div className="bg-emerald-500/20 rounded-lg p-3">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                      {editedEstimatedHours && (
                                        <div>
                                          <span className="text-xs text-gray-400">Presupuesto</span>
                                          <div className="text-lg font-bold text-emerald-400/70">
                                            ${(parseFloat(editedHourlyRate) * parseFloat(editedEstimatedHours)).toFixed(2)}
                                          </div>
                                          <span className="text-[10px] text-gray-500">{editedEstimatedHours}h estimadas</span>
                                        </div>
                                      )}
                                      {editedHoursWorked && (
                                        <div>
                                          <span className="text-xs text-gray-400">Total real</span>
                                          <div className="text-lg font-bold text-emerald-400">
                                            ${(parseFloat(editedHourlyRate) * parseFloat(editedHoursWorked)).toFixed(2)}
                                          </div>
                                          <span className="text-[10px] text-gray-500">{editedHoursWorked}h trabajadas</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Paid checkbox - show if has any billing amount */}
                            {((editedBillingType === 'FIXED' && editedBudgetAmount && parseFloat(editedBudgetAmount) > 0) ||
                              (editedBillingType === 'HOURLY' && editedHourlyRate && (editedEstimatedHours || editedHoursWorked))) && (
                              <label className={cn(
                                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                                editedIsPaid 
                                  ? "border-success/40 bg-success/10" 
                                  : "border-primary/20 bg-surface-dark hover:border-primary/40"
                              )}>
                                <input
                                  type="checkbox"
                                  checked={editedIsPaid}
                                  onChange={(e) => setEditedIsPaid(e.target.checked)}
                                  className="h-5 w-5 rounded border-primary/30 bg-surface-dark text-success focus:ring-success"
                                />
                                <div className="flex-1">
                                  <span className="font-medium text-white flex items-center gap-2">
                                    <CheckCircle2 className={cn("h-4 w-4", editedIsPaid ? "text-success" : "text-gray-400")} />
                                    Proyecto cobrado
                                  </span>
                                  <p className="text-xs text-gray-400">
                                    Marca cuando hayas recibido el pago
                                  </p>
                                </div>
                                {editedIsPaid && (
                                  <span className="text-xs text-success bg-success/20 px-2 py-1 rounded-lg">
                                    ✓ Pagado
                                  </span>
                                )}
                              </label>
                            )}
                          </div>
                        </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          variant="ghost"
                          onClick={handleCancelEditQuest}
                          disabled={isSaving}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveQuest}
                          disabled={isSaving || !editedTitle.trim()}
                          isLoading={isSaving}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Guardar cambios
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="display"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-6"
                >
                  <div className="mb-2 flex items-center gap-2">
                    {quest.isBossBattle ? (
                      <Skull className="h-6 w-6 text-error" />
                    ) : quest.type === 'MAIN' ? (
                      <Sword className="h-6 w-6 text-primary" />
                    ) : (
                      <Target className="h-6 w-6 text-primary" />
                    )}
                    <span
                      className={cn(
                        'text-sm font-medium',
                        difficulty.color
                      )}
                    >
                      {difficulty.label} ({difficulty.xpMult} XP)
                    </span>
                  </div>

                  <h1 className="mb-2 text-2xl font-bold text-white">{quest.title}</h1>
                  
                  {quest.description && (
                    <p className="text-gray-400">{quest.description}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Boss battle card */}
            {quest.isBossBattle && quest.bossName && (
              <Card variant="boss" className="mb-6">
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skull className="h-5 w-5 text-error" />
                      <span className="font-bold text-error">{quest.bossName}</span>
                    </div>
                    {quest.bossHp === 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 text-sm text-success"
                      >
                        <Trophy className="h-4 w-4" />
                        ¡DERROTADO!
                      </motion.span>
                    )}
                  </div>
                  <ProgressBar
                    value={quest.bossHp || 0}
                    max={quest.bossMaxHp || 100}
                    color="error"
                    size="lg"
                    showLabel
                    label="HP"
                    glow
                  />
                </div>
              </Card>
            )}

            {/* Progress */}
            <Card className="mb-6">
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Progreso de la misión</span>
                  <span className="text-sm font-medium text-white">
                    {completedTasks}/{totalTasks} tareas
                  </span>
                </div>
                <ProgressBar
                  value={completedTasks}
                  max={totalTasks}
                  color={isComplete ? 'success' : 'primary'}
                  size="lg"
                  glow={isComplete}
                />
              </div>
            </Card>

            {/* Rewards */}
            <Card className="mb-6">
              <div className="flex items-center justify-around p-4">
                <div className="text-center">
                  <Star className="mx-auto mb-1 h-6 w-6 text-accent" />
                  <p className="text-lg font-bold text-accent">{quest.xpReward}</p>
                  <p className="text-xs text-gray-400">XP Total</p>
                </div>
                <div className="h-10 w-px bg-primary/20" />
                <div className="text-center">
                  <Coins className="mx-auto mb-1 h-6 w-6 text-yellow-400" />
                  <p className="text-lg font-bold text-yellow-400">{quest.goldReward}</p>
                  <p className="text-xs text-gray-400">Oro</p>
                </div>
                {quest.deadline && (
                  <>
                    <div className="h-10 w-px bg-primary/20" />
                    <div className="text-center">
                      <Clock className="mx-auto mb-1 h-6 w-6 text-gray-400" />
                      <p className="text-sm font-medium text-white">
                        {new Date(quest.deadline).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-xs text-gray-400">Fecha límite</p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Billing Card (for quests with budget) */}
            {quest.budgetAmount !== null && quest.budgetAmount !== undefined && quest.budgetAmount > 0 && (
              <Card className={cn(
                "mb-6 border-2",
                quest.isPaid ? "border-success/40" : "border-emerald-500/40"
              )}>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        quest.isPaid ? "bg-success/20" : "bg-emerald-500/20"
                      )}>
                        <Banknote className={cn("h-6 w-6", quest.isPaid ? "text-success" : "text-emerald-400")} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Monto del proyecto</p>
                        <p className={cn(
                          "text-2xl font-bold",
                          quest.isPaid ? "text-success" : "text-emerald-400"
                        )}>
                          {formatCurrency(quest.budgetAmount)}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-2",
                      quest.isPaid 
                        ? "bg-success/20 text-success" 
                        : "bg-amber-500/20 text-amber-400"
                    )}>
                      {quest.isPaid ? (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          <div>
                            <p className="font-semibold">Cobrado</p>
                            {quest.paidAt && (
                              <p className="text-xs opacity-80">
                                {new Date(quest.paidAt).toLocaleDateString('es-ES')}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <Clock className="h-5 w-5" />
                          <span className="font-semibold">Pendiente</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Tasks */}
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-white">Tareas</h2>
              <TaskList
                tasks={quest.tasks}
                onToggleTask={onToggleTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onAddTask={onAddTask ? (data) => onAddTask(quest.id, data) : undefined}
                disabled={quest.status === 'COMPLETED'}
                editable={quest.status !== 'COMPLETED'}
              />
            </div>

            {/* Complete banner */}
            {isComplete && quest.status !== 'COMPLETED' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-success/20 border border-success/30 p-4 text-center"
              >
                <Trophy className="mx-auto mb-2 h-8 w-8 text-success" />
                <p className="font-bold text-success">¡Misión Completada!</p>
                <p className="text-sm text-gray-400">
                  Has ganado {quest.xpReward} XP y {quest.goldReward} oro
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Eliminar Misión"
        size="sm"
      >
        <p className="mb-4 text-gray-300">
          ¿Estás seguro de que quieres eliminar esta misión? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="flex-1"
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </>
  );
}
