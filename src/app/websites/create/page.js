'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe, ArrowLeft } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

const websiteSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  url: z.string().url('Please enter a valid URL'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price must be at least $1'),
  category: z.string().min(1, 'Please select a category'),
});

export default function CreateWebsitePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(websiteSchema),
  });

  const onSubmit = async (data) => {
    if (!session?.accessToken) return;

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/websites/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showToast('Website created successfully!', 'success');
        router.push('/sell-backlinks');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to create website', 'error');
      }
    } catch (error) {
      showToast('Failed to create website', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-4 lg:p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Website</h1>
              <p className="text-gray-600 dark:text-gray-400">List your website to start selling backlinks</p>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Website Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    {...register('title')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your website title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Website URL */}
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website URL *
                  </label>
                  <input
                    id="url"
                    type="url"
                    {...register('url')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com"
                  />
                  {errors.url && (
                    <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    {...register('category')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
                  >
                    <option value="">Select a category</option>
                    <option value="technology">Technology</option>
                    <option value="health">Health & Fitness</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price per Backlink ($) *
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="1"
                    {...register('price', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="25.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Describe your website and the type of backlinks you offer..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Website'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 