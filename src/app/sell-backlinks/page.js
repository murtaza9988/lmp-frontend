'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  Plus, 
  Globe, 
  DollarSign, 
  TrendingUp,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function SellBacklinksPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [myWebsites, setMyWebsites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyWebsites = async () => {
      if (!session?.accessToken) return;

      try {
        setLoading(true);
        const response = await fetch('/api/websites/my', {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMyWebsites(data.results || data || []);
        } else {
          showToast('Failed to load your websites', 'error');
        }
      } catch (error) {
        showToast('Failed to load your websites', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchMyWebsites();
  }, [session, showToast]);

  const handleDeleteWebsite = async (websiteId) => {
    if (!confirm('Are you sure you want to delete this website?')) return;

    try {
      const response = await fetch(`/api/websites/my/${websiteId}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });

      if (response.ok) {
        showToast('Website deleted successfully!', 'success');
        setMyWebsites(myWebsites.filter(w => w.id !== websiteId));
      } else {
        showToast('Failed to delete website', 'error');
      }
    } catch (error) {
      showToast('Failed to delete website', 'error');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your websites...</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-4 lg:p-6 space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Sell Backlinks</h1>
            <p className="text-green-100">
              List your websites and start earning from backlink sales
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Listings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{myWebsites.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${myWebsites.reduce((sum, w) => sum + (w.total_revenue || 0), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sales</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {myWebsites.filter(w => w.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add New Website */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              <button
                onClick={() => router.push('/websites/create')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-xl text-sm transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Website
              </button>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                List your website to start selling backlinks
              </p>
            </div>
          </div>

          {/* My Websites */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Websites</h2>
            
            {myWebsites.length > 0 ? (
              <div className="space-y-4">
                {myWebsites.map((website) => (
                  <div
                    key={website.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{website.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{website.url}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ${website.price} per backlink
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            website.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : website.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {website.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/websites/${website.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/websites/${website.id}/edit`)}
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWebsite(website.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No websites listed yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start by adding your first website to sell backlinks
                </p>
                <button
                  onClick={() => router.push('/websites/create')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg text-sm transition-all duration-200 transform hover:scale-105 cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Website
                </button>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 