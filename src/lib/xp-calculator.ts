// ============================================
// XP & LEVEL CALCULATOR
// Fórmula: XP_necesario = Base * (Nivel ^ Factor)
// ============================================

// Difficulty type (string en SQLite)
export type Difficulty = 'TRIVIAL' | 'EASY' | 'NORMAL' | 'HARD' | 'EPIC' | 'LEGENDARY';

const BASE_XP = 100;
const GROWTH_FACTOR = 1.5;

// Calcular XP necesario para un nivel específico
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(BASE_XP * Math.pow(level - 1, GROWTH_FACTOR));
}

// Calcular XP necesario para el siguiente nivel
export function xpForNextLevel(currentLevel: number): number {
  return xpForLevel(currentLevel + 1);
}

// Calcular nivel basado en XP total
export function levelFromXP(totalXP: number): number {
  let level = 1;
  let xpRequired = 0;
  
  while (xpRequired <= totalXP) {
    level++;
    xpRequired = xpForLevel(level);
  }
  
  return level - 1;
}

// Calcular progreso dentro del nivel actual (0-100%)
export function levelProgress(currentXP: number, currentLevel: number): number {
  const currentLevelXP = xpForLevel(currentLevel);
  const nextLevelXP = xpForLevel(currentLevel + 1);
  const xpInLevel = currentXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  
  if (xpNeeded === 0) return 100;
  return Math.min(Math.round((xpInLevel / xpNeeded) * 100), 100);
}

// ============================================
// REWARD MULTIPLIERS
// ============================================

export const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
  TRIVIAL: 0.5,
  EASY: 0.75,
  NORMAL: 1.0,
  HARD: 1.5,
  EPIC: 2.0,
  LEGENDARY: 3.0,
};

export const STREAK_BONUS: Record<number, number> = {
  0: 1.0,    // Sin racha
  3: 1.1,    // 3 días: +10%
  7: 1.25,   // 7 días: +25%
  14: 1.5,   // 14 días: +50%
  30: 2.0,   // 30 días: +100%
};

// Obtener multiplicador de racha
export function getStreakMultiplier(streakDays: number): number {
  const thresholds = Object.keys(STREAK_BONUS)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const threshold of thresholds) {
    if (streakDays >= threshold) {
      return STREAK_BONUS[threshold];
    }
  }
  
  return 1.0;
}

// Calcular recompensa final con multiplicadores
export function calculateFinalReward(
  baseReward: number,
  difficulty: Difficulty,
  streakDays: number
): number {
  const difficultyMult = DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
  const streakMult = getStreakMultiplier(streakDays);
  
  return Math.floor(baseReward * difficultyMult * streakMult);
}

// ============================================
// BOSS DAMAGE CALCULATION
// ============================================

// Calcular daño al jefe basado en tareas completadas
export function calculateBossDamage(
  taskXP: number,
  bossMaxHp: number,
  totalTasksXP: number
): number {
  if (totalTasksXP === 0) return 0;
  const damagePercent = taskXP / totalTasksXP;
  return Math.floor(bossMaxHp * damagePercent);
}

// ============================================
// ATTRIBUTE XP
// ============================================

const ATTRIBUTE_BASE_XP = 50;
const ATTRIBUTE_GROWTH = 1.3;

export function attributeXPForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(ATTRIBUTE_BASE_XP * Math.pow(level - 1, ATTRIBUTE_GROWTH));
}

export function attributeLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpRequired = 0;
  
  while (xpRequired <= totalXP) {
    level++;
    xpRequired = attributeXPForLevel(level);
  }
  
  return level - 1;
}

// ============================================
// TITLES BY LEVEL
// ============================================

export const TITLES_BY_LEVEL: Record<number, string> = {
  1: 'Novato Digital',
  5: 'Aprendiz del Código',
  10: 'Desarrollador Emergente',
  15: 'Craftsman del Pixel',
  20: 'Arquitecto de Interfaces',
  25: 'Maestro UX',
  30: 'Gurú del Frontend',
  40: 'Leyenda Digital',
  50: 'Dios del Diseño',
};

export function getTitleForLevel(level: number): string {
  const levels = Object.keys(TITLES_BY_LEVEL)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const lvl of levels) {
    if (level >= lvl) {
      return TITLES_BY_LEVEL[lvl];
    }
  }
  
  return 'Novato Digital';
}
