// User types
export interface User {
  id: string
  email: string
  name: string
  xp: number
  level: number
  createdAt: string
}

// Subject types
export interface Subject {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

// Question types
export interface Question {
  id: string
  subjectId: string
  questionText: string
  options: string[]
  correctOption: number
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic?: string
}

// Test types
export interface TestAnswer {
  questionId: string
  selectedOption: number
  isCorrect: boolean
  timeSpent: number
}

export interface TestResult {
  subjectId: string
  subjectName: string
  totalQuestions: number
  correctAnswers: number
  totalTime: number
  accuracy: number
  xpEarned: number
  answers: TestAnswer[]
}

// Badge types
export interface Badge {
  id: string
  name: string
  description: string
  xpRequired: number
  icon: string
  color: string
  category: 'general' | 'subject' | 'achievement'
}

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  earnedAt: string
  badge: Badge
}

// AI Chat types
export interface AiChatMessage {
  id: string
  userId: string
  subject?: string
  question: string
  answer: string
  isFavorite: boolean
  createdAt: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Statistics types
export interface UserStats {
  totalTests: number
  correctAnswers: number
  totalAnswers: number
  averageScore: number
  currentStreak: number
  longestStreak: number
  subjectProgress: SubjectProgress[]
  recentBadges: Badge[]
}

export interface SubjectProgress {
  subjectId: string
  subjectName: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  lastTestDate?: string
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Component props types
export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export interface CardProps {
  className?: string
  children: React.ReactNode
}

// Store types
export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export interface TestState {
  currentTest: {
    subjectId: string
    subjectName: string
    questions: Question[]
    currentQuestionIndex: number
    answers: TestAnswer[]
    startTime: number
    isActive: boolean
  } | null
  startTest: (subjectId: string, subjectName: string, questions: Question[]) => void
  answerQuestion: (questionId: string, selectedOption: number, timeSpent: number) => void
  nextQuestion: () => void
  finishTest: () => void
  resetTest: () => void
}