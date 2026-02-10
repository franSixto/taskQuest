import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Canjear una recompensa (gastar oro)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reward = await prisma.reward.findUnique({
      where: { id: params.id },
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

    if (!reward) {
      return NextResponse.json(
        { error: 'Recompensa no encontrada' },
        { status: 404 }
      );
    }

    // Verificar límite diario
    if (reward.dailyLimit && reward.redemptions.length >= reward.dailyLimit) {
      return NextResponse.json(
        { error: 'Has alcanzado el límite diario para esta recompensa' },
        { status: 400 }
      );
    }

    // Obtener el personaje
    const character = await prisma.character.findFirst();
    if (!character) {
      return NextResponse.json(
        { error: 'Personaje no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si tiene suficiente oro
    if (character.gold < reward.goldCost) {
      return NextResponse.json(
        { 
          error: 'No tienes suficiente oro',
          required: reward.goldCost,
          current: character.gold,
        },
        { status: 400 }
      );
    }

    // Realizar la transacción: descontar oro y crear redemption
    const [updatedCharacter, redemption] = await prisma.$transaction([
      prisma.character.update({
        where: { id: character.id },
        data: {
          gold: character.gold - reward.goldCost,
        },
      }),
      prisma.rewardRedemption.create({
        data: {
          rewardId: reward.id,
          characterId: character.id,
          goldSpent: reward.goldCost,
        },
      }),
    ]);

    // Contar uso diario actualizado
    const todayUsage = reward.redemptions.length + 1;

    return NextResponse.json({
      success: true,
      data: {
        redemption,
        reward: {
          ...reward,
          todayUsage,
          canRedeem: reward.dailyLimit ? todayUsage < reward.dailyLimit : true,
        },
        character: {
          gold: updatedCharacter.gold,
        },
      },
    });
  } catch (error) {
    console.error('Error redeeming reward:', error);
    return NextResponse.json(
      { error: 'Error al canjear recompensa' },
      { status: 500 }
    );
  }
}
