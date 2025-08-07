'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Globe, 
  TrendingUp, 
  DollarSign, 
  Star,
  Eye,
  ShoppingCart,
  ChevronDown,
  X
} from 'lucide-react';
import { backlinksAPI } from '@/lib/api';

export default function BacklinksPage() {
  const router = useRouter();
  const [backlinks, setBacklinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    min_da: '',
    max_da: '',
    min_price: '',
    max_price: '',
    content_type: '',
    placement_position: '',
    is_dofollow: '',
    category: '',
    niche: '',
    language: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('domain_authority');

  useEffect(() => {
    loadBacklinks();
  }, [filters, sortBy]);

  const loadBacklinks = async () => {
    try {
      setLoading(true);
      const params = { ...filters, ordering: `-${sortBy}` };
      const response = await backlinksAPI.search(params);
      setBacklinks(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading backlinks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      min_da: '',
      max_da: '',
      min_price: '',
      max_price: '',
      content_type: '',
      placement_position: '',
      is_dofollow: '',
      category: '',
      niche: '',
      language: '',
      search: ''
    });
  };

  const handlePurchase = (backlinkId) => {
    router.push(`/backlinks/${backlinkId}/purchase`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Backlinks</h1>
              <p className="text-gray-600 mt-1">Find high-quality backlinks to boost your SEO</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary"
            >
              My Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search backlinks, websites, or keywords..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="domain_authority">Domain Authority</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="created_at">Newest First</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Domain Authority
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.min_da}
                      onChange={(e) => handleFilterChange('min_da', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.max_da}
                      onChange={(e) => handleFilterChange('max_da', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min $"
                      value={filters.min_price}
                      onChange={(e) => handleFilterChange('min_price', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max $"
                      value={filters.max_price}
                      onChange={(e) => handleFilterChange('max_price', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type
                  </label>
                  <select
                    value={filters.content_type}
                    onChange={(e) => handleFilterChange('content_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="article">Article</option>
                    <option value="blog_post">Blog Post</option>
                    <option value="resource_page">Resource Page</option>
                    <option value="landing_page">Landing Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Type
                  </label>
                  <select
                    value={filters.is_dofollow}
                    onChange={(e) => handleFilterChange('is_dofollow', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Links</option>
                    <option value="true">DoFollow</option>
                    <option value="false">NoFollow</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={clearFilters}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear all filters
                </button>
                <span className="text-sm text-gray-500">
                  {backlinks.length} backlinks found
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Backlinks Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading backlinks...</p>
            </div>
          </div>
        ) : backlinks.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No backlinks found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {backlinks.map((backlink) => (
              <div key={backlink.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Website Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Globe className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate">
                          {backlink.website?.domain}
                        </h3>
                        <p className="text-sm text-gray-500">
                          DA: {backlink.domain_authority}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${backlink.price}
                      </div>
                      <div className="text-sm text-gray-500">
                        {backlink.is_dofollow ? 'DoFollow' : 'NoFollow'}
                      </div>
                    </div>
                  </div>

                  {/* Target URL */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Target URL:</p>
                    <p className="text-sm text-gray-900 truncate">
                      {backlink.target_url}
                    </p>
                  </div>

                  {/* Anchor Text */}
                  {backlink.anchor_text && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Anchor Text:</p>
                      <p className="text-sm text-gray-900">
                        "{backlink.anchor_text}"
                      </p>
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-sm font-medium text-gray-900">
                        {backlink.domain_authority}
                      </div>
                      <div className="text-xs text-gray-500">Domain Authority</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-sm font-medium text-gray-900">
                        {backlink.page_authority}
                      </div>
                      <div className="text-xs text-gray-500">Page Authority</div>
                    </div>
                  </div>

                  {/* Content Type */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {backlink.content_type}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/backlinks/${backlink.id}`)}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => handlePurchase(backlink.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Purchase
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 