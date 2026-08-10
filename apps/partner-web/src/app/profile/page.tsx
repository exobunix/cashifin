"use client";
import React from 'react';

export default function Profile() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-800">👤 Customers & Partner Profile Directory</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Manage contact profiles, view rating logs, and update credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4 col-span-1">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-[#39b54a]/10 text-[#39b54a] rounded-full mx-auto flex items-center justify-center text-3xl font-black">
              MH
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800">MobileHub Store</h3>
              <p className="text-[10px] text-slate-400 font-bold">Partner ID: CFN12345</p>
            </div>
            <div className="inline-block bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-100">
              ⭐️ 4.8 Rating
            </div>
          </div>
          
          <div className="space-y-2 pt-4 text-xs font-bold text-slate-650 border-t">
            <p className="flex justify-between"><span className="text-slate-400">Joining Date</span> <span>15 Feb 2025</span></p>
            <p className="flex justify-between"><span className="text-slate-400">Pincodes</span> <span>110016, 110024</span></p>
            <p className="flex justify-between"><span className="text-slate-400">Status</span> <span className="text-emerald-500">Active</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4 col-span-2">
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Office Details & Locations</h3>
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col"><span className="text-slate-400 font-bold mb-1">Contact Email</span><span className="font-extrabold text-slate-800">mobilehub.delhi@gmail.com</span></div>
              <div className="flex flex-col"><span className="text-slate-400 font-bold mb-1">Phone Number</span><span className="font-extrabold text-slate-800">+91 98765 43210</span></div>
            </div>
            <div className="flex flex-col"><span className="text-slate-400 font-bold mb-1">Registered Address</span><span className="font-extrabold text-slate-800 leading-relaxed">C-18, Green Park Extension, New Delhi - 110016</span></div>
            <div className="flex flex-col"><span className="text-slate-400 font-bold mb-1">Authorized Representatives</span><span className="font-extrabold text-slate-800">Rohit Sharma, Amit Saxena</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
