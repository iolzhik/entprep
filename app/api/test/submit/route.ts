import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const submitTestSchema = z.object({
  subjectId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedOption: z.number(),
    isCorrect: z.boolean(),
    timeSpent: z.number(),
  }))
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subjectId, answers } = submitTestSchema.parse(body)

    // Для демо создаем или находим пользователя
    let user = await prisma.user.findFirst()
    
    if (!user) {
      // Создаем демо пользователя
      user = await prisma.user.create({
        data: {
          email: 'demo@example.com',
          name: 'Демо Пользователь',
          passwordHash: 'demo',
          xp: 0,
          level: 1,
        }
      })
    }

    // Сохраняем ответы
    const userAnswers = await Promise.all(
      answers.map(answer => 
        prisma.userAnswer.upsert({
          where: {
            userId_questionId: {
              userId: user!.id,
              questionId: answer.questionId
            }
          },
          update: {
            isCorrect: answer.isCorrect,
            timeSpent: answer.timeSpent,
          },
          create: {
            userId: user!.id,
            questionId: answer.questionId,
            isCorrect: answer.isCorrect,
            timeSpent: answer.timeSpent,
          }
        })
      )
    )

    // Подсчитываем XP (10 очков за правильный ответ)
    const correctAnswersCount = answers.filter(a => a.isCorrect).length
    const xpEarned = correctAnswersCount * 10

    // Обновляем XP пользователя
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: xpEarned },
        level: Math.floor((user.xp + xpEarned) / 100) + 1,
      }
    })

    // Проверяем, заслужил ли пользователь новые бейджи
    const badges = await prisma.badge.findMany({
      where: {
        xpRequired: { lte: updatedUser.xp }
      }
    })

    // Добавляем новые бейджи
    for (const badge of badges) {
      await prisma.userBadge.upsert({
        where: {
          userId_badgeId: {
            userId: user.id,
            badgeId: badge.id
          }
        },
        update: {},
        create: {
          userId: user.id,
          badgeId: badge.id,
        }
      })
    }

    return NextResponse.json({
      message: 'Результаты теста сохранены',
      xpEarned,
      newLevel: updatedUser.level,
      totalXp: updatedUser.xp,
      correctAnswers: correctAnswersCount,
      totalQuestions: answers.length,
      accuracy: Math.round((correctAnswersCount / answers.length) * 100)
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error submitting test:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}