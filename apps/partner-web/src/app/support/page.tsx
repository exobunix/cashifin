"use client";
import React, { useState } from 'react';

export default function Support() {
  const [tickets, setTickets] = useState([
    { id: 'TKT-1049', subject: 'Payout Delayed ORD-8692', category: 'Payouts', date: '04 May 2025', status: 'Pending' },
    { id: 'TKT-1021', subject: 'Pincode Expansion Request', category: 'Profile', date: '01 May 2025', status: 'Closed' }
  ]);
  const [sub, setSub] = useState('');
  const [cat, setCat] = useState('Payouts');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sub) return;
    const newTkt = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: sub,
      category: cat,
      date: 'Today',
      status: 'Open'
    };
    setTickets([newTkt, ...tickets]);
    setSub('');
    alert('Support Ticket filed successfully! Our regional help desk will inspect it shortly.');
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-800">❓ Support & Help Desk</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">File support queries, view active ticket status logs, and read partner tutorials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4 col-span-1">
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">File Support Ticket</h3>
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="flex flex-col">
              <label className="font-bold text-slate-400 mb-1">Category</label>
              <select value={cat} onChange={e => setCat(e.target.value)} className="p-2.5 border rounded-xl bg-slate-50">
                <option>Payouts</option>
                <option>Diagnostics Appraisals</option>
                <option>Pincodes/Areas</option>
                <option>Hardware Issues</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-400 mb-1">Issue Description</label>
              <textarea value={sub} onChange={e => setSub(e.target.value)} className="p-2.5 border rounded-xl bg-slate-50 h-24" placeholder="Briefly explain the issue..." required />
            </div>
            <button type="submit" className="w-full py-2.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-xl text-[10px] shadow-3xs transition">
              File Ticket
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4 col-span-2">
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Active Support Tickets</h3>
          <div className="space-y-3 divide-y divide-slate-100">
            {tickets.map((t, idx) => (
              <div key={t.id} className={`flex justify-between items-center pt-3 ${idx === 0 ? 'pt-0' : ''}`}>
                <div className="space-y-0.5 text-xs font-bold">
                  <p className="text-slate-800">{t.subject}</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{t.id} | {t.category} | {t.date}</p>
                </div>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                  t.status === 'Closed' 
                    ? 'bg-slate-50 text-slate-400 border-slate-200' 
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
