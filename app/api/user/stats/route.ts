import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Временно отключаем проверку авторизации для демо
    // const authHeader = request.headers.get('authorization')
    // if (!authHeader) {
    //   return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    // }

    // const token = authHeader.replace('Bearer ', '')
    // const user = await getCurrentUser(token)
    // if (!user) {
    //   return NextResponse.json({ error: 'Недействительный токен' }, { status: 401 })
    // }

    // Для демо используем первого пользователя или создаем статистику
    let user = await prisma.user.findFirst()
    
    if (!user) {
      // Если нет пользователей, возвращаем пустую статистику
      return NextResponse.json({
        totalTests: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        averageScore: 0,
        currentStreak: 0,
        longestStreak: 0,
        subjectProgress: [],
        recentBadges: []
      })
    }

    // Получаем статистику ответов пользователя
    const userAnswers = await prisma.userAnswer.findMany({
      where: { userId: user.id },
      include: {
        question: {
          include: {
            subject: true
          }
        }
      }
    })

    // Подсчитываем общую статистику
    const totalAnswers = userAnswers.length
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length
    const averageScore = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0

    // Подсчитываем количество завершенных тестов
    // Группируем ответы по предмету и дате, считаем как отдельные тесты
    const testSessions = userAnswers.reduce((acc, answer) => {
      const dateKey = answer.createdAt.toDateString()
      const subjectKey = answer.question.subject.id
      const sessionKey = `${dateKey}-${subjectKey}`
      
      if (!acc[sessionKey]) {
        acc[sessionKey] = {
          date: answer.createdAt,
          subjectId: subjectKey,
          subjectName: answer.question.subject.name,
          answers: []
        }
      }
      acc[sessionKey].answers.push(answer)
      return acc
    }, {} as Record<string, any>)

    const totalTests = Object.keys(testSessions).length

    // Группируем по предметам
    const subjectStats = userAnswers.reduce((acc, answer) => {
      const subjectName = answer.question.subject.name
      if (!acc[subjectName]) {
        acc[subjectName] = {
          total: 0,
          correct: 0,
          subjectId: answer.question.subject.id
        }
      }
      acc[subjectName].total++
      if (answer.isCorrect) {
        acc[subjectName].correct++
      }
      return acc
    }, {} as Record<string, { total: number; correct: number; subjectId: string }>)

    const subjectProgress = Object.entries(subjectStats).map(([name, stats]) => ({
      subjectId: stats.subjectId,
      subjectName: name,
      totalQuestions: stats.total,
      correctAnswers: stats.correct,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      lastTestDate: userAnswers
        .filter(a => a.question.subject.name === name)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]?.createdAt.toISOString()
    }))

    // Получаем бейджи пользователя
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: user.id },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
      take: 5
    })

    const recentBadges = userBadges.map(ub => ({
      id: ub.badge.id,
      name: ub.badge.name,
      icon: ub.badge.icon,
      color: ub.badge.color,
      earnedAt: ub.earnedAt.toISOString()
    }))

    // Подсчитываем серии активности (дни подряд с тестами)
    const testDates = Array.from(new Set(
      userAnswers.map(answer => answer.createdAt.toDateString())
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    // Подсчитываем текущую серию
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    
    if (testDates.length > 0) {
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      
      // Проверяем текущую серию
      if (testDates.includes(today) || testDates.includes(yesterday)) {
        let checkDate = testDates.includes(today) ? new Date() : new Date(Date.now() - 24 * 60 * 60 * 1000)
        
        while (testDates.includes(checkDate.toDateString())) {
          currentStreak++
          checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000)
        }
      }
      
      // Подсчитываем самую длинную серию
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

    return NextResponse.json({
      totalTests,
      correctAnswers,
      totalAnswers,
      averageScore,
      currentStreak,
      longestStreak,
      subjectProgress,
      recentBadges,
      currentXp: user.xp,
      currentLevel: user.level,
      userId: user.id
    })

  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}