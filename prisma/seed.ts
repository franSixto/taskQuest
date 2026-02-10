import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎮 Seeding TaskQuest database...');

  // Create default character
  const character = await prisma.character.upsert({
    where: { userId: 'default-user' },
    update: {},
    create: {
      userId: 'default-user',
      name: 'Hero Developer',
      title: 'Novato Digital',
      level: 1,
      currentXP: 0,
      totalXP: 0,
      hp: 100,
      maxHp: 100,
      mana: 50,
      maxMana: 50,
      gold: 100,
      gems: 5,
      currentStreak: 0,
      longestStreak: 0,
    },
  });

  console.log('✅ Character created:', character.name);

  // Create attributes
  const attributes = [
    { name: 'creativity', displayName: 'Creatividad', color: '#FF6B6B', icon: 'Palette' },
    { name: 'logic', displayName: 'Lógica', color: '#4ECDC4', icon: 'Code' },
    { name: 'focus', displayName: 'Enfoque', color: '#45B7D1', icon: 'Target' },
    { name: 'communication', displayName: 'Comunicación', color: '#96CEB4', icon: 'MessageCircle' },
  ];

  for (const attr of attributes) {
    await prisma.attribute.upsert({
      where: { characterId_name: { characterId: character.id, name: attr.name } },
      update: {},
      create: {
        characterId: character.id,
        ...attr,
        level: 1,
        currentXP: 0,
      },
    });
  }

  console.log('✅ Attributes created');

  // Create sample quests
  const mainQuest = await prisma.quest.create({
    data: {
      characterId: character.id,
      title: '⚔️ Rediseño del Dashboard Principal',
      description: 'El cliente necesita un nuevo dashboard más intuitivo y moderno.',
      type: 'MAIN',
      difficulty: 'HARD',
      isBossBattle: true,
      bossName: 'Cliente Exigente',
      bossHp: 100,
      bossMaxHp: 100,
      xpReward: 500,
      goldReward: 200,
      tasks: {
        create: [
          { title: 'Investigar competencia', xpReward: 30, goldReward: 10, attributeBoost: 'creativity', order: 1 },
          { title: 'Crear wireframes', xpReward: 50, goldReward: 20, attributeBoost: 'creativity', order: 2 },
          { title: 'Diseñar mockups en Figma', xpReward: 80, goldReward: 30, attributeBoost: 'creativity', order: 3 },
          { title: 'Implementar componentes React', xpReward: 100, goldReward: 40, attributeBoost: 'logic', order: 4 },
          { title: 'Testing y QA', xpReward: 60, goldReward: 25, attributeBoost: 'focus', order: 5 },
        ],
      },
    },
  });

  console.log('✅ Main quest created:', mainQuest.title);

  const sideQuest = await prisma.quest.create({
    data: {
      characterId: character.id,
      title: 'Optimizar Performance',
      description: 'Mejorar el rendimiento de la aplicación actual.',
      type: 'SIDE',
      difficulty: 'NORMAL',
      xpReward: 150,
      goldReward: 75,
      tasks: {
        create: [
          { title: 'Auditar con Lighthouse', xpReward: 25, goldReward: 10, attributeBoost: 'logic', order: 1 },
          { title: 'Optimizar imágenes', xpReward: 30, goldReward: 15, attributeBoost: 'logic', order: 2 },
          { title: 'Implementar lazy loading', xpReward: 40, goldReward: 20, attributeBoost: 'logic', order: 3 },
        ],
      },
    },
  });

  console.log('✅ Side quest created:', sideQuest.title);

  // Create daily quests
  const dailyQuests = [
    { title: 'Revisar emails', xpReward: 20, goldReward: 5, attributeBoost: 'communication' },
    { title: 'Standup meeting', xpReward: 15, goldReward: 5, attributeBoost: 'communication' },
    { title: 'Leer documentación técnica (30 min)', xpReward: 30, goldReward: 10, attributeBoost: 'logic' },
    { title: 'Practicar diseño (Dribbble)', xpReward: 25, goldReward: 10, attributeBoost: 'creativity' },
  ];

  for (const daily of dailyQuests) {
    await prisma.quest.create({
      data: {
        characterId: character.id,
        title: daily.title,
        type: 'DAILY',
        difficulty: 'EASY',
        isDaily: true,
        xpReward: daily.xpReward,
        goldReward: daily.goldReward,
        tasks: {
          create: [
            { title: daily.title, xpReward: daily.xpReward, goldReward: daily.goldReward, attributeBoost: daily.attributeBoost, order: 1 },
          ],
        },
      },
    });
  }

  console.log('✅ Daily quests created');

  // Create achievements
  const achievements = [
    { name: 'first_quest', description: 'Completa tu primera misión', icon: 'Flag', rarity: 'COMMON', condition: JSON.stringify({ type: 'quest_complete', value: 1 }), xpReward: 50, goldReward: 25 },
    { name: 'quest_hunter', description: 'Completa 10 misiones', icon: 'Target', rarity: 'RARE', condition: JSON.stringify({ type: 'quest_complete', value: 10 }), xpReward: 200, goldReward: 100 },
    { name: 'quest_master', description: 'Completa 50 misiones', icon: 'Crown', rarity: 'EPIC', condition: JSON.stringify({ type: 'quest_complete', value: 50 }), xpReward: 500, goldReward: 250 },
    { name: 'boss_slayer', description: 'Derrota a tu primer jefe', icon: 'Sword', rarity: 'RARE', condition: JSON.stringify({ type: 'boss_defeat', value: 1 }), xpReward: 300, goldReward: 150, titleReward: 'Cazador de Jefes' },
    { name: 'streak_warrior', description: 'Mantén una racha de 7 días', icon: 'Flame', rarity: 'RARE', condition: JSON.stringify({ type: 'streak', value: 7 }), xpReward: 250, goldReward: 100 },
    { name: 'legendary_streak', description: 'Mantén una racha de 30 días', icon: 'Zap', rarity: 'LEGENDARY', condition: JSON.stringify({ type: 'streak', value: 30 }), xpReward: 1000, goldReward: 500, titleReward: 'Guerrero Incansable' },
    { name: 'level_10', description: 'Alcanza el nivel 10', icon: 'Star', rarity: 'RARE', condition: JSON.stringify({ type: 'level', value: 10 }), xpReward: 500, goldReward: 200 },
    { name: 'rich', description: 'Acumula 1000 de oro', icon: 'Coins', rarity: 'EPIC', condition: JSON.stringify({ type: 'gold', value: 1000 }), xpReward: 300, goldReward: 0 },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    });
  }

  console.log('✅ Achievements created');

  // Create items for shop
  const items = [
    { name: 'Poción de Vida', description: 'Restaura 50 HP', icon: 'Heart', rarity: 'COMMON', type: 'CONSUMABLE', effects: JSON.stringify({ hp_restore: 50 }), goldCost: 50 },
    { name: 'Poción de Maná', description: 'Restaura 25 Maná', icon: 'Droplet', rarity: 'COMMON', type: 'CONSUMABLE', effects: JSON.stringify({ mana_restore: 25 }), goldCost: 40 },
    { name: 'Elixir de Enfoque', description: '+20% XP por 1 hora', icon: 'Sparkles', rarity: 'RARE', type: 'BOOST', effects: JSON.stringify({ xp_boost: 0.2, duration: 3600 }), goldCost: 150 },
    { name: 'Amuleto de Creatividad', description: '+10% XP en tareas creativas', icon: 'Gem', rarity: 'EPIC', type: 'EQUIPMENT', effects: JSON.stringify({ creativity_boost: 0.1 }), goldCost: 500 },
    { name: 'Café Premium', description: 'Restaura 10 HP y 10 Maná', icon: 'Coffee', rarity: 'COMMON', type: 'CONSUMABLE', effects: JSON.stringify({ hp_restore: 10, mana_restore: 10 }), goldCost: 25 },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }

  console.log('✅ Items created');

  // Create rewards for the reward shop
  const rewards = [
    { name: '30 min de videojuegos', description: 'Juega tu juego favorito', icon: 'gamepad2', goldCost: 100, category: 'LEISURE', dailyLimit: 2 },
    { name: 'Café especial', description: 'Un café de la cafetería favorita', icon: 'coffee', goldCost: 50, category: 'TREAT', dailyLimit: 3 },
    { name: 'Cigarrillo', description: 'Un descanso para fumar', icon: 'cigarette', goldCost: 30, category: 'TREAT', dailyLimit: 5 },
    { name: 'Paseo corto', description: '15 minutos de caminata', icon: 'footprints', goldCost: 20, category: 'HEALTH', dailyLimit: null },
    { name: 'Ver un episodio', description: 'Un capítulo de tu serie', icon: 'tv', goldCost: 80, category: 'LEISURE', dailyLimit: 2 },
    { name: 'Snack saludable', description: 'Una fruta o snack nutritivo', icon: 'utensils', goldCost: 15, category: 'HEALTH', dailyLimit: null },
    { name: 'Redes sociales 15 min', description: 'Revisar redes libremente', icon: 'message-circle', goldCost: 40, category: 'SOCIAL', dailyLimit: 3 },
    { name: 'Siesta 20 min', description: 'Power nap reparador', icon: 'moon', goldCost: 60, category: 'HEALTH', dailyLimit: 1 },
    { name: 'Escuchar música', description: '30 minutos de música favorita', icon: 'music', goldCost: 25, category: 'LEISURE', dailyLimit: null },
    { name: 'Compra pequeña', description: 'Algo que quieras (< $10)', icon: 'shopping-bag', goldCost: 200, category: 'TREAT', dailyLimit: 1 },
  ];

  // Delete existing rewards and create new ones
  await prisma.reward.deleteMany({});
  for (const reward of rewards) {
    await prisma.reward.create({ data: reward });
  }

  console.log('✅ Rewards created');

  console.log('🎮 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
