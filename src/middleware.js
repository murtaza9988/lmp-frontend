import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
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
  ],
}; 