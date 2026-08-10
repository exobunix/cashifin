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

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [qId: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [wizardStep, setWizardStep] = useState(1); // 1: survey, 2: success

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(d => {
        setQuestions(d || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelectAnswer = (qText: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [qText]: option
    }));
  };

  const calculateFinalPrice = () => {
    let base = parseInt(rawPrice.replace(/[^\d]/g, '')) || 85000;
    // Apply dummy deductions for broken answers
    Object.keys(answers).forEach(q => {
      if (answers[q] === 'Faulty') {
        base -= 4500;
      }
    });
    return Math.max(5000, base);
  };

  const finalPrice = calculateFinalPrice();

  const handleCompleteInspection = async () => {
    // Add commission increment to local balance simulation
    const currentBal = parseInt(localStorage.getItem('partner_wallet_bal') || '8320');
    localStorage.setItem('partner_wallet_bal', (currentBal + 450).toString());

    setWizardStep(2);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50 text-slate-800 min-h-screen">
      {wizardStep === 1 ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h1 className="text-xl font-black text-[#0c213a]">🛠️ Diagnostic Appraisal Sheet</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Order: {orderId} | Client: {client}</p>
            </div>
            <span className="text-sm font-black text-[#39b54a] bg-[#39b54a]/10 px-3 py-1 rounded-full">
              Original Quote: {rawPrice}
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-xs text-slate-400 text-center py-10 font-bold">Loading questions matrix...</p>
            ) : (
              questions.slice(0, 4).map((q) => (
                <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-3">
                  <p className="font-extrabold text-slate-800 text-xs">{q.text}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {['Perfect', 'Faulty'].map((opt) => {
                      const isSelected = answers[q.text] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectAnswer(q.text, opt)}
                          className={`py-3 rounded-xl border text-center transition font-bold ${
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
              className="px-6 py-3 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-xl text-xs shadow-md transition"
            >
              Verify & Payout Client
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6 mt-12">
          <span className="text-6xl block">🎉</span>
          <h2 className="text-xl font-black text-[#0c213a]">Inspection Completed!</h2>
          <p className="text-xs text-slate-450 leading-relaxed font-bold">
            Device appraisal verified successfully at <strong className="text-emerald-600">₹{finalPrice.toLocaleString()}</strong>. IMPS payment has been disbursed to {client}.
          </p>
          <div className="bg-slate-50 border p-4 rounded-2xl flex justify-between items-center text-xs font-bold">
            <span className="text-slate-400">Commission Earned</span>
            <span className="text-[#39b54a] font-black">+₹450</span>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="w-full py-3 bg-[#0c213a] text-white font-black rounded-xl text-xs transition"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
