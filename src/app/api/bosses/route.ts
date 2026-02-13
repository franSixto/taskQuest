import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/bosses - Get all bosses for the character
export async function GET() {
  try {
    const bosses = await prisma.boss.findMany({
      where: { characterId: 'default-user' },
      include: {
        attempts: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Last 5 attempts
        },
      },
      orderBy: { firstDefeatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: bosses });
  } catch (error) {
    console.error('Error fetching bosses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bosses' },
      { status: 500 }
    );
  }
}

// POST /api/bosses - Create a new boss
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, difficulty, maxHp } = body;

    // Check if boss already exists
    const existingBoss = await prisma.boss.findUnique({
      where: {
        characterId_name: {
          characterId: 'default-user',
          name: name.trim(),
        },
      },
    });

    if (existingBoss) {
      return NextResponse.json(
        { success: false, error: 'Boss already exists' },
        { status: 400 }
      );
    }

    const boss = await prisma.boss.create({
      data: {
        characterId: 'default-user',
        name: name.trim(),
        description: description?.trim() || null,
        difficulty: difficulty || 'NORMAL',
        maxHp: maxHp || 100,
      },
    });

    return NextResponse.json({ success: true, data: boss });
  } catch (error) {
    console.error('Error creating boss:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create boss' },
      { status: 500 }
    );
  }
}
