import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/quests/history - Get completed quests history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const character = await prisma.character.findUnique({
      where: { userId: 'default-user' },
    });

    if (!character) {
      return NextResponse.json(
        { success: false, error: 'Character not found' },
        { status: 404 }
      );
    }

    // Get completed quests with pagination
    const [quests, total] = await Promise.all([
      prisma.quest.findMany({
        where: {
          characterId: character.id,
          status: 'COMPLETED',
        },
        include: {
          tasks: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { completedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.quest.count({
        where: {
          characterId: character.id,
          status: 'COMPLETED',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: quests,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + quests.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching quest history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quest history' },
      { status: 500 }
    );
  }
}
