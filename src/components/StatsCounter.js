'use client';

import { useEffect, useRef, useState } from 'react';

export default function StatsCounter({ number, label, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef();

  const cleanNumber = number.replace(/[^0-9.]/g, '');
  const targetNumber = parseFloat(cleanNumber);
  const hasSymbol = number.includes('%') || number.includes('+') || number.includes('$') || number.includes('M') || number.includes('K');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const increment = targetNumber / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          setCount(targetNumber);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, targetNumber]);

  const formatNumber = (num) => {
    if (number.includes('%')) {
      return Math.floor(num) + '%';
    } else if (number.includes('K')) {
      return Math.floor(num) + 'K+';
    } else if (number.includes('M')) {
      return '$' + Math.floor(num) + 'M+';
    } else if (number.includes('$')) {
      return '$' + Math.floor(num) + '+';
    } else if (number.includes('+')) {
      return Math.floor(num).toLocaleString() + '+';
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <div
      ref={ref}
      className={`text-center transform transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      } group cursor-pointer`}
    >
      <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-gray-800/50 group-hover:border-emerald-500/30 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="text-4xl md:text-5xl font-bold text-emerald-500 mb-2 font-mono group-hover:text-emerald-400 transition-colors duration-300 group-hover:scale-105 transform duration-300">
            {formatNumber(count)}
          </div>
          <div className="text-gray-400 text-sm uppercase tracking-wider font-medium group-hover:text-gray-300 transition-colors duration-300">{label}</div>
        </div>
        
        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
      </div>
    </div>
  );
}