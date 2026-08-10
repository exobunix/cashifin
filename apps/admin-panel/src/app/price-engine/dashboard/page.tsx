"use client";
import React from 'react';

export default function PriceEngineDashboard() {
  const stats = [
    { label: 'Active Formulas', value: '12 Live', desc: 'Depreciation & overhead expressions', icon: '📝', color: 'text-emerald-500' },
    { label: 'Configured Questions', value: '42 Items', desc: 'Across 4 active product categories', icon: '📋', color: 'text-blue-500' },
    { label: 'Active Rules', value: '34 Rules', desc: 'Deductions & conditional penalties', icon: '⚙️', color: 'text-purple-500' },
    { label: 'Device Evaluations', value: '14,820', desc: 'Assessments simulated this month', icon: '⚡', color: 'text-amber-500' }
  ];

  const recentLogs = [
    { timestamp: '06 Aug 2026, 04:12 PM', author: 'Adarsh Admin', change: 'Updated screen replacement deduction rules (v2.4.1)' },
    { timestamp: '05 Aug 2026, 11:30 AM', author: 'Adarsh Admin', change: 'Modified Apple iPhone 14 Pro expected base price value' },
    { timestamp: '02 Aug 2026, 02:45 PM', author: 'Adarsh Admin', change: 'Added MacBook Pro M3 category pricing bounds configurations' },
    { timestamp: '01 Aug 2026, 09:15 AM', author: 'Adarsh Admin', change: 'Deployed emergency hotfix for battery health penalties (v2.4.0)' }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-800">
      {/* Heading */}
      <div>
        <h2 className="text-lg font-bold text-slate-800">Pricing Engine Overview Dashboard</h2>
        <p className="text-xs text-slate-400 mt-0.5">Real-time statistics, formula outputs, and engine modification audit logs</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
              <p className="text-2xl font-black text-slate-800 mt-1">{s.value}</p>
              <p className="text-[10px] text-slate-400 mt-1">{s.desc}</p>
            </div>
            <span className={`text-2xl p-2 bg-slate-50 rounded-lg ${s.color}`}>{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appraisal Volumes Line Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-800 text-sm">Evaluation Trend (Appraisals / Day)</h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">Last 7 Days</span>
          </div>
          <div className="h-60 relative w-full pt-4">
            {/* SVG line chart */}
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" />
              
              {/* Smooth Spline Area */}
              <path d="M 0 160 C 80 140, 160 110, 240 70 C 320 50, 400 90, 500 40 L 500 200 L 0 200 Z" fill="url(#grad-appraisals)" />
              <path d="M 0 160 C 80 140, 160 110, 240 70 C 320 50, 400 90, 500 40" fill="none" stroke="#3b82f6" strokeWidth="3" />
              
              <defs>
                <linearGradient id="grad-appraisals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold px-1">
              <span>01 Aug</span>
              <span>02 Aug</span>
              <span>03 Aug</span>
              <span>04 Aug</span>
              <span>05 Aug</span>
              <span>06 Aug</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Category Share Donut */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <h3 className="font-extrabold text-slate-800 text-sm">Buyback Valuation Share</h3>
          <div className="flex items-center justify-center py-2">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                {/* Smartphones (68%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="68 32" strokeDashoffset="0" />
                {/* Laptops (18%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="18 82" strokeDashoffset="-68" />
                {/* Tablets (10%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="-86" />
                {/* Watches (4%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="4 96" strokeDashoffset="-96" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-slate-400 font-bold leading-none">Smartphones</span>
                <span className="text-lg font-black text-slate-800 mt-1">68%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span><span>Phones (68%)</span></div>
            <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500"></span><span>Laptops (18%)</span></div>
            <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded bg-purple-500"></span><span>Tablets (10%)</span></div>
            <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span><span>Watches (4%)</span></div>
          </div>
        </div>
      </div>

      {/* Modifications History logs */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="font-extrabold text-slate-800 text-sm border-b pb-3 mb-4">Pricing Engine Modification Logs</h3>
        <div className="divide-y divide-slate-150">
          {recentLogs.map((log, idx) => (
            <div key={idx} className="py-3 flex justify-between items-center text-xs">
              <div>
                <span className="font-black text-slate-700">{log.author}</span>
                <p className="text-slate-500 mt-1">{log.change}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
