"use client";
import React from 'react';

export default function Marketing() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-800">📣 Marketing Tools & Referrals</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Access sharing posters, banners, and partner program commission incentives.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
          <h3 className="font-black text-xs text-[#0c213a] uppercase tracking-wider">Referral Code program</h3>
          <div className="p-4 bg-slate-50 border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-450 uppercase block">Your Referral Code</span>
              <h4 className="text-lg font-mono font-black text-[#39b54a] mt-0.5">CFN-ROHIT-512</h4>
            </div>
            <button onClick={() => alert('Code copied!')} className="px-4 py-2 bg-[#0c213a] text-white font-black text-[10px] rounded-xl shadow-3xs transition cursor-pointer">
              Copy Code
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
            Invite new retail partners or diagnostic agents to the Cashifin Logistics network using this code. Earn a flat ₹1,000 credit bonus when they complete their first 10 doorstep pickups successfully!
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-3">
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Download Marketing Assets</h3>
          <div className="space-y-2.5 text-xs font-bold text-slate-650 pt-2">
            {[
              { name: 'Cashifin In-Store Acrylic Standee (PDF)', size: '4.8 MB' },
              { name: 'WhatsApp Promotional Banner Template (PNG)', size: '1.2 MB' },
              { name: 'Verified Diagnostic Partner Badge Asset (SVG)', size: '250 KB' }
            ].map((asset, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 border rounded-xl hover:bg-slate-50 cursor-pointer transition">
                <div>
                  <p className="text-slate-800">{asset.name}</p>
                  <p className="text-[9px] text-slate-450">{asset.size}</p>
                </div>
                <button onClick={() => alert('Downloading asset...')} className="text-[#39b54a]">⬇️</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
