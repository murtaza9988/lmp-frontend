'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  ArrowLeft, 
  Globe, 
  TrendingUp, 
  DollarSign, 
  Star,
  ShoppingCart,
  Shield,
  ExternalLink,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Heart,
  HeartOff,
  Eye,
  Link as LinkIcon
} from 'lucide-react';

export default function BacklinkDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && params.id) {
      loadWebsite();
      checkFavoriteStatus();
    }
  }, [status, params.id]);

  const loadWebsite = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/websites/${params.id}/`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWebsite(data);
      } else {
        console.error('Failed to load website');
      }
    } catch (error) {
      console.error('Error loading website:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch('/api/backlinks/favorites/', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      });
      
      if (response.ok) {
        const favorites = await response.json();
        setIsFavorited(favorites.some(fav => fav.website === parseInt(params.id)));
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const response = await fetch(`/api/backlinks/favorites/toggle/${params.id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.favorited);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      const response = await fetch('/api/backlinks/orders/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({
          website: params.id,
          target_url: '',
          anchor_text: ''
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        router.push(`/orders/${data.id}`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const getBacklinkTypeColor = (type) => {
    const colors = {
      'dofollow': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'nofollow': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'sponsored': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'ugc': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return colors[type] || colors.dofollow;
  };

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (!website) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Backlink not found</h3>
            <p className="text-gray-600 dark:text-gray-400">The backlink you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Backlink Details</h1>
              <p className="text-gray-600 dark:text-gray-400">High-quality backlink from {website.url}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleFavorite}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              {isFavorited ? (
                <Heart className="w-5 h-5 text-red-500" />
              ) : (
                <HeartOff className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              My Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Backlink Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <Globe className="w-12 h-12 text-blue-600 mr-4" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {website.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {website.url}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    ${website.price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    One-time purchase
                  </div>
                </div>
              </div>

              {/* Description */}
              {website.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">{website.description}</p>
                </div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {website.domain_authority || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Domain Authority</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {website.page_authority || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Page Authority</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {website.organic_traffic?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Organic Traffic</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {website.referring_domains || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ref Domains</div>
                </div>
              </div>

              {/* Link Attributes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Link Attributes</h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBacklinkTypeColor(website.backlink_type)}`}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {website.backlink_type}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <Shield className="w-4 h-4 mr-1" />
                    Quality Verified
                  </span>
                </div>
              </div>

              {/* Purchase Button */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || website.status !== 'active'}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {purchasing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : website.status !== 'active' ? (
                    'Not Available'
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Purchase for ${website.price}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Website Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Website Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Website URL</p>
                  <a 
                    href={website.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 break-all"
                  >
                    {website.url}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Title</p>
                  <p className="font-medium text-gray-900 dark:text-white">{website.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Backlink Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{website.backlink_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    website.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {website.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Seller Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seller Information</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 dark:text-white">{website.seller_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Verified Seller</p>
                </div>
              </div>
            </div>

            {/* Pricing Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Backlink Price</span>
                  <span className="font-medium text-gray-900 dark:text-white">${website.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Platform Fee (10%)</span>
                  <span className="font-medium text-gray-900 dark:text-white">${(website.price * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-green-600">${(website.price * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Status</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Quality verified</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Secure payment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Money-back guarantee</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Live within 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 