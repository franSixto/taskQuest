import { Prisma } from '@prisma/client';

// Character with all relations
export type CharacterWithRelations = Prisma.CharacterGetPayload<{
  include: {
    attributes: true;
    quests: {
      include: {
        tasks: true;
      };
    };
    achievements: {
      include: {
        achievement: true;
      };
    };
    inventory: {
      include: {
        item: true;
      };
    };
  };
}>;

// Quest with tasks (including billing fields)
export type QuestWithTasks = Prisma.QuestGetPayload<{
  include: {
    tasks: true;
  };
}> & {
  // Billing fields
  billingType?: 'FIXED' | 'HOURLY';
  budgetAmount?: number | null;
  hourlyRate?: number | null;
  estimatedHours?: number | null;
  hoursWorked?: number | null;
  isPaid?: boolean;
  paidAt?: Date | null;
};

// Achievement with unlock status
export type AchievementWithStatus = Prisma.AchievementGetPayload<{}> & {
  isUnlocked: boolean;
  unlockedAt?: Date;
};

// Inventory item with details
export type InventoryItemWithDetails = Prisma.InventoryItemGetPayload<{
  include: {
    item: true;
  };
}>;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// XP Gain event for animations
export interface XPGainEvent {
  id: string;
  amount: number;
  source: string;
  timestamp: Date;
}

// Level up event
export interface LevelUpEvent {
  oldLevel: number;
  newLevel: number;
  unlockedTitle?: string;
}

// Reward summary
export interface RewardSummary {
  xp: number;
  gold: number;
  attributeXP?: {
    attribute: string;
    amount: number;
  };
}

// Quest creation input
export interface CreateQuestInput {
  title: string;
  description?: string;
  type: 'MAIN' | 'SIDE' | 'DAILY' | 'WEEKLY' | 'BOSS';
  difficulty: 'TRIVIAL' | 'EASY' | 'NORMAL' | 'HARD' | 'EPIC' | 'LEGENDARY';
  deadline?: Date;
  isBossBattle?: boolean;
  bossName?: string;
  bossHp?: number;
  // Billing
  billingType?: 'FIXED' | 'HOURLY';
  budgetAmount?: number;
  hourlyRate?: number;
  estimatedHours?: number;
  hoursWorked?: number;
  tasks: {
    title: string;
    description?: string;
    xpReward?: number;
    goldReward?: number;
    attributeBoost?: string;
  }[];
}

// Task completion result
export interface TaskCompletionResult {
  task: Prisma.TaskGetPayload<{}>;
  rewards: RewardSummary;
  questCompleted: boolean;
  bossDefeated?: boolean;
  levelUp?: LevelUpEvent;
  achievementsUnlocked: Prisma.AchievementGetPayload<{}>[];
}

// Daily progress summary
export interface DailyProgressSummary {
  date: Date;
  tasksCompleted: number;
  questsCompleted: number;
  xpEarned: number;
  goldEarned: number;
  focusMinutes: number;
  pomodorosCompleted: number;
}

// Character stats for display
export interface CharacterStats {
  totalTasksCompleted: number;
  totalQuestsCompleted: number;
  bossesDefeated: number;
  achievementsUnlocked: number;
  totalPlayTime: number; // in minutes
}
