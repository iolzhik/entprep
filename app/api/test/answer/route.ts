import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { openRouterService } from '@/lib/openrouter'
import { prisma } from '@/lib/prisma'

const answerSchema = z.object({
  questionId: z.string(),
  selectedOption: z.number(),
  timeSpent: z.number(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionId, selectedOption, timeSpent } = answerSchema.parse(body)

    // Получаем вопрос из базы данных
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        subject: true
      }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Вопрос не найден' },
        { status: 404 }
      )
    }

    const options = JSON.parse(question.options as string)
    const isCorrect = selectedOption === question.correctOption
    const userAnswer = options[selectedOption] || 'Не отвечено'
    const correctAnswer = options[question.correctOption]

    let explanation = question.explanation || ''

    // Если ответ неправильный, получаем развернутое объяснение от ИИ
    if (!isCorrect) {
      explanation = await openRouterService.generateExplanation(
        question.topic || question.subject.name,
        question.questionText,
        correctAnswer,
        userAnswer,
        question.subject.name
      )
    } else {
      // Даже для правильных ответов можем дать дополнительную информацию
      explanation = await openRouterService.generatePositiveExplanation(
        question.topic || question.subject.name,
        question.questionText,
        correctAnswer,
        question.subject.name
      )
    }

    return NextResponse.json({
      isCorrect,
      correctAnswer,
      userAnswer,
      explanation,
      topic: question.topic,
      subject: question.subject.name,
      timeSpent
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Answer API error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}