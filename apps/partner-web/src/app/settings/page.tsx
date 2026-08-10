"use client";
import React, { useState } from 'react';

export default function Settings() {
  const [pincodes, setPincodes] = useState('110016, 110024');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-800">⚙️ Settings & Service Configuration</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Configure service pincodes, bank payout targets, and notification triggers.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs max-w-2xl space-y-6">
        <form onSubmit={handleSave} className="space-y-4 text-xs font-bold">
          <h3 className="font-black text-xs text-[#0c213a] uppercase tracking-wider border-b pb-2">Logistics Pincodes</h3>
          <div className="flex flex-col">
            <label className="text-slate-400 mb-1">Assigned Zip codes (Comma separated)</label>
            <input type="text" value={pincodes} onChange={e => setPincodes(e.target.value)} className="p-2.5 border rounded-xl bg-slate-50" />
            <span className="text-[9px] text-slate-400 font-semibold mt-1">Changing zip codes requires admin verification review before active route assignment redirects.</span>
          </div>

          <h3 className="font-black text-xs text-[#0c213a] uppercase tracking-wider border-b pb-2 pt-4">Payout Destination Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col"><span className="text-slate-400 mb-1">Account Holder Name</span><input type="text" defaultValue="MobileHub Store" className="p-2.5 border rounded-xl bg-slate-50" /></div>
            <div className="flex flex-col"><span className="text-slate-400 mb-1">Bank Name</span><input type="text" defaultValue="HDFC Bank" className="p-2.5 border rounded-xl bg-slate-50" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col"><span className="text-slate-400 mb-1">Account Number</span><input type="text" defaultValue="5010002148291" className="p-2.5 border rounded-xl bg-slate-50 font-mono" /></div>
            <div className="flex flex-col"><span className="text-slate-400 mb-1">IFSC Code</span><input type="text" defaultValue="HDFC0000104" className="p-2.5 border rounded-xl bg-slate-50 font-mono" /></div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="px-5 py-2.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-xl text-xs shadow-3xs transition">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
