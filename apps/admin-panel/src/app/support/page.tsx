import React from 'react';

export default function RoutePage() {
  return (
    <div className="p-6">
      
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="text-base font-bold text-slate-800 border-b pb-4 mb-4">Customer Support Tickets</h3>
    <table className="w-full text-left border-collapse text-xs">
      <thead>
        <tr className="bg-slate-50 text-slate-400 font-bold border-b">
          <th className="p-3">Ticket ID</th>
          <th className="p-3">Subject</th>
          <th className="p-3">User</th>
          <th className="p-3">Priority</th>
          <th className="p-3">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {[
          { id: 'TCK-201', subject: 'Payment Delay - Order #1092', user: 'Sarah Connor', priority: 'High', status: 'Open' }
        ].map((t) => (
          <tr key={t.id}>
            <td className="p-3 font-bold text-slate-900">{t.id}</td>
            <td className="p-3 font-bold text-slate-800">{t.subject}</td>
            <td className="p-3 text-slate-500">{t.user}</td>
            <td className="p-3"><span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-600">{t.priority}</span></td>
            <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600">{t.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

    </div>
  );
}
