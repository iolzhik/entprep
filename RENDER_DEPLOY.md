# 🚀 Деплой ENT Prep на Render.com

Render.com - отличная бесплатная альтернатива с PostgreSQL!

## 🎯 Почему Render?

✅ **Полностью бесплатный план** - 0$ в месяц  
✅ **Бесплатная PostgreSQL** - 1GB бесплатно  
✅ **Простой деплой** - подключаете GitHub и готово  
✅ **Автоматические переменные** - DATABASE_URL создается сам  
✅ **SSL сертификаты** - HTTPS из коробки  

## 📋 Пошаговый деплой:

### 1. 🚀 Регистрация на Render

1. Перейдите на **https://render.com**
2. Нажмите **"Get Started for Free"**
3. Войдите через **GitHub**

### 2. 🗄️ Создание PostgreSQL базы данных

1. В Dashboard нажмите **"New +"**
2. Выберите **"PostgreSQL"**
3. Настройки:
   - **Name**: `ent-prep-db`
   - **Database**: `entprep`
   - **User**: `entprep_user`
   - **Region**: Frankfurt (ближайший к вам)
   - **Plan**: **Free** (1GB, достаточно для проекта)
4. Нажмите **"Create Database"**
5. **Скопируйте External Database URL** - это ваш DATABASE_URL!

### 3. 📊 Создание Web Service

1. Нажмите **"New +"** → **"Web Service"**
2. Выберите **"Build and deploy from a Git repository"**
3. Подключите GitHub и выберите **"iolzhik/entprep"**
4. Настройки:
   - **Name**: `ent-prep-app`
   - **Region**: Frankfurt
   - **Branch**: `master`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: **Free** (512MB RAM, достаточно)

### 4. ⚙️ Настройка переменных окружения

В разделе **"Environment"** добавьте переменные:

```env
DATABASE_URL=postgresql://entprep_user:password@hostname/entprep
JWT_SECRET=B83CLuQ0OrOhjkZ1vUeqtWIQjes1nPew1C9bDGWchTs=
JWT_REFRESH_SECRET=SxTEKMkeDjqfVHEgpUKtCF7Sn4TUVKh9Xuo55a7eHmw=
OPENROUTER_API_KEY=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
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=BqaVTkaaMrJ3X5CD8xTaBuF0d2n3Zw2PJ3hWgEu3xWg=
NODE_ENV=production
```

**DATABASE_URL** скопируйте из настроек PostgreSQL базы!

### 5. 🎯 Деплой!

1. Нажмите **"Create Web Service"**
2. Render автоматически:
   - ✅ Установит зависимости
   - ✅ Сгенерирует Prisma клиент
   - ✅ Создаст таблицы в PostgreSQL
   - ✅ Заполнит базу тестовыми данными
   - ✅ Соберет Next.js приложение
   - ✅ Задеплоит на домен

### 6. 🔗 Обновите NEXTAUTH_URL

1. После деплоя скопируйте URL (например: `https://ent-prep-app.onrender.com`)
2. Обновите переменную `NEXTAUTH_URL` в настройках
3. Render автоматически пересоберет приложение

## 🎉 Готово!

Ваше приложение будет доступно по адресу:
**https://your-app-name.onrender.com**

## 💰 Бесплатный план включает:

- ✅ **512MB RAM** для приложения
- ✅ **1GB PostgreSQL** база данных
- ✅ **100GB bandwidth** в месяц
- ✅ **SSL сертификаты** автоматически
- ✅ **Custom domains** (можете добавить свой домен)

**Полностью бесплатно! 🎉**

## ⚠️ Ограничения бесплатного плана:

- **Sleep mode** - приложение засыпает через 15 минут неактивности
- **Cold start** - первый запрос может быть медленным (30 сек)
- **1GB база данных** - достаточно для тысяч пользователей

Для учебного проекта это идеально!

## 🔄 Автоматические обновления:

При каждом push в GitHub:
1. Render автоматически пересобирает приложение
2. Применяет изменения в базе данных
3. Деплоит новую версию

**Время деплоя: ~5 минут! 🚀**

## 🆘 Если что-то не работает:

### База данных не подключается:
- Проверьте DATABASE_URL в переменных окружения
- Убедитесь, что PostgreSQL база создана и активна

### Ошибки при сборке:
- Проверьте логи в Render Dashboard → Logs
- Убедитесь, что все переменные окружения добавлены

### Приложение не запускается:
- Проверьте Start Command: `npm start`
- Убедитесь, что Build Command выполнился успешно

## 🎯 Преимущества Render:

✅ **Полностью бесплатный** - 0$ в месяц  
✅ **Простая настройка** - меньше шагов чем Vercel  
✅ **Встроенная PostgreSQL** - не нужен отдельный сервис  
✅ **Автоматический SSL** - HTTPS из коробки  
✅ **Хорошие логи** - легко отлаживать проблемы  

**Render идеально подходит для учебных проектов! 🎉**