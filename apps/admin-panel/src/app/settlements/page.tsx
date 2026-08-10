import React from 'react';

export default function RoutePage() {
  return (
    <div className="p-6">
      
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="text-base font-bold text-slate-800 border-b pb-4 mb-4">Partner Settlements</h3>
    <table className="w-full text-left border-collapse text-xs">
      <thead>
        <tr className="bg-slate-50 text-slate-400 font-bold border-b">
          <th className="p-3">Settlement ID</th>
          <th className="p-3">Partner Name</th>
          <th className="p-3">Amount</th>
          <th className="p-3">Process Date</th>
          <th className="p-3">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {[
          { id: 'SET-901', partner: 'Rohit Sharma', amount: '₹14,500', date: '20 Jun 2024', status: 'Processed' }
        ].map((s) => (
          <tr key={s.id}>
            <td className="p-3 font-bold text-slate-900">{s.id}</td>
            <td className="p-3 font-bold">{s.partner}</td>
            <td className="p-3 font-semibold text-slate-700">{s.amount}</td>
            <td className="p-3 text-slate-400">{s.date}</td>
            <td className="p-3"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[9px]">{s.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

    </div>
  );
}
