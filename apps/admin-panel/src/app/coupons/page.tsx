import React from 'react';

export default function RoutePage() {
  return (
    <div className="p-6">
      
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="text-base font-bold text-slate-800 border-b pb-4 mb-4">Coupons & Offers</h3>
    <table className="w-full text-left border-collapse text-xs">
      <thead>
        <tr className="bg-slate-50 text-slate-400 font-bold border-b">
          <th className="p-3">Coupon Code</th>
          <th className="p-3">Description</th>
          <th className="p-3">Resale Bonus</th>
          <th className="p-3">Expiry Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {[
          { code: 'SAVE500', description: 'Get extra ₹500 resale bonus', discount: '₹500 Bonus', expiry: '30 Aug 2026' }
        ].map((c) => (
          <tr key={c.code}>
            <td className="p-3 font-black text-slate-900 font-mono">{c.code}</td>
            <td className="p-3 text-slate-500">{c.description}</td>
            <td className="p-3 font-bold text-emerald-600">{c.discount}</td>
            <td className="p-3 text-slate-400">{c.expiry}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

    </div>
  );
}
