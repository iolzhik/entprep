import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Создаем предметы
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { name: 'Математика' },
      update: {},
      create: {
        name: 'Математика',
        description: 'Алгебра, геометрия, тригонометрия',
        icon: '🧮',
        color: '#3b82f6',
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Физика' },
      update: {},
      create: {
        name: 'Физика',
        description: 'Механика, термодинамика, электричество',
        icon: '⚡',
        color: '#10b981',
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Химия' },
      update: {},
      create: {
        name: 'Химия',
        description: 'Органическая и неорганическая химия',
        icon: '🧪',
        color: '#f59e0b',
      },
    }),
    prisma.subject.upsert({
      where: { name: 'История Казахстана' },
      update: {},
      create: {
        name: 'История Казахстана',
        description: 'От древности до современности',
        icon: '🏛️',
        color: '#8b5cf6',
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Английский язык' },
      update: {},
      create: {
        name: 'Английский язык',
        description: 'Грамматика, лексика, чтение',
        icon: '🇬🇧',
        color: '#ef4444',
      },
    }),
    prisma.subject.upsert({
      where: { name: 'География' },
      update: {},
      create: {
        name: 'География',
        description: 'Физическая и экономическая география',
        icon: '🌍',
        color: '#06b6d4',
      },
    }),
  ])

  console.log('✅ Предметы созданы')

  // Создаем вопросы по математике
  const mathQuestions = [
    {
      questionText: 'Чему равен корень из 144?',
      options: ['10', '12', '14', '16'],
      correctOption: 1,
      explanation: 'Корень из 144 равен 12, так как 12² = 144',
      topic: 'Арифметика',
    },
    {
      questionText: 'Решите уравнение: 2x + 5 = 13',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
      correctOption: 1,
      explanation: '2x + 5 = 13, 2x = 8, x = 4',
      topic: 'Алгебра',
    },
    {
      questionText: 'Чему равна площадь круга с радиусом 3?',
      options: ['6π', '9π', '12π', '18π'],
      correctOption: 1,
      explanation: 'Площадь круга S = πr², где r = 3, значит S = π × 3² = 9π',
      topic: 'Геометрия',
    },
    {
      questionText: 'Найдите производную функции f(x) = x²',
      options: ['x', '2x', 'x²', '2x²'],
      correctOption: 1,
      explanation: 'Производная функции f(x) = x² равна f\'(x) = 2x',
      topic: 'Математический анализ',
    },
    {
      questionText: 'Чему равен sin(30°)?',
      options: ['1/2', '√2/2', '√3/2', '1'],
      correctOption: 0,
      explanation: 'sin(30°) = 1/2 - это табличное значение',
      topic: 'Тригонометрия',
    },
  ]

  const mathSubject = subjects.find(s => s.name === 'Математика')!
  
  for (const question of mathQuestions) {
    await prisma.question.create({
      data: {
        ...question,
        options: JSON.stringify(question.options),
        subjectId: mathSubject.id,
      },
    })
  }

  // Создаем вопросы по физике
  const physicsQuestions = [
    {
      questionText: 'Чему равно ускорение свободного падения на Земле?',
      options: ['9.8 м/с²', '10 м/с²', '9.6 м/с²', '8.9 м/с²'],
      correctOption: 0,
      explanation: 'Ускорение свободного падения на Земле g ≈ 9.8 м/с²',
      topic: 'Механика',
    },
    {
      questionText: 'Первый закон Ньютона также называется законом:',
      options: ['Действия', 'Инерции', 'Тяготения', 'Сохранения'],
      correctOption: 1,
      explanation: 'Первый закон Ньютона - это закон инерции',
      topic: 'Механика',
    },
    {
      questionText: 'Единица измерения силы в СИ:',
      options: ['Джоуль', 'Ньютон', 'Ватт', 'Паскаль'],
      correctOption: 1,
      explanation: 'Сила измеряется в ньютонах (Н)',
      topic: 'Механика',
    },
    {
      questionText: 'Формула для расчета кинетической энергии:',
      options: ['E = mgh', 'E = mc²', 'E = mv²/2', 'E = Pt'],
      correctOption: 2,
      explanation: 'Кинетическая энергия E = mv²/2',
      topic: 'Механика',
    },
  ]

  const physicsSubject = subjects.find(s => s.name === 'Физика')!
  
  for (const question of physicsQuestions) {
    await prisma.question.create({
      data: {
        ...question,
        options: JSON.stringify(question.options),
        subjectId: physicsSubject.id,
      },
    })
  }

  // Создаем бейджи
  const badges = [
    {
      name: 'Первые шаги',
      description: 'Пройдите свой первый тест',
      xpRequired: 10,
      icon: '🎯',
      color: '#f59e0b',
      category: 'general',
    },
    {
      name: 'Математический гений',
      description: 'Наберите 90% правильных ответов по математике',
      xpRequired: 100,
      icon: '🧮',
      color: '#3b82f6',
      category: 'subject',
    },
    {
      name: 'Физик-теоретик',
      description: 'Решите 50 задач по физике',
      xpRequired: 200,
      icon: '⚡',
      color: '#10b981',
      category: 'subject',
    },
    {
      name: 'Неделя побед',
      description: 'Проходите тесты 7 дней подряд',
      xpRequired: 50,
      icon: '🔥',
      color: '#ef4444',
      category: 'achievement',
    },
    {
      name: 'Легенда ЕНТ',
      description: 'Достигните 10 уровня',
      xpRequired: 1000,
      icon: '👑',
      color: '#fbbf24',
      category: 'achievement',
    },
  ]

  for (const badge of badges) {
    await prisma.badge.create({
      data: badge,
    })
  }

  console.log('✅ Вопросы и бейджи созданы')
  console.log('🎉 База данных успешно заполнена!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })