'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/contexts/ToastContext';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  user_type: z.enum(['buyer', 'seller', 'both']),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ["password_confirm"],
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast, showLoading, dismissLoading } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      user_type: 'both',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    const loadingToast = showLoading('Creating your account...');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        dismissLoading(loadingToast);
        showToast('Account created successfully! Please sign in.', 'success');
        router.push('/login');
      } else {
        dismissLoading(loadingToast);
        showToast(result.error || 'Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      dismissLoading(loadingToast);
      showToast('An error occurred. Please try again.', 'error');
    }
    
    setIsLoading(false);
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the form if already authenticated
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-black to-gray-900/60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.10),transparent_60%)]"></div>

      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Glass effect card */}
          <div className="backdrop-blur-xl bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-700/50 p-6 relative overflow-hidden">
            {/* Card background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-400/5"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-400 text-xs font-medium backdrop-blur-sm">
                    🚀 Join LinkVault
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                  Create Account
                </h2>
                <p className="text-xs text-gray-400">
                  Start your SEO revolution today
                </p>
              </div>

              {/* Form */}
              <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                {/* Name fields in a row */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="first_name" className="block text-xs font-medium text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      autoComplete="given-name"
                      {...register('first_name')}
                      className="w-full px-3 py-2 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm"
                      placeholder="John"
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-xs text-red-400">{errors.first_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="last_name" className="block text-xs font-medium text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      autoComplete="family-name"
                      {...register('last_name')}
                      className="w-full px-3 py-2 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm"
                      placeholder="Doe"
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-xs text-red-400">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-xs font-medium text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    {...register('username')}
                    className="w-full px-3 py-2 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm"
                    placeholder="johndoe"
                  />
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className="w-full px-3 py-2 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Password fields in a row */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...register('password')}
                        className="w-full px-3 py-2 pr-10 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-400 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password_confirm" className="block text-xs font-medium text-gray-300 mb-1">
                      Confirm
                    </label>
                    <div className="relative">
                      <input
                        id="password_confirm"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...register('password_confirm')}
                        className="w-full px-3 py-2 pr-10 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-400 transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password_confirm && (
                      <p className="mt-1 text-xs text-red-400">{errors.password_confirm.message}</p>
                    )}
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <label htmlFor="user_type" className="block text-xs font-medium text-gray-300 mb-1">
                    Account Type
                  </label>
                  <select
                    id="user_type"
                    {...register('user_type')}
                    className="w-full px-3 py-2 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm"
                  >
                    <option value="both">Buyer & Seller</option>
                    <option value="buyer">Buyer Only</option>
                    <option value="seller">Seller Only</option>
                  </select>
                  {errors.user_type && (
                    <p className="mt-1 text-xs text-red-400">{errors.user_type.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-600 hover:via-emerald-500 hover:to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-emerald-500/40"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Back to home link */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-xs text-gray-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 