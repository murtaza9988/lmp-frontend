'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  ArrowLeft, 
  Globe, 
  DollarSign, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function PurchasePage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [formData, setFormData] = useState({
    target_url: '',
    anchor_text: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && params.id) {
      loadWebsite();
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    
    if (!formData.target_url || !formData.anchor_text) {
      alert('Please fill in all required fields');
      return;
    }

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
          target_url: formData.target_url,
          anchor_text: formData.anchor_text
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
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Backlink</h1>
            <p className="text-gray-600 dark:text-gray-400">Complete your purchase for {website.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Purchase Form */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Backlink Details</h2>
              
              <form onSubmit={handlePurchase} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.target_url}
                    onChange={(e) => handleInputChange('target_url', e.target.value)}
                    placeholder="https://yourwebsite.com/page"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    The URL where you want the backlink to point to
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Anchor Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.anchor_text}
                    onChange={(e) => handleInputChange('anchor_text', e.target.value)}
                    placeholder="Your desired anchor text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    The text that will be used as the clickable link
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={purchasing}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {purchasing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Complete Purchase
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Globe className="w-8 h-8 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{website.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{website.url}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Backlink Price</span>
                    <span className="font-medium text-gray-900 dark:text-white">${website.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Platform Fee (10%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">${(website.price * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">Total</span>
                      <span className="font-bold text-green-600">${(website.price * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What&apos;s Included */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What&apos;s Included</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">High-quality {website.backlink_type} backlink</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Live within 7 days</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Money-back guarantee</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Quality verification</span>
                </div>
              </div>
            </div>

            {/* Website Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Website Information</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Domain Authority</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{website.domain_authority || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Page Authority</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{website.page_authority || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Organic Traffic</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{website.organic_traffic?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Referring Domains</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{website.referring_domains || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 