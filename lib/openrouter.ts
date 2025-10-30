import axios from 'axios'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export class OpenRouterService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY!
  }

  async generateExplanation(
    topic: string,
    question: string,
    correctAnswer: string,
    userAnswer: string,
    subject: string
  ): Promise<string> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `Ты опытный и заботливый репетитор по подготовке к ЕНТ с 15-летним стажем. Твоя задача - дать развернутое, мотивирующее объяснение студенту, который дал неправильный ответ.

СТРУКТУРА ОТВЕТА:
1. 🔍 Анализ ошибки - объясни, почему студент мог выбрать именно этот вариант
2. ✅ Правильное решение - пошагово покажи правильный ход мыслей
3. 📚 Пробелы в знаниях - укажи конкретные темы для изучения
4. 💡 Практические советы - дай рекомендации для улучшения
5. 🎯 Мотивация - подбодри и направь на дальнейшее изучение

Говори как наставник: дружелюбно, понятно, с примерами и аналогиями. Используй эмодзи для структурирования ответа.`
      },
      {
        role: 'user',
        content: `Предмет: ${subject}
Тема: ${topic}
Вопрос: ${question}
Правильный ответ: ${correctAnswer}
Ответ студента: ${userAnswer}

Дай развернутое объяснение по структуре выше. Будь конкретным в рекомендациях по изучению тем.`
      }
    ]

    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: 'anthropic/claude-3-haiku',
          messages,
          max_tokens: 800,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXTAUTH_URL,
            'X-Title': 'ENT Prep App',
          }
        }
      )

      return response.data.choices[0]?.message?.content || 'Не удалось получить объяснение.'
    } catch (error) {
      console.error('OpenRouter API Error:', error)
      return 'К сожалению, не удалось получить объяснение от ИИ. Попробуйте позже.'
    }
  }

  async generatePositiveExplanation(
    topic: string,
    question: string,
    correctAnswer: string,
    subject: string
  ): Promise<string> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `Ты опытный репетитор по подготовке к ЕНТ. Студент дал правильный ответ! Твоя задача - похвалить его и дать дополнительную полезную информацию по теме.

СТРУКТУРА ОТВЕТА:
1. 🎉 Похвала за правильный ответ
2. 🧠 Объяснение логики решения
3. 📖 Дополнительная информация по теме
4. 🔗 Связь с другими темами
5. 💪 Мотивация к дальнейшему изучению

Будь позитивным и вдохновляющим!`
      },
      {
        role: 'user',
        content: `Предмет: ${subject}
Тема: ${topic}
Вопрос: ${question}
Правильный ответ: ${correctAnswer}

Студент ответил правильно! Дай позитивное объяснение с дополнительной информацией.`
      }
    ]

    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: 'anthropic/claude-3-haiku',
          messages,
          max_tokens: 600,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXTAUTH_URL,
            'X-Title': 'ENT Prep App',
          }
        }
      )

      return response.data.choices[0]?.message?.content || 'Отлично! Правильный ответ!'
    } catch (error) {
      console.error('OpenRouter API Error:', error)
      return '🎉 Отлично! Вы дали правильный ответ! Продолжайте в том же духе!'
    }
  }

  async generatePositiveExplanation(
    topic: string,
    question: string,
    correctAnswer: string,
    subject: string
  ): Promise<string> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `Ты опытный репетитор по предмету "${subject}". Студент дал правильный ответ. Дай краткое позитивное подтверждение и дополнительную полезную информацию по теме.`
      },
      {
        role: 'user',
        content: `Тема: ${topic}
Вопрос: ${question}
Правильный ответ: ${correctAnswer}

Студент ответил правильно! Дай краткое подтверждение и дополнительную информацию по теме.`
      }
    ]

    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: 'anthropic/claude-3-haiku',
          messages,
          max_tokens: 300,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXTAUTH_URL,
            'X-Title': 'ENT Prep App',
          }
        }
      )

      return response.data.choices[0]?.message?.content || 'Отлично! Правильный ответ!'
    } catch (error) {
      console.error('OpenRouter API Error:', error)
      return 'Отлично! Правильный ответ!'
    }
  }

  async generateQuestionExplanation(
    topic: string,
    questionText: string,
    correctAnswer: string,
    subject: string,
    allOptions: string[]
  ): Promise<string> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `Ты опытный преподаватель по предмету "${subject}". Создай краткое, но понятное объяснение для правильного ответа на вопрос ЕНТ. Объяснение должно быть образовательным и помочь студенту понять тему.`
      },
      {
        role: 'user',
        content: `Предмет: ${subject}
Тема: ${topic}
Вопрос: ${questionText}
Варианты ответов: ${allOptions.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`).join(', ')}
Правильный ответ: ${correctAnswer}

Создай краткое объяснение (2-3 предложения), почему этот ответ правильный. Объяснение должно быть понятным для студента, готовящегося к ЕНТ.`
      }
    ]

    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: 'anthropic/claude-3-haiku',
          messages,
          max_tokens: 200,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXTAUTH_URL,
            'X-Title': 'ENT Prep App',
          }
        }
      )

      return response.data.choices[0]?.message?.content || `Правильный ответ: ${correctAnswer}`
    } catch (error) {
      console.error('OpenRouter API Error:', error)
      return `Правильный ответ: ${correctAnswer}. Изучите тему "${topic}" для лучшего понимания.`
    }
  }

  async askTutor(subject: string, question: string): Promise<string> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `Ты ИИ-репетитор по предмету "${subject}" для подготовки к ЕНТ. Отвечай развернуто, с примерами, формулами (если нужно), и практическими советами. Будь дружелюбным и мотивирующим.`
      },
      {
        role: 'user',
        content: question
      }
    ]

    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: 'anthropic/claude-3-haiku',
          messages,
          max_tokens: 800,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXTAUTH_URL,
            'X-Title': 'ENT Prep App',
          }
        }
      )

      return response.data.choices[0]?.message?.content || 'Не удалось получить ответ.'
    } catch (error) {
      console.error('OpenRouter API Error:', error)
      return 'К сожалению, не удалось получить ответ от ИИ-репетитора. Попробуйте позже.'
    }
  }
}

export const openRouterService = new OpenRouterService()