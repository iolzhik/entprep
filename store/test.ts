import { create } from 'zustand'

export interface Question {
  id: string
  questionText: string
  options: string[]
  correctOption: number
  explanation?: string
  topic?: string
}

export interface TestAnswer {
  questionId: string
  selectedOption: number
  isCorrect: boolean
  timeSpent: number
}

interface TestState {
  currentTest: {
    subjectId: string
    subjectName: string
    questions: Question[]
    currentQuestionIndex: number
    answers: TestAnswer[]
    startTime: number
    isActive: boolean
    timeLimit: number // в секундах
  } | null
  startTest: (subjectId: string, subjectName: string, questions: Question[], timeLimit: number) => void
  answerQuestion: (questionId: string, selectedOption: number, timeSpent: number) => void
  nextQuestion: () => void
  finishTest: () => void
  resetTest: () => void
}

export const useTestStore = create<TestState>((set, get) => ({
  currentTest: null,
  
  startTest: (subjectId, subjectName, questions, timeLimit) => {
    console.log('Starting test with:', { subjectId, subjectName, questionsCount: questions.length, timeLimit })
    set({
      currentTest: {
        subjectId,
        subjectName,
        questions,
        currentQuestionIndex: 0,
        answers: [],
        startTime: Date.now(),
        isActive: true,
        timeLimit,
      }
    })
  },
  
  answerQuestion: (questionId, selectedOption, timeSpent) => {
    const state = get()
    if (!state.currentTest) return
    
    const question = state.currentTest.questions.find(q => q.id === questionId)
    if (!question) return
    
    const isCorrect = selectedOption === question.correctOption
    const answer: TestAnswer = {
      questionId,
      selectedOption,
      isCorrect,
      timeSpent,
    }
    
    set({
      currentTest: {
        ...state.currentTest,
        answers: [...state.currentTest.answers, answer],
      }
    })
  },
  
  nextQuestion: () => {
    const state = get()
    if (!state.currentTest) return
    
    set({
      currentTest: {
        ...state.currentTest,
        currentQuestionIndex: state.currentTest.currentQuestionIndex + 1,
      }
    })
  },
  
  finishTest: () => {
    const state = get()
    if (!state.currentTest) return
    
    set({
      currentTest: {
        ...state.currentTest,
        isActive: false,
      }
    })
  },
  
  resetTest: () => {
    set({ currentTest: null })
  },
}))