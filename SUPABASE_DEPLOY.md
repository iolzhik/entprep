# 🚀 Деплой ENT Prep на Vercel + Supabase

Комбинация Vercel (фронтенд) + Supabase (база данных) - полностью бесплатно!

## 🎯 Почему Vercel + Supabase?

✅ **Полностью бесплатно** - оба сервиса имеют щедрые бесплатные планы  
✅ **Supabase PostgreSQL** - 500MB бесплатно + удобный интерфейс  
✅ **Vercel для фронтенда** - лучший хостинг для Next.js  
✅ **Простая интеграция** - работают отлично вместе  

## 📋 Пошаговый деплой:

### 1. 🗄️ Создание базы данных на Supabase

1. Перейдите на **https://supabase.com**
2. Нажмите **"Start your project"**
3. Войдите через **GitHub**
4. Нажмите **"New project"**
5. Настройки:
   - **Organization**: ваш GitHub username
   - **Name**: `ent-prep-db`
   - **Database Password**: создайте надежный пароль
   - **Region**: Europe (Frankfurt)
   - **Plan**: **Free** (500MB)
6. Нажмите **"Create new project"**
7. Дождитесь создания (2-3 минуты)

### 2. 📊 Получение DATABASE_URL

1. В проекте Supabase перейдите в **"Settings"** → **"Database"**
2. Найдите **"Connection string"** → **"URI"**
3. Скопируйте строку подключения:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
4. Замените `[YOUR-PASSWORD]` на ваш пароль

### 3. 🚀 Деплой на Vercel

1. Перейдите на **https://vercel.com**
2. Войдите через **GitHub**
3. Нажмите **"New Project"**
4. Выберите репозиторий **"iolzhik/entprep"**
5. Нажмите **"Import"**

### 4. ⚙️ Настройка переменных окружения в Vercel

В настройках проекта добавьте переменные:

```env
DATABASE_URL=postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres
JWT_SECRET=B83CLuQ0OrOhjkZ1vUeqtWIQjes1nPew1C9bDGWchTs=
JWT_REFRESH_SECRET=SxTEKMkeDjqfVHEgpUKtCF7Sn4TUVKh9Xuo55a7eHmw=
OPENROUTER_API_KEY=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
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=BqaVTkaaMrJ3X5CD8xTaBuF0d2n3Zw2PJ3hWgEu3xWg=
```

### 5. 🎯 Деплой!

1. Нажмите **"Deploy"**
2. Vercel автоматически:
   - ✅ Установит зависимости
   - ✅ Сгенерирует Prisma клиент
   - ✅ Создаст таблицы в Supabase
   - ✅ Заполнит базу тестовыми данными
   - ✅ Соберет Next.js приложение
   - ✅ Задеплоит на домен

### 6. 🔗 Обновите NEXTAUTH_URL

1. После деплоя скопируйте URL (например: `https://entprep-abc123.vercel.app`)
2. Обновите переменную `NEXTAUTH_URL` в настройках Vercel
3. Vercel автоматически пересоберет приложение

## 🎉 Готово!

Ваше приложение будет доступно по адресу:
**https://your-app-name.vercel.app**

## 💰 Бесплатные планы включают:

### Vercel Free:
- ✅ **100GB bandwidth** в месяц
- ✅ **Unlimited deployments**
- ✅ **Custom domains**
- ✅ **SSL сертификаты**

### Supabase Free:
- ✅ **500MB PostgreSQL** база данных
- ✅ **2GB bandwidth** в месяц
- ✅ **50MB file storage**
- ✅ **Realtime subscriptions**

**Полностью бесплатно для учебных проектов! 🎉**

## 🔄 Автоматические обновления:

При каждом push в GitHub:
1. Vercel автоматически пересобирает приложение
2. Применяет изменения в базе данных Supabase
3. Деплоит новую версию

**Время деплоя: ~3 минуты! 🚀**

## 🎯 Преимущества этой связки:

✅ **Полностью бесплатно** - оба сервиса бесплатны  
✅ **Лучшая производительность** - Vercel оптимизирован для Next.js  
✅ **Удобный интерфейс БД** - Supabase имеет отличный dashboard  
✅ **Масштабируемость** - легко перейти на платные планы  
✅ **Надежность** - оба сервиса очень стабильны  

**Идеальная комбинация для современных приложений! 🎉**