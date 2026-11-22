import { NextResponse } from 'next/server';
import { COOKIE, verifySession } from '@/lib/auth';

// every page and API is private, except the login page and the login API
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const session = await verifySession(req.cookies.get(COOKIE)?.value);

  if (pathname === '/login') {
    return session ? NextResponse.redirect(new URL('/dashboard', req.url)) : NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/auth/login' || session) return NextResponse.next();
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!session) return NextResponse.redirect(new URL('/login', req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|ico|webp)$).*)'],
};
