'use client';

import { useEffect, useRef, useState } from 'react';

export default function FeatureCard({ icon, title, description, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-800 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-all duration-700 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 rotate-0' 
          : 'opacity-0 translate-y-12 -rotate-3'
      } hover:scale-105 hover:-translate-y-2 group relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center mx-auto mb-6 text-emerald-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-emerald-500/30">
          <div className="transition-transform duration-500 group-hover:scale-125">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-emerald-400 transition-all duration-300 group-hover:scale-105">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/50 via-emerald-400/50 to-emerald-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-xl"></div>
      </div>
    </div>
  );
}