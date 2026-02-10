'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Gift,
  Coins,
  Gamepad2,
  Coffee,
  Cigarette,
  Music,
  Tv,
  ShoppingBag,
  Utensils,
  Moon,
  Footprints,
  MessageCircle,
  Heart,
  Sparkles,
  Plus,
  Check,
  AlertCircle,
  Crown,
  Loader2,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Card, Button, Input, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Reward {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  goldCost: number;
  category: string;
  dailyLimit: number | null;
  todayUsage: number;
  canRedeem: boolean;
}

interface RewardShopProps {
  isOpen: boolean;
  onClose: () => void;
  currentGold: number;
  onGoldChange: (newGold: number) => void;
}

const CATEGORY_INFO: Record<string, { label: string; color: string }> = {
  LEISURE: { label: 'Ocio', color: 'text-blue-400' },
  HEALTH: { label: 'Bienestar', color: 'text-green-400' },
  SOCIAL: { label: 'Social', color: 'text-purple-400' },
  TREAT: { label: 'Capricho', color: 'text-amber-400' },
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  gift: Gift,
  gamepad2: Gamepad2,
  coffee: Coffee,
  cigarette: Cigarette,
  music: Music,
  tv: Tv,
  'shopping-bag': ShoppingBag,
  utensils: Utensils,
  moon: Moon,
  footprints: Footprints,
  'message-circle': MessageCircle,
  heart: Heart,
  sparkles: Sparkles,
  crown: Crown,
};

const AVAILABLE_ICONS = [
  { id: 'gift', label: 'Regalo' },
  { id: 'gamepad2', label: 'Videojuego' },
  { id: 'coffee', label: 'Café' },
  { id: 'cigarette', label: 'Cigarrillo' },
  { id: 'music', label: 'Música' },
  { id: 'tv', label: 'TV/Series' },
  { id: 'shopping-bag', label: 'Compras' },
  { id: 'utensils', label: 'Comida' },
  { id: 'moon', label: 'Descanso' },
  { id: 'footprints', label: 'Paseo' },
  { id: 'message-circle', label: 'Redes' },
  { id: 'heart', label: 'Favorito' },
  { id: 'sparkles', label: 'Especial' },
  { id: 'crown', label: 'Premium' },
];

export function RewardShop({ isOpen, onClose, currentGold, onGoldChange }: RewardShopProps) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [recentlyRedeemed, setRecentlyRedeemed] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'gift',
    goldCost: 50,
    category: 'LEISURE',
    dailyLimit: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchRewards();
    }
  }, [isOpen]);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rewards');
      if (res.ok) {
        const { data } = await res.json();
        setRewards(data);
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (!reward.canRedeem || currentGold < reward.goldCost) return;

    setRedeeming(reward.id);
    try {
      const res = await fetch(`/api/rewards/${reward.id}/redeem`, {
        method: 'POST',
      });

      if (res.ok) {
        const { data } = await res.json();
        onGoldChange(data.character.gold);
        
        // Actualizar la recompensa en el estado
        setRewards(prev => prev.map(r => 
          r.id === reward.id 
            ? { ...r, todayUsage: data.reward.todayUsage, canRedeem: data.reward.canRedeem }
            : r
        ));

        // Mostrar feedback visual
        setRecentlyRedeemed(reward.id);
        setTimeout(() => setRecentlyRedeemed(null), 2000);
      } else {
        const error = await res.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
    } finally {
      setRedeeming(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      description: formData.description || null,
      icon: formData.icon,
      goldCost: formData.goldCost,
      category: formData.category,
      dailyLimit: formData.dailyLimit ? parseInt(formData.dailyLimit) : null,
    };

    try {
      const url = editingReward 
        ? `/api/rewards/${editingReward.id}` 
        : '/api/rewards';
      const method = editingReward ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchRewards();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving reward:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta recompensa?')) return;

    try {
      const res = await fetch(`/api/rewards/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRewards(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting reward:', error);
    }
  };

  const startEdit = (reward: Reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description || '',
      icon: reward.icon,
      goldCost: reward.goldCost,
      category: reward.category,
      dailyLimit: reward.dailyLimit?.toString() || '',
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'gift',
      goldCost: 50,
      category: 'LEISURE',
      dailyLimit: '',
    });
    setEditingReward(null);
    setShowAddForm(false);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName] || Gift;
    return IconComponent;
  };

  // Agrupar por categoría
  const groupedRewards = rewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, Reward[]>);

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20 border border-secondary/40">
              <Gift className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Tienda de Recompensas</h1>
              <p className="text-xs text-gray-400">Canjea tu oro por premios</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/40">
              <Coins className="h-5 w-5 text-yellow-400" />
              <span className="font-bold text-yellow-400">{currentGold}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-4 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Add button */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Recompensa
                </Button>
              </div>

              {/* Rewards by category */}
              {Object.entries(groupedRewards).length === 0 ? (
                <Card className="p-10 text-center border-dashed">
                  <Gift className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Sin recompensas</h3>
                  <p className="text-gray-400 mb-4">Agrega recompensas para motivarte</p>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Recompensa
                  </Button>
                </Card>
              ) : (
                Object.entries(groupedRewards).map(([category, categoryRewards]) => (
                  <div key={category}>
                    <h2 className={cn(
                      "text-sm font-semibold mb-3 uppercase tracking-wider",
                      CATEGORY_INFO[category]?.color || 'text-gray-400'
                    )}>
                      {CATEGORY_INFO[category]?.label || category}
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {categoryRewards.map((reward, index) => {
                        const IconComponent = getIcon(reward.icon);
                        const canAfford = currentGold >= reward.goldCost;
                        const isAvailable = reward.canRedeem && canAfford;
                        const isRedeemed = recentlyRedeemed === reward.id;

                        return (
                          <motion.div
                            key={reward.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card
                              className={cn(
                                "p-4 transition-all relative overflow-hidden group",
                                isRedeemed && "border-success ring-2 ring-success/30",
                                !isAvailable && "opacity-60"
                              )}
                            >
                              {/* Success overlay */}
                              <AnimatePresence>
                                {isRedeemed && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute inset-0 bg-success/20 flex items-center justify-center z-10"
                                  >
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: 'spring', delay: 0.1 }}
                                    >
                                      <Check className="h-12 w-12 text-success" />
                                    </motion.div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0",
                                  "bg-gradient-to-br from-secondary/20 to-primary/20 border border-secondary/30"
                                )}>
                                  <IconComponent className="h-6 w-6 text-secondary" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-white truncate">
                                    {reward.name}
                                  </h3>
                                  <p className="text-xs text-gray-400 truncate h-4">
                                    {reward.description || '\u00A0'}
                                  </p>

                                  {/* Precio con altura fija */}
                                  <div className="flex items-center gap-2 mt-2 h-5">
                                    <span className={cn(
                                      "flex items-center gap-1 text-sm font-bold",
                                      canAfford ? "text-yellow-400" : "text-red-400"
                                    )}>
                                      <Coins className="h-3 w-3" />
                                      {reward.goldCost}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {reward.dailyLimit 
                                        ? `${reward.todayUsage}/${reward.dailyLimit} hoy`
                                        : '\u00A0'}
                                    </span>
                                  </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col gap-1">
                                  <Button
                                    size="sm"
                                    variant={isAvailable ? 'default' : 'ghost'}
                                    onClick={() => handleRedeem(reward)}
                                    disabled={!isAvailable || redeeming === reward.id}
                                    className="h-8 px-3"
                                  >
                                    {redeeming === reward.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : !reward.canRedeem ? (
                                      <AlertCircle className="h-4 w-4" />
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </Button>
                                  
                                  {/* Edit/Delete on hover */}
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => startEdit(reward)}
                                      className="p-1 text-gray-500 hover:text-primary"
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(reward.id)}
                                      className="p-1 text-gray-500 hover:text-error"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={resetForm}
        title={editingReward ? 'Editar Recompensa' : 'Nueva Recompensa'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Nombre
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: 30 min de videojuegos"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Descripción (opcional)
            </label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción breve"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Costo en Oro
              </label>
              <Input
                type="number"
                min="1"
                value={formData.goldCost}
                onChange={(e) => setFormData({ ...formData, goldCost: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Límite Diario (0 = ilimitado)
              </label>
              <Input
                type="number"
                min="0"
                value={formData.dailyLimit}
                onChange={(e) => setFormData({ ...formData, dailyLimit: e.target.value })}
                placeholder="Sin límite"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Categoría
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORY_INFO).map(([key, { label, color }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: key })}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-all",
                    formData.category === key
                      ? "bg-primary/20 border border-primary text-white"
                      : "bg-surface-dark border border-gray-700 text-gray-400 hover:border-gray-500"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Ícono
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ICONS.map(({ id, label }) => {
                const IconComponent = ICON_MAP[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: id })}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      formData.icon === id
                        ? "bg-secondary/20 border border-secondary text-secondary"
                        : "bg-surface-dark border border-gray-700 text-gray-400 hover:border-gray-500"
                    )}
                    title={label}
                  >
                    <IconComponent className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={resetForm} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {editingReward ? 'Guardar' : 'Crear Recompensa'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
