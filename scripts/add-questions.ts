import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Вопросы по предметам (объяснения будут генерироваться ИИ)
const questionsBySubject = {
  'История Казахстана': [
    {
      questionText: 'В каком году была образована Казахская ССР?',
      options: ['1920', '1936', '1925', '1930'],
      correctOption: 1,
      topic: 'Советский период',
      difficulty: 'medium' as const
    },
    {
      questionText: 'Кто был первым президентом независимого Казахстана?',
      options: ['Нурсултан Назарбаев', 'Динмухамед Кунаев', 'Касым-Жомарт Токаев', 'Серикболсын Абдильдин'],
      correctOption: 0,
      topic: 'Независимость',
      difficulty: 'easy' as const
    },
    {
      questionText: 'В каком году Казахстан получил независимость?',
      options: ['1990', '1991', '1992', '1989'],
      correctOption: 1,
      topic: 'Независимость',
      difficulty: 'easy' as const
    }
  ],
  'Английский язык': [
    {
      questionText: 'Choose the correct form: "I ___ to London last year."',
      options: ['go', 'went', 'have gone', 'going'],
      correctOption: 1,
      explanation: 'Используется Past Simple для действий в прошлом с указанием времени',
      topic: 'Past Simple',
      difficulty: 'medium' as const
    },
    {
      questionText: 'What is the plural form of "child"?',
      options: ['childs', 'children', 'childes', 'child'],
      correctOption: 1,
      explanation: 'Children - неправильная форма множественного числа от child',
      topic: 'Irregular plurals',
      difficulty: 'easy' as const
    },
    {
      questionText: 'Choose the correct article: "___ sun is shining brightly."',
      options: ['A', 'An', 'The', 'No article'],
      correctOption: 2,
      explanation: 'Используется определенный артикль "the" с уникальными объектами',
      topic: 'Articles',
      difficulty: 'medium' as const
    }
  ],
  'Химия': [
    {
      questionText: 'Какой элемент имеет химический символ "O"?',
      options: ['Олово', 'Кислород', 'Осмий', 'Золото'],
      correctOption: 1,
      explanation: 'O - химический символ кислорода (Oxygen)',
      topic: 'Химические элементы',
      difficulty: 'easy' as const
    },
    {
      questionText: 'Сколько электронов в атоме углерода?',
      options: ['4', '6', '8', '12'],
      correctOption: 1,
      explanation: 'Углерод имеет атомный номер 6, значит 6 электронов',
      topic: 'Строение атома',
      difficulty: 'medium' as const
    },
    {
      questionText: 'Какая формула воды?',
      options: ['H2O', 'CO2', 'NaCl', 'CH4'],
      correctOption: 0,
      explanation: 'Вода состоит из двух атомов водорода и одного атома кислорода - H2O',
      topic: 'Химические формулы',
      difficulty: 'easy' as const
    }
  ],
  'География': [
    {
      questionText: 'Какая самая высокая гора в Казахстане?',
      options: ['Хан-Тенгри', 'Белуха', 'Пик Талгар', 'Пик Алматы'],
      correctOption: 0,
      explanation: 'Хан-Тенгри (7010 м) - самая высокая точка Казахстана',
      topic: 'Рельеф Казахстана',
      difficulty: 'medium' as const
    },
    {
      questionText: 'Какое самое большое озеро в Казахстане?',
      options: ['Балхаш', 'Зайсан', 'Алаколь', 'Каспийское море'],
      correctOption: 3,
      explanation: 'Каспийское море - крупнейший водоем у берегов Казахстана',
      topic: 'Гидрография',
      difficulty: 'easy' as const
    },
    {
      questionText: 'В какой природной зоне расположена большая часть Казахстана?',
      options: ['Тайга', 'Степь', 'Пустыня', 'Тундра'],
      correctOption: 1,
      explanation: 'Большая часть территории Казахстана находится в степной зоне',
      topic: 'Природные зоны',
      difficulty: 'medium' as const
    }
  ]
}

async function addQuestions() {
  console.log('🌱 Добавляем вопросы по всем предметам...')

  for (const [subjectName, questions] of Object.entries(questionsBySubject)) {
    console.log(`\n📚 Добавляем вопросы по предмету: ${subjectName}`)
    
    // Находим предмет
    const subject = await prisma.subject.findFirst({
      where: {
        name: {
          contains: subjectName
        }
      }
    })

    if (!subject) {
      console.log(`❌ Предмет "${subjectName}" не найден`)
      continue
    }

    // Добавляем вопросы (объяснения будут генерироваться через API)
    for (const question of questions) {
      try {
        // Создаем базовое объяснение, если ИИ недоступен
        const fallbackExplanation = `Правильный ответ: ${question.options[question.correctOption]}. Изучите тему "${question.topic}" для лучшего понимания.`
        
        await prisma.question.create({
          data: {
            subjectId: subject.id,
            questionText: question.questionText,
            options: JSON.stringify(question.options),
            correctOption: question.correctOption,
            explanation: fallbackExplanation, // Временное объяснение
            topic: question.topic,
            difficulty: question.difficulty,
          }
        })
        console.log(`✅ Добавлен вопрос: ${question.questionText.substring(0, 50)}...`)
      } catch (error) {
        console.log(`❌ Ошибка при добавлении вопроса: ${error}`)
      }
    }
  }

  console.log('\n🎉 Все вопросы добавлены!')
}

addQuestions()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })