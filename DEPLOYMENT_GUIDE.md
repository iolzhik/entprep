# 🚀 Полное руководство по деплою ENT Prep

## 🎯 Выбранный стек: Vercel + Neon

**Почему именно этот стек:**
- ✅ **100% бесплатно** для небольших проектов
- ✅ **Быстрый деплой** - 5 минут от кода до продакшена
- ✅ **Автоматические обновления** из GitHub
- ✅ **Serverless** - масштабируется автоматически
- ✅ **PostgreSQL** - полная совместимость с Prisma

## 📋 Пошаговая инструкция:

### Шаг 1: Создание GitHub репозитория

1. Перейдите на https://github.com
2. Нажмите "New repository"
3. Назовите репозиторий: `ent-prep-app`
4. Сделайте его публичным
5. Нажмите "Create repository"

### Шаг 2: Загрузка кода

```bash
# Инициализируем git (если еще не сделано)
git init

# Добавляем все файлы
git add .

# Делаем первый коммит
git commit -m "🎉 Initial commit - ENT Prep App"

# Добавляем remote origin
git remote add origin https://github.com/YOUR_USERNAME/ent-prep-app.git

# Загружаем код
git push -u origin main
```

### Шаг 3: Создание базы данных на Neon

1. **Перейдите на https://neon.tech**
2. **Зарегистрируйтесь** (можно через GitHub)
3. **Создайте новый проект:**
   - Name: `ent-prep-db`
   - Region: выберите ближайший
   - PostgreSQL version: 15 (по умолчанию)
4. **Скопируйте DATABASE_URL** из Dashboard
   - Формат: `postgresql://username:password@hostname/database`

### Шаг 4: Деплой на Vercel

1. **Перейдите на https://vercel.com**
2. **Зарегистрируйтесь** (лучше через GitHub)
3. **Импортируйте проект:**
   - Нажмите "New Project"
   - Выберите ваш GitHub репозиторий `ent-prep-app`
   - Нажмите "Import"

### Шаг 5: Настройка переменных окружения

В настройках проекта Vercel добавьте:

```env
DATABASE_URL=postgresql://username:password@hostname/database
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_REFRESH_SECRET=another-super-secret-refresh-key-minimum-32-characters
OPENROUTER_API_KEY=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
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=nextauth-secret-minimum-32-characters-long
```

**Как сгенерировать секреты:**
```bash
# В терминале:
openssl rand -base64 32
```

### Шаг 6: Деплой!

1. Нажмите **"Deploy"** в Vercel
2. Ждите 2-3 минуты
3. Получите ссылку на ваше приложение!

## 🎉 Готово!

Ваше приложение будет доступно по адресу:
**https://your-app-name.vercel.app**

## 🔧 Автоматические обновления

Теперь при каждом push в GitHub:
1. Vercel автоматически пересобирает приложение
2. Применяет миграции базы данных
3. Деплоит новую версию

## 📊 Мониторинг

- **Vercel Dashboard** - логи, аналитика, производительность
- **Neon Console** - мониторинг базы данных
- **GitHub Actions** - можно настроить CI/CD

## 🆘 Возможные проблемы:

### База данных не подключается:
- Проверьте DATABASE_URL в переменных окружения
- Убедитесь, что Neon база активна

### Ошибки при сборке:
- Проверьте логи в Vercel Dashboard
- Убедитесь, что все зависимости установлены

### OpenRouter API не работает:
- Проверьте OPENROUTER_API_KEY
- Убедитесь, что ключ активен

## 💰 Лимиты бесплатных планов:

### Vercel Free:
- 100GB bandwidth/месяц
- 100 deployments/день
- Serverless functions: 100GB-hours

### Neon Free:
- 500MB storage
- 1 database
- 1 compute unit

**Этого хватит для тестирования и демонстрации!**

## 🚀 Альтернативные варианты:

1. **Railway** - простой деплой с PostgreSQL
2. **Render** - бесплатный план с базой данных
3. **Supabase** - PostgreSQL + Auth из коробки
4. **PlanetScale** - MySQL serverless база

**Но Vercel + Neon - самый быстрый и надежный вариант! 🎯**