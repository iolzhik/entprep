import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Маршруты, которые требуют аутентификации
const protectedRoutes = ['/dashboard', '/test', '/tutor', '/achievements']

// Маршруты для неаутентифицированных пользователей
const authRoutes = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Проверяем, является ли маршрут защищенным
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Проверяем, является ли маршрут аутентификационным
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Если пользователь пытается получить доступ к защищенному маршруту без токена
  // перенаправляем на страницу входа (клиентская проверка будет в компонентах)
  if (isProtectedRoute) {
    // Позволяем загрузиться странице, проверка токена будет на клиенте
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}