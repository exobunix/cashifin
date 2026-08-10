import React from 'react';

export default function RoutePage() {
  return (
    <div className="p-6">
      
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="text-base font-bold text-slate-800 border-b pb-4 mb-4">Wallet Transactions</h3>
    <div className="bg-slate-50 p-4 rounded-lg border flex justify-around mb-4">
      <div className="text-center"><p className="text-slate-400 text-[10px] font-bold uppercase">Total Escrow Wallet</p><p className="text-xl font-black text-slate-800 mt-1">₹8,45,200</p></div>
      <div className="text-center"><p className="text-slate-400 text-[10px] font-bold uppercase">Settled Payments</p><p className="text-xl font-black text-slate-800 mt-1">₹37,50,000</p></div>
    </div>
    <p className="text-xs text-slate-400 text-center py-6">Loading transaction records...</p>
  </div>

    </div>
  );
}
