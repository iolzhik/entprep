@echo off
echo 🚀 Инициализация Git репозитория...

git init
git add .
git commit -m "🎉 Initial commit - ENT Prep App"

echo.
echo ✅ Git репозиторий инициализирован!
echo.
echo 📋 Следующие шаги:
echo 1. Создайте репозиторий на GitHub
echo 2. Выполните команды:
echo    git remote add origin https://github.com/YOUR_USERNAME/ent-prep-app.git
echo    git push -u origin main
echo.
echo 3. Затем деплойте на Vercel!

pause