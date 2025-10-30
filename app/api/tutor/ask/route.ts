import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { openRouterService } from '@/lib/openrouter'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const askSchema = z.object({
  question: z.string().min(1, 'Вопрос не может быть пустым'),
  subject: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Временно отключаем проверку авторизации для демо
    // const authHeader = request.headers.get('authorization')
    // if (!authHeader) {
    //   return NextResponse.json(
    //     { error: 'Требуется авторизация' },
    //     { status: 401 }
    //   )
    // }

    // const token = authHeader.replace('Bearer ', '')
    // const user = await getCurrentUser(token)
    
    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Недействительный токен' },
    //     { status: 401 }
    //   )
    // }

    const body = await request.json()
    const { question, subject } = askSchema.parse(body)

    // Получаем ответ от ИИ
    const answer = await openRouterService.askTutor(subject || 'Общие вопросы', question)

    // Сохраняем диалог в базу данных (временно отключено для демо)
    // await prisma.aiChat.create({
    //   data: {
    //     userId: user.id,
    //     subject,
    //     question,
    //     answer,
    //   }
    // })

    return NextResponse.json({ answer })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Tutor API error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}