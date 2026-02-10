import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener una recompensa específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reward = await prisma.reward.findUnique({
      where: { id: params.id },
    });

    if (!reward) {
      return NextResponse.json(
        { error: 'Recompensa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: reward });
  } catch (error) {
    console.error('Error fetching reward:', error);
    return NextResponse.json(
      { error: 'Error al obtener recompensa' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar recompensa
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, icon, goldCost, category, dailyLimit, isActive } = body;

    const reward = await prisma.reward.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(goldCost !== undefined && { goldCost }),
        ...(category !== undefined && { category }),
        ...(dailyLimit !== undefined && { dailyLimit }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ data: reward });
  } catch (error) {
    console.error('Error updating reward:', error);
    return NextResponse.json(
      { error: 'Error al actualizar recompensa' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar recompensa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.reward.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reward:', error);
    return NextResponse.json(
      { error: 'Error al eliminar recompensa' },
      { status: 500 }
    );
  }
}
