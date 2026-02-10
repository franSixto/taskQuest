import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las recompensas con info de uso diario
export async function GET() {
  try {
    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { goldCost: 'asc' },
      ],
      include: {
        redemptions: {
          where: {
            redeemedAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
      },
    });

    // Añadir conteo de uso diario
    const rewardsWithUsage = rewards.map(reward => ({
      ...reward,
      todayUsage: reward.redemptions.length,
      canRedeem: reward.dailyLimit ? reward.redemptions.length < reward.dailyLimit : true,
      redemptions: undefined, // No enviar las redempciones completas
    }));

    return NextResponse.json({ data: rewardsWithUsage });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json(
      { error: 'Error al obtener recompensas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva recompensa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon, goldCost, category, dailyLimit } = body;

    if (!name || goldCost === undefined) {
      return NextResponse.json(
        { error: 'Nombre y costo en oro son requeridos' },
        { status: 400 }
      );
    }

    const reward = await prisma.reward.create({
      data: {
        name,
        description,
        icon: icon || 'gift',
        goldCost,
        category: category || 'LEISURE',
        dailyLimit: dailyLimit || null,
      },
    });

    return NextResponse.json({ data: reward }, { status: 201 });
  } catch (error) {
    console.error('Error creating reward:', error);
    return NextResponse.json(
      { error: 'Error al crear recompensa' },
      { status: 500 }
    );
  }
}
