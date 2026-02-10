'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  DollarSign,
  Clock,
  TrendingUp,
  CheckCircle2,
  Target,
  Banknote,
  PieChart,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, Button, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StatsData {
  financial: {
    totalBilled: number;
    totalPaid: number;
    totalPending: number;
    avgHourlyRate: number;
    fixedProjects: number;
    hourlyProjects: number;
  };
  time: {
    totalHoursEstimated: number;
    totalHoursWorked: number;
    efficiency: string;
  };
  quests: {
    total: number;
    completed: number;
    active: number;
    completionRate: string;
  };
  tasks: {
    total: number;
    completed: number;
    completionRate: string;
  };
  monthly: Array<{
    month: string;
    billed: number;
    paid: number;
    hours: number;
  }>;
}

interface StatsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsDashboard({ isOpen, onClose }: StatsDashboardProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'monthly'>('overview');

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const { data } = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
  };

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Estadísticas</h1>
              <p className="text-xs text-gray-400">Dashboard financiero y de productividad</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-4 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : stats ? (
            <>
              {/* Tabs */}
              <div className="flex gap-2 bg-surface-dark rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                    activeTab === 'overview'
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  Resumen General
                </button>
                <button
                  onClick={() => setActiveTab('monthly')}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                    activeTab === 'monthly'
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  Por Mes
                </button>
              </div>

              {activeTab === 'overview' ? (
                <>
                  {/* Financial Overview Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                      icon={DollarSign}
                      label="Total Facturado"
                      value={formatCurrency(stats.financial.totalBilled)}
                      color="emerald"
                    />
                    <StatCard
                      icon={CheckCircle2}
                      label="Total Cobrado"
                      value={formatCurrency(stats.financial.totalPaid)}
                      color="success"
                    />
                    <StatCard
                      icon={Clock}
                      label="Pendiente"
                      value={formatCurrency(stats.financial.totalPending)}
                      color="warning"
                    />
                    <StatCard
                      icon={TrendingUp}
                      label="Tarifa Promedio"
                      value={`${formatCurrency(stats.financial.avgHourlyRate)}/hr`}
                      color="primary"
                    />
                  </div>

                  {/* Project Types */}
                  <Card className="p-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-primary" />
                      Tipos de Proyecto
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface-dark rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-emerald-400">
                          {stats.financial.fixedProjects}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Precio Fijo</div>
                      </div>
                      <div className="bg-surface-dark rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-primary">
                          {stats.financial.hourlyProjects}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Por Hora</div>
                      </div>
                    </div>
                  </Card>

                  {/* Time Stats */}
                  <Card className="p-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Control de Tiempo
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Horas Estimadas</span>
                        <span className="font-bold text-white">{stats.time.totalHoursEstimated}h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Horas Trabajadas</span>
                        <span className="font-bold text-emerald-400">{stats.time.totalHoursWorked}h</span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Eficiencia</span>
                          <span className={cn(
                            "font-bold",
                            parseFloat(stats.time.efficiency) <= 100 ? "text-success" : "text-warning"
                          )}>
                            {stats.time.efficiency}%
                          </span>
                        </div>
                        <ProgressBar
                          value={parseFloat(stats.time.efficiency)}
                          max={150}
                          color={parseFloat(stats.time.efficiency) <= 100 ? "success" : "warning"}
                          size="sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {parseFloat(stats.time.efficiency) <= 100 
                            ? "✓ Entregando dentro del tiempo estimado"
                            : "⚠ Tomando más tiempo del estimado"}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Quest & Task Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Misiones
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total</span>
                          <span className="font-bold text-white">{stats.quests.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Completadas</span>
                          <span className="font-bold text-success">{stats.quests.completed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Activas</span>
                          <span className="font-bold text-primary">{stats.quests.active}</span>
                        </div>
                        <div className="pt-2 border-t border-primary/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">Tasa de Completado</span>
                            <span className="text-sm font-bold text-success">{stats.quests.completionRate}%</span>
                          </div>
                          <ProgressBar
                            value={parseFloat(stats.quests.completionRate)}
                            max={100}
                            color="success"
                            size="sm"
                          />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Tareas
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total</span>
                          <span className="font-bold text-white">{stats.tasks.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Completadas</span>
                          <span className="font-bold text-success">{stats.tasks.completed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pendientes</span>
                          <span className="font-bold text-warning">{stats.tasks.total - stats.tasks.completed}</span>
                        </div>
                        <div className="pt-2 border-t border-primary/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">Tasa de Completado</span>
                            <span className="text-sm font-bold text-success">{stats.tasks.completionRate}%</span>
                          </div>
                          <ProgressBar
                            value={parseFloat(stats.tasks.completionRate)}
                            max={100}
                            color="success"
                            size="sm"
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                </>
              ) : (
                /* Monthly Tab */
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Ingresos Mensuales (últimos 12 meses)
                  </h3>
                  <div className="space-y-3">
                    {stats.monthly.map((month, index) => {
                      const maxBilled = Math.max(...stats.monthly.map(m => m.billed), 1);
                      const prevMonth = stats.monthly[index + 1];
                      const trend = prevMonth 
                        ? ((month.billed - prevMonth.billed) / (prevMonth.billed || 1)) * 100
                        : 0;
                      
                      return (
                        <div key={month.month} className="group">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-400 w-20">{formatMonth(month.month)}</span>
                            <div className="flex-1 mx-4">
                              <div className="relative h-6 bg-surface-dark rounded overflow-hidden">
                                {/* Billed bar */}
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(month.billed / maxBilled) * 100}%` }}
                                  transition={{ duration: 0.5, delay: index * 0.05 }}
                                  className="absolute inset-y-0 left-0 bg-emerald-500/30 rounded"
                                />
                                {/* Paid bar */}
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(month.paid / maxBilled) * 100}%` }}
                                  transition={{ duration: 0.5, delay: index * 0.05 + 0.1 }}
                                  className="absolute inset-y-0 left-0 bg-emerald-500 rounded"
                                />
                              </div>
                            </div>
                            <div className="text-right w-28">
                              <span className="text-sm font-bold text-emerald-400">
                                {formatCurrency(month.paid)}
                              </span>
                              {month.billed > month.paid && (
                                <span className="text-xs text-gray-500 ml-1">
                                  /{formatCurrency(month.billed)}
                                </span>
                              )}
                            </div>
                            {trend !== 0 && (
                              <div className={cn(
                                "ml-2 flex items-center text-xs",
                                trend > 0 ? "text-success" : "text-error"
                              )}>
                                {trend > 0 ? (
                                  <ArrowUpRight className="h-3 w-3" />
                                ) : (
                                  <ArrowDownRight className="h-3 w-3" />
                                )}
                                {Math.abs(trend).toFixed(0)}%
                              </div>
                            )}
                          </div>
                          {month.hours > 0 && (
                            <div className="text-xs text-gray-500 pl-24">
                              {month.hours}h trabajadas
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex gap-4 mt-4 pt-4 border-t border-primary/10 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded" />
                      <span>Cobrado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500/30 rounded" />
                      <span>Facturado (pendiente)</span>
                    </div>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              Error al cargar las estadísticas
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'emerald' | 'success' | 'warning' | 'primary' | 'error';
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    success: 'bg-success/10 border-success/30 text-success',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    primary: 'bg-primary/10 border-primary/30 text-primary',
    error: 'bg-error/10 border-error/30 text-error',
  };

  const iconColorClasses = {
    emerald: 'text-emerald-400',
    success: 'text-success',
    warning: 'text-warning',
    primary: 'text-primary',
    error: 'text-error',
  };

  return (
    <Card className={cn("p-4 border", colorClasses[color])}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("h-4 w-4", iconColorClasses[color])} />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
    </Card>
  );
}
