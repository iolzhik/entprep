import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        color: true,
        _count: {
          select: {
            questions: true
          }
        }
      }
    })

    const subjectsWithQuestionCount = subjects.map(subject => ({
      ...subject,
      questionCount: subject._count.questions,
      difficulty: 'medium' as const,
      estimatedTime: Math.max(20, subject._count.questions * 2)
    }))

    return NextResponse.json(subjectsWithQuestionCount)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Ошибка получения предметов' },
      { status: 500 }
    )
  }
}