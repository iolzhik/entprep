import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { openRouterService } from '@/lib/openrouter'

const explanationSchema = z.object({
  topic: z.string(),
  question: z.string(),
  correctAnswer: z.string(),
  userAnswer: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, question, correctAnswer, userAnswer } = explanationSchema.parse(body)

    // Получаем объяснение от ИИ
    const explanation = await openRouterService.generateExplanation(
      topic,
      question,
      correctAnswer,
      userAnswer
    )

    return NextResponse.json({ explanation })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Explanation API error:', error)
    return NextResponse.json(
      { error: 'Не удалось получить объяснение' },
      { status: 500 }
    )
  }
}