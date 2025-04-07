import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareClient({ req, res }) // ✅ no config needed
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (session) {
    const userId = session.user.id

    const { data: userData } = await supabase
      .from('User')
      .select('role')
      .eq('id', userId)
      .single()

    const role = userData?.role
    const pathname = req.nextUrl.pathname

    if (pathname.startsWith('/login')) {
      // prevent logged-in users from going to /login
      if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      if (role === 'SUPERADMIN') return NextResponse.redirect(new URL('/superadmin/dashboard', req.url))
      if (role === 'EMPLOYEE') return NextResponse.redirect(new URL('/employee/dashboard', req.url))
      if (role === 'SERVICE_PROVIDER') return NextResponse.redirect(new URL('/service/dashboard', req.url))
    }

    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (pathname.startsWith('/superadmin') && role !== 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (pathname.startsWith('/employee') && role !== 'EMPLOYEE') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (pathname.startsWith('/service') && role !== 'SERVICE_PROVIDER') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/superadmin/:path*',
    '/employee/:path*',
    '/service/:path*',
    '/login',
  ],
}
