// Простой тест для проверки OpenRouter API
const axios = require('axios');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = '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';

async function testOpenRouter() {
  try {
    console.log('🧪 Тестируем OpenRouter API...');
    
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'Ты репетитор по математике. Ответь кратко и понятно.'
          },
          {
            role: 'user',
            content: 'Объясни, чему равен корень из 144?'
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'ENT Prep App',
        }
      }
    );

    console.log('✅ OpenRouter API работает!');
    console.log('Ответ:', response.data.choices[0]?.message?.content);
  } catch (error) {
    console.error('❌ Ошибка OpenRouter API:', error.response?.data || error.message);
  }
}

testOpenRouter();