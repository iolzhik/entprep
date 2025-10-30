import fs from 'fs'
import path from 'path'

console.log('🚀 Подготовка проекта к деплою...')

// 1. Создаем .env.example для Vercel
const envExample = `# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@hostname/database"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"

# OpenRouter API
OPENROUTER_API_KEY="sk-or-v1-your-api-key-here"

# Next.js
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret"
`

fs.writeFileSync('.env.example', envExample)
console.log('✅ Создан .env.example')

// 2. Обновляем package.json для деплоя
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

// Добавляем скрипты для деплоя
packageJson.scripts = {
  ...packageJson.scripts,
  "build": "next build",
  "postinstall": "prisma generate",
  "vercel-build": "prisma generate && prisma db push && npm run db:seed && next build"
}

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2))
console.log('✅ Обновлен package.json')

// 3. Создаем README для деплоя
const deployReadme = `# 🚀 Деплой ENT Prep на Vercel + Neon

## Быстрый деплой:

### 1. Создайте базу данных на Neon:
- Перейдите на https://neon.tech
- Создайте аккаунт и новый проект
- Скопируйте DATABASE_URL

### 2. Деплой на Vercel:
- Перейдите на https://vercel.com
- Импортируйте проект из GitHub
- Добавьте переменные окружения:
  - DATABASE_URL (из Neon)
  - JWT_SECRET (любая длинная строка)
  - JWT_REFRESH_SECRET (другая длинная строка)
  - OPENROUTER_API_KEY (ваш ключ)
  - NEXTAUTH_URL (https://your-app.vercel.app)
  - NEXTAUTH_SECRET (еще одна длинная строка)

### 3. Готово!
Приложение автоматически развернется с базой данных и всеми функциями.

## 🔗 Полезные ссылки:
- Neon: https://neon.tech
- Vercel: https://vercel.com
- Документация: README.md
`

fs.writeFileSync('DEPLOY.md', deployReadme)
console.log('✅ Создан DEPLOY.md')

console.log('\n🎉 Проект готов к деплою!')
console.log('\n📋 Следующие шаги:')
console.log('1. Создайте репозиторий на GitHub')
console.log('2. Загрузите код: git add . && git commit -m "Initial commit" && git push')
console.log('3. Создайте базу данных на https://neon.tech')
console.log('4. Деплойте на https://vercel.com')
console.log('5. Добавьте переменные окружения в Vercel')