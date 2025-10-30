'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  Heart,
  Trash2,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { useAuthStore } from '@/store/auth'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  subject?: string
  isFavorite?: boolean
}

const subjects = [
  { id: 'math', name: 'Математика', icon: '🧮', color: '#3b82f6' },
  { id: 'physics', name: 'Физика', icon: '⚡', color: '#10b981' },
  { id: 'chemistry', name: 'Химия', icon: '🧪', color: '#f59e0b' },
  { id: 'history', name: 'История', icon: '🏛️', color: '#8b5cf6' },
  { id: 'english', name: 'Английский', icon: '🇬🇧', color: '#ef4444' },
  { id: 'geography', name: 'География', icon: '🌍', color: '#06b6d4' },
]

const sampleQuestions = [
  'Объясни теорему Пифагора с примерами',
  'Как решать квадратные уравнения?',
  'Расскажи о законах Ньютона',
  'Что такое периодическая система элементов?',
  'Объясни причины Первой мировой войны',
  'Как правильно использовать времена в английском?'
]

export default function TutorPage() {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      subject: selectedSubject,
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/tutor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: inputValue,
          subject: subjects.find(s => s.id === selectedSubject)?.name || 'Общие вопросы',
        }),
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || 'Извините, не удалось получить ответ.',
        timestamp: new Date(),
        subject: selectedSubject,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте позже.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleFavorite = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isFavorite: !msg.isFavorite }
        : msg
    ))
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Subject Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Предметы</span>
                </CardTitle>
                <CardDescription>
                  Выберите предмет для более точных ответов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedSubject === '' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setSelectedSubject('')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Общие вопросы
                </Button>
                {subjects.map((subject) => (
                  <Button
                    key={subject.id}
                    variant={selectedSubject === subject.id ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedSubject(subject.id)}
                  >
                    <span className="mr-2">{subject.icon}</span>
                    {subject.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Sample Questions */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Примеры вопросов</CardTitle>
                <CardDescription>
                  Нажмите на вопрос, чтобы задать его
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {sampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-primary-600" />
                    <span>ИИ-Репетитор</span>
                  </CardTitle>
                  <CardDescription>
                    {selectedSubject 
                      ? `Помощь по предмету: ${subjects.find(s => s.id === selectedSubject)?.name}`
                      : 'Задавайте любые вопросы по подготовке к ЕНТ'
                    }
                  </CardDescription>
                </div>
                {messages.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearChat}
                    className="flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Очистить</span>
                  </Button>
                )}
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Добро пожаловать в ИИ-Репетитор!
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Я помогу вам с подготовкой к ЕНТ. Задавайте любые вопросы!
                      </p>
                      <Badge variant="secondary">
                        Выберите предмет слева для более точных ответов
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === 'user' 
                                ? 'bg-primary-600 text-white' 
                                : 'bg-secondary-600 text-white'
                            }`}>
                              {message.role === 'user' ? (
                                <User className="w-4 h-4" />
                              ) : (
                                <Bot className="w-4 h-4" />
                              )}
                            </div>
                            <div className={`rounded-lg p-3 ${
                              message.role === 'user'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="whitespace-pre-wrap">{message.content}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className={`text-xs ${
                                  message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                                }`}>
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                                {message.role === 'assistant' && (
                                  <button
                                    onClick={() => toggleFavorite(message.id)}
                                    className={`ml-2 ${
                                      message.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                                    }`}
                                  >
                                    <Heart className={`w-4 h-4 ${message.isFavorite ? 'fill-current' : ''}`} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-secondary-600 text-white flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Задайте вопрос по ЕНТ..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {selectedSubject && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {subjects.find(s => s.id === selectedSubject)?.icon} {subjects.find(s => s.id === selectedSubject)?.name}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}