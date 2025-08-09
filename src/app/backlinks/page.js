'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Search, 
  Filter, 
  Heart, 
  HeartOff, 
  ExternalLink, 
  DollarSign,
  TrendingUp,
  Globe,
  Link as LinkIcon,
  Star,
  Eye
} from 'lucide-react';

export default function BuyBacklinksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    min_price: '',
    max_price: '',
    min_da: '',
    max_da: '',
    backlink_type: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchWebsites();
      fetchFavorites();
    }
  }, [status, currentPage, filters]);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        ...filters
      });
      
      const response = await fetch(`/api/websites/?${params}`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWebsites(data.results || data);
        setTotalPages(Math.ceil((data.count || data.length) / 20));
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/backlinks/favorites/', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(new Set(data.map(fav => fav.website)));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (websiteId) => {
    try {
      const response = await fetch(`/api/backlinks/favorites/toggle/${websiteId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.favorited) {
          setFavorites(prev => new Set([...prev, websiteId]));
        } else {
          setFavorites(prev => {
            const newSet = new Set(prev);
            newSet.delete(websiteId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      min_price: '',
      max_price: '',
      min_da: '',
      max_da: '',
      backlink_type: '',
    });
    setCurrentPage(1);
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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Buy Backlinks
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Browse and purchase high-quality backlinks from verified sellers
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button
              onClick={() => router.push('/backlinks/favorites')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search websites, titles, or descriptions..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Domain Authority
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min DA"
                    value={filters.min_da}
                    onChange={(e) => handleFilterChange('min_da', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max DA"
                    value={filters.max_da}
                    onChange={(e) => handleFilterChange('max_da', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Backlink Type
                </label>
                <select
                  value={filters.backlink_type}
                  onChange={(e) => handleFilterChange('backlink_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="dofollow">DoFollow</option>
                  <option value="nofollow">NoFollow</option>
                  <option value="sponsored">Sponsored</option>
                  <option value="ugc">UGC</option>
                </select>
              </div>
            </div>
          )}

          {/* Filter Actions */}
          <div className="flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Clear all filters
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {websites.length} results
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4">
            {websites.map((website) => (
              <div
                key={website.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {website.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBacklinkTypeColor(website.backlink_type)}`}>
                        {website.backlink_type}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {website.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        <span>DA: {website.domain_authority || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>PA: {website.page_authority || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>Traffic: {website.organic_traffic?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <LinkIcon className="w-4 h-4 mr-1" />
                        <span>Ref Domains: {website.referring_domains || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Visit Site
                        </a>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          by {website.seller_name}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleFavorite(website.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          {favorites.has(website.id) ? (
                            <Heart className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartOff className="w-5 h-5" />
                          )}
                        </button>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${website.price}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Platform fee: ${(website.price * 0.1).toFixed(2)}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => router.push(`/backlinks/purchase/${website.id}`)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === page
                      ? 'text-white bg-blue-600'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 