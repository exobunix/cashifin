import React from 'react';

export default function RoutePage() {
  return (
    <div className="p-6">
      
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="text-base font-bold text-slate-800 border-b pb-4 mb-4">Admin Audit Logs</h3>
    <div className="space-y-3">
      {[
        { timestamp: '20 Jun 2024, 04:30 PM', admin: 'Adarsh Admin', action: 'Modified Pricing Rule #RULE-002 (Screen Broken deduction)' }
      ].map((log, i) => (
        <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between text-xs">
          <div>
            <span className="font-extrabold text-slate-800">{log.admin}</span>
            <p className="text-slate-500 mt-1">{log.action}</p>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">{log.timestamp}</span>
        </div>
      ))}
    </div>
  </div>

    </div>
  );
}
