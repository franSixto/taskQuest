import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DIFFICULTY_MULTIPLIERS, calculateBossDamage, type Difficulty } from '@/lib/xp-calculator';

// GET /api/quests - Get all quests
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'ACTIVE';
    const type = searchParams.get('type');

    const character = await prisma.character.findUnique({
      where: { userId: 'default-user' },
    });

    if (!character) {
      return NextResponse.json(
        { success: false, error: 'Character not found' },
        { status: 404 }
      );
    }

    const whereClause: Record<string, unknown> = {
      characterId: character.id,
    };

    if (status !== 'ALL') {
      whereClause.status = status;
    }

    if (type) {
      whereClause.type = type;
    }

    const quests = await prisma.quest.findMany({
      where: whereClause,
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [
        { type: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, data: quests });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}

// POST /api/quests - Create new quest
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type = 'SIDE',
      difficulty = 'NORMAL',
      deadline,
      isBossBattle = false,
      bossName,
      bossHp = 100,
      // Billing fields
      billingType = 'FIXED',
      budgetAmount,
      hourlyRate,
      estimatedHours,
      hoursWorked,
      tasks = [],
    } = body;

    const character = await prisma.character.findUnique({
      where: { userId: 'default-user' },
    });

    if (!character) {
      return NextResponse.json(
        { success: false, error: 'Character not found' },
        { status: 404 }
      );
    }

    // Calculate base rewards
    const difficultyMult = DIFFICULTY_MULTIPLIERS[difficulty as Difficulty] || 1;
    const baseXP = Math.floor(50 * tasks.length * difficultyMult);
    const baseGold = Math.floor(20 * tasks.length * difficultyMult);

    // Create quest with tasks
    const quest = await prisma.quest.create({
      data: {
        characterId: character.id,
        title,
        description,
        type,
        difficulty,
        deadline: deadline ? new Date(deadline) : null,
        isBossBattle: type === 'MAIN' && isBossBattle,
        bossName: isBossBattle ? bossName : null,
        bossHp: isBossBattle ? bossHp : null,
        bossMaxHp: isBossBattle ? bossHp : null,
        // Billing fields
        billingType: billingType,
        budgetAmount: billingType === 'FIXED' && budgetAmount ? budgetAmount : null,
        hourlyRate: billingType === 'HOURLY' && hourlyRate ? hourlyRate : null,
        estimatedHours: billingType === 'HOURLY' && estimatedHours ? estimatedHours : null,
        hoursWorked: billingType === 'HOURLY' && hoursWorked ? hoursWorked : null,
        xpReward: baseXP,
        goldReward: baseGold,
        isDaily: type === 'DAILY',
        tasks: {
          create: tasks.map((task: { title: string; description?: string; attributeBoost?: string }, index: number) => ({
            title: task.title,
            description: task.description,
            attributeBoost: task.attributeBoost,
            xpReward: Math.floor(20 * difficultyMult),
            goldReward: Math.floor(10 * difficultyMult),
            order: index,
          })),
        },
      },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({ success: true, data: quest });
  } catch (error) {
    console.error('Error creating quest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create quest' },
      { status: 500 }
    );
  }
}
