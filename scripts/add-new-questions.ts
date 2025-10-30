import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Новые вопросы без объяснений (будут генерироваться ИИ)
const newQuestions = [
  {
    subject: 'Математика',
    questions: [
      {
        questionText: 'Найдите значение выражения: 3² + 4² = ?',
        options: ['25', '49', '12', '7'],
        correctOption: 0,
        topic: 'Арифметика',
        difficulty: 'easy' as const
      },
      {
        questionText: 'Решите неравенство: 2x - 3 > 7',
        options: ['x > 5', 'x < 5', 'x > 2', 'x < 2'],
        correctOption: 0,
        topic: 'Неравенства',
        difficulty: 'medium' as const
      }
    ]
  },
  {
    subject: 'Физика',
    questions: [
      {
        questionText: 'Какая единица измерения мощности в СИ?',
        options: ['Джоуль', 'Ватт', 'Ньютон', 'Вольт'],
        correctOption: 1,
        topic: 'Единицы измерения',
        difficulty: 'easy' as const
      }
    ]
  }
]

async function addNewQuestions() {
  console.log('🌱 Добавляем новые вопросы с ИИ объяснениями...')

  for (const subjectData of newQuestions) {
    console.log(`\n📚 Добавляем вопросы по предмету: ${subjectData.subject}`)
    
    // Находим предмет
    const subject = await prisma.subject.findFirst({
      where: {
        name: {
          contains: subjectData.subject
        }
      }
    })

    if (!subject) {
      console.log(`❌ Предмет "${subjectData.subject}" не найден`)
      continue
    }

    // Добавляем вопросы через API (чтобы сработала генерация ИИ)
    for (const question of subjectData.questions) {
      try {
        const response = await fetch('http://localhost:3001/api/admin/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...question,
            subjectId: subject.id
          })
        })

        if (response.ok) {
          console.log(`✅ Добавлен вопрос с ИИ объяснением: ${question.questionText.substring(0, 50)}...`)
        } else {
          const error = await response.json()
          console.log(`❌ Ошибка API: ${error.error}`)
        }
      } catch (error) {
        console.log(`❌ Ошибка при добавлении вопроса: ${error}`)
      }
    }
  }

  console.log('\n🎉 Все новые вопросы добавлены с ИИ объяснениями!')
}

addNewQuestions()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })