'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Trophy, 
  Target, 
  TrendingUp, 
  Brain,
  Play,
  Star,
  Clock,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useAuthStore } from '@/store/auth'
import { calculateLevel, getXpProgress } from '@/lib/utils'
import Link from 'next/link'

interface DashboardStats {
  totalTests: number
  correctAnswers: number
  totalAnswers: number
  averageScore: number
  currentStreak: number
  longestStreak: number
  currentXp?: number
  currentLevel?: number
  recentBadges: Array<{
    id: string
    name: string
    icon: string
    color: string
    earnedAt?: string
  }>
  subjectProgress: Array<{
    name: string
    progress: number
    color: string
  }>
}

const getSubjectColor = (subjectName: string): string => {
  const colors: Record<string, string> = {
    'Математика': '#3b82f6',
    'Физика': '#10b981',
    'Химия': '#f59e0b',
    'История Казахстана': '#8b5cf6',
    'Английский язык': '#ef4444',
    'География': '#06b6d4',
  }
  return colors[subjectName] || '#6b7280'
}

export default function DashboardPage() {
  const { user, setUser } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user/stats')
        if (response.ok) {
          const data = await response.json()
          
          // Обновляем пользователя в store если данные изменились
          if (data.currentXp !== user.xp || data.currentLevel !== user.level) {
            setUser({
              ...user,
              xp: data.currentXp,
              level: data.currentLevel
            })
          }
          
          // Преобразуем данные в формат компонента
          const transformedStats: DashboardStats = {
            totalTests: data.totalTests,
            correctAnswers: data.correctAnswers,
            totalAnswers: data.totalAnswers,
            averageScore: data.averageScore,
            currentStreak: data.currentStreak,
            longestStreak: data.longestStreak,
            currentXp: data.currentXp,
            currentLevel: data.currentLevel,
            recentBadges: data.recentBadges,
            subjectProgress: data.subjectProgress.map((subject: any) => ({
              name: subject.subjectName,
              progress: subject.accuracy,
              color: getSubjectColor(subject.subjectName)
            }))
          }
          
          setStats(transformedStats)
        } else {
          throw new Error('Failed to fetch stats')
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Fallback к моковым данным
        const mockStats: DashboardStats = {
          totalTests: 0,
          correctAnswers: 0,
          totalAnswers: 0,
          averageScore: 0,
          currentStreak: 0,
          longestStreak: 0,
          recentBadges: [],
          subjectProgress: []
        }
        setStats(mockStats)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
    
    // Обновляем статистику каждые 30 секунд
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
  }, [user, setUser])

  if (!user) {
    return <div>Loading...</div>
  }

  const accuracy = stats && stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0
  
  // Используем XP и уровень из статистики (более актуальные)
  const currentXp = stats?.currentXp || user.xp
  const currentLevel = stats?.currentLevel || user.level
  
  const xpProgress = getXpProgress(currentXp)
  const nextLevelXp = calculateLevel(currentXp) * 100

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Готовы продолжить подготовку к ЕНТ? Давайте посмотрим на ваш прогресс.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Уровень</CardTitle>
                <Trophy className="h-4 w-4 text-warning-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentLevel}</div>
                <div className="mt-2">
                  <Progress value={xpProgress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {currentXp} / {nextLevelXp} XP
                  </p>
                </div>
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
                <CardTitle className="text-sm font-medium">Точность</CardTitle>
                <Target className="h-4 w-4 text-success-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accuracy}%</div>
                <p className="text-xs text-gray-500">
                  {stats?.correctAnswers} из {stats?.totalAnswers} правильных
                </p>
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
                <CardTitle className="text-sm font-medium">Тестов пройдено</CardTitle>
                <BookOpen className="h-4 w-4 text-primary-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalTests || 0}</div>
                <p className="text-xs text-gray-500">
                  Средний балл: {stats?.averageScore || 0}%
                </p>
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
                <CardTitle className="text-sm font-medium">Текущая серия</CardTitle>
                <Zap className="h-4 w-4 text-warning-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.currentStreak || 0}</div>
                <p className="text-xs text-gray-500">
                  Лучшая: {stats?.longestStreak || 0} дней
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
                <CardDescription>
                  Выберите, что хотите сделать сегодня
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/test">
                  <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <Play className="w-6 h-6" />
                    <span>Начать тестирование</span>
                  </Button>
                </Link>
                
                <Link href="/tutor">
                  <Button variant="secondary" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <Brain className="w-6 h-6" />
                    <span>ИИ-Репетитор</span>
                  </Button>
                </Link>
                
                <Link href="/achievements">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <Trophy className="w-6 h-6" />
                    <span>Достижения</span>
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <TrendingUp className="w-6 h-6" />
                  <span>Статистика</span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Последние достижения</CardTitle>
                <CardDescription>
                  Ваши новые бейджи
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats?.recentBadges.map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3">
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-sm text-gray-500">Получен недавно</p>
                    </div>
                  </div>
                ))}
                {(!stats?.recentBadges || stats.recentBadges.length === 0) && (
                  <p className="text-gray-500 text-center py-4">
                    Пока нет новых достижений
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Subject Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Прогресс по предметам</CardTitle>
              <CardDescription>
                Ваши успехи в изучении различных предметов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.subjectProgress.map((subject) => (
                  <div key={subject.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{subject.name}</span>
                      <span className="text-sm text-gray-500">{subject.progress}%</span>
                    </div>
                    <Progress 
                      value={subject.progress} 
                      className="h-2"
                      color={subject.color === '#3b82f6' ? 'primary' : 'success'}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
    </AuthGuard>
  )
}