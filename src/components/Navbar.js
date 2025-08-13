'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-sm shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="relative">
              <Globe className="w-8 h-8 text-emerald-500 animate-pulse" />
              <div className="absolute -inset-1 bg-emerald-500/20 rounded-full animate-ping"></div>
            </div>
            <span className="ml-2 text-xl font-bold text-white bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              LinkVault
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="relative text-gray-300 hover:text-white transition-all duration-300 group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#how-it-works" className="relative text-gray-300 hover:text-white transition-all duration-300 group">
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#testimonials" className="relative text-gray-300 hover:text-white transition-all duration-300 group">
              Reviews
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Link href="/login" className="relative text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 group">
              Login
              <span className="absolute -bottom-1 left-4 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-8"></span>
            </Link>
            <Link href="/register" className="relative bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-all duration-300 font-medium group overflow-hidden">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block text-gray-300 hover:text-white px-3 py-2">Features</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white px-3 py-2">How It Works</a>
              <a href="#testimonials" className="block text-gray-300 hover:text-white px-3 py-2">Reviews</a>
              <Link href="/login" className="block text-gray-300 hover:text-white px-3 py-2">Login</Link>
              <Link href="/register" className="block bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg mt-2">Get Started</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}