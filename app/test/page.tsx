'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Users, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { AuthGuard } from '@/components/auth/auth-guard'
import { TimerSelector } from '@/components/test/timer-selector'
import Link from 'next/link'

interface Subject {
  id: string
  name: string
  description: string
  icon: string
  color: string
  questionCount: number
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number
}

export default function TestPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showTimerSelector, setShowTimerSelector] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/subjects')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка загрузки предметов')
        }
        
        setSubjects(data)
      } catch (error) {
        console.error('Error fetching subjects:', error)
        // Fallback к моковым данным
        const mockSubjects: Subject[] = [
          {
            id: '1',
            name: 'Математика',
            description: 'Алгебра, геометрия, тригонометрия',
            icon: '🧮',
            color: '#3b82f6',
            questionCount: 5,
            difficulty: 'medium',
            estimatedTime: 10
          },
          {
            id: '2',
            name: 'Физика',
            description: 'Механика, термодинамика, электричество',
            icon: '⚡',
            color: '#10b981',
            questionCount: 4,
            difficulty: 'hard',
            estimatedTime: 8
          }
        ]
        setSubjects(mockSubjects)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success'
      case 'medium': return 'warning'
      case 'hard': return 'destructive'
      default: return 'default'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легкий'
      case 'medium': return 'Средний'
      case 'hard': return 'Сложный'
      default: return 'Неизвестно'
    }
  }

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject)
    setShowTimerSelector(true)
  }

  const handleTimerSelect = (timeInSeconds: number) => {
    if (selectedSubject) {
      // Сохраняем выбранное время в localStorage для использования в тесте
      localStorage.setItem('testTimeLimit', timeInSeconds.toString())
      router.push(`/test/${selectedSubject.id}`)
    }
  }

  const handleTimerCancel = () => {
    setShowTimerSelector(false)
    setSelectedSubject(null)
  }

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
            Тестирование ЕНТ 📚
          </h1>
          <p className="text-gray-600">
            Выберите предмет для прохождения тестирования. Каждый тест поможет вам оценить свои знания и подготовиться к экзамену.
          </p>
        </motion.div>

        {/* Test Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                <span>Как проходит тестирование</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Выберите предмет</h4>
                    <p className="text-sm text-gray-600">Выберите предмет из списка ниже</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Отвечайте на вопросы</h4>
                    <p className="text-sm text-gray-600">У вас есть ограниченное время на каждый вопрос</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Получите результат</h4>
                    <p className="text-sm text-gray-600">Увидите результаты и объяснения от ИИ</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl">{subject.icon}</div>
                    <Badge variant={getDifficultyColor(subject.difficulty) as any}>
                      {getDifficultyText(subject.difficulty)}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary-600 transition-colors">
                    {subject.name}
                  </CardTitle>
                  <CardDescription>{subject.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{subject.questionCount} вопросов</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{subject.estimatedTime} мин</span>
                    </div>
                  </div>
                  
                  {subject.questionCount > 0 ? (
                    <Button 
                      onClick={() => handleSubjectSelect(subject)}
                      className="w-full group-hover:bg-primary-700 transition-colors"
                    >
                      Начать тест
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      Скоро появится
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>💡 Советы для успешного прохождения тестов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Перед тестом:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Убедитесь, что у вас стабильное интернет-соединение</li>
                    <li>• Найдите тихое место для концентрации</li>
                    <li>• Приготовьте ручку и бумагу для заметок</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Во время теста:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Внимательно читайте каждый вопрос</li>
                    <li>• Не тратьте слишком много времени на один вопрос</li>
                    <li>• Используйте объяснения ИИ для изучения ошибок</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Timer Selector Modal */}
      {showTimerSelector && (
        <TimerSelector
          onSelect={handleTimerSelect}
          onCancel={handleTimerCancel}
        />
      )}
    </div>
    </AuthGuard>
  )
}