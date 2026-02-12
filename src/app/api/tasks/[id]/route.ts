import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { levelFromXP, getTitleForLevel, calculateBossDamage } from '@/lib/xp-calculator';

// PUT /api/tasks/[id] - Update task (title, xpReward, goldReward, attributeBoost)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, xpReward, goldReward, attributeBoost } = body;

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id },
      include: { quest: true },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: 'Title cannot be empty' },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }
    
    if (xpReward !== undefined) {
      updateData.xpReward = Math.max(0, parseInt(xpReward) || 0);
    }
    
    if (goldReward !== undefined) {
      updateData.goldReward = Math.max(0, parseInt(goldReward) || 0);
    }
    
    if (attributeBoost !== undefined) {
      updateData.attributeBoost = attributeBoost || null;
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    // Recalculate quest rewards if task rewards changed
    if (xpReward !== undefined || goldReward !== undefined) {
      const allTasks = await prisma.task.findMany({
        where: { questId: task.questId },
      });
      
      const totalXP = allTasks.reduce((sum, t) => sum + t.xpReward, 0);
      const totalGold = allTasks.reduce((sum, t) => sum + t.goldReward, 0);
      
      await prisma.quest.update({
        where: { id: task.questId },
        data: {
          xpReward: totalXP,
          goldReward: totalGold,
        },
      });
    }

    return NextResponse.json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if task exists and get quest info
    const task = await prisma.task.findUnique({
      where: { id },
      include: { quest: true },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Don't allow deleting if task is completed (rewards already given)
    if (task.completed) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete completed tasks' },
        { status: 400 }
      );
    }

    // Delete the task
    await prisma.task.delete({
      where: { id },
    });

    // Recalculate quest rewards
    const remainingTasks = await prisma.task.findMany({
      where: { questId: task.questId },
    });
    
    const totalXP = remainingTasks.reduce((sum, t) => sum + t.xpReward, 0);
    const totalGold = remainingTasks.reduce((sum, t) => sum + t.goldReward, 0);
    
    await prisma.quest.update({
      where: { id: task.questId },
      data: {
        xpReward: totalXP,
        goldReward: totalGold,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/[id] - Toggle task completion
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get task with quest and character info
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        quest: {
          include: {
            tasks: true,
            character: {
              include: { attributes: true },
            },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    const wasCompleted = task.completed;
    const newCompleted = !wasCompleted;
    const quest = task.quest;
    const character = quest.character;

    // Calculate rewards (only give rewards when completing, remove when uncompleting)
    const xpChange = newCompleted ? task.xpReward : -task.xpReward;
    const goldChange = newCompleted ? task.goldReward : -task.goldReward;

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        completed: newCompleted,
        completedAt: newCompleted ? new Date() : null,
      },
    });

    // Update character XP and gold
    const newTotalXP = Math.max(0, character.totalXP + xpChange);
    const newCurrentXP = Math.max(0, character.currentXP + xpChange);
    const newGold = Math.max(0, character.gold + goldChange);
    const newLevel = levelFromXP(newTotalXP);
    
    // HP/Mana regeneration on task completion
    const hpRegen = newCompleted ? 5 : 0; // +5 HP per task completed
    const manaRegen = newCompleted ? 3 : 0; // +3 Mana per task completed
    const newHp = Math.min(character.maxHp, character.hp + hpRegen);
    const newMana = Math.min(character.maxMana, character.mana + manaRegen);

    let levelUp = null;
    if (newLevel > character.level) {
      levelUp = {
        oldLevel: character.level,
        newLevel,
        newTitle: getTitleForLevel(newLevel),
      };
    }

    // Update character
    await prisma.character.update({
      where: { id: character.id },
      data: {
        totalXP: newTotalXP,
        currentXP: newCurrentXP,
        gold: newGold,
        level: newLevel,
        title: newLevel > character.level ? getTitleForLevel(newLevel) : undefined,
        hp: newHp,
        mana: newMana,
      },
    });

    // Update attribute XP if task has attribute boost
    if (task.attributeBoost && newCompleted) {
      await prisma.attribute.updateMany({
        where: {
          characterId: character.id,
          name: task.attributeBoost,
        },
        data: {
          currentXP: {
            increment: task.attributeXP || 5,
          },
        },
      });
    }

    // Handle boss battle damage
    if (quest.isBossBattle && quest.bossMaxHp) {
      const totalTasksXP = quest.tasks.reduce((sum, t) => sum + t.xpReward, 0);
      const damage = calculateBossDamage(task.xpReward, quest.bossMaxHp, totalTasksXP);
      const currentBossHp = quest.bossHp || quest.bossMaxHp;
      
      const newBossHp = newCompleted
        ? Math.max(0, currentBossHp - damage)
        : Math.min(quest.bossMaxHp, currentBossHp + damage);

      await prisma.quest.update({
        where: { id: quest.id },
        data: { bossHp: newBossHp },
      });
    }

    // Check if all tasks are completed
    const allTasks = await prisma.task.findMany({
      where: { questId: quest.id },
    });
    
    const allCompleted = allTasks.every((t) => (t.id === id ? newCompleted : t.completed));

    // Update quest status if all tasks completed
    if (allCompleted && newCompleted) {
      // Quest completion bonus: +15 HP, +10 Mana
      await prisma.character.update({
        where: { id: character.id },
        data: {
          hp: Math.min(character.maxHp, newHp + 15),
          mana: Math.min(character.maxMana, newMana + 10),
        },
      });
      
      await prisma.quest.update({
        where: { id: quest.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          bossHp: quest.isBossBattle ? 0 : null,
        },
      });
    } else if (!allCompleted && quest.status === 'COMPLETED') {
      // Reactivate quest if a task is unchecked
      await prisma.quest.update({
        where: { id: quest.id },
        data: {
          status: 'ACTIVE',
          completedAt: null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        task: updatedTask,
        rewards: newCompleted ? { 
          xp: task.xpReward, 
          gold: task.goldReward,
          hpRegen: hpRegen + (allCompleted ? 15 : 0),
          manaRegen: manaRegen + (allCompleted ? 10 : 0),
        } : null,
        levelUp,
        questCompleted: allCompleted && newCompleted,
      },
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
