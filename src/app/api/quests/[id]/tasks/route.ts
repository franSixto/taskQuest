import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/quests/[id]/tasks - Add a new task to a quest
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questId } = await params;
    const body = await request.json();
    const { title, xpReward = 10, goldReward = 5, attributeBoost = null } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    // Check if quest exists
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
      include: { tasks: true },
    });

    if (!quest) {
      return NextResponse.json(
        { success: false, error: 'Quest not found' },
        { status: 404 }
      );
    }

    // Don't allow adding tasks to completed quests
    if (quest.status === 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Cannot add tasks to completed quests' },
        { status: 400 }
      );
    }

    // Get the next order number
    const maxOrder = quest.tasks.reduce((max, task) => Math.max(max, task.order), 0);

    // Create the new task
    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        xpReward: Math.max(0, parseInt(xpReward) || 10),
        goldReward: Math.max(0, parseInt(goldReward) || 5),
        attributeBoost: attributeBoost || null,
        order: maxOrder + 1,
        questId: questId,
      },
    });

    // Update quest total rewards
    const newTotalXP = quest.xpReward + newTask.xpReward;
    const newTotalGold = quest.goldReward + newTask.goldReward;

    await prisma.quest.update({
      where: { id: questId },
      data: {
        xpReward: newTotalXP,
        goldReward: newTotalGold,
      },
    });

    return NextResponse.json({
      success: true,
      task: newTask,
    });
  } catch (error) {
    console.error('Error adding task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add task' },
      { status: 500 }
    );
  }
}
