"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SellCategoryBrandsPage({ params }: { params: { category: string } }) {
  const [activeLocation, setActiveLocation] = useState('Gurgaon');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [brandSearch, setBrandSearch] = useState('');

  const decodedCategory = decodeURIComponent(params.category);
  
  const cleanCat = 
    decodedCategory === 'smartphones' ? 'Smartphones' :
    decodedCategory === 'laptops' ? 'Laptops' :
    decodedCategory === 'tablets' ? 'Tablets' :
    decodedCategory === 'tvs' ? 'TVs' :
    decodedCategory === 'smartwatches' ? 'Smartwatches' :
    decodedCategory === 'gaming-consoles' ? 'Gaming Consoles' :
    decodedCategory === 'smart-speakers' ? 'Smart Speakers' : decodedCategory;

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(d || []));
    const loc = localStorage.getItem('cashifin_location');
    if (loc) setActiveLocation(loc);
  }, []);

  const getBrandLogo = (brandName: string) => {
    const name = brandName.toLowerCase();
    if (name.includes('apple')) return 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=120&auto=format&fit=crop';
    if (name.includes('google')) return 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=120&auto=format&fit=crop';
    if (name.includes('oneplus')) return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=120&auto=format&fit=crop';
    if (name.includes('samsung')) return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=120&auto=format&fit=crop';
    if (name.includes('dell')) return 'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=120&auto=format&fit=crop';
    if (name.includes('hp')) return 'https://images.unsplash.com/photo-1589561084283-930aa241560b?q=80&w=120&auto=format&fit=crop';
    if (name.includes('lenovo')) return 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=120&auto=format&fit=crop';
    if (name.includes('asus')) return 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=120&auto=format&fit=crop';
    if (name.includes('sony')) return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=120&auto=format&fit=crop';
    if (name.includes('microsoft')) return 'https://images.unsplash.com/photo-1625014618427-fbc980b974f5?q=80&w=120&auto=format&fit=crop';
    if (name.includes('xiaomi') || name.includes('mi')) return 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?q=80&w=120&auto=format&fit=crop';
    return null;
  };

  // Filter brands based on URL route category and search term
  const filteredBrands = brands.filter(b => {
    const matchesCategory = b.categories && b.categories.some((c: string) => c.toLowerCase() === cleanCat.toLowerCase());
    const matchesSearch = b.name.toLowerCase().includes(brandSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

      {/* Breadcrumbs */}
      <div className="px-4 md:px-12 lg:px-20 py-3 text-[10px] text-slate-400 font-semibold space-x-1.5 border-b bg-white">
        <Link href="/" className="hover:text-sellifyTeal-600">Home</Link>
        <span>&gt;</span>
        <span className="capitalize">Sell Your Old {cleanCat}</span>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-[#0c213a]">
            Sell Old <span className="text-sellifyTeal-500">{cleanCat.replace('s', '')}</span> Online
          </h1>
          <p className="text-slate-500 text-xs font-semibold leading-relaxed">
            Sell your old device online at the best resale price with Cashifin. Choose your preferred brand, get instant price quotes, enjoy free doorstep pickup, and receive fast payments anywhere in India.
          </p>
        </div>

        {/* Brand Selector Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-48">
            <select 
              value={decodedCategory} 
              disabled
              className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-white font-bold text-[#0c213a] capitalize"
            >
              <option value={decodedCategory}>{cleanCat}</option>
            </select>
          </div>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Search for Brand"
              value={brandSearch}
              onChange={e => setBrandSearch(e.target.value)}
              className="w-full p-3 pl-10 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-sellifyTeal-500"
            />
            <span className="absolute left-3.5 top-3.5 text-slate-400 text-xs">🔍</span>
          </div>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {filteredBrands.map((b: any) => {
            const logoSrc = (b.logoUrl && b.logoUrl.startsWith('http')) ? b.logoUrl : getBrandLogo(b.name);
            return (
              <Link 
                href={`/sell/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(b.name)}`}
                key={b.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-sellifyTeal-500 hover:shadow-md transition flex flex-col justify-between items-center group overflow-hidden h-[150px]"
              >
                <div className="w-full h-20 rounded-xl overflow-hidden bg-slate-50/50 flex items-center justify-center border border-slate-100/50">
                  {logoSrc ? (
                    <img 
                      src={logoSrc} 
                      alt={b.name} 
                      className="h-12 w-auto object-contain transform group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-[#0c213a] font-black text-xs uppercase tracking-wider select-none p-1 text-center">
                      {b.name}
                    </div>
                  )}
                </div>
                <span className="font-extrabold text-xs text-[#0c213a] mt-2 block text-center group-hover:text-sellifyTeal-600 transition">
                  {b.name}
                </span>
              </Link>
            );
          })}
          {filteredBrands.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-xs font-bold">No matching brands found in our database.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
