"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PartnerHome() {
  const [pickups, setPickups] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Dynamic fetches to hydrate Recent Orders and Stats aggregates
    fetch('/api/pickups')
      .then(res => res.json())
      .then(data => setPickups(data || []))
      .catch(err => console.log(err));

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data || []))
      .catch(err => console.log(err));
  }, []);

  const totalAssigned = pickups.length;
  const completedJobs = pickups.filter(p => p.status === 'Completed' || p.status === 'Paid').length;
  const pendingJobs = pickups.filter(p => p.status === 'Scheduled' || p.status === 'Pending Verification').length;

  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50 text-slate-800 font-sans min-h-screen">
      {/* Title & Greeting Banner */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-[#0c213a] flex items-center space-x-1.5">
            <span>Welcome back, MobileHub Store!</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs text-slate-450 font-bold mt-1">Here's what's happening with your business today.</p>
        </div>
        {/* Date Filter Widget */}
        <div className="bg-white border px-3.5 py-2 rounded-xl shadow-3xs flex items-center space-x-2 text-[11px] font-bold text-slate-650 cursor-pointer hover:bg-slate-50 transition select-none">
          <span>📅</span>
          <span>06 May 2025 - 12 May 2025</span>
          <span>▼</span>
        </div>
      </div>

      {/* Top Statistics Row (5 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { title: 'Total Earnings', value: '₹82,650', trend: '↑ 18.6% vs last week', icon: '💵', isGreen: true },
          { title: 'Total Orders', value: totalAssigned ? (120 + totalAssigned) : '126', trend: '↑ 12.4% vs last week', icon: '🛒', isGreen: true },
          { title: 'Total Commission', value: '₹12,480', trend: '↑ 15.3% vs last week', icon: '💰', isGreen: true },
          { title: 'Products Sold', value: completedJobs ? (150 + completedJobs) : '156', trend: '↑ 10.7% vs last week', icon: '📦', isGreen: true },
          { title: 'Pending Payout', value: '₹8,320', trend: 'Will be paid on 15 May 2025', icon: '⏳', isText: true }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-3 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-black text-slate-800">{stat.value}</h3>
              <p className={`text-[9px] font-bold ${stat.isText ? 'text-slate-400' : 'text-[#39b54a]'}`}>
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Grid layout (Earnings Overview chart + Top Selling Categories) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Overview Card */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-black text-xs text-[#0c213a] uppercase tracking-wider">Earnings Overview</h3>
            <select className="bg-slate-50 border rounded-lg px-2.5 py-1 text-[10px] font-bold text-slate-600 focus:outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          
          {/* Custom SVG Line Chart */}
          <div className="relative pt-4 h-48 w-full">
            <svg className="w-full h-full" viewBox="0 0 600 160">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#39b54a" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#39b54a" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              {/* Path Area */}
              <path 
                d="M 50 120 L 130 110 L 210 95 L 290 85 L 370 100 L 450 92 L 550 50 L 550 150 L 50 150 Z" 
                fill="url(#chartGrad)" 
              />
              {/* Line Path */}
              <path 
                d="M 50 120 L 130 110 L 210 95 L 290 85 L 370 100 L 450 92 L 550 50" 
                fill="none" 
                stroke="#39b54a" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              {/* Points circles */}
              {[
                { x: 50, y: 120 }, { x: 130, y: 110 }, { x: 210, y: 95 }, 
                { x: 290, y: 85 }, { x: 370, y: 100 }, { x: 450, y: 92 }, { x: 550, y: 50 }
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke="#39b54a" strokeWidth="2.5" />
              ))}
              {/* Active point tooltip indicator */}
              <circle cx="370" cy="100" r="6" fill="#39b54a" />
            </svg>
            <div className="absolute top-10 left-[310px] bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-[9px] shadow-lg border border-slate-700 flex flex-col font-bold">
              <span className="text-slate-400">10 May 2025</span>
              <span className="text-[#39b54a]">₹14,850</span>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-bold px-4 pt-1.5 border-t">
              {['06 May', '07 May', '08 May', '09 May', '10 May', '11 May', '12 May'].map(lbl => <span key={lbl}>{lbl}</span>)}
            </div>
          </div>
        </div>

        {/* Top Selling Categories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-black text-xs text-[#0c213a] uppercase tracking-wider">Top Selling Categories</h3>
            <span className="text-[10px] font-black text-[#39b54a] hover:underline cursor-pointer">View All</span>
          </div>
          <div className="space-y-4">
            {[
              { cat: 'Mobile Phones', pct: 62, count: 78, bar: 'bg-[#39b54a]', icon: '📱' },
              { cat: 'Laptops', pct: 18, count: 23, bar: 'bg-blue-500', icon: '💻' },
              { cat: 'TVs', pct: 10, count: 13, bar: 'bg-indigo-500', icon: '📺' },
              { cat: 'Tablets', pct: 6, count: 8, bar: 'bg-emerald-500', icon: '📟' },
              { cat: 'Accessories', pct: 4, count: 5, bar: 'bg-slate-400', icon: '🎧' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <span>{item.icon}</span>
                    <span>{item.cat}</span>
                  </span>
                  <span className="text-slate-400 font-semibold">{item.pct}% ({item.count})</span>
                </div>
                {/* Progress bar container */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.bar}`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid layout (Recent Orders + Payout Overview + Account Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-black text-xs text-[#0c213a] uppercase tracking-wider">Recent Orders</h3>
            <Link href="/incoming-orders" className="text-[10px] font-black text-[#39b54a] hover:underline">View All</Link>
          </div>
          <div className="space-y-4 divide-y divide-slate-100">
            {[
              { id: '#CFN12560', desc: 'iPhone 14 Pro Max 256GB', price: '₹72,999', date: '12 May 2025', status: 'Delivered', statColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
              { id: '#CFN12559', desc: 'MacBook Air M2 256GB', price: '₹89,999', date: '11 May 2025', status: 'Shipped', statColor: 'bg-blue-50 text-blue-600 border border-blue-100' },
              { id: '#CFN12558', desc: 'Samsung 55" 4K TV', price: '₹36,990', date: '11 May 2025', status: 'Delivered', statColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
              { id: '#CFN12557', desc: 'boAt Airdopes 141', price: '₹1,299', date: '10 May 2025', status: 'Processing', statColor: 'bg-amber-50 text-amber-600 border border-amber-100' }
            ].map((order, idx) => (
              <div key={idx} className={`flex justify-between items-center pt-3.5 ${idx === 0 ? 'pt-0' : ''}`}>
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-slate-800">{order.desc}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold">ID: {order.id} | {order.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-slate-800 block text-xs">{order.price}</span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.2 rounded-full ${order.statColor}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Overview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-black text-xs text-[#0c213a] uppercase tracking-wider">Payout Overview</h3>
            <span className="text-[10px] font-black text-[#39b54a] hover:underline cursor-pointer">View All</span>
          </div>
          <div className="space-y-5">
            <div className="p-4 bg-slate-50 border rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Available Balance</p>
                <h4 className="text-lg font-black text-slate-800">₹8,320</h4>
              </div>
              <button 
                onClick={() => alert('Payout request of ₹8,320 sent to admin verification!')}
                className="px-4 py-2.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-xl text-[10px] shadow-3xs transition cursor-pointer"
              >
                Request Payout
              </button>
            </div>

            <div className="space-y-2.5 pt-1.5 text-xs font-bold text-slate-650">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">Last Payout</span>
                <span className="text-slate-700">₹15,680 <span className="text-[9px] text-slate-400 font-semibold">(01 May 2025)</span></span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">Total Payouts</span>
                <span className="text-slate-700">₹1,25,430</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Next Payout Date</span>
                <span className="text-slate-700">15 May 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-black text-xs text-[#0c213a] uppercase tracking-wider">Account Summary</h3>
          </div>
          <div className="space-y-3.5 text-xs font-bold text-slate-650">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-400">Partner Name</span>
              <span className="text-slate-800">MobileHub Store</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-400">Partner ID</span>
              <span className="text-slate-800">CFN12345</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-400">Joining Date</span>
              <span className="text-slate-800">15 Feb 2025</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-400">Account Status</span>
              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-black uppercase text-[9px] border border-emerald-100">Active</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-400">Commission Rate</span>
              <span className="text-slate-800">Up to 10%</span>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100/60 p-3.5 rounded-xl flex items-center space-x-2 text-[10px] text-[#39b54a] font-black cursor-pointer hover:bg-emerald-50 transition">
              <span>📞</span>
              <span>Need help? Contact Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
