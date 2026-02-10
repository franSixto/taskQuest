'use client';

import { useState } from 'react';
import { Plus, X, Trash2, Skull, Banknote } from 'lucide-react';
import { Button, Input, Textarea, Select, Modal } from '@/components/ui';
import type { CreateQuestInput } from '@/lib/types';

interface QuestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quest: CreateQuestInput) => Promise<void>;
}

const questTypes = [
  { value: 'SIDE', label: 'Misión Secundaria' },
  { value: 'MAIN', label: 'Misión Principal' },
  { value: 'DAILY', label: 'Diaria' },
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'BOSS', label: '🔥 Batalla de Jefe' },
];

const difficulties = [
  { value: 'TRIVIAL', label: 'Trivial (0.5x XP)' },
  { value: 'EASY', label: 'Fácil (0.75x XP)' },
  { value: 'NORMAL', label: 'Normal (1x XP)' },
  { value: 'HARD', label: 'Difícil (1.5x XP)' },
  { value: 'EPIC', label: 'Épico (2x XP)' },
  { value: 'LEGENDARY', label: 'Legendario (3x XP)' },
];

const attributes = [
  { value: '', label: 'Sin atributo' },
  { value: 'creativity', label: 'Creatividad' },
  { value: 'logic', label: 'Lógica' },
  { value: 'focus', label: 'Enfoque' },
  { value: 'communication', label: 'Comunicación' },
];

interface TaskInput {
  id: string;
  title: string;
  attributeBoost: string;
}

export function QuestForm({ isOpen, onClose, onSubmit }: QuestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('SIDE');
  const [difficulty, setDifficulty] = useState('NORMAL');
  const [isBossBattle, setIsBossBattle] = useState(false);
  const [bossName, setBossName] = useState('');
  // Billing states
  const [billingType, setBillingType] = useState<'FIXED' | 'HOURLY'>('FIXED');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [tasks, setTasks] = useState<TaskInput[]>([
    { id: '1', title: '', attributeBoost: '' },
  ]);

  const addTask = () => {
    setTasks([
      ...tasks,
      { id: Math.random().toString(36).substring(7), title: '', attributeBoost: '' },
    ]);
  };

  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const updateTask = (id: string, field: keyof TaskInput, value: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('SIDE');
    setDifficulty('NORMAL');
    setIsBossBattle(false);
    setBossName('');
    setBillingType('FIXED');
    setBudgetAmount('');
    setHourlyRate('');
    setEstimatedHours('');
    setHoursWorked('');
    setTasks([{ id: '1', title: '', attributeBoost: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const validTasks = tasks.filter((t) => t.title.trim());
    if (validTasks.length === 0) return;

    // Boss battle is enabled when type is BOSS or when MAIN with isBossBattle checked
    const isBoss = type === 'BOSS' || (type === 'MAIN' && isBossBattle);

    setIsSubmitting(true);

    try {
      const questData: CreateQuestInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        type: type === 'BOSS' ? 'MAIN' : type as CreateQuestInput['type'],
        difficulty: difficulty as CreateQuestInput['difficulty'],
        isBossBattle: isBoss,
        bossName: isBoss ? bossName.trim() || title.trim() : undefined,
        bossHp: isBoss ? 100 : undefined,
        // Billing fields
        billingType: billingType,
        budgetAmount: billingType === 'FIXED' && budgetAmount ? parseFloat(budgetAmount) : undefined,
        hourlyRate: billingType === 'HOURLY' && hourlyRate ? parseFloat(hourlyRate) : undefined,
        estimatedHours: billingType === 'HOURLY' && estimatedHours ? parseFloat(estimatedHours) : undefined,
        hoursWorked: billingType === 'HOURLY' && hoursWorked ? parseFloat(hoursWorked) : undefined,
        tasks: validTasks.map((t) => ({
          title: t.title.trim(),
          attributeBoost: t.attributeBoost || undefined,
        })),
      };

      await onSubmit(questData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating quest:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Misión"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Título de la misión"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Rediseñar página de inicio"
          required
        />

        {/* Description */}
        <Textarea
          label="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe los objetivos de esta misión..."
          rows={2}
        />

        {/* Type and Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo de misión"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={questTypes}
          />
          <Select
            label="Dificultad"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={difficulties}
          />
        </div>

        {/* Boss battle toggle (for MAIN quests) or always shown for BOSS type */}
        {(type === 'MAIN' || type === 'BOSS') && (
          <div className="rounded-lg border border-error/30 bg-error/5 p-4">
            {type === 'BOSS' ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Skull className="h-5 w-5 text-error" />
                  <span className="font-medium text-error">Configuración del Jefe</span>
                </div>
                <Input
                  label="Nombre del jefe"
                  value={bossName}
                  onChange={(e) => setBossName(e.target.value)}
                  placeholder="Ej: Dragón del Deadline"
                />
                <p className="mt-2 text-xs text-gray-400">
                  El jefe tendrá 100 HP. Cada tarea completada le quitará vida proporcional.
                </p>
              </>
            ) : (
              <>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isBossBattle}
                    onChange={(e) => setIsBossBattle(e.target.checked)}
                    className="h-5 w-5 rounded border-primary/30 bg-surface-dark text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="font-medium text-white">Batalla de Jefe</span>
                    <p className="text-xs text-gray-400">
                      Añade un jefe con barra de HP que disminuye al completar tareas
                    </p>
                  </div>
                </label>

                {isBossBattle && (
                  <Input
                    label="Nombre del jefe"
                    value={bossName}
                    onChange={(e) => setBossName(e.target.value)}
                    placeholder="Ej: Cliente Exigente"
                    className="mt-3"
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Budget/Billing (for all quests) */}
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Banknote className="h-5 w-5 text-emerald-400" />
              <span className="font-medium text-emerald-400">Facturación del Proyecto</span>
            </div>
            
            {/* Billing Type Toggle */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-2 block">Tipo de cobro</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBillingType('FIXED')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    billingType === 'FIXED'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-surface-dark text-gray-400 hover:text-white border border-primary/20'
                  }`}
                >
                  💰 Monto Fijo
                </button>
                <button
                  type="button"
                  onClick={() => setBillingType('HOURLY')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    billingType === 'HOURLY'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-surface-dark text-gray-400 hover:text-white border border-primary/20'
                  }`}
                >
                  ⏱️ Por Hora
                </button>
              </div>
            </div>

            {billingType === 'FIXED' ? (
              <Input
                label="Monto a cobrar (USD) - Opcional"
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="100"
              />
            ) : (
              <div className="space-y-3">
                <Input
                  label="Tarifa por hora (USD)"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="10"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="📋 Horas estimadas"
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.5"
                  />
                  <Input
                    label="✅ Horas trabajadas"
                    type="number"
                    value={hoursWorked}
                    onChange={(e) => setHoursWorked(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.5"
                  />
                </div>
                {hourlyRate && (estimatedHours || hoursWorked) && (
                  <div className="bg-emerald-500/20 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      {estimatedHours && (
                        <div>
                          <span className="text-xs text-gray-400">Presupuesto estimado</span>
                          <div className="text-lg font-bold text-emerald-400/70">
                            ${(parseFloat(hourlyRate) * parseFloat(estimatedHours)).toFixed(2)}
                          </div>
                        </div>
                      )}
                      {hoursWorked && (
                        <div>
                          <span className="text-xs text-gray-400">Total real</span>
                          <div className="text-lg font-bold text-emerald-400">
                            ${(parseFloat(hourlyRate) * parseFloat(hoursWorked)).toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <p className="mt-2 text-xs text-gray-400">
              {billingType === 'FIXED' 
                ? 'Registra el monto del proyecto para llevar control de cobros'
                : 'Puedes actualizar las horas trabajadas más adelante'}
            </p>
          </div>

        {/* Tasks */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Tareas</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addTask}
            >
              <Plus className="h-4 w-4" />
              Añadir tarea
            </Button>
          </div>

          <div className="space-y-2">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center gap-2 rounded-lg border border-primary/10 bg-surface-dark p-2"
              >
                <span className="text-xs text-gray-500">{index + 1}.</span>
                <Input
                  value={task.title}
                  onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                  placeholder="Título de la tarea"
                  className="flex-1"
                />
                <Select
                  value={task.attributeBoost}
                  onChange={(e) => updateTask(task.id, 'attributeBoost', e.target.value)}
                  options={attributes}
                  className="w-40"
                />
                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTask(task.id)}
                    className="text-gray-400 hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="flex-1"
          >
            Crear Misión
          </Button>
        </div>
      </form>
    </Modal>
  );
}
