import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { levelFromXP, getTitleForLevel } from '@/lib/xp-calculator';

// GET /api/character - Get character data
export async function GET() {
  try {
    // Get or create default character
    let character = await prisma.character.findUnique({
      where: { userId: 'default-user' },
      include: {
        attributes: true,
        quests: {
          where: { status: 'ACTIVE' },
          include: { tasks: true },
          orderBy: { createdAt: 'desc' },
        },
        achievements: {
          include: { achievement: true },
        },
      },
    });

    if (!character) {
      // Create new character
      character = await prisma.character.create({
        data: {
          userId: 'default-user',
          name: 'Hero Developer',
          title: 'Novato Digital',
          attributes: {
            create: [
              { name: 'creativity', displayName: 'Creatividad', color: '#FF6B6B', icon: 'Palette' },
              { name: 'logic', displayName: 'Lógica', color: '#4ECDC4', icon: 'Code' },
              { name: 'focus', displayName: 'Enfoque', color: '#45B7D1', icon: 'Target' },
              { name: 'communication', displayName: 'Comunicación', color: '#96CEB4', icon: 'MessageCircle' },
            ],
          },
        },
        include: {
          attributes: true,
          quests: {
            include: { tasks: true },
          },
          achievements: {
            include: { achievement: true },
          },
        },
      });
    }

    return NextResponse.json({ success: true, data: character });
  } catch (error) {
    console.error('Error fetching character:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch character' },
      { status: 500 }
    );
  }
}

// PATCH /api/character - Update character (gain XP, gold, etc.)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { xp, gold, hp, mana, gems, streak } = body;

    const character = await prisma.character.findUnique({
      where: { userId: 'default-user' },
    });

    if (!character) {
      return NextResponse.json(
        { success: false, error: 'Character not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    let levelUp = null;

    // Handle XP gain
    if (xp !== undefined) {
      const newTotalXP = character.totalXP + xp;
      const newCurrentXP = character.currentXP + xp;
      const newLevel = levelFromXP(newTotalXP);

      updateData.totalXP = newTotalXP;
      updateData.currentXP = newCurrentXP;

      if (newLevel > character.level) {
        updateData.level = newLevel;
        updateData.title = getTitleForLevel(newLevel);
        levelUp = {
          oldLevel: character.level,
          newLevel,
          newTitle: getTitleForLevel(newLevel),
        };
      }
    }

    // Handle other updates
    if (gold !== undefined) updateData.gold = character.gold + gold;
    if (gems !== undefined) updateData.gems = character.gems + gems;
    if (hp !== undefined) updateData.hp = Math.max(0, Math.min(character.maxHp, hp));
    if (mana !== undefined) updateData.mana = Math.max(0, Math.min(character.maxMana, mana));
    
    if (streak !== undefined) {
      updateData.currentStreak = streak;
      if (streak > character.longestStreak) {
        updateData.longestStreak = streak;
      }
      updateData.lastActiveDate = new Date();
    }

    const updated = await prisma.character.update({
      where: { userId: 'default-user' },
      data: updateData,
      include: {
        attributes: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      levelUp,
    });
  } catch (error) {
    console.error('Error updating character:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update character' },
      { status: 500 }
    );
  }
}
