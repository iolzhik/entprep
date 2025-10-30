import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { subjectId: string } }
) {
  try {
    const { subjectId } = params

    // Получаем предмет
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    })

    if (!subject) {
      return NextResponse.json(
        { error: 'Предмет не найден' },
        { status: 404 }
      )
    }

    // Получаем вопросы по предмету
    const questions = await prisma.question.findMany({
      where: { subjectId },
      select: {
        id: true,
        questionText: true,
        options: true,
        correctOption: true,
        explanation: true,
        topic: true,
        difficulty: true,
      }
    })

    // Преобразуем options из JSON строки в массив
    const formattedQuestions = questions.map(question => ({
      ...question,
      options: JSON.parse(question.options as string)
    }))

    return NextResponse.json({
      subject,
      questions: formattedQuestions
    })

  } catch (error) {
    console.error('Questions API error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}