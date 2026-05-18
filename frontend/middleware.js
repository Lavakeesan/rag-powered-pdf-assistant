import { NextResponse } from 'next/server';

export async function middleware(request) {
  const response = NextResponse.next();

  // Simple cookie-based authentication check
  const userCookie = request.cookies.get('user');
  const user = userCookie ? userCookie.value : null;

  const protectedPaths = ['/dashboard', '/chat', '/upload', '/documents', '/history', '/profile'];
  const authPaths = ['/login', '/register'];

  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Protect dashboard routes
  if (!user && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if logged in and trying to access login/register
  if (user && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
