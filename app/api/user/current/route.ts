import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Для демо используем первого пользователя
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        xp: true,
        level: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      xp: user.xp,
      level: user.level,
      createdAt: user.createdAt.toISOString(),
    })

  } catch (error) {
    console.error('Error fetching current user:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}