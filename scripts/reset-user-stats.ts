import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetUserStats() {
  console.log('🔄 Сбрасываем все метрики пользователя...')

  try {
    // Находим пользователя
    const user = await prisma.user.findFirst()
    
    if (!user) {
      console.log('❌ Пользователь не найден')
      return
    }

    console.log(`👤 Найден пользователь: ${user.name} (${user.email})`)

    // 1. Удаляем все ответы пользователя
    const deletedAnswers = await prisma.userAnswer.deleteMany({
      where: { userId: user.id }
    })
    console.log(`🗑️ Удалено ответов: ${deletedAnswers.count}`)

    // 2. Удаляем все бейджи пользователя
    const deletedBadges = await prisma.userBadge.deleteMany({
      where: { userId: user.id }
    })
    console.log(`🏆 Удалено бейджей: ${deletedBadges.count}`)

    // 3. Удаляем историю ИИ чатов
    const deletedChats = await prisma.aiChat.deleteMany({
      where: { userId: user.id }
    })
    console.log(`💬 Удалено ИИ чатов: ${deletedChats.count}`)

    // 4. Сбрасываем XP и уровень пользователя
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: 0,
        level: 1,
      }
    })
    console.log(`📊 Сброшены XP: ${updatedUser.xp}, Уровень: ${updatedUser.level}`)

    console.log('\n✅ Все метрики пользователя успешно сброшены!')
    console.log('\n📋 Текущее состояние:')
    console.log(`   • XP: 0`)
    console.log(`   • Уровень: 1`)
    console.log(`   • Ответов: 0`)
    console.log(`   • Бейджей: 0`)
    console.log(`   • ИИ чатов: 0`)
    console.log('\n🎯 Теперь можете начать тестирование с чистого листа!')

  } catch (error) {
    console.error('❌ Ошибка при сбросе метрик:', error)
  }
}

resetUserStats()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })