#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...')
    
    // Push schema to database
    console.log('📊 Creating database schema...')
    
    // Check if tables exist by trying to count users
    try {
      await prisma.user.count()
      console.log('✅ Database schema already exists')
    } catch (error) {
      console.log('❌ Database schema not found, please run: npx prisma db push')
      process.exit(1)
    }
    
    // Check if we have any data
    const userCount = await prisma.user.count()
    const subjectCount = await prisma.subject.count()
    const questionCount = await prisma.question.count()
    
    console.log(`📊 Current data: ${userCount} users, ${subjectCount} subjects, ${questionCount} questions`)
    
    if (subjectCount === 0) {
      console.log('🌱 Seeding database with initial data...')
      
      // Import and run seed
      const { seedDatabase } = await import('../prisma/seed')
      await seedDatabase()
      
      console.log('✅ Database seeded successfully!')
    } else {
      console.log('✅ Database already has data')
    }
    
    console.log('🎉 Database initialization complete!')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

initDatabase()