'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, Star, Coins, Sparkles, Pencil, X, Save, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';

export interface TaskData {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
  goldReward: number;
  attributeBoost: string | null;
}

export interface TaskUpdateData {
  title?: string;
  xpReward?: number;
  goldReward?: number;
  attributeBoost?: string | null;
}

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
  goldReward: number;
  attributeBoost?: string | null;
  onToggle: (id: string) => void;
  onEdit?: (id: string, data: TaskUpdateData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  disabled?: boolean;
  editable?: boolean;
}

const attributeColors: Record<string, string> = {
  creativity: 'text-creativity',
  logic: 'text-logic',
  focus: 'text-focus',
  communication: 'text-communication',
};

const attributeLabels: Record<string, string> = {
  creativity: 'Creatividad',
  logic: 'Lógica',
  focus: 'Enfoque',
  communication: 'Comunicación',
};

const attributeOptions = [
  { value: '', label: 'Ninguno' },
  { value: 'creativity', label: 'Creatividad' },
  { value: 'logic', label: 'Lógica' },
  { value: 'focus', label: 'Enfoque' },
  { value: 'communication', label: 'Comunicación' },
];

export function TaskItem({
  id,
  title,
  completed,
  xpReward,
  goldReward,
  attributeBoost,
  onToggle,
  onEdit,
  onDelete,
  disabled = false,
  editable = true,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedXP, setEditedXP] = useState(xpReward);
  const [editedGold, setEditedGold] = useState(goldReward);
  const [editedAttribute, setEditedAttribute] = useState(attributeBoost || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async () => {
    if (!onEdit || !editedTitle.trim()) {
      setIsEditing(false);
      resetForm();
      return;
    }

    // Check if anything changed
    const hasChanges = 
      editedTitle.trim() !== title ||
      editedXP !== xpReward ||
      editedGold !== goldReward ||
      (editedAttribute || null) !== attributeBoost;

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onEdit(id, {
        title: editedTitle.trim(),
        xpReward: editedXP,
        goldReward: editedGold,
        attributeBoost: editedAttribute || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving task:', error);
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setEditedTitle(title);
    setEditedXP(xpReward);
    setEditedGold(goldReward);
    setEditedAttribute(attributeBoost || '');
  };

  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsSaving(true);
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className={cn(
        'group rounded-xl border-2 transition-all duration-300',
        completed
          ? 'border-success/40 bg-gradient-to-r from-success/10 to-success/5'
          : 'border-primary/20 bg-gradient-to-r from-surface-dark to-surface-dark/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5',
        disabled && 'pointer-events-none opacity-50',
        isEditing && 'border-primary/60'
      )}
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-3"
          >
            {/* Title input */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Título de la tarea</label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="h-10 text-sm"
                placeholder="¿Qué necesitas hacer?"
              />
            </div>

            {/* Rewards row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <Star className="h-3 w-3 text-accent" /> XP
                </label>
                <Input
                  type="number"
                  value={editedXP}
                  onChange={(e) => setEditedXP(Math.max(0, parseInt(e.target.value) || 0))}
                  onKeyDown={handleKeyDown}
                  className="h-9 text-sm"
                  min={0}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <Coins className="h-3 w-3 text-yellow-400" /> Oro
                </label>
                <Input
                  type="number"
                  value={editedGold}
                  onChange={(e) => setEditedGold(Math.max(0, parseInt(e.target.value) || 0))}
                  onKeyDown={handleKeyDown}
                  className="h-9 text-sm"
                  min={0}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" /> Atributo
                </label>
                <select
                  value={editedAttribute}
                  onChange={(e) => setEditedAttribute(e.target.value)}
                  className="h-9 w-full rounded-lg border border-primary/30 bg-surface-dark px-2 text-sm text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {attributeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSaving}
                className="text-error hover:bg-error/20"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !editedTitle.trim()}
                  isLoading={isSaving}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Guardar
                </Button>
              </div>
            </div>

            {/* Delete confirmation */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-error/30 pt-3 mt-3"
                >
                  <p className="text-sm text-gray-300 mb-3">
                    ¿Eliminar esta tarea? Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={handleDelete}
                      disabled={isSaving}
                      isLoading={isSaving}
                    >
                      Sí, eliminar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4"
          >
            {/* Checkbox */}
            <button
              onClick={() => onToggle(id)}
              disabled={disabled}
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300',
                completed
                  ? 'border-success bg-success text-white shadow-lg shadow-success/30'
                  : 'border-primary/40 hover:border-primary hover:bg-primary/20 hover:shadow-md hover:shadow-primary/20'
              )}
            >
              {completed ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              ) : (
                <Circle className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors" />
              )}
            </button>

            {/* Title */}
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <span
                className={cn(
                  'text-sm font-medium transition-all duration-200 truncate',
                  completed ? 'text-gray-500 line-through' : 'text-gray-100'
                )}
              >
                {title}
              </span>
              {editable && !completed && !disabled && onEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-primary/20 rounded-md"
                  title="Editar tarea"
                >
                  <Pencil className="h-3.5 w-3.5 text-primary" />
                </button>
              )}
            </div>

            {/* Rewards */}
            <div className="flex items-center gap-3 text-xs flex-shrink-0">
              {attributeBoost && (
                <span
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-md bg-white/5',
                    attributeColors[attributeBoost] || 'text-gray-400'
                  )}
                  title={attributeLabels[attributeBoost] || attributeBoost}
                >
                  <Sparkles className="h-3 w-3" />
                  <span className="hidden sm:inline text-[10px] uppercase tracking-wider">
                    {attributeLabels[attributeBoost]?.slice(0, 3) || attributeBoost.slice(0, 3)}
                  </span>
                </span>
              )}
              <span className="flex items-center gap-1 text-accent font-semibold">
                <Star className="h-3.5 w-3.5" />
                {xpReward}
              </span>
              <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                <Coins className="h-3.5 w-3.5" />
                {goldReward}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Add new task form component
interface AddTaskFormProps {
  onAdd: (data: { title: string; xpReward: number; goldReward: number; attributeBoost: string | null }) => Promise<void>;
  disabled?: boolean;
}

export function AddTaskForm({ onAdd, disabled }: AddTaskFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [xpReward, setXpReward] = useState(10);
  const [goldReward, setGoldReward] = useState(5);
  const [attributeBoost, setAttributeBoost] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      await onAdd({
        title: title.trim(),
        xpReward,
        goldReward,
        attributeBoost: attributeBoost || null,
      });
      // Reset form
      setTitle('');
      setXpReward(10);
      setGoldReward(5);
      setAttributeBoost('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setTitle('');
    }
  };

  if (disabled) return null;

  return (
    <AnimatePresence mode="wait">
      {isAdding ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-xl border-2 border-dashed border-primary/40 bg-surface-dark/50 p-4 space-y-3"
        >
          {/* Title input */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Nueva tarea</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="h-10 text-sm"
              placeholder="¿Qué necesitas hacer?"
            />
          </div>

          {/* Rewards row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Star className="h-3 w-3 text-accent" /> XP
              </label>
              <Input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Math.max(0, parseInt(e.target.value) || 0))}
                onKeyDown={handleKeyDown}
                className="h-9 text-sm"
                min={0}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Coins className="h-3 w-3 text-yellow-400" /> Oro
              </label>
              <Input
                type="number"
                value={goldReward}
                onChange={(e) => setGoldReward(Math.max(0, parseInt(e.target.value) || 0))}
                onKeyDown={handleKeyDown}
                className="h-9 text-sm"
                min={0}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" /> Atributo
              </label>
              <select
                value={attributeBoost}
                onChange={(e) => setAttributeBoost(e.target.value)}
                className="h-9 w-full rounded-lg border border-primary/30 bg-surface-dark px-2 text-sm text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {attributeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setTitle('');
              }}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isSaving || !title.trim()}
              isLoading={isSaving}
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          key="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAdding(true)}
          className="w-full rounded-xl border-2 border-dashed border-primary/30 p-4 text-sm text-gray-400 hover:border-primary/50 hover:text-gray-300 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar nueva tarea
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Task list component
interface TaskListProps {
  tasks: TaskData[];
  onToggleTask: (id: string) => void;
  onEditTask?: (id: string, data: TaskUpdateData) => Promise<void>;
  onDeleteTask?: (id: string) => Promise<void>;
  onAddTask?: (data: { title: string; xpReward: number; goldReward: number; attributeBoost: string | null }) => Promise<void>;
  disabled?: boolean;
  editable?: boolean;
}

export function TaskList({ 
  tasks, 
  onToggleTask, 
  onEditTask, 
  onDeleteTask,
  onAddTask,
  disabled, 
  editable = true 
}: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            transition={{ delay: index * 0.03 }}
            layout
          >
            <TaskItem
              {...task}
              onToggle={onToggleTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              disabled={disabled}
              editable={editable}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Add task form */}
      {editable && onAddTask && (
        <AddTaskForm onAdd={onAddTask} disabled={disabled} />
      )}
    </div>
  );
}
