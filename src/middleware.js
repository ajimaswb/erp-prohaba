import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'

const { auth } = NextAuth(authConfig)

// Specify which routes should be protected
const protectedRoutes = ['/dashboard', '/scurve', '/logistik', '/finance', '/hr', '/payroll', '/projects']

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Check if current route is protected (starts with any of the protected routes)
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Redirect to login if accessing a protected route without being logged in
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if logged in and trying to access login page or home page
  if (isLoggedIn && (pathname === '/login' || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
})

// Optional: Configure middleware to run on specific paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
