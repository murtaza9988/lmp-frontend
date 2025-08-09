'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Globe, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Globe className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl text-sm transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
          
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-xl text-sm transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-xl text-sm transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 