-- CreateTable
CREATE TABLE "bosses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'NORMAL',
    "maxHp" INTEGER NOT NULL DEFAULT 100,
    "imageUrl" TEXT,
    "totalAttempts" INTEGER NOT NULL DEFAULT 0,
    "totalDefeats" INTEGER NOT NULL DEFAULT 0,
    "bestTime" INTEGER,
    "lastAttemptedAt" DATETIME,
    "firstDefeatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bosses_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "boss_attempts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bossId" TEXT NOT NULL,
    "questId" TEXT,
    "defeated" BOOLEAN NOT NULL,
    "timeSpent" INTEGER,
    "damageDealt" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "boss_attempts_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "bosses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "boss_attempts_questId_fkey" FOREIGN KEY ("questId") REFERENCES "quests" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rewards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL DEFAULT 'gift',
    "goldCost" INTEGER NOT NULL DEFAULT 50,
    "category" TEXT NOT NULL DEFAULT 'LEISURE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "dailyLimit" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "reward_redemptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rewardId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "goldSpent" INTEGER NOT NULL,
    "redeemedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reward_redemptions_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "rewards" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_quests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'SIDE',
    "difficulty" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "goldReward" INTEGER NOT NULL DEFAULT 10,
    "billingType" TEXT NOT NULL DEFAULT 'FIXED',
    "budgetAmount" REAL,
    "hourlyRate" REAL,
    "estimatedHours" REAL,
    "hoursWorked" REAL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" DATETIME,
    "isBossBattle" BOOLEAN NOT NULL DEFAULT false,
    "bossId" TEXT,
    "bossName" TEXT,
    "bossHp" INTEGER,
    "bossMaxHp" INTEGER,
    "bossImageUrl" TEXT,
    "deadline" DATETIME,
    "completedAt" DATETIME,
    "isDaily" BOOLEAN NOT NULL DEFAULT false,
    "dailyResetAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quests_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quests_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "bosses" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_quests" ("bossHp", "bossImageUrl", "bossMaxHp", "bossName", "characterId", "completedAt", "createdAt", "dailyResetAt", "deadline", "description", "difficulty", "goldReward", "id", "isBossBattle", "isDaily", "status", "title", "type", "updatedAt", "xpReward") SELECT "bossHp", "bossImageUrl", "bossMaxHp", "bossName", "characterId", "completedAt", "createdAt", "dailyResetAt", "deadline", "description", "difficulty", "goldReward", "id", "isBossBattle", "isDaily", "status", "title", "type", "updatedAt", "xpReward" FROM "quests";
DROP TABLE "quests";
ALTER TABLE "new_quests" RENAME TO "quests";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "bosses_characterId_name_key" ON "bosses"("characterId", "name");
