'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Filter
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function OrdersPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.accessToken) return;

      try {
        setLoading(true);
        const response = await fetch('/api/backlinks/orders', {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.results || data || []);
        } else {
          showToast('Failed to load orders', 'error');
        }
      } catch (error) {
        showToast('Failed to load orders', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, showToast]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
      case 'buyer_details_pending':
      case 'seller_review_pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
      case 'disputed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'buyer_details_pending':
      case 'seller_review_pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
      case 'disputed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading orders...</p>
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
            <h1 className="text-2xl font-bold mb-2">My Orders</h1>
            <p className="text-blue-100">
              Track all your backlink purchases and sales
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="buyer_details_pending">Awaiting Details</option>
                <option value="seller_review_pending">Under Review</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {filteredOrders.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {order.website_title || 'Backlink Order'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.website_url}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Order #{order.id} • {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            ${order.total_amount || order.price}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {order.target_url && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Target URL:</span>
                            <p className="text-gray-600 dark:text-gray-400 break-all">{order.target_url}</p>
                          </div>
                          {order.anchor_text && (
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Anchor Text:</span>
                              <p className="text-gray-600 dark:text-gray-400">{order.anchor_text}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No orders found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {filter === 'all' 
                    ? 'You haven\'t made any orders yet. Start by buying backlinks!'
                    : `No orders with status "${filter}" found.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 