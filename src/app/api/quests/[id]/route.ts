import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/quests/[id] - Get quest by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quest = await prisma.quest.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quest) {
      return NextResponse.json(
        { success: false, error: 'Quest not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: quest });
  } catch (error) {
    console.error('Error fetching quest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quest' },
      { status: 500 }
    );
  }
}

// PATCH /api/quests/[id] - Update quest
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // If isPaid is being set to true, automatically set paidAt
    if (body.isPaid === true) {
      body.paidAt = new Date();
    } else if (body.isPaid === false) {
      body.paidAt = null;
    }

    // Convert deadline string to Date if present
    if (body.deadline && typeof body.deadline === 'string') {
      body.deadline = new Date(body.deadline);
    }

    const quest = await prisma.quest.update({
      where: { id },
      data: body,
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({ success: true, data: quest });
  } catch (error) {
    console.error('Error updating quest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update quest' },
      { status: 500 }
    );
  }
}

// DELETE /api/quests/[id] - Delete quest
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.quest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete quest' },
      { status: 500 }
    );
  }
}
