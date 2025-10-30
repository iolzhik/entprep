'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Trophy,
  Target,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { useTestStore } from '@/store/test'
import { useAuthStore } from '@/store/auth'
import { formatTime } from '@/lib/utils'
import Confetti from 'react-confetti'

interface Question {
  id: string
  questionText: string
  options: string[]
  correctOption: number
  explanation?: string
  topic?: string
}

export default function TestSubjectPage() {
  const params = useParams()
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const { currentTest, startTest, answerQuestion, nextQuestion, finishTest, resetTest } = useTestStore()
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [totalTimeLeft, setTotalTimeLeft] = useState(0) // Общее время теста
  const [timeLeft, setTimeLeft] = useState(60) // 60 секунд на вопрос
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentExplanation, setCurrentExplanation] = useState<string>('')
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false)

  const subjectId = params.subjectId as string

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('Fetching questions for subjectId:', subjectId)
        const response = await fetch(`/api/questions/${subjectId}`)
        const data = await response.json()
        
        console.log('Questions response:', response.status, data)
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка загрузки вопросов')
        }
        
        // Проверяем, есть ли вопросы
        if (!data || data.length === 0) {
          throw new Error('Для этого предмета пока нет вопросов')
        }
        
        // Получаем название предмета
        const subjectResponse = await fetch('/api/subjects')
        const subjects = await subjectResponse.json()
        const subject = subjects.find((s: any) => s.id === subjectId)
        const subjectName = subject?.name || 'Тест'
        
        console.log('Found subject:', subject, 'Questions:', data.length)
        
        // Получаем выбранное время из localStorage
        const selectedTime = localStorage.getItem('testTimeLimit')
        const timeLimit = selectedTime ? parseInt(selectedTime) : 7200 // По умолчанию 2 часа
        
        setQuestions(data)
        setTotalTimeLeft(timeLimit)
        startTest(subjectId, subjectName, data, timeLimit)
      } catch (error) {
        console.error('Error fetching questions:', error)
        console.log('Using fallback mock data')
        // Fallback к моковым данным если API не работает
        const mockQuestions: Question[] = [
          {
            id: '1',
            questionText: 'Чему равен корень из 144?',
            options: ['10', '12', '14', '16'],
            correctOption: 1,
            explanation: 'Корень из 144 равен 12, так как 12² = 144',
            topic: 'Арифметика',
          },
          {
            id: '2',
            questionText: 'Решите уравнение: 2x + 5 = 13',
            options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
            correctOption: 1,
            explanation: '2x + 5 = 13, 2x = 8, x = 4',
            topic: 'Алгебра',
          },
        ]
        
        const selectedTime = localStorage.getItem('testTimeLimit')
        const timeLimit = selectedTime ? parseInt(selectedTime) : 7200
        
        setQuestions(mockQuestions)
        setTotalTimeLeft(timeLimit)
        startTest(subjectId, 'Математика', mockQuestions, timeLimit)
        console.log('Started test with mock data')
      } finally {
        console.log('Setting isLoading to false')
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [subjectId, startTest])

  // Общий таймер теста
  useEffect(() => {
    if (!currentTest?.isActive) return

    const totalTimer = setInterval(() => {
      setTotalTimeLeft(prev => {
        if (prev <= 1) {
          // Время теста истекло - завершаем тест
          finishTest()
          setShowResults(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(totalTimer)
  }, [currentTest?.isActive, finishTest])

  // Таймер на вопрос
  useEffect(() => {
    if (!currentTest?.isActive || showExplanation) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentTest?.isActive, showExplanation])

  const handleTimeUp = () => {
    if (selectedOption === null) {
      // Автоматически выбираем неправильный ответ
      handleAnswerSelect(-1)
    }
  }

  const handleAnswerSelect = async (optionIndex: number) => {
    if (selectedOption !== null) return

    setSelectedOption(optionIndex)
    setIsLoadingExplanation(true)
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)
    
    if (currentTest) {
      const currentQuestion = currentTest.questions[currentTest.currentQuestionIndex]
      
      // Сначала сохраняем ответ
      answerQuestion(currentQuestion.id, optionIndex, timeSpent)
      
      // Отправляем ответ на сервер для получения объяснения от ИИ
      try {
        const response = await fetch('/api/test/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: currentQuestion.id,
            selectedOption: optionIndex,
            timeSpent
          }),
        })

        const data = await response.json()
        
        // Устанавливаем объяснение от ИИ
        setCurrentExplanation(data.explanation || currentQuestion.explanation || 'Объяснение недоступно')
        
      } catch (error) {
        console.error('Error getting explanation:', error)
        setCurrentExplanation(currentQuestion.explanation || 'Не удалось получить объяснение от ИИ')
      } finally {
        setIsLoadingExplanation(false)
        setShowExplanation(true)
      }
    }
  }

  const handleNextQuestion = () => {
    if (!currentTest) return

    if (currentTest.currentQuestionIndex < currentTest.questions.length - 1) {
      nextQuestion()
      setSelectedOption(null)
      setShowExplanation(false)
      setCurrentExplanation('')
      setIsLoadingExplanation(false)
      setTimeLeft(60)
      setQuestionStartTime(Date.now())
    } else {
      finishTest()
      setShowResults(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }

  const handleFinishTest = async () => {
    if (!currentTest) return

    try {
      // Сохраняем результаты теста
      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: currentTest.subjectId,
          answers: currentTest.answers
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Test results saved:', result)
        
        // Обновляем пользователя в store с новыми XP и уровнем
        if (result.newLevel && result.totalXp) {
          setUser({
            ...user!,
            xp: result.totalXp,
            level: result.newLevel
          })
        }
      }
    } catch (error) {
      console.error('Error saving test results:', error)
    }

    resetTest()
    router.push('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p>Загрузка вопросов...</p>
          </div>
        </div>
      </div>
    )
  }

  console.log('Component render - currentTest:', currentTest, 'isLoading:', isLoading)

  if (!currentTest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p>Ошибка загрузки теста</p>
            <Button onClick={() => router.push('/test')} className="mt-4">
              Вернуться к выбору тестов
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    const correctAnswers = currentTest.answers.filter(a => a.isCorrect).length
    const accuracy = Math.round((correctAnswers / currentTest.answers.length) * 100)
    const xpEarned = correctAnswers * 10

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {showConfetti && <Confetti />}
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Тест завершен!
            </h1>
            <p className="text-gray-600">
              Отличная работа! Вот ваши результаты:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="text-center">
                <Trophy className="w-8 h-8 text-warning-600 mx-auto mb-2" />
                <CardTitle>Точность</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-primary-600">{accuracy}%</div>
                <p className="text-sm text-gray-500">
                  {correctAnswers} из {currentTest.answers.length} правильных
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Target className="w-8 h-8 text-success-600 mx-auto mb-2" />
                <CardTitle>Опыт</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-success-600">+{xpEarned}</div>
                <p className="text-sm text-gray-500">XP заработано</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Clock className="w-8 h-8 text-secondary-600 mx-auto mb-2" />
                <CardTitle>Время</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-secondary-600">
                  {formatTime(Math.round((Date.now() - currentTest.startTime) / 1000))}
                </div>
                <p className="text-sm text-gray-500">потрачено времени</p>
                <div className="text-sm text-gray-400 mt-1">
                  Лимит: {formatTime(currentTest.timeLimit)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Детальные результаты</CardTitle>
              <CardDescription>
                Разбор ваших ответов по вопросам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentTest.questions.map((question, index) => {
                  const answer = currentTest.answers[index]
                  const isCorrect = answer?.isCorrect
                  
                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">
                          {index + 1}. {question.questionText}
                        </h4>
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-error-600 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Правильный ответ:</span> {question.options[question.correctOption]}
                      </div>
                      
                      {answer && answer.selectedOption !== question.correctOption && (
                        <div className="text-sm text-error-600 mb-2">
                          <span className="font-medium">Ваш ответ:</span> {question.options[answer.selectedOption] || 'Не отвечено'}
                        </div>
                      )}
                      
                      {question.explanation && (
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          <span className="font-medium">Объяснение:</span> {question.explanation}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={handleFinishTest} size="lg">
              Вернуться в личный кабинет
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const currentQuestion = currentTest.questions[currentTest.currentQuestionIndex]
  const progress = ((currentTest.currentQuestionIndex + 1) / currentTest.questions.length) * 100

  // Проверяем, что вопрос загружен
  if (!currentQuestion || currentTest.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p>Загрузка вопроса...</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Вопросы скоро появятся!</h2>
                <p className="text-gray-600 mb-6">Для этого предмета пока нет доступных вопросов.</p>
                <div className="space-y-2">
                  <Button onClick={() => router.push('/test/cmhbnlwm00005hvucgg3hxrwv')} className="mr-2">
                    Попробовать Математику
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/test')}>
                    Вернуться к выбору
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentTest.subjectName}
              </h1>
              <p className="text-gray-600">
                Вопрос {currentTest.currentQuestionIndex + 1} из {currentTest.questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${totalTimeLeft <= 300 ? 'text-error-600' : 'text-primary-600'}`}>
                {formatTime(totalTimeLeft)}
              </div>
              <p className="text-sm text-gray-500">общее время теста</p>
              <div className={`text-sm font-medium mt-1 ${timeLeft <= 10 ? 'text-error-600' : 'text-gray-600'}`}>
                Вопрос: {formatTime(timeLeft)}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTest.currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {currentQuestion.questionText}
                  </CardTitle>
                  {currentQuestion.topic && (
                    <Badge variant="outline">{currentQuestion.topic}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    let buttonClass = 'w-full p-4 text-left border-2 rounded-lg transition-all hover:border-primary-300'
                    
                    if (selectedOption !== null) {
                      if (index === currentQuestion.correctOption) {
                        buttonClass += ' border-success-500 bg-success-50 text-success-800'
                      } else if (index === selectedOption && index !== currentQuestion.correctOption) {
                        buttonClass += ' border-error-500 bg-error-50 text-error-800'
                      } else {
                        buttonClass += ' border-gray-200 bg-gray-50 text-gray-500'
                      }
                    } else {
                      buttonClass += ' border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedOption !== null}
                        className={buttonClass}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <h4 className="font-medium text-blue-900 mb-2">
                      {selectedOption === currentQuestion.correctOption ? '🎉' : '💡'} 
                      {selectedOption === currentQuestion.correctOption ? ' Отлично!' : ' Объяснение от ИИ-репетитора:'}
                    </h4>
                    {isLoadingExplanation ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-blue-700">ИИ-репетитор готовит объяснение...</span>
                      </div>
                    ) : (
                      <div className="text-blue-800 whitespace-pre-wrap">{currentExplanation}</div>
                    )}
                  </motion.div>
                )}

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex justify-between"
                  >
                    <Button
                      variant="outline"
                      onClick={() => router.push('/test')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Выйти из теста
                    </Button>
                    
                    <Button onClick={handleNextQuestion}>
                      {currentTest.currentQuestionIndex < currentTest.questions.length - 1 ? (
                        <>
                          Следующий вопрос
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Завершить тест
                          <Trophy className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}