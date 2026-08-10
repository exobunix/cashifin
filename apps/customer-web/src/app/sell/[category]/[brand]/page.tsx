"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Custom high-quality Unsplash image presets by brand & category
const getDeviceImage = (brandName: string, categoryName: string, idx: number) => {
  const brand = brandName.toLowerCase();
  const cat = categoryName.toLowerCase();

  // 1. LAPTOPS Category
  if (cat.includes('laptop')) {
    if (brand.includes('lenovo')) {
      const lenovoLaptops = [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=300&auto=format&fit=crop"
      ];
      return lenovoLaptops[idx % lenovoLaptops.length];
    }
    if (brand.includes('dell')) {
      const dellLaptops = [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?q=80&w=300&auto=format&fit=crop"
      ];
      return dellLaptops[idx % dellLaptops.length];
    }
    if (brand.includes('hp')) {
      const hpLaptops = [
        "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=300&auto=format&fit=crop"
      ];
      return hpLaptops[idx % hpLaptops.length];
    }
    if (brand.includes('asus')) {
      const asusLaptops = [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=300&auto=format&fit=crop"
      ];
      return asusLaptops[idx % asusLaptops.length];
    }
    if (brand.includes('apple')) {
      const appleLaptops = [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=300&auto=format&fit=crop"
      ];
      return appleLaptops[idx % appleLaptops.length];
    }
    // General Laptop list fallback
    const genericLaptops = [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=300&auto=format&fit=crop"
    ];
    return genericLaptops[idx % genericLaptops.length];
  }

  // 2. TELEVISION Category
  if (cat.includes('tv')) {
    const tvImages = [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=300&auto=format&fit=crop"
    ];
    return tvImages[idx % tvImages.length];
  }

  // 3. TABLETS Category
  if (cat.includes('tablet')) {
    if (brand.includes('apple')) {
      const iPads = [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=300&auto=format&fit=crop"
      ];
      return iPads[idx % iPads.length];
    }
    const tabletImages = [
      "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=300&auto=format&fit=crop"
    ];
    return tabletImages[idx % tabletImages.length];
  }

  // 4. SMARTWATCHES Category
  if (cat.includes('watch')) {
    if (brand.includes('apple')) {
      const appleWatches = [
        "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=300&auto=format&fit=crop"
      ];
      return appleWatches[idx % appleWatches.length];
    }
    const watchImages = [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=300&auto=format&fit=crop"
    ];
    return watchImages[idx % watchImages.length];
  }

  // 5. GAMING CONSOLES Category
  if (cat.includes('console')) {
    if (brand.includes('sony')) {
      return "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=300&auto=format&fit=crop"; // PlayStation 5
    }
    if (brand.includes('microsoft')) {
      return "https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=300&auto=format&fit=crop"; // Xbox Series X
    }
    return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&auto=format&fit=crop";
  }

  // 6. SMARTPHONES / MOBILES Category
  const phoneImages: { [key: string]: string[] } = {
    apple: [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=300&auto=format&fit=crop"
    ],
    samsung: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610945415295-d9b21034b5fc?q=80&w=300&auto=format&fit=crop"
    ],
    oneplus: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?q=80&w=300&auto=format&fit=crop"
    ],
    google: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop"
    ]
  };

  const list = phoneImages[brand] || [
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop"
  ];
  return list[idx % list.length];
};

export default function SellBrandModelsPage({ params }: { params: { category: string; brand: string } }) {
  const [activeLocation, setActiveLocation] = useState('Gurgaon');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [detectingLoc, setDetectingLoc] = useState(false);

  const handleSelectCity = (city: string) => {
    setActiveLocation(city);
    localStorage.setItem('cashifin_location', city);
    setShowLocationModal(false);
  };

  const handleDetectLocation = async () => {
    setDetectingLoc(true);
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data && data.city) {
        const detectedCity = data.city;
        setActiveLocation(detectedCity);
        localStorage.setItem('cashifin_location', detectedCity);
      } else {
        setActiveLocation('Gurgaon');
        localStorage.setItem('cashifin_location', 'Gurgaon');
      }
    } catch (err) {
      setActiveLocation('Gurgaon');
      localStorage.setItem('cashifin_location', 'Gurgaon');
    }
    setDetectingLoc(false);
    setShowLocationModal(false);
  };

  useEffect(() => {
    const loc = localStorage.getItem('cashifin_location');
    if (loc) {
      setActiveLocation(loc);
    }
  }, []);

  // Decode parameters
  const decodedCategory = decodeURIComponent(params.category);
  const decodedBrand = decodeURIComponent(params.brand);

  const [models, setModels] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  
  const [modelSearch, setModelSearch] = useState('');

  // Diagnostic survey wizard state
  const [activeModel, setActiveModel] = useState<any>(null);
  const [wizardStep, setWizardStep] = useState(1); // 1: Questions survey, 2: Checkout, 3: Completed
  const [answers, setAnswers] = useState<{ [qId: string]: string }>({});

  // Checkout inputs
  const [custName, setCustName] = useState('adarsh Deep Sachan');
  const [custPhone, setCustPhone] = useState('+91 98765 43210');
  const [custAddress, setCustAddress] = useState('B-45, Sector 62, Noida, UP');
  const [custSlot, setCustSlot] = useState('Tomorrow, 10:00 AM - 01:00 PM');

  useEffect(() => {
    fetch('/api/models').then(r => r.json()).then(d => setModels(d || []));
    fetch('/api/questions').then(r => r.json()).then(d => setQuestions(d || []));
    fetch('/api/pricingRules').then(r => r.json()).then(d => setRules(d || []));
  }, []);

  // Filter models dynamically based on URL route and optional search input
  const filteredModels = models.filter(m => 
    m.brand.toLowerCase() === decodedBrand.toLowerCase() &&
    (m.category || 'Smartphones').toLowerCase() === decodedCategory.toLowerCase() &&
    m.name.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const handleStartSurvey = (model: any) => {
    setActiveModel(model);
    setAnswers({});
    setWizardStep(1);
  };

  const handleSelectAnswer = (qText: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [qText]: option
    }));
  };

  const calculateQuote = () => {
    if (!activeModel) return 0;
    let base = activeModel.rawBase || 35000;
    rules.forEach(rule => {
      const match = rule.condition.match(/IF "(.*)" is "(.*)"/);
      if (match) {
        const ruleQ = match[1];
        const ruleA = match[2];
        if (answers[ruleQ] === ruleA) {
          const pctMatch = rule.deduction.match(/Reduce (\d+)%/);
          if (pctMatch) {
            base -= (activeModel.rawBase * parseInt(pctMatch[1])) / 100;
          }
          const flatMatch = rule.deduction.match(/Reduce ₹([\d,]+)/);
          if (flatMatch) {
            base -= parseInt(flatMatch[1].replace(/,/g, ''));
          }
        }
      }
    });
    return Math.max(activeModel.rawMin || 3000, Math.round(base));
  };

  const currentQuote = calculateQuote();

  const handlePlaceOrder = async () => {
    const orderId = `ORD-${Date.now().toString().slice(-5)}`;
    const newOrder = {
      id: orderId,
      customer: custName,
      device: `${activeModel.name} (${decodedBrand})`,
      price: `₹${currentQuote.toLocaleString()}`,
      status: 'Pending',
      partner: 'Rohit Sharma',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', item: newOrder })
    });

    const newPickup = {
      orderId,
      slot: custSlot,
      address: custAddress,
      distance: '3.8 KM',
      partner: 'Rohit Sharma',
      status: 'Scheduled'
    };

    await fetch('/api/pickups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', item: newPickup })
    });

    setWizardStep(3);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navigation Header */}
      <div className="bg-white border-b border-slate-100 px-10 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-40">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <img src="/logo.jpg" alt="CASHIFIN" className="h-16 w-auto rounded-lg object-contain py-1" />
        </Link>
        <div className="flex-1 max-w-2xl mx-10 relative">
          <input
            type="text"
            placeholder="Search for models..."
            value={modelSearch}
            onChange={e => setModelSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:bg-white transition"
          />
          <span className="absolute left-3 top-2.5">🔍</span>
        </div>
        <div className="flex items-center space-x-6 text-xs font-bold text-slate-650">
          <span><span className="cursor-pointer" onClick={() => setShowLocationModal(true)}>📍 {activeLocation} ▼</span></span>
          <Link href="/profile" className="hover:text-[#39b54a]">👤 adarsh Deep Sachan</Link>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="px-10 py-4 text-[10px] text-slate-400 font-semibold space-x-1.5 border-b bg-white">
        <Link href="/" className="hover:text-[#39b54a]">Home</Link>
        <span>&gt;</span>
        <span className="capitalize">Sell Old {decodedCategory}</span>
        <span>&gt;</span>
        <span className="text-slate-600 capitalize">Sell Old {decodedBrand}</span>
      </div>

      {/* Main Container */}
      <div className="px-10 py-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-850 capitalize">Sell Old {decodedBrand} {decodedCategory}</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-1 uppercase">Select your model from the grid below</p>
          </div>
          <input
            type="text"
            placeholder="Select Model"
            value={modelSearch}
            onChange={e => setModelSearch(e.target.value)}
            className="w-full md:w-72 p-2.5 border rounded-xl text-xs bg-white focus:outline-none focus:border-[#39b54a]"
          />
        </div>

        {/* Dynamic Grid list with actual product images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
          {filteredModels.map((m, idx) => {
            const deviceUrl = m.imageUrl || getDeviceImage(decodedBrand, decodedCategory, idx);
            return (
              <div
                key={m.id}
                onClick={() => handleStartSurvey(m)}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#39b54a] cursor-pointer text-center space-y-3 transition duration-200 shadow-3xs group flex flex-col justify-between"
              >
                <div className="h-28 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                  <img src={deviceUrl} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[11px] text-slate-800 line-clamp-2 leading-snug">{m.name}</h4>
                  <p className="text-[9px] text-[#39b54a] font-black mt-1.5">{m.basePrice}</p>
                </div>
              </div>
            );
          })}
          {filteredModels.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-xs font-bold">No matching models found in our database.</p>
            </div>
          )}
        </div>
      </div>

      {/* Diagnostic Survey Modal */}
      {activeModel && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[550px] shadow-2xl space-y-5 text-slate-800 border relative overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-3.5 shrink-0">
              <div>
                <h3 className="font-black text-sm text-slate-800">Appraisal Survey: {activeModel.name}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Grade your device condition accurately</p>
              </div>
              <button 
                onClick={() => setActiveModel(null)} 
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {/* Step 1: Diagnostics */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-450 uppercase">Step 1 of 2: Perform Diagnostic Survey</span>
                  <div className="space-y-3">
                    {questions
                      .filter(q => q.categories?.includes(decodedCategory) || q.categories?.includes('Smartphones'))
                      .map((q: any) => (
                        <div key={q.id} className="p-3.5 bg-slate-50 rounded-xl border space-y-2">
                          <p className="font-bold text-slate-700 text-xs">{q.text}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {['No Faults / Perfect', 'Faulty / Damaged'].map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleSelectAnswer(q.text, opt === 'Faulty / Damaged' ? 'Cracked' : 'Perfect')}
                                className={`py-2 text-xs font-bold rounded-lg border transition ${
                                  answers[q.text] === (opt === 'Faulty / Damaged' ? 'Cracked' : 'Perfect')
                                    ? 'border-[#39b54a] bg-teal-50/10 text-[#39b54a]'
                                    : 'border-slate-200 bg-white'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between mt-4">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Estimated Valuation</span>
                      <p className="text-xl font-black text-emerald-400">₹{currentQuote.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => setWizardStep(2)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold"
                    >
                      Continue to Checkout →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Checkout details */}
              {wizardStep === 2 && (
                <div className="space-y-4 text-xs text-slate-800">
                  <span className="text-[10px] font-bold text-slate-450 uppercase">Step 2 of 2: Checkout details</span>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border">
                    <div className="flex flex-col">
                      <label className="font-bold text-slate-555 mb-1">Your Full Name</label>
                      <input type="text" value={custName} onChange={e => setCustName(e.target.value)} className="p-2.5 border rounded bg-white" />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold text-slate-555 mb-1">Phone Number</label>
                      <input type="text" value={custPhone} onChange={e => setCustPhone(e.target.value)} className="p-2.5 border rounded bg-white" />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold text-slate-555 mb-1">Pickup Address</label>
                      <input type="text" value={custAddress} onChange={e => setCustAddress(e.target.value)} className="p-2.5 border rounded bg-white" />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold text-[#39b54a] mb-1">Preferred Time Slot</label>
                      <select value={custSlot} onChange={e => setCustSlot(e.target.value)} className="p-2.5 border rounded bg-white">
                        <option value="Tomorrow, 10:00 AM - 01:00 PM">Tomorrow, 10:00 AM - 01:00 PM</option>
                        <option value="Tomorrow, 02:00 PM - 05:00 PM">Tomorrow, 02:00 PM - 05:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Final Resale Price</span>
                      <p className="text-lg font-black text-[#39b54a]">₹{currentQuote.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={handlePlaceOrder}
                      className="px-5 py-2.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white rounded-lg font-bold"
                    >
                      Book Doorstep Pickup
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Success */}
              {wizardStep === 3 && (
                <div className="text-center py-6 space-y-4">
                  <span className="text-5xl block">🎉</span>
                  <h3 className="text-lg font-black text-slate-800">Booking Confirmed Successfully!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Your buyback order has been registered at <strong className="text-teal-605">₹{currentQuote.toLocaleString()}</strong>. Our verified partner will contact you shortly to schedule doorstep inspection!
                  </p>
                  <button 
                    onClick={() => setActiveModel(null)}
                    className="px-5 py-2.5 bg-[#39b54a] text-white rounded-xl text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    
      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-2xl space-y-4 text-slate-800 border relative">
            <button 
              onClick={() => setShowLocationModal(false)} 
              className="absolute top-4 right-4 text-xs font-bold bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            <div className="text-center space-y-1.5 pb-2 border-b">
              <h3 className="font-black text-sm text-slate-850">Select Your Location</h3>
              <p className="text-[9px] text-slate-400">Choose your city to view correct doorstep evaluator schedules</p>
            </div>

            <button 
              onClick={handleDetectLocation}
              disabled={detectingLoc}
              className="w-full py-2.5 bg-[#39b54a]/10 hover:bg-[#39b54a]/15 text-[#39b54a] font-black rounded-lg text-xs flex items-center justify-center space-x-2 border border-dashed border-[#39b54a] transition"
            >
              <span>📍</span>
              <span>{detectingLoc ? 'Detecting Location...' : 'Use Current Location'}</span>
            </button>

            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Popular Cities</p>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold">
                {['Gurgaon', 'Delhi', 'Noida', 'Bangalore', 'Mumbai', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune'].map(city => (
                  <button 
                    key={city}
                    onClick={() => handleSelectCity(city)}
                    className="p-2 border rounded-lg hover:border-[#39b54a] hover:bg-slate-50 transition"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
</div>
  );
}
