'use client';

import React, { useState, useEffect } from 'react';

export default function PriceSimulationPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);

  // Selection state
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((res) => res.json()),
      fetch('/api/brands').then((res) => res.json()),
      fetch('/api/models').then((res) => res.json()),
      fetch('/api/questions').then((res) => res.json()),
      fetch('/api/pricingRules').then((res) => res.json()),
    ])
      .then(([cats, brds, mdls, qstns, rls]) => {
        setCategories(cats || []);
        setBrands(brds || []);
        setModels(mdls || []);
        setQuestions(qstns || []);
        setRules(rls || []);
      })
      .catch((err) => console.error('Error fetching simulator data:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter brands based on category
  const filteredBrands = brands.filter((b) => {
    if (!selectedCat) return true;
    const cats = b.categories || [];
    const normalizedCat = selectedCat.toLowerCase().replace('sell ', '');
    return cats.some((c: any) =>
      c.toString().toLowerCase().includes(normalizedCat) ||
      normalizedCat.includes(c.toString().toLowerCase())
    );
  });

  // Filter models based on brand & category
  const filteredModels = models.filter((m) => {
    const matchBrand = !selectedBrand || m.brand?.toLowerCase() === selectedBrand.toLowerCase();
    const matchCat = !selectedCat || m.category?.toLowerCase().includes(selectedCat.toLowerCase().replace('sell ', ''));
    return matchBrand && matchCat;
  });

  // Filter questions for active model
  const matchingQuestions = questions.filter((q) => {
    if (!selectedModel) return false;
    const catName = selectedModel.category?.toLowerCase() || '';
    const brandName = selectedModel.brand?.toLowerCase() || '';
    const modelName = selectedModel.name?.toLowerCase() || '';

    const qCats = q.categories || [];
    const qBrands = q.brands || [];
    const qModels = q.models || [];

    const matchesCat = qCats.length === 0 || qCats.some((c: any) => catName.includes(c.toLowerCase()) || c.toLowerCase().includes(catName));
    const matchesBrand = qBrands.length === 0 || qBrands.some((b: any) => brandName.includes(b.toLowerCase()) || b.toLowerCase().includes(brandName));
    const matchesModel = qModels.length === 0 || qModels.some((m: any) => modelName.includes(m.toLowerCase()) || m.toLowerCase().includes(modelName));

    return matchesCat && matchesBrand && matchesModel;
  });

  // Default values when model is selected
  useEffect(() => {
    if (selectedModel) {
      const defaultAns: Record<string, string> = {};
      matchingQuestions.forEach((q) => {
        const text = q.text || '';
        const options = q.options || [];
        if (options.length > 0) {
          defaultAns[text] = options[0].optionText || '';
        }
      });
      setAnswers(defaultAns);
    } else {
      setAnswers({});
    }
  }, [selectedModel]);

  // Calculate quote based on choices and pricing rules
  const calculateValuation = () => {
    if (!selectedModel) return 0;
    const basePrice = parseInt(selectedModel.rawBase || selectedModel.basePrice?.replace(/[^\d]/g, '') || '25000');
    let price = basePrice;

    // Apply answer deductions
    matchingQuestions.forEach((q) => {
      const text = q.text || '';
      const selectedOptText = answers[text];
      if (selectedOptText) {
        const options = q.options || [];
        const opt = options.find((o: any) => o.optionText === selectedOptText);
        if (opt) {
          const type = opt.deductionType?.toLowerCase();
          const val = parseInt(opt.deductionValue || '0');
          if (type === 'flat') {
            price -= val;
          } else if (type === 'percentage') {
            price -= Math.round((price * val) / 100);
          }
        }
      }
    });

    // Apply matching pricing rules
    rules.forEach((rule) => {
      const condStr = rule.condition || '';
      const deductionStr = rule.deduction || '';

      const match = condStr.match(/IF "(.*)" is "(.*)"/);
      if (match) {
        const ruleQ = match[1];
        const ruleA = match[2];
        if (answers[ruleQ]?.toLowerCase() === ruleA?.toLowerCase()) {
          const flatMatch = deductionStr.match(/Reduce ₹([\d,]+)/);
          if (flatMatch) {
            const val = parseInt(flatMatch[1].replace(/,/g, ''));
            price -= val;
          }
          const pctMatch = deductionStr.match(/Reduce (\d+)%/);
          if (pctMatch) {
            const pct = parseInt(pctMatch[1]);
            price -= Math.round((basePrice * pct) / 100);
          }
        }
      }
    });

    const minPrice = parseInt(selectedModel.rawMin || '2000');
    return price < minPrice ? minPrice : price;
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500 font-semibold">
        Loading Valuation Simulator Engine...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Device Inspection & Valuation Simulator</h1>
          <p className="text-slate-500 text-sm">Simulate immediate on-site inspection quotes for any catalog model instantly.</p>
        </div>
        {selectedModel && (
          <button
            onClick={() => {
              setSelectedCat('');
              setSelectedBrand('');
              setSelectedModel(null);
            }}
            className="mt-3 md:mt-0 px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
          >
            Reset Simulator
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Catalog Selector */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">1. Catalog Target</h2>
            
            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Category</label>
              <select
                value={selectedCat}
                onChange={(e) => {
                  setSelectedCat(e.target.value);
                  setSelectedBrand('');
                  setSelectedModel(null);
                }}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white transition-colors focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Select */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel(null);
                }}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white transition-colors focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select Brand</option>
                {filteredBrands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Select */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Model</label>
              <select
                value={selectedModel ? selectedModel.id : ''}
                onChange={(e) => {
                  const m = filteredModels.find((model) => model.id === e.target.value);
                  setSelectedModel(m || null);
                }}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white transition-colors focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select Model</option>
                {filteredModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedModel && (
              <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
                <img
                  src={selectedModel.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=150'}
                  alt={selectedModel.name}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-50"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{selectedModel.name}</h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                    Base: {selectedModel.basePrice || '₹25,000'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {selectedModel && (
            <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-sm space-y-2">
              <span className="text-[10px] bg-emerald-800 text-emerald-300 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Simulated Quote
              </span>
              <div className="text-3xl font-extrabold">
                ₹{calculateValuation().toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-200">
                This calculated value incorporates default model base prices, on-site physical parameters, and active pricing rules.
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Diagnostics Questionnaire */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[300px]">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
              2. On-Site Physical Inspection Parameters
            </h2>

            {!selectedModel ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <svg className="w-16 h-16 mb-4 stroke-current opacity-70" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-sm font-bold">Please select a category, brand, and model to load the diagnostic checklist.</p>
              </div>
            ) : matchingQuestions.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-sm font-bold">No custom questions apply to this device. Default valuation calculations apply.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {matchingQuestions.map((q) => {
                  const text = q.text || '';
                  const options = q.options || [];
                  const activeVal = answers[text];

                  return (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-xl space-y-3">
                      <h3 className="text-sm font-bold text-slate-800">{text}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {options.map((opt: any, idx: number) => {
                          const isSelected = activeVal === opt.optionText;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setAnswers((prev) => ({
                                  ...prev,
                                  [text]: opt.optionText,
                                }));
                              }}
                              className={`px-4 py-2.5 text-xs font-semibold rounded-xl text-left border transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <div className="font-bold">{opt.optionText}</div>
                              <div className={`text-[10px] mt-1 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                                {opt.deductionValue && parseInt(opt.deductionValue) > 0 ? (
                                  <>Deduction: {opt.deductionType === 'flat' ? `₹${opt.deductionValue}` : `${opt.deductionValue}%`}</>
                                ) : (
                                  <>No Deduction</>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
