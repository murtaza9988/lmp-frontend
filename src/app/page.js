'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  TrendingUp, 
  Shield, 
  Users, 
  DollarSign, 
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import FeatureCard from '@/components/FeatureCard';
import TestimonialCard from '@/components/TestimonialCard';
import StatsCounter from '@/components/StatsCounter';

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const heroRef = useRef();

  useEffect(() => {
    setHeroVisible(true);
    
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20,
      size: 2 + Math.random() * 6
    }));
    setFloatingElements(elements);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Premium Backlinks",
      description: "Access thousands of high-authority backlinks from verified websites with exceptional domain ratings and organic traffic."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "SEO Acceleration",
      description: "Dramatically improve your search engine rankings and drive exponential organic traffic growth to your website."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Enterprise-grade security with escrow protection, SSL encryption, and fraud prevention for all transactions."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Results",
      description: "Get your backlinks indexed quickly and see measurable improvements in your search rankings within weeks."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Backlinks" },
    { number: "15K+", label: "Website Owners" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "10M", label: "Total Transactions" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Digital Marketing Director",
      content: "This platform completely revolutionized our SEO strategy. We've achieved a 400% increase in organic traffic and our domain authority skyrocketed from 28 to 52 in just 4 months.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "E-commerce Founder",
      content: "The quality of backlinks here is unmatched. Our website now ranks #1 for multiple high-competition keywords, resulting in 6-figure revenue growth.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Content Creator",
      content: "I've been monetizing my blog through this platform for over 2 years. It's generated consistent passive income while maintaining my site's integrity.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute w-1 h-1 bg-emerald-500/30 rounded-full animate-pulse"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
              width: `${element.size}px`,
              height: `${element.size}px`,
            }}
          ></div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-black to-gray-900/60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_60%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.10),transparent_60%)]"></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transform transition-all duration-1500 ${heroVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
            <div className="mb-8 animate-bounce">
              <span className="inline-block px-6 py-3 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm shadow-lg hover:bg-emerald-500/30 transition-all duration-300 cursor-default">
                ✨ #1 Premium Link Marketplace
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-gray-100 to-emerald-400 bg-clip-text text-transparent leading-tight animate-pulse">
              Welcome to<br />
              <span className="text-emerald-500 relative">
                LinkVault
                <div className="absolute -inset-2 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fadeInUp">
              The ultimate marketplace for premium backlinks. Connect with elite website owners, accelerate your SEO growth, and dominate search rankings with our exclusive link ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register" className="group relative bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-600 hover:via-emerald-500 hover:to-emerald-600 text-white text-lg px-12 py-5 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/40 inline-flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10">Start Selling Now</span>
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
              </Link>
              <Link href="/register" className="group relative bg-gray-800/80 hover:bg-gray-700/80 border-2 border-gray-700 hover:border-emerald-500/60 text-white text-lg px-12 py-5 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10">Explore Links</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 1s ease-out 0.5s both;
          }
        `}</style>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatsCounter 
                key={index}
                number={stat.number}
                label={stat.label}
                delay={index * 150}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-6 animate-bounce">
              <span className="inline-block px-6 py-3 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm hover:bg-emerald-500/30 transition-all duration-300 cursor-default">
                ✨ Why Choose LinkVault
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-emerald-400 to-white bg-clip-text relative">
              Premium Features
              <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl rounded-full animate-pulse"></div>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Everything you need to dominate search rankings and build a thriving link empire.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm">
                Simple Process
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-emerald-400 bg-clip-text">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Get started in minutes with our streamlined 3-step process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Sign up instantly and choose your role as a buyer or seller. Verify your websites and set up your premium profile.",
                icon: "🚀"
              },
              {
                step: "2", 
                title: "Browse & Connect",
                description: "Discover premium backlink opportunities or list your high-authority websites for instant monetization.",
                icon: "🔍"
              },
              {
                step: "3",
                title: "Secure Transaction", 
                description: "Complete purchases or receive payments safely through our military-grade encrypted platform with instant delivery.",
                icon: "🛡️"
              }
            ].map((item, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-500 rounded-3xl flex flex-col items-center justify-center mx-auto text-white shadow-2xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 border-2 border-emerald-400/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="text-2xl mb-1 relative z-10">{item.icon}</div>
                    <div className="text-lg font-bold relative z-10">{item.step}</div>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500/60 via-emerald-400/40 to-transparent animate-pulse"></div>
                  )}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-emerald-400 transition-all duration-300 group-hover:scale-105">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-300 transition-colors duration-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm">
                Success Stories
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-emerald-400 bg-clip-text">
              Client Testimonials
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Join thousands of satisfied customers who&apos;ve transformed their SEO results
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                content={testimonial.content}
                rating={testimonial.rating}
                delay={index * 150}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-emerald-900/20 via-black to-gray-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent_70%)] animate-pulse"></div>
        
        {floatingElements.slice(0, 8).map((element) => (
          <div
            key={`cta-${element.id}`}
            className="absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-ping"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay + 2}s`,
              animationDuration: `${element.duration / 2}s`,
            }}
          ></div>
        ))}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 animate-bounce">
            <span className="inline-block px-6 py-3 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm hover:bg-emerald-500/30 transition-all duration-300 cursor-default">
              🚀 Ready to Dominate?
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-400 to-white bg-clip-text text-transparent relative">
            Start Your SEO Revolution
            <div className="absolute -inset-6 bg-emerald-500/10 blur-3xl rounded-full animate-pulse"></div>
          </h2>
          <p className="text-xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of website owners and marketers who are already using LinkVault to accelerate their online growth and revenue exponentially.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register" className="group relative bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-600 hover:via-emerald-500 hover:to-emerald-600 text-white text-lg px-12 py-5 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 shadow-xl hover:shadow-emerald-500/50 inline-flex items-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">Create Free Account</span>
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-3 group-hover:scale-125 transition-all duration-300" />
            </Link>
            <Link href="#features" className="group relative bg-gray-800/80 hover:bg-gray-700/80 border-2 border-gray-700 hover:border-emerald-500/60 text-white text-lg px-12 py-5 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">Learn More</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 text-white py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center mb-6 group cursor-pointer">
                <div className="relative">
                  <Globe className="w-8 h-8 text-emerald-500 group-hover:rotate-12 transition-transform duration-500" />
                  <div className="absolute -inset-2 bg-emerald-500/20 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                  LinkVault
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                The premier marketplace for buying and selling premium backlinks. Accelerate your SEO growth and dominate your competition today.
              </p>
              <div className="flex space-x-4">
                {['T', 'L', 'F', 'I'].map((letter, index) => (
                  <div key={letter} className="w-10 h-10 bg-gray-800 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 hover:rotate-3 border border-gray-700 hover:border-emerald-400 group">
                    <span className="text-sm font-bold group-hover:text-white transition-colors">{letter}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white relative group cursor-pointer">
                Platform
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></div>
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Browse Backlinks</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Sell Backlinks</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Pricing Plans</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">API Access</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Affiliate Program</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white relative group cursor-pointer">
                Support
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></div>
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Live Chat</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Contact Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white relative group cursor-pointer">
                Resources
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></div>
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">SEO Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Link Building Guide</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Case Studies</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Webinars</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 inline-block">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 LinkVault. All rights reserved. Built with ❤️ for SEO professionals.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:scale-105">Cookie Policy</a>
              <a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:scale-105">GDPR</a>
              <a href="#" className="hover:text-emerald-400 transition-all duration-300 hover:scale-105">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}