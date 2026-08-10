"use client";
import React from 'react';

export default function Earnings() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-800">💰 Earnings Breakdown & Commission reports</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Review active commissions, rates, and historical monthly summaries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'May 2025 Earnings', val: '₹82,650', count: '126 Orders', comm: '₹12,480 Total Commission' },
          { title: 'April 2025 Earnings', val: '₹75,400', count: '110 Orders', comm: '₹11,310 Total Commission' },
          { title: 'March 2025 Earnings', val: '₹91,200', count: '142 Orders', comm: '₹13,680 Total Commission' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{item.title}</span>
            <h3 className="text-2xl font-black text-[#0c213a]">{item.val}</h3>
            <div className="space-y-1 text-[11px] text-slate-450 font-bold">
              <p>📦 Volume: {item.count}</p>
              <p>📈 Commission: {item.comm}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Device Category Performance Matrix</h3>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-4">Category</th>
              <th className="p-4">Assigned Volume</th>
              <th className="p-4">Avg Device Value</th>
              <th className="p-4">Commission Rate</th>
              <th className="p-4">Total Earnings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
            {[
              { cat: 'Mobile Phones', vol: '78 Devices', avg: '₹22,500', rate: '10%', total: '₹7,800' },
              { cat: 'Laptops', vol: '23 Devices', avg: '₹45,000', rate: '8%', total: '₹2,300' },
              { cat: 'TVs', vol: '13 Devices', avg: '₹25,000', rate: '10%', total: '₹1,300' },
              { cat: 'Tablets', vol: '8 Devices', avg: '₹18,000', rate: '10%', total: '₹800' },
              { cat: 'Accessories', vol: '5 Devices', avg: '₹3,500', rate: '10%', total: '₹280' }
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="p-4 text-slate-900">{row.cat}</td>
                <td className="p-4">{row.vol}</td>
                <td className="p-4 text-slate-500">{row.avg}</td>
                <td className="p-4 text-[#39b54a] font-black">{row.rate}</td>
                <td className="p-4 text-slate-800 font-black">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
