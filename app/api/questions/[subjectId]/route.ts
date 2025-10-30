import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { subjectId: string } }
) {
  try {
    const { subjectId } = params

    const questions = await prisma.question.findMany({
      where: {
        subjectId: subjectId
      },
      select: {
        id: true,
        questionText: true,
        options: true,
        correctOption: true,
        explanation: true,
        topic: true,
        difficulty: true
      }
    })

    // Парсим JSON options для каждого вопроса
    const parsedQuestions = questions.map(question => ({
      ...question,
      options: typeof question.options === 'string' 
        ? JSON.parse(question.options as string)
        : question.options
    }))

    return NextResponse.json(parsedQuestions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Ошибка получения вопросов' },
      { status: 500 }
    )
  }
}