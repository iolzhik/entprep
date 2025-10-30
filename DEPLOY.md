# 🚀 Деплой ENT Prep на Vercel + Neon

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
