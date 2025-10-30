import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Для демо используем первого пользователя
    let user = await prisma.user.findFirst()
    
    if (!user) {
      return NextResponse.json({
        achievements: [],
        userStats: {
          totalXp: 0,
          level: 1,
          testsCompleted: 0,
          correctAnswers: 0,
          currentStreak: 0,
          longestStreak: 0,
          subjectMastery: {}
        }
      })
    }

    // Получаем все бейджи
    const allBadges = await prisma.badge.findMany({
      orderBy: { xpRequired: 'asc' }
    })

    // Получаем бейджи пользователя
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: user.id },
      include: { badge: true }
    })

    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId))

    // Получаем статистику пользователя для расчета прогресса
    const userAnswers = await prisma.userAnswer.findMany({
      where: { userId: user.id },
      include: {
        question: {
          include: { subject: true }
        }
      }
    })

    // Подсчитываем статистику
    const totalAnswers = userAnswers.length
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length
    
    // Подсчитываем тесты (группируем по дате и предмету)
    const testSessions = userAnswers.reduce((acc, answer) => {
      const dateKey = answer.createdAt.toDateString()
      const subjectKey = answer.question.subject.id
      const sessionKey = `${dateKey}-${subjectKey}`
      
      if (!acc[sessionKey]) {
        acc[sessionKey] = true
      }
      return acc
    }, {} as Record<string, boolean>)
    
    const testsCompleted = Object.keys(testSessions).length

    // Подсчитываем серии
    const testDates = Array.from(new Set(
      userAnswers.map(answer => answer.createdAt.toDateString())
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let currentStreak = 0
    let longestStreak = 0
    
    if (testDates.length > 0) {
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      
      // Текущая серия
      if (testDates.includes(today) || testDates.includes(yesterday)) {
        let checkDate = testDates.includes(today) ? new Date() : new Date(Date.now() - 24 * 60 * 60 * 1000)
        
        while (testDates.includes(checkDate.toDateString())) {
          currentStreak++
          checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000)
        }
      }
      
      // Самая длинная серия
      let tempStreak = 0
      for (let i = 0; i < testDates.length; i++) {
        if (i === 0) {
          tempStreak = 1
        } else {
          const currentDate = new Date(testDates[i])
          const prevDate = new Date(testDates[i - 1])
          const dayDiff = Math.abs((prevDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000))
          
          if (dayDiff === 1) {
            tempStreak++
          } else {
            longestStreak = Math.max(longestStreak, tempStreak)
            tempStreak = 1
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak)
    }

    // Подсчитываем мастерство по предметам
    const subjectStats = userAnswers.reduce((acc, answer) => {
      const subjectName = answer.question.subject.name
      if (!acc[subjectName]) {
        acc[subjectName] = { total: 0, correct: 0 }
      }
      acc[subjectName].total++
      if (answer.isCorrect) {
        acc[subjectName].correct++
      }
      return acc
    }, {} as Record<string, { total: number; correct: number }>)

    const subjectMastery = Object.entries(subjectStats).reduce((acc, [subject, stats]) => {
      acc[subject] = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
      return acc
    }, {} as Record<string, number>)

    // Формируем список достижений с прогрессом
    const achievements = allBadges.map(badge => {
      const isEarned = earnedBadgeIds.has(badge.id)
      const userBadge = userBadges.find(ub => ub.badgeId === badge.id)
      
      // Рассчитываем прогресс для незаработанных бейджей
      let progress = 0
      
      if (!isEarned) {
        // Прогресс основан на XP
        if (badge.xpRequired > 0) {
          progress = Math.min(Math.round((user.xp / badge.xpRequired) * 100), 100)
        }
        
        // Специальные условия для разных типов бейджей
        if (badge.name.includes('серия') || badge.name.includes('Неделя')) {
          // Для бейджей серий используем текущую серию
          const requiredDays = 7 // Можно извлечь из описания
          progress = Math.min(Math.round((currentStreak / requiredDays) * 100), 100)
        }
      }

      return {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        color: badge.color,
        category: badge.category as 'general' | 'subject' | 'streak' | 'special',
        xpRequired: badge.xpRequired,
        isEarned,
        earnedAt: userBadge?.earnedAt.toISOString(),
        progress: isEarned ? 100 : progress
      }
    })

    return NextResponse.json({
      achievements,
      userStats: {
        totalXp: user.xp,
        level: user.level,
        testsCompleted,
        correctAnswers,
        currentStreak,
        longestStreak,
        subjectMastery
      }
    })

  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}