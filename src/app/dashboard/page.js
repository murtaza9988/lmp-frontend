'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Globe, 
  Link as LinkIcon,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [marketStats, setMarketStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user;

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.accessToken) return;

      try {
        setLoading(true);
        
        // Fetch user stats
        const statsResponse = await fetch('/api/backlinks/stats', {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Fetch recent orders
        const ordersResponse = await fetch('/api/backlinks/orders', {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setRecentOrders(ordersData.results || ordersData || []);
        }

        // Fetch market overview (this would need to be implemented on backend)
        // For now, we'll use placeholder data
        setMarketStats({
          active_listings: 0,
          active_sellers: 0,
          completed_orders: 0
        });

      } catch (error) {
        showToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, showToast]);

  // Calculate stats for display
  const getDisplayStats = () => {
    if (!stats) return [];

    const buyerStats = stats.buyer || {};
    const sellerStats = stats.seller || {};

    return [
      {
        name: 'Total Backlinks',
        value: (buyerStats.completed_purchases || 0) + (sellerStats.completed_sales || 0),
        change: '+0%',
        changeType: 'increase',
        icon: LinkIcon,
        color: 'blue'
      },
      {
        name: 'Account Balance',
        value: `$${user?.balance || '0.00'}`,
        change: '+0%',
        changeType: 'increase',
        icon: DollarSign,
        color: 'green'
      },
      {
        name: 'Total Spent',
        value: `$${(buyerStats.total_spent || 0).toFixed(2)}`,
        change: '+0%',
        changeType: 'increase',
        icon: ShoppingCart,
        color: 'yellow'
      },
      {
        name: 'Total Earned',
        value: `$${(sellerStats.total_earned || 0).toFixed(2)}`,
        change: '+0%',
        changeType: 'increase',
        icon: TrendingUp,
        color: 'purple'
      }
    ];
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    };
    return colors[color] || colors.blue;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'buy':
        router.push('/buy-backlinks');
        break;
      case 'sell':
        router.push('/sell-backlinks');
        break;
      case 'profile':
        router.push('/profile');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-4 lg:p-6 space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
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
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.full_name || user?.first_name || 'User'}! 👋
            </h1>
            <p className="text-blue-100">
              Here&apos;s what&apos;s happening with your backlink marketplace today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getDisplayStats().map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`inline-flex items-center text-sm font-medium ${
                      stat.changeType === 'increase'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    from last month
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => handleQuickAction('buy')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-xl text-sm transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-lg"
                >
                  <Globe className="w-4 h-4 mr-2 inline" />
                  Buy Backlinks
                </button>
                <button 
                  onClick={() => handleQuickAction('sell')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-xl text-sm transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-lg"
                >
                  <LinkIcon className="w-4 h-4 mr-2 inline" />
                  Sell My Backlinks
                </button>
                <button 
                  onClick={() => handleQuickAction('profile')}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium py-3 px-4 rounded-xl text-sm transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-sm"
                >
                  <Users className="w-4 h-4 mr-2 inline" />
                  View Profile
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
                <button 
                  onClick={() => router.push('/orders')}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer flex items-center"
                >
                  View all
                  <ExternalLink className="w-3 h-3 ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <LinkIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.website_title || 'Backlink Order'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.status === 'completed' ? 'Order completed' : `Order ${order.status}`}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatTimeAgo(order.created_at)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Start by buying or selling backlinks
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Market Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Market Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketStats?.active_listings || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Listings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketStats?.active_sellers || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Sellers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketStats?.completed_orders || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed Orders</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 