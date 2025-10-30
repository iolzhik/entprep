# 🚀 Деплой ENT Prep на Vercel

## ✅ Код загружен в GitHub!

**Репозиторий**: https://github.com/iolzhik/entprep.git

## 📋 Следующие шаги для деплоя:

### 1. 🗄️ Создайте базу данных на Neon

1. Перейдите на **https://neon.tech**
2. Нажмите **"Sign Up"** (можно через GitHub)
3. Создайте новый проект:
   - **Project name**: `ent-prep-db`
   - **Region**: Europe (ближайший к вам)
   - **PostgreSQL version**: 15
4. **Скопируйте DATABASE_URL** из Dashboard
   - Он выглядит как: `postgresql://username:password@hostname/database`

### 2. 🚀 Деплой на Vercel

1. Перейдите на **https://vercel.com**
2. Нажмите **"Sign Up"** (лучше через GitHub)
3. Нажмите **"New Project"**
4. Найдите репозиторий **"iolzhik/entprep"**
5. Нажмите **"Import"**

### 3. ⚙️ Настройте переменные окружения

В настройках проекта Vercel добавьте эти переменные:

```env
DATABASE_URL=postgresql://username:password@hostname/database
JWT_SECRET=super-secret-jwt-key-minimum-32-characters-long-for-security
JWT_REFRESH_SECRET=another-super-secret-refresh-key-minimum-32-characters-long
OPENROUTER_API_KEY=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
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=nextauth-secret-minimum-32-characters-long-for-security
```

**Как сгенерировать секреты:**
- Используйте онлайн генератор: https://generate-secret.vercel.app/32
- Или в терминале: `openssl rand -base64 32`

### 4. 🎯 Деплой!

1. Нажмите **"Deploy"**
2. Ждите 2-3 минуты
3. Получите ссылку на приложение!

## 🎉 Готово!

Ваше приложение будет доступно по адресу типа:
**https://entprep-xyz123.vercel.app**

## 🔧 Что произойдет автоматически:

1. ✅ **Установка зависимостей** - npm install
2. ✅ **Генерация Prisma** - prisma generate  
3. ✅ **Создание таблиц** - prisma db push
4. ✅ **Заполнение данными** - npm run db:seed
5. ✅ **Сборка приложения** - next build
6. ✅ **Деплой** - готово к использованию!

## 📊 Что будет работать:

- ✅ **Регистрация и вход** пользователей
- ✅ **Тестирование** по всем предметам
- ✅ **ИИ-репетитор** с объяснениями
- ✅ **Система достижений** и прогресса
- ✅ **Админ-панель** для добавления вопросов
- ✅ **Выбор таймера** для тестов
- ✅ **Реальная статистика** из базы данных

## 🆘 Если что-то не работает:

### База данных не подключается:
- Проверьте DATABASE_URL в переменных окружения Vercel
- Убедитесь, что Neon база активна

### Ошибки при сборке:
- Проверьте логи в Vercel Dashboard → Functions → View Function Logs
- Убедитесь, что все переменные окружения добавлены

### OpenRouter API не работает:
- Проверьте OPENROUTER_API_KEY
- Убедитесь, что ключ активен и имеет баланс

## 🔄 Автоматические обновления:

Теперь при каждом push в GitHub:
1. Vercel автоматически пересобирает приложение
2. Применяет изменения в базе данных
3. Деплоит новую версию

**Время деплоя: ~5 минут от нажатия кнопки до готового приложения! 🚀**