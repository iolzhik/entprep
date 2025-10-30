// Генератор секретных ключей для Vercel
const crypto = require('crypto');

console.log('🔐 Секретные ключи для Vercel:');
console.log('');
console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('JWT_REFRESH_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('NEXTAUTH_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('');
console.log('✅ Скопируйте эти ключи в настройки Vercel!');