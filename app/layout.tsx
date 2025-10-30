import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'ENT Prep - Подготовка к ЕНТ',
  description: 'Интерактивная платформа для подготовки к единому национальному тестированию с ИИ-репетитором',
  keywords: 'ЕНТ, подготовка, тестирование, образование, ИИ репетитор',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}