import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/websites/:path*',
    '/backlinks/:path*',
    '/profile/:path*',
    '/analytics/:path*',
    '/orders/:path*',
    '/settings/:path*',
    '/buy-backlinks/:path*',
    '/sell-backlinks/:path*',
    '/admin/:path*',
  ],
}; 