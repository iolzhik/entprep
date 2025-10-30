'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Target, Zap, Crown, Medal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Navbar } from '@/components/layout/navbar'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useAuthStore } from '@/store/auth'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: 'general' | 'subject' | 'streak' | 'special'
  xpRequired: number
  isEarned: boolean
  earnedAt?: string
  progress?: number
}

interface UserStats {
  totalXp: number
  level: number
  testsCompleted: number
  correctAnswers: number
  currentStreak: number
  longestStreak: number
  subjectMastery: Record<string, number>
}

export default function AchievementsPage() {
  const { user } = useAuthStore()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements')
        if (response.ok) {
          const data = await response.json()
          setAchievements(data.achievements)
          setUserStats(data.userStats)
        } else {
          throw new Error('Failed to fetch achievements')
        }
      } catch (error) {
        console.error('Error fetching achievements:', error)
        // Fallback к пустым данным
        setAchievements([])
        setUserStats({
          totalXp: user?.xp || 0,
          level: user?.level || 1,
          testsCompleted: 0,
          correctAnswers: 0,
          currentStreak: 0,
          longestStreak: 0,
          subjectMastery: {}
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAchievements()
  }, [user])

  const categories = [
    { id: 'all', name: 'Все', icon: Trophy },
    { id: 'general', name: 'Общие', icon: Star },
    { id: 'subject', name: 'Предметы', icon: Target },
    { id: 'streak', name: 'Серии', icon: Zap },
    { id: 'special', name: 'Особые', icon: Crown },
  ]

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory)

  const earnedCount = achievements.filter(a => a.isEarned).length
  const totalCount = achievements.length

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Достижения 🏆
          </h1>
          <p className="text-gray-600">
            Отслеживайте свой прогресс и получайте награды за успехи в обучении
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Получено наград</CardTitle>
                <Medal className="h-4 w-4 text-warning-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{earnedCount}</div>
                <p className="text-xs text-gray-500">из {totalCount} доступных</p>
                <Progress value={(earnedCount / totalCount) * 100} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Текущая серия</CardTitle>
                <Zap className="h-4 w-4 text-error-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.currentStreak || 0}</div>
                <p className="text-xs text-gray-500">дней подряд</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Лучшая серия</CardTitle>
                <Crown className="h-4 w-4 text-secondary-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.longestStreak || 0}</div>
                <p className="text-xs text-gray-500">дней подряд</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Тестов пройдено</CardTitle>
                <Target className="h-4 w-4 text-success-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.testsCompleted || 0}</div>
                <p className="text-xs text-gray-500">всего тестов</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card className={`h-full ${achievement.isEarned ? 'ring-2 ring-warning-200 bg-gradient-to-br from-warning-50 to-white' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`text-3xl ${achievement.isEarned ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    {achievement.isEarned ? (
                      <Badge variant="success">Получено</Badge>
                    ) : (
                      <Badge variant="outline">
                        {achievement.progress ? `${achievement.progress}%` : 'Заблокировано'}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className={achievement.isEarned ? 'text-warning-800' : 'text-gray-600'}>
                    {achievement.name}
                  </CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Требуется XP:</span>
                      <span className="font-medium">{achievement.xpRequired}</span>
                    </div>
                    
                    {!achievement.isEarned && achievement.progress && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Прогресс</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    )}
                    
                    {achievement.isEarned && achievement.earnedAt && (
                      <div className="text-sm text-gray-500">
                        Получено: {new Date(achievement.earnedAt).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Subject Mastery */}
        {userStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>Мастерство по предметам</CardTitle>
                <CardDescription>
                  Ваш прогресс в изучении различных предметов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(userStats.subjectMastery).map(([subject, mastery]) => (
                    <div key={subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject}</span>
                        <span className="text-sm text-gray-500">{mastery}%</span>
                      </div>
                      <Progress 
                        value={mastery} 
                        className="h-3"
                        color={mastery >= 80 ? 'success' : mastery >= 60 ? 'warning' : 'error'}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
    </AuthGuard>
  )
}