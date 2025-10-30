import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { openRouterService } from '@/lib/openrouter'

const questionSchema = z.object({
  subjectId: z.string(),
  questionText: z.string().min(1, 'Текст вопроса обязателен'),
  options: z.array(z.string()).length(4, 'Должно быть 4 варианта ответа').refine(
    (options) => options.every(option => option.trim().length > 0),
    'Все варианты ответов должны быть заполнены'
  ),
  correctOption: z.number().min(0).max(3, 'Правильный ответ должен быть от 0 до 3'),
  explanation: z.string().optional(), // Теперь необязательно
  topic: z.string().min(1, 'Тема обязательна'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = questionSchema.parse(body)

    // Проверяем, что предмет существует
    const subject = await prisma.subject.findUnique({
      where: { id: data.subjectId }
    })

    if (!subject) {
      return NextResponse.json(
        { error: 'Предмет не найден' },
        { status: 404 }
      )
    }

    // Генерируем объяснение с помощью ИИ
    let explanation = data.explanation || ''
    
    if (!explanation) {
      try {
        explanation = await openRouterService.generateQuestionExplanation(
          data.topic,
          data.questionText,
          data.options[data.correctOption],
          subject.name,
          data.options
        )
      } catch (error) {
        console.error('Error generating explanation:', error)
        explanation = `Правильный ответ: ${data.options[data.correctOption]}. Изучите тему "${data.topic}" для лучшего понимания.`
      }
    }

    // Создаем вопрос
    const question = await prisma.question.create({
      data: {
        subjectId: data.subjectId,
        questionText: data.questionText,
        options: JSON.stringify(data.options),
        correctOption: data.correctOption,
        explanation: explanation,
        topic: data.topic,
        difficulty: data.difficulty,
      }
    })

    return NextResponse.json({
      message: 'Вопрос успешно создан',
      question: {
        id: question.id,
        questionText: question.questionText,
        options: JSON.parse(question.options as string),
        correctOption: question.correctOption,
        explanation: question.explanation,
        topic: question.topic,
        difficulty: question.difficulty,
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}