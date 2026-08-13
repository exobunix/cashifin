"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SellCategoriesLandingPage() {
  const [activeLocation, setActiveLocation] = useState('Gurgaon');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d || []));
    const loc = localStorage.getItem('cashifin_location');
    if (loc) setActiveLocation(loc);
  }, []);

  const getCategoryImg = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes('phone') || name.includes('smartphones')) return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=400&auto=format&fit=crop';
    if (name.includes('laptop')) return 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?q=80&w=400&auto=format&fit=crop';
    if (name.includes('tablet')) return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop';
    if (name.includes('watch') || name.includes('smartwatches')) return 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400&auto=format&fit=crop';
    if (name.includes('tv')) return 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=400&auto=format&fit=crop';
    if (name.includes('console')) return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=400&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=400&auto=format&fit=crop';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-100 px-4 md:px-12 lg:px-20 py-4 flex items-center justify-between sticky top-0 z-40 w-full shadow-3xs">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <img src="/logo.jpg" alt="CASHIFIN" className="h-16 w-auto rounded-lg object-contain py-0.5" style={{ height: '64px', width: 'auto' }} />
        </Link>

        <div className="flex items-center space-x-6 text-sm font-bold text-slate-650">
          <Link href="/sell" className="hover:text-sellifyTeal-500 transition">Sell</Link>
          <div onClick={() => setShowLocationModal(true)} className="cursor-pointer hover:text-sellifyTeal-500 flex items-center space-x-1 transition">
            <span>📍 {activeLocation} ▼</span>
          </div>
          <Link href="/" className="px-6 py-2 bg-sellifyTeal-500 hover:bg-sellifyTeal-600 text-white font-bold rounded-lg text-xs transition shadow-sm text-center">
            Go Home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-[#0c213a]">Select <span className="text-sellifyTeal-500">Category</span></h1>
          <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto leading-relaxed">
            Select the device category below to proceed with your doorstep evaluation and instant payout.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((cat: any) => {
            const pathName = cat.name.replace('Sell ', '').toLowerCase();
            const cleanPath = pathName === 'phone' ? 'smartphones' : pathName === 'laptop' ? 'laptops' : pathName === 'tv' ? 'tvs' : pathName === 'tablet' ? 'tablets' : pathName === 'gaming consoles' ? 'gaming-consoles' : pathName === 'smartwatch' ? 'smartwatches' : pathName;

            return (
              <Link 
                href={`/sell/${encodeURIComponent(cleanPath)}`}
                key={cat.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-sellifyTeal-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between items-center group overflow-hidden h-[300px]"
              >
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100">
                  <img 
                    src={cat.imageUrl || getCategoryImg(cat.name)} 
                    alt={cat.name} 
                    className="h-36 w-auto object-contain transform group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="text-center mt-4">
                  <span className="font-extrabold text-base text-[#0c213a] block group-hover:text-sellifyTeal-600 transition">{cat.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
