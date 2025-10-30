import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    const { questionId } = params

    // Проверяем, что вопрос существует
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Вопрос не найден' },
        { status: 404 }
      )
    }

    // Удаляем вопрос
    await prisma.question.delete({
      where: { id: questionId }
    })

    return NextResponse.json({
      message: 'Вопрос успешно удален'
    })

  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}