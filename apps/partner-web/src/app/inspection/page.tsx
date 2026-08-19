"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function InspectionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('orderId') || 'ORD-8711';
  const name = searchParams.get('name') || 'MacBook Pro M3 16-Inch';
  const client = searchParams.get('client') || 'Arjun Reddy';
  const rawPrice = searchParams.get('price') || '₹1,25,000';

  // Original Order details from database
  const [originalOrder, setOriginalOrder] = useState<any>(null);

  // Device selection states
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [modelSearch, setModelSearch] = useState('');

  // Survey states
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [qId: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // wizardStep:
  // 0: Select Category, Brand, Model
  // 1: Diagnostic questions
  // 2: Success
  const [wizardStep, setWizardStep] = useState(0);

  useEffect(() => {
    // Load categories, brands, models, questions, and the original order details
    Promise.all([
      fetch('/api/categories').then(res => res.json()).catch(() => []),
      fetch('/api/brands').then(res => res.json()).catch(() => []),
      fetch('/api/models').then(res => res.json()).catch(() => []),
      fetch('/api/questions').then(res => res.json()).catch(() => []),
      fetch('/api/orders').then(res => res.json()).catch(() => [])
    ]).then(([catData, brandData, modelData, qData, orderData]) => {
      setCategories(catData || []);
      setBrands(brandData || []);
      setModels(modelData || []);
      setQuestions(qData || []);

      if (Array.isArray(orderData)) {
        const ord = orderData.find(o => o.id === orderId);
        if (ord) setOriginalOrder(ord);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [orderId]);

  const handleSelectAnswer = (qText: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [qText]: option
    }));
  };

  const calculateFinalPrice = () => {
    let base = selectedModel 
      ? (selectedModel.rawBase || parseInt(selectedModel.basePrice?.replace(/[^\d]/g, '')) || 50000) 
      : (parseInt(rawPrice.replace(/[^\d]/g, '')) || 85000);
      
    // Apply deductions for broken answers
    Object.keys(answers).forEach(q => {
      if (answers[q] === 'Faulty') {
        base -= 4500;
      }
    });
    return Math.max(5000, base);
  };

  const finalPrice = calculateFinalPrice();

  const handleCompleteInspection = async () => {
    // Update order with new device details, final price and status
    const updatedJob = {
      ...originalOrder,
      id: orderId,
      device: selectedModel ? `${selectedModel.brand} ${selectedModel.name}` : (originalOrder?.device || name),
      price: `₹${finalPrice.toLocaleString()}`,
      status: 'Under Inspection',
      answers: answers,
      category: selectedCategory,
      brand: selectedBrand,
      model: selectedModel?.name
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item: updatedJob })
      });
    } catch (e) {
      console.error(e);
    }

    // Add commission increment to local balance simulation
    const currentBal = parseInt(localStorage.getItem('partner_wallet_bal') || '8320');
    localStorage.setItem('partner_wallet_bal', (currentBal + 450).toString());

    setWizardStep(2);
  };

  // Helper to filter brands based on category
  const filteredBrands = brands.filter(b => {
    if (!selectedCategory) return true;
    return b.categories && b.categories.some((cat: string) => cat.toLowerCase() === selectedCategory.toLowerCase());
  });

  // Helper to filter models based on brand and category
  const filteredModels = models.filter(m => {
    const matchesBrand = !selectedBrand || m.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesCategory = !selectedCategory || m.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !modelSearch || m.name.toLowerCase().includes(modelSearch.toLowerCase());
    return matchesBrand && matchesCategory && matchesSearch;
  });

  // Helper to filter questions based on category
  const categoryFilteredQuestions = questions.filter(q => {
    if (!selectedCategory) return true;
    return q.categories && q.categories.some((cat: string) => cat.toLowerCase() === selectedCategory.toLowerCase());
  });

  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50 text-slate-800 min-h-screen">
      {loading ? (
        <div className="max-w-md mx-auto py-20 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#39b54a] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 font-bold">Loading device catalogs & parameters...</p>
        </div>
      ) : wizardStep === 0 ? (
        // STEP 0: Category, Brand, Model Selection
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h1 className="text-xl font-black text-[#0c213a]">🔍 Device Selection</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Order: {orderId} | Client: {client}</p>
            </div>
            <span className="text-xs font-black text-[#39b54a] bg-[#39b54a]/10 px-3 py-1 rounded-full">
              Route: {name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Selector Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">1. Select Category</h3>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setSelectedBrand('');
                        setSelectedModel(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-black transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#39b54a] bg-emerald-50/20 text-[#39b54a]'
                          : 'border-slate-100 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-650'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand Selector Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">2. Select Brand</h3>
              {!selectedCategory ? (
                <p className="text-[10px] text-slate-400 font-semibold py-8 text-center">Please select a category first</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredBrands.map((brand) => {
                    const isSelected = selectedBrand.toLowerCase() === brand.name.toLowerCase();
                    return (
                      <button
                        key={brand.id}
                        onClick={() => {
                          setSelectedBrand(brand.name);
                          setSelectedModel(null);
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-black transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#39b54a] bg-emerald-50/20 text-[#39b54a]'
                            : 'border-slate-100 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-650'
                        }`}
                      >
                        <span>{brand.name}</span>
                        {isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                  {filteredBrands.length === 0 && (
                    <p className="text-[10px] text-slate-400 font-semibold py-8 text-center">No brands found for this category</p>
                  )}
                </div>
              )}
            </div>

            {/* Model Selector Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">3. Select Model</h3>
              {!selectedBrand ? (
                <p className="text-[10px] text-slate-400 font-semibold py-8 text-center">Please select a brand first</p>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Search model..."
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#39b54a]/60 bg-slate-50"
                  />
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {filteredModels.map((model) => {
                      const isSelected = selectedModel?.id === model.id;
                      return (
                        <button
                          key={model.id}
                          onClick={() => setSelectedModel(model)}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-black transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#39b54a] bg-emerald-50/20 text-[#39b54a]'
                              : 'border-slate-100 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-650'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span>{model.name}</span>
                            <span className="text-[9px] text-slate-450 font-normal">Base: {model.basePrice}</span>
                          </div>
                          {isSelected && <span>✓</span>}
                        </button>
                      );
                    })}
                    {filteredModels.length === 0 && (
                      <p className="text-[10px] text-slate-400 font-semibold py-8 text-center">No models match criteria</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          {selectedModel && (
            <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between shadow-lg animate-fade-in">
              <div>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Selected Device</span>
                <p className="text-sm font-extrabold text-white">{selectedBrand} {selectedModel.name}</p>
                <p className="text-xs font-bold text-emerald-400">Base Quote: {selectedModel.basePrice}</p>
              </div>
              <button
                onClick={() => setWizardStep(1)}
                className="px-6 py-3 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-xl text-xs shadow-md transition cursor-pointer"
              >
                Proceed to Diagnostics →
              </button>
            </div>
          )}
        </div>
      ) : wizardStep === 1 ? (
        // STEP 1: Diagnostic Appraisal Questions
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h1 className="text-xl font-black text-[#0c213a]">🛠️ Diagnostic Appraisal Sheet</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Order: {orderId} | Device: {selectedBrand} {selectedModel?.name}
              </p>
            </div>
            <button
              onClick={() => setWizardStep(0)}
              className="text-xs font-black text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-full transition cursor-pointer"
            >
              ← Back to Device
            </button>
          </div>

          <div className="space-y-4">
            {categoryFilteredQuestions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10 font-bold">No inspection questions found for this category.</p>
            ) : (
              categoryFilteredQuestions.map((q) => (
                <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-3">
                  <p className="font-extrabold text-slate-800 text-xs">{q.text || q.title}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {['Perfect', 'Faulty'].map((opt) => {
                      const isSelected = answers[q.text || q.title] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectAnswer(q.text || q.title, opt)}
                          className={`py-3 rounded-xl border text-center transition font-bold cursor-pointer ${
                            isSelected 
                              ? 'border-[#39b54a] bg-emerald-50/20 text-[#39b54a]' 
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-650'
                          }`}
                        >
                          {opt === 'Perfect' ? '✅ No Fault / Functional' : '❌ Faulty / Damaged'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Estimated Valuation</span>
              <p className="text-2xl font-black text-emerald-400">₹{finalPrice.toLocaleString()}</p>
            </div>
            <button 
              onClick={handleCompleteInspection}
              disabled={Object.keys(answers).length < categoryFilteredQuestions.length}
              className={`px-6 py-3 font-black rounded-xl text-xs shadow-md transition ${
                Object.keys(answers).length < categoryFilteredQuestions.length
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-[#39b54a] hover:bg-[#2fa03e] text-white cursor-pointer'
              }`}
            >
              Verify & Payout Client
            </button>
          </div>
        </div>
      ) : (
        // STEP 2: Success
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6 mt-12">
          <span className="text-6xl block animate-bounce">🎉</span>
          <h2 className="text-xl font-black text-[#0c213a]">Inspection Completed!</h2>
          <p className="text-xs text-slate-450 leading-relaxed font-bold">
            Device appraisal verified successfully at <strong className="text-emerald-600">₹{finalPrice.toLocaleString()}</strong>. IMPS payment has been disbursed to {client}.
          </p>
          <div className="bg-slate-50 border p-4 rounded-2xl flex justify-between items-center text-xs font-bold">
            <span className="text-slate-400">Commission Earned</span>
            <span className="text-[#39b54a] font-black">+₹450</span>
          </div>
          <button 
            onClick={() => router.push('/active-jobs')}
            className="w-full py-3 bg-[#0c213a] text-white font-black rounded-xl text-xs transition cursor-pointer"
          >
            Back to Active Jobs
          </button>
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
