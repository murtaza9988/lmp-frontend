'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Globe, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export default function SellBacklinksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    backlink_type: 'dofollow',
    price: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchWebsites();
    }
  }, [status]);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/websites/my/', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWebsites(data);
      }
    } catch (error) {
      showToast('Failed to load websites', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.url) newErrors.url = 'Website URL is required';
        else if (!formData.url.startsWith('http')) {
          newErrors.url = 'URL must start with http:// or https://';
        }
        break;
      case 2:
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.description) newErrors.description = 'Description is required';
        break;
      case 3:
        if (!formData.price) newErrors.price = 'Price is required';
        else if (parseFloat(formData.price) <= 0) {
          newErrors.price = 'Price must be greater than 0';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitListing = async () => {
    if (!validateStep(currentStep)) return;
    
    try {
      setSubmitting(true);
      const response = await fetch('/api/websites/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowWizard(false);
        setCurrentStep(1);
        setFormData({
          url: '',
          title: '',
          description: '',
          backlink_type: 'dofollow',
          price: '',
        });
        fetchWebsites(); // Refresh the list
      } else {
        const errorData = await response.json();
        setErrors(errorData);
      }
    } catch (error) {
      showToast('Failed to create listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending_review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'active': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[status] || colors.inactive;
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
              Sell My Backlinks
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              List your websites and start earning from backlink sales
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Globe className="w-4 h-4 mr-2" />
            List New Backlink
          </button>
        </div>

        {/* My Listings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            My Listings
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : websites.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                No listings yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Start by creating your first backlink listing
              </p>
              <button
                onClick={() => setShowWizard(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2" />
                Create First Listing
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {websites.map((website) => (
                <div
                  key={website.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {website.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(website.status)}`}>
                          {website.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBacklinkTypeColor(website.backlink_type)}`}>
                          {website.backlink_type}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {website.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          {website.url}
                        </a>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${website.price}
                        </span>
                      </div>
                      
                      {website.rejection_reason && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                Rejection Reason:
                              </p>
                              <p className="text-sm text-red-700 dark:text-red-300">
                                {website.rejection_reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => router.push(`/websites/my/${website.id}`)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/websites/my/${website.id}/delete`)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Listing Wizard Modal */}
        {showWizard && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    List Your Backlink
                  </h2>
                  <button
                    onClick={() => {
                      setShowWizard(false);
                      setCurrentStep(1);
                      setFormData({
                        url: '',
                        title: '',
                        description: '',
                        backlink_type: 'dofollow',
                        price: '',
                      });
                      setErrors({});
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                      </div>
                      {step < 4 && (
                        <div className={`w-16 h-1 mx-2 ${
                          step < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Website Information
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website URL *
                      </label>
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => handleInputChange('url', e.target.value)}
                        placeholder="https://example.com"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.url ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      {errors.url && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.url}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Listing Details
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter a descriptive title"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.title ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your website and the type of content where backlinks will be placed"
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.description ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Pricing & Type
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Backlink Type
                      </label>
                      <select
                        value={formData.backlink_type}
                        onChange={(e) => handleInputChange('backlink_type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="dofollow">DoFollow</option>
                        <option value="nofollow">NoFollow</option>
                        <option value="sponsored">Sponsored</option>
                        <option value="ugc">UGC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price (USD) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.price ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        />
                      </div>
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Review & Submit
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">URL:</span>
                        <p className="text-sm text-gray-900 dark:text-white">{formData.url}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Title:</span>
                        <p className="text-sm text-gray-900 dark:text-white">{formData.title}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Description:</span>
                        <p className="text-sm text-gray-900 dark:text-white">{formData.description}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
                        <p className="text-sm text-gray-900 dark:text-white">{formData.backlink_type}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Price:</span>
                        <p className="text-sm text-gray-900 dark:text-white">${formData.price}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Important Note:
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Your listing will be reviewed by our team before going live. This usually takes 24-48 hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                  
                  {currentStep < 4 ? (
                    <button
                      onClick={nextStep}
                      className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      onClick={submitListing}
                      disabled={submitting}
                      className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Submit for Review
                        </>
                      )}
                    </button>
                  )}
                </div>

                {errors.general && (
                  <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-700 dark:text-red-300">{errors.general}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 