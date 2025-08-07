'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  AlertCircle
} from 'lucide-react';
import { backlinksAPI } from '@/lib/api';

export default function BacklinkDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [backlink, setBacklink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadBacklink();
    }
  }, [params.id]);

  const loadBacklink = async () => {
    try {
      setLoading(true);
      const response = await backlinksAPI.getById(params.id);
      setBacklink(response.data);
    } catch (error) {
      console.error('Error loading backlink:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      const response = await backlinksAPI.purchase(params.id, {
        target_url: backlink.target_url,
        anchor_text: backlink.anchor_text
      });
      
      if (response.data) {
        router.push(`/orders/${response.data.order.id}`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading backlink details...</p>
        </div>
      </div>
    );
  }

  if (!backlink) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Backlink not found</h3>
          <p className="text-gray-600">The backlink you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Backlink Details</h1>
                <p className="text-gray-600">High-quality backlink from {backlink.website?.domain}</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-secondary"
            >
              My Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Backlink Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <Globe className="w-12 h-12 text-blue-600 mr-4" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {backlink.website?.domain}
                    </h2>
                    <p className="text-gray-600">
                      {backlink.website?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    ${backlink.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    One-time purchase
                  </div>
                </div>
              </div>

              {/* Target URL */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Target URL</h3>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <ExternalLink className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900 break-all">{backlink.target_url}</span>
                </div>
              </div>

              {/* Anchor Text */}
              {backlink.anchor_text && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Anchor Text</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900 font-medium">"{backlink.anchor_text}"</span>
                  </div>
                </div>
              )}

              {/* Description */}
              {backlink.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{backlink.description}</p>
                </div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {backlink.domain_authority}
                  </div>
                  <div className="text-sm text-gray-600">Domain Authority</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {backlink.page_authority}
                  </div>
                  <div className="text-sm text-gray-600">Page Authority</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {backlink.trust_flow}
                  </div>
                  <div className="text-sm text-gray-600">Trust Flow</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {backlink.citation_flow}
                  </div>
                  <div className="text-sm text-gray-600">Citation Flow</div>
                </div>
              </div>

              {/* Link Attributes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Link Attributes</h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    backlink.is_dofollow 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {backlink.is_dofollow ? 'DoFollow' : 'NoFollow'}
                  </span>
                  {backlink.is_sponsored && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Shield className="w-4 h-4 mr-1" />
                      Sponsored
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {backlink.content_type}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {backlink.placement_position}
                  </span>
                </div>
              </div>

              {/* Purchase Button */}
              <div className="border-t pt-6">
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || backlink.status !== 'available'}
                  className="w-full btn-success py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing ? (
                    'Processing...'
                  ) : backlink.status !== 'available' ? (
                    'Not Available'
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Purchase for ${backlink.price}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Website Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Domain</p>
                  <p className="font-medium text-gray-900">{backlink.website?.domain}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{backlink.website?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-gray-900">{backlink.website?.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Niche</p>
                  <p className="font-medium text-gray-900">{backlink.website?.niche || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Language</p>
                  <p className="font-medium text-gray-900">{backlink.website?.language || 'English'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Traffic</p>
                  <p className="font-medium text-gray-900">
                    {backlink.website?.monthly_traffic?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{backlink.seller}</p>
                  <p className="text-sm text-gray-500">Verified Seller</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sales</span>
                  <span className="font-medium">{backlink.website?.total_backlinks_sold || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">
                      {backlink.website?.average_rating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Commission Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Backlink Price</span>
                  <span className="font-medium">${backlink.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">${backlink.commission_amount}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Seller Receives</span>
                    <span className="font-bold text-green-600">${backlink.seller_amount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Quality verified</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Secure payment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Money-back guarantee</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Live within 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 