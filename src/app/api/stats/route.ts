import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/stats - Get financial and quest statistics
export async function GET() {
  try {
    const character = await prisma.character.findUnique({
      where: { userId: 'default-user' },
    });

    if (!character) {
      return NextResponse.json(
        { success: false, error: 'Character not found' },
        { status: 404 }
      );
    }

    // Get all quests with billing info
    const allQuests = await prisma.quest.findMany({
      where: { characterId: character.id },
      include: { tasks: true },
    });

    // Separate by status
    const completedQuests = allQuests.filter(q => q.status === 'COMPLETED');
    const activeQuests = allQuests.filter(q => q.status === 'ACTIVE');

    // Calculate billing stats
    let totalBilled = 0;
    let totalPaid = 0;
    let totalPending = 0;
    let totalHoursEstimated = 0;
    let totalHoursWorked = 0;
    let fixedProjects = 0;
    let hourlyProjects = 0;

    // Monthly stats (last 12 months)
    const monthlyStats: Record<string, { billed: number; paid: number; hours: number }> = {};
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyStats[key] = { billed: 0, paid: 0, hours: 0 };
    }

    allQuests.forEach(quest => {
      let questAmount = 0;

      if (quest.billingType === 'HOURLY') {
        const rate = quest.hourlyRate || 0;
        const hours = quest.hoursWorked || quest.estimatedHours || 0;
        questAmount = rate * hours;
        totalHoursEstimated += quest.estimatedHours || 0;
        totalHoursWorked += quest.hoursWorked || 0;
        if (rate > 0) hourlyProjects++;
      } else {
        questAmount = quest.budgetAmount || 0;
        if (questAmount > 0) fixedProjects++;
      }

      if (questAmount > 0) {
        totalBilled += questAmount;
        
        if (quest.isPaid) {
          totalPaid += questAmount;
          
          // Add to monthly stats
          const paidDate = quest.paidAt || quest.completedAt || quest.updatedAt;
          if (paidDate) {
            const key = `${paidDate.getFullYear()}-${String(paidDate.getMonth() + 1).padStart(2, '0')}`;
            if (monthlyStats[key]) {
              monthlyStats[key].paid += questAmount;
            }
          }
        } else {
          totalPending += questAmount;
        }

        // Track billed amount by completion/creation date
        const billedDate = quest.completedAt || quest.createdAt;
        if (billedDate) {
          const key = `${billedDate.getFullYear()}-${String(billedDate.getMonth() + 1).padStart(2, '0')}`;
          if (monthlyStats[key]) {
            monthlyStats[key].billed += questAmount;
            if (quest.billingType === 'HOURLY') {
              monthlyStats[key].hours += quest.hoursWorked || 0;
            }
          }
        }
      }
    });

    // Calculate averages
    const avgHourlyRate = totalHoursWorked > 0 
      ? totalPaid / totalHoursWorked 
      : 0;

    // Task stats
    const totalTasks = allQuests.reduce((sum, q) => sum + q.tasks.length, 0);
    const completedTasks = allQuests.reduce(
      (sum, q) => sum + q.tasks.filter(t => t.completed).length, 
      0
    );

    // Format monthly stats for response
    const monthlyData = Object.entries(monthlyStats).map(([month, data]) => ({
      month,
      ...data,
    }));

    return NextResponse.json({
      success: true,
      data: {
        // Financial stats
        financial: {
          totalBilled,
          totalPaid,
          totalPending,
          avgHourlyRate,
          fixedProjects,
          hourlyProjects,
        },
        // Time stats
        time: {
          totalHoursEstimated,
          totalHoursWorked,
          efficiency: totalHoursEstimated > 0 
            ? ((totalHoursWorked / totalHoursEstimated) * 100).toFixed(1)
            : 0,
        },
        // Quest stats
        quests: {
          total: allQuests.length,
          completed: completedQuests.length,
          active: activeQuests.length,
          completionRate: allQuests.length > 0
            ? ((completedQuests.length / allQuests.length) * 100).toFixed(1)
            : 0,
        },
        // Task stats
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          completionRate: totalTasks > 0
            ? ((completedTasks / totalTasks) * 100).toFixed(1)
            : 0,
        },
        // Monthly breakdown
        monthly: monthlyData,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
