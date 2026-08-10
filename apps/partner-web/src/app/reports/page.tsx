"use client";
import React from 'react';

export default function Reports() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-800">📈 Partner Performance Reports</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Review diagnostic accuracy charts, collection volumes, and customer conversion rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Monthly Collection Conversion Rate</h3>
          {/* Custom SVG Line Chart */}
          <div className="relative pt-4 h-48 w-full">
            <svg className="w-full h-full" viewBox="0 0 600 160">
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <path d="M 50 110 L 150 90 L 250 100 L 350 70 L 450 50 L 550 45" fill="none" stroke="#39b54a" strokeWidth="3" />
              {[
                { x: 50, y: 110 }, { x: 150, y: 90 }, { x: 250, y: 100 }, 
                { x: 350, y: 70 }, { x: 450, y: 50 }, { x: 550, y: 45 }
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#39b54a" strokeWidth="2" />
              ))}
            </svg>
            <div className="flex justify-between text-[9px] text-slate-400 font-bold px-4 pt-1.5 border-t">
              {['Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025'].map(lbl => <span key={lbl}>{lbl}</span>)}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Verification Accuracy Stats</h3>
          <div className="space-y-4 pt-2">
            {[
              { label: 'Accurate Appraisals', pct: 94, color: 'bg-[#39b54a]' },
              { label: 'Disputed Appraisals', pct: 4, color: 'bg-amber-500' },
              { label: 'Device Rejections', pct: 2, color: 'bg-rose-500' }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>{stat.label}</span>
                  <span className="text-slate-400">{stat.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${stat.color}`} style={{ width: `${stat.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
