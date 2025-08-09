'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  Search, 
  Filter, 
  Globe, 
  DollarSign, 
  Star,
  ExternalLink,
  Heart
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function BuyBacklinksPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: '',
    status: 'all'
  });

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!session?.accessToken) return;

      try {
        setLoading(true);
        const response = await fetch('/api/websites', {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setWebsites(data.results || data || []);
        } else {
          showToast('Failed to load websites', 'error');
        }
      } catch (error) {
        showToast('Failed to load websites', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, [session, showToast]);

  const handlePurchase = async (websiteId) => {
    try {
      const response = await fetch('/api/backlinks/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          website: websiteId,
          target_url: '',
          anchor_text: '',
          price: 0
        }),
      });

      if (response.ok) {
        showToast('Order created successfully!', 'success');
        // Refresh the page or redirect to orders
      } else {
        showToast('Failed to create order', 'error');
      }
    } catch (error) {
      showToast('Failed to create order', 'error');
    }
  };

  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         website.url?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = (!filters.minPrice || website.price >= parseFloat(filters.minPrice)) &&
                        (!filters.maxPrice || website.price <= parseFloat(filters.maxPrice));
    const matchesStatus = true;
    
    return matchesSearch && matchesPrice && matchesStatus;
  });

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading backlinks...</p>
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Buy Backlinks</h1>
            <p className="text-blue-100">
              Find high-quality backlinks to boost your website&apos;s SEO
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative flex">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search websites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-lg transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <select
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
                >
                  <option value="">Min Price</option>
                  <option value="10">$10</option>
                  <option value="25">$25</option>
                  <option value="50">$50</option>
                  <option value="100">$100</option>
                </select>

                <select
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
                >
                  <option value="">Max Price</option>
                  <option value="50">$50</option>
                  <option value="100">$100</option>
                  <option value="250">$250</option>
                  <option value="500">$500</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
                >
                  <option value="all">All Available</option>
                  <option value="active">Active</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.length > 0 ? (
              filteredWebsites.map((website) => (
                <div
                  key={website.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {/* Website Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                    <Globe className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {website.title}
                      </h3>
                      <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {website.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${website.price}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">per backlink</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {website.rating || '4.5'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePurchase(website.id)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 cursor-pointer"
                      >
                        Buy Now
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors cursor-pointer">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No backlinks found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 