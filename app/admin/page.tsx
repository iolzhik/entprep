'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Save, Trash2, BookOpen } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'

interface Subject {
  id: string
  name: string
  icon: string
  color: string
  questionCount: number
}

interface Question {
  id?: string
  questionText: string
  options: string[]
  correctOption: number
  explanation: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export default function AdminPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState<Question>({
    questionText: '',
    options: ['', '', '', ''],
    correctOption: 0,
    explanation: '', // Будет генерироваться ИИ
    topic: '',
    difficulty: 'medium'
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects')
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const fetchQuestions = async (subjectId: string) => {
    try {
      const response = await fetch(`/api/questions/${subjectId}`)
      const data = await response.json()
      setQuestions(data)
    } catch (error) {
      console.error('Error fetching questions:', error)
      setQuestions([])
    }
  }

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId)
    if (subjectId) {
      fetchQuestions(subjectId)
    } else {
      setQuestions([])
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options]
    newOptions[index] = value
    setNewQuestion({ ...newQuestion, options: newOptions })
  }

  const addQuestion = async () => {
    // Валидация
    if (!selectedSubject) {
      alert('Выберите предмет')
      return
    }
    
    if (!newQuestion.questionText.trim()) {
      alert('Введите текст вопроса')
      return
    }
    
    if (newQuestion.options.some(option => !option.trim())) {
      alert('Заполните все варианты ответов')
      return
    }
    
    if (!newQuestion.topic.trim()) {
      alert('Укажите тему вопроса')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newQuestion,
          subjectId: selectedSubject
        })
      })

      if (response.ok) {
        // Сброс формы
        setNewQuestion({
          questionText: '',
          options: ['', '', '', ''],
          correctOption: 0,
          explanation: '', // Будет генерироваться ИИ
          topic: '',
          difficulty: 'medium'
        })
        // Обновляем список вопросов
        fetchQuestions(selectedSubject)
        fetchSubjects() // Обновляем счетчики
        alert('Вопрос добавлен успешно!')
      } else {
        alert('Ошибка при добавлении вопроса')
      }
    } catch (error) {
      console.error('Error adding question:', error)
      alert('Ошибка при добавлении вопроса')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Удалить этот вопрос?')) return

    try {
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchQuestions(selectedSubject)
        fetchSubjects()
        alert('Вопрос удален')
      }
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Админ-панель 🛠️
          </h1>
          <p className="text-gray-600">
            Управление вопросами для тестирования ЕНТ
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Выбор предмета */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Предметы</CardTitle>
                <CardDescription>Выберите предмет для управления вопросами</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectChange(subject.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedSubject === subject.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{subject.icon}</span>
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <Badge variant="outline">{subject.questionCount}</Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Форма добавления вопроса */}
          <div className="lg:col-span-2">
            {selectedSubject ? (
              <Card>
                <CardHeader>
                  <CardTitle>Добавить новый вопрос</CardTitle>
                  <CardDescription>
                    Заполните все поля для создания нового вопроса
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Текст вопроса</label>
                    <Input
                      value={newQuestion.questionText}
                      onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                      placeholder="Введите текст вопроса..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Варианты ответов</label>
                    <div className="space-y-2">
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Вариант ${String.fromCharCode(65 + index)}`}
                          />
                          <input
                            type="radio"
                            name="correctOption"
                            checked={newQuestion.correctOption === index}
                            onChange={() => setNewQuestion({ ...newQuestion, correctOption: index })}
                            className="w-4 h-4"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Отметьте правильный ответ</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Тема</label>
                      <Input
                        value={newQuestion.topic}
                        onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                        placeholder="Например: Алгебра"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Сложность</label>
                      <select
                        value={newQuestion.difficulty}
                        onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="easy">Легкий</option>
                        <option value="medium">Средний</option>
                        <option value="hard">Сложный</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-600">🤖</span>
                      <span className="text-sm font-medium text-blue-800">Объяснение от ИИ</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Объяснение правильного ответа будет автоматически сгенерировано ИИ на основе вопроса, темы и правильного ответа.
                    </p>
                  </div>

                  <Button
                    onClick={addQuestion}
                    disabled={
                      isLoading || 
                      !newQuestion.questionText.trim() || 
                      !newQuestion.topic.trim() ||
                      newQuestion.options.some(option => !option.trim())
                    }
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Генерируем объяснение и добавляем...' : 'Добавить вопрос (с ИИ объяснением)'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Выберите предмет для добавления вопросов</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Список существующих вопросов */}
        {selectedSubject && questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Существующие вопросы ({questions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">
                          {index + 1}. {question.questionText}
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQuestion(question.id!)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded ${
                              optIndex === question.correctOption
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100'
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Тема: {question.topic}</span>
                        <span>Сложность: {question.difficulty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}