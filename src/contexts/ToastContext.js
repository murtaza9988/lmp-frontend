'use client';

import { createContext, useContext, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    switch (type) {
      case 'success':
        toast.success(message, {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#fff',
            fontWeight: '500',
          },
        });
        break;
      case 'error':
        toast.error(message, {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            fontWeight: '500',
          },
        });
        break;
      case 'warning':
        toast(message, {
          duration: 4000,
          position: 'top-center',
          icon: '⚠️',
          style: {
            background: '#F59E0B',
            color: '#fff',
            fontWeight: '500',
          },
        });
        break;
      case 'info':
        toast(message, {
          duration: 4000,
          position: 'top-center',
          icon: 'ℹ️',
          style: {
            background: '#3B82F6',
            color: '#fff',
            fontWeight: '500',
          },
        });
        break;
      default:
        toast(message, {
          duration: 4000,
          position: 'top-center',
        });
    }
  };

  const showLoading = (message = 'Loading...') => {
    setIsLoading(true);
    return toast.loading(message, {
      position: 'top-center',
      style: {
        background: '#6B7280',
        color: '#fff',
        fontWeight: '500',
      },
    });
  };

  const dismissLoading = (toastId) => {
    setIsLoading(false);
    toast.dismiss(toastId);
  };

  const value = {
    showToast,
    showLoading,
    dismissLoading,
    isLoading,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}; 