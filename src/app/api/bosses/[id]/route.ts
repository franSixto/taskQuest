import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/bosses/[id] - Get boss details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const boss = await prisma.boss.findUnique({
      where: { id },
      include: {
        attempts: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!boss) {
      return NextResponse.json(
        { success: false, error: 'Boss not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: boss });
  } catch (error) {
    console.error('Error fetching boss:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch boss' },
      { status: 500 }
    );
  }
}

// PATCH /api/bosses/[id] - Update boss (record attempt)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { defeated, timeSpent, damageDealt, questId } = body;

    const boss = await prisma.boss.findUnique({
      where: { id },
    });

    if (!boss) {
      return NextResponse.json(
        { success: false, error: 'Boss not found' },
        { status: 404 }
      );
    }

    // Create attempt record
    const attempt = await prisma.bossAttempt.create({
      data: {
        bossId: id,
        questId: questId || null,
        defeated,
        timeSpent: timeSpent || null,
        damageDealt: damageDealt || null,
      },
    });

    // Update boss statistics
    const updateData: Record<string, unknown> = {
      totalAttempts: { increment: 1 },
      lastAttemptedAt: new Date(),
    };

    if (defeated) {
      updateData.totalDefeats = { increment: 1 };
      updateData.firstDefeatedAt = boss.firstDefeatedAt || new Date();

      // Update best time if this is better
      if (timeSpent && (!boss.bestTime || timeSpent < boss.bestTime)) {
        updateData.bestTime = timeSpent;
      }
    }

    const updatedBoss = await prisma.boss.update({
      where: { id },
      data: updateData as Record<string, unknown>,
      include: {
        attempts: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    return NextResponse.json({ success: true, data: updatedBoss, attempt });
  } catch (error) {
    console.error('Error updating boss:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update boss' },
      { status: 500 }
    );
  }
}

// DELETE /api/bosses/[id] - Delete boss
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.boss.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting boss:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete boss' },
      { status: 500 }
    );
  }
}
