'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TimerOption {
  minutes: number
  seconds: number
  label: string
  description: string
  recommended?: boolean
}

interface TimerSelectorProps {
  onSelect: (timeInSeconds: number) => void
  onCancel: () => void
}

const timerOptions: TimerOption[] = [
  {
    minutes: 60,
    seconds: 3600,
    label: '60 минут',
    description: 'Быстрый тест для повторения',
  },
  {
    minutes: 120,
    seconds: 7200,
    label: '120 минут',
    description: 'Стандартное время для подготовки',
    recommended: true,
  },
  {
    minutes: 180,
    seconds: 10800,
    label: '180 минут',
    description: 'Расширенное время для изучения',
  },
  {
    minutes: 240,
    seconds: 14400,
    label: '240 минут',
    description: 'Максимальное время для глубокого изучения',
  },
]

export function TimerSelector({ onSelect, onCancel }: TimerSelectorProps) {
  const [selectedTimer, setSelectedTimer] = useState<number>(7200) // По умолчанию 120 минут

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
            <CardTitle className="text-2xl">Выберите время для теста</CardTitle>
            <CardDescription>
              Установите лимит времени для прохождения тестирования
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timerOptions.map((option) => (
                <motion.div
                  key={option.seconds}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => setSelectedTimer(option.seconds)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left relative ${
                      selectedTimer === option.seconds
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.recommended && (
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-warning-500 text-white text-xs px-2 py-1 rounded-full">
                          Рекомендуется
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{option.label}</h3>
                      {selectedTimer === option.seconds && (
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">{option.description}</p>
                    
                    <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{option.minutes} минут = {Math.round(option.minutes / 60 * 100) / 100} часа</span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 mt-0.5">💡</div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Совет по выбору времени:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>60 минут</strong> - для быстрого повторения пройденного материала</li>
                    <li>• <strong>120 минут</strong> - оптимальное время для большинства тестов</li>
                    <li>• <strong>180-240 минут</strong> - для углубленного изучения сложных тем</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onCancel}>
                Отмена
              </Button>
              <Button onClick={() => onSelect(selectedTimer)}>
                Начать тест ({timerOptions.find(t => t.seconds === selectedTimer)?.label})
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}