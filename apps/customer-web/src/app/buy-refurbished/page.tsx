"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RefurbishedBrowsePage() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<any>(null);

  const [activeLocation, setActiveLocation] = useState('Gurgaon');
  const [logoConfig, setLogoConfig] = useState<any>({ userLogo: '/logo.jpg' });
  const [footerConfig, setFooterConfig] = useState<any>({});
  const getCategoryImg = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes('phone') || name.includes('smartphones')) return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200&auto=format&fit=crop';
    if (name.includes('laptop')) return 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?q=80&w=200&auto=format&fit=crop';
    if (name.includes('tablet')) return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=200&auto=format&fit=crop';
    if (name.includes('watch') || name.includes('smartwatches')) return 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=200&auto=format&fit=crop';
    if (name.includes('tv')) return 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=200&auto=format&fit=crop';
    if (name.includes('console')) return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=200&auto=format&fit=crop';
    if (name.includes('speaker') || name.includes('audio')) return 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=200&auto=format&fit=crop';
    if (name.includes('camera')) return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=200&auto=format&fit=crop';
    if (name.includes('smart home') || name.includes('home')) return 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=200&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200&auto=format&fit=crop';
  };

  const getBrandLogo = (brandName: string) => {
    const name = brandName.toLowerCase();
    if (name.includes('apple')) return 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=120&auto=format&fit=crop';
    if (name.includes('dell')) return 'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=120&auto=format&fit=crop';
    if (name.includes('hp')) return 'https://images.unsplash.com/photo-1589561084283-930aa241560b?q=80&w=120&auto=format&fit=crop';
    if (name.includes('lenovo')) return 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=120&auto=format&fit=crop';
    if (name.includes('asus')) return 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=120&auto=format&fit=crop';
    if (name.includes('microsoft')) return 'https://images.unsplash.com/photo-1625014020771-13757997926e?q=80&w=120&auto=format&fit=crop';
    if (name.includes('samsung')) return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=120&auto=format&fit=crop';
    if (name.includes('oneplus')) return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=120&auto=format&fit=crop';
    if (name.includes('google')) return 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=120&auto=format&fit=crop';
    if (name.includes('sony')) return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=120&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=120&auto=format&fit=crop';
  };
  useEffect(() => {
    // Load datasets
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d || []));
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(d || []));
    fetch('/api/models').then(r => r.json()).then(d => setModels(d || []));
    
    // Load config
    fetch('/api/logos').then(r => r.json()).then(d => setLogoConfig(d?.[0] || { userLogo: '/logo.jpg' }));
    fetch('/api/footerContent').then(r => r.json()).then(d => setFooterConfig(d?.[0] || {}));
    
    const loc = localStorage.getItem('cashifin_location');
    if (loc) setActiveLocation(loc);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 bg-white border-b border-slate-100 z-40 transition-all duration-200">
        <div className="px-4 md:px-12 lg:px-20 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-40 w-full">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer select-none">
            <img src={logoConfig.userLogo || '/logo.jpg'} alt="CASHIFIN" className="h-24 w-auto rounded-lg object-contain py-1" style={{ height: '96px', width: 'auto' }} />
          </Link>
          <div className="flex items-center space-x-6 text-sm font-bold text-slate-650">
            <div className="flex items-center space-x-1.5 text-sm text-slate-500 font-extrabold cursor-pointer">
              <span>📍 {activeLocation} ▼</span>
            </div>
            <Link href="/" className="text-sm font-black text-[#39b54a] hover:underline">
              ← Go Home
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Page Content Grid */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 flex flex-col items-center">
        {/* Progress Tracker Header */}
        <div className="w-full max-w-3xl mb-8 flex justify-between items-center text-sm font-black text-slate-400 border-b pb-4">
          <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-[#39b54a]' : ''}`}>
            <span className="w-6 h-6 rounded-full bg-slate-100 border flex items-center justify-center font-black">1</span>
            <span>Category</span>
          </div>
          <span className="text-slate-300">➔</span>
          <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-[#39b54a]' : ''}`}>
            <span className="w-6 h-6 rounded-full bg-slate-100 border flex items-center justify-center font-black">2</span>
            <span>Brand</span>
          </div>
          <span className="text-slate-300">➔</span>
          <div className={`flex items-center space-x-1.5 ${step >= 3 ? 'text-[#39b54a]' : ''}`}>
            <span className="w-6 h-6 rounded-full bg-slate-100 border flex items-center justify-center font-black">3</span>
            <span>Model</span>
          </div>
          <span className="text-slate-300">➔</span>
          <div className={`flex items-center space-x-1.5 ${step >= 4 ? 'text-[#39b54a]' : ''}`}>
            <span className="w-6 h-6 rounded-full bg-slate-100 border flex items-center justify-center font-black">4</span>
            <span>Review</span>
          </div>
        </div>

        {/* Wizard Main Panel */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm w-full max-w-3xl p-8 min-h-[460px] flex flex-col justify-between">
          
          {/* Step 1: Select Category */}
          {step === 1 && (
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="text-center space-y-1.5 mb-2">
                <h2 className="text-3xl font-black text-[#0c213a]">Choose Refurbished Category</h2>
                <p className="text-sm text-slate-500 font-semibold">Pick your device category to see our certified inventory</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-2xl mx-auto w-full">
                {categories.map((cat: any) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setStep(2);
                    }}
                    className="p-4 bg-slate-50/50 hover:bg-white border border-slate-200/80 hover:border-[#39b54a] rounded-2xl cursor-pointer transition text-center space-y-3 group shadow-3xs overflow-hidden flex flex-col items-center justify-between"
                  >
                    <div className="w-full h-24 overflow-hidden rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                      <img src={cat.imageUrl || getCategoryImg(cat.name)} alt={cat.name} className="h-20 w-auto object-contain transform group-hover:scale-105 transition" />
                    </div>
                    <span className="font-extrabold text-sm text-slate-800 block">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Brand */}
          {step === 2 && (
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="flex items-baseline justify-between border-b pb-2 mb-2">
                <div>
                  <h2 className="text-3xl font-black text-[#0c213a]">Choose Brand</h2>
                  <p className="text-sm text-slate-500 font-semibold">Browse active brands for {selectedCategory}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-sm font-black text-[#39b54a] hover:underline">
                  ← Back to Categories
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto w-full">
                {brands
                  .filter(b => b.categories && b.categories.includes(selectedCategory))
                  .map((brand: any) => (
                    <div
                      key={brand.id}
                      onClick={() => {
                        setSelectedBrand(brand.name);
                        setStep(3);
                      }}
                      className="p-3 bg-slate-50/50 hover:bg-white border border-slate-200/80 hover:border-[#39b54a] rounded-xl cursor-pointer transition text-center space-y-2 group shadow-3xs flex flex-col items-center justify-between"
                    >
                      <div className="w-16 h-12 flex items-center justify-center overflow-hidden rounded bg-white border border-slate-100 p-1">
                        <img src={brand.logoUrl || getBrandLogo(brand.name)} alt={brand.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="font-black text-xs text-slate-700">{brand.name}</span>
                    </div>
                  ))}
                {brands.filter(b => b.categories && b.categories.includes(selectedCategory)).length === 0 && (
                  <div className="col-span-4 text-center py-12 text-slate-400 font-bold">No brands found for this selection.</div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Select Model */}
          {step === 3 && (
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="flex items-baseline justify-between border-b pb-2 mb-2">
                <div>
                  <h2 className="text-3xl font-black text-[#0c213a]">Select {selectedBrand} Model</h2>
                  <p className="text-sm text-slate-500 font-semibold">Grade-A certified devices ready for dispatch</p>
                </div>
                <button onClick={() => setStep(2)} className="text-sm font-black text-[#39b54a] hover:underline">
                  ← Back to Brands
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full max-h-[300px] overflow-y-auto pr-1">
                {models
                  .filter(m => m.category === selectedCategory && m.brand === selectedBrand)
                  .map((model: any) => (
                    <div
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model);
                        setStep(4);
                      }}
                      className="flex items-center space-x-4 p-4 bg-slate-50/50 hover:bg-white hover:border-[#39b54a] rounded-2xl border border-slate-200/80 cursor-pointer transition shadow-3xs group"
                    >
                      <img src={model.imageUrl || model.img || getCategoryImg(model.category)} alt={model.name} className="w-12 h-12 object-contain bg-white rounded-xl border p-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-sm text-slate-800 truncate group-hover:text-[#39b54a] transition">{model.name}</p>
                        <p className="text-sm text-[#39b54a] font-black mt-0.5">{model.range || model.basePrice}</p>
                      </div>
                      <span className="text-slate-450 font-bold text-lg group-hover:translate-x-1 transition">→</span>
                    </div>
                  ))}
                {models.filter(m => m.category === selectedCategory && m.brand === selectedBrand).length === 0 && (
                  <div className="col-span-2 text-center py-12 text-slate-400 font-bold">No models found for this brand criteria.</div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Model Specifications & Details Review */}
          {step === 4 && selectedModel && (
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="flex items-baseline justify-between border-b pb-2">
                <div>
                  <h2 className="text-3xl font-black text-[#0c213a]">Review Specifications</h2>
                  <p className="text-sm text-slate-500 font-semibold">inspected & certified under 34 checkpoints</p>
                </div>
                <button onClick={() => setStep(3)} className="text-sm font-black text-[#39b54a] hover:underline">
                  ← Back to Models
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-center p-6 bg-slate-50/50 rounded-2xl border">
                <div className="w-44 h-44 bg-white border rounded-xl flex items-center justify-center p-3 relative shrink-0">
                  <span className="absolute top-2 left-2 bg-[#39b54a]/10 text-[#39b54a] text-[8px] font-black px-2 py-0.5 rounded-full">
                    ASSURED
                  </span>
                  <img src={selectedModel.imageUrl} alt={selectedModel.name} className="max-h-full max-w-full object-contain" />
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <h3 className="font-black text-base text-slate-850 leading-tight">{selectedModel.name}</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">Brand: {selectedModel.brand} | Category: {selectedModel.category}</p>
                  </div>
                  
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-[#39b54a] font-black text-lg">{selectedModel.basePrice}</span>
                    <span className="text-[10px] text-slate-400 font-bold">Refurbished Payout Base Value</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border space-y-2 text-slate-650">
                    <p className="font-extrabold text-[10px] text-slate-700">Refurbished Quality Checklist:</p>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-500 text-[10px] font-semibold">
                      <li>✓ 34 Hardware checks OK</li>
                      <li>✓ 6-Month local warranty</li>
                      <li>✓ Charger box included</li>
                      <li>✓ Secure free doorstep delivery</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Link
                href={`/refurbished/${selectedModel.id}`}
                className="w-full py-4 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-xl text-center block text-sm shadow-md transition"
              >
                Proceed to Checkout & Buy Now
              </Link>
            </div>
          )}

        </div>
      </main>

      {/* 3. Recommerce White Corporate Footer */}
      <footer className="bg-white border-t border-slate-200 w-full mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-20 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-slate-500">
          <div className="space-y-3">
            <img src={logoConfig.userLogo || '/logo.jpg'} alt="CASHIFIN" className="h-16 w-auto rounded-lg object-contain" />
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              {footerConfig.aboutUs || "Cashifin is India's premier tech recommerce network built for digital life cycle circularity. Established in 2015, we disburse instant payouts transparently."}
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Help & Support</h4>
            <p className="text-xs text-slate-400 font-semibold">{footerConfig.contactUs || "Operations center support hotline: 1800-123-4567. Address: Sector 62, Noida, UP."}</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Agreement</h4>
            <p className="text-xs text-slate-400 font-semibold">{footerConfig.sellerAgreement || "By scheduling evaluations you legally certify device ownership and details criteria matching billing records."}</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Privacy & Security</h4>
            <p className="text-xs text-slate-400 font-semibold">{footerConfig.privacyPolicy || "We encrypt all personal data variables securely and process ISO-compliant diagnostic formatting on logistics collections."}</p>
          </div>
        </div>
        <div className="bg-slate-50 border-t border-slate-200 py-6 text-center text-xs text-slate-400 font-semibold">
          <p>© 2026 Cashifin Recommerce Private Limited. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
