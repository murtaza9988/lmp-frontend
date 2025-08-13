'use client';

import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

export default function TestimonialCard({ name, role, content, rating, delay = 0 }) {
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
      className={`bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-800 rounded-xl p-8 hover:border-emerald-500/50 transition-all duration-700 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 rotate-0' 
          : 'opacity-0 translate-y-12 rotate-1'
      } hover:scale-105 hover:-translate-y-3 group relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/30 via-transparent to-emerald-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-6 transform group-hover:scale-105 transition-transform duration-300">
          {[...Array(rating)].map((_, i) => (
            <Star 
              key={i} 
              className="w-5 h-5 text-yellow-500 fill-current transition-all duration-300 hover:scale-125" 
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        <p className="text-gray-300 mb-6 text-lg leading-relaxed italic group-hover:text-white transition-colors duration-300 relative">
          <span className="text-emerald-400 text-3xl absolute -top-2 -left-2 opacity-30">&quot;</span>
          {content}
          <span className="text-emerald-400 text-3xl opacity-30">&quot;</span>
        </p>
        <div className="flex items-center group-hover:scale-105 transition-transform duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300 group-hover:rotate-3">
            {name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">{name}</div>
            <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">{role}</div>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-200"></div>
      </div>
    </div>
  );
}