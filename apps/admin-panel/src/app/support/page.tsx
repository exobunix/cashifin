"use client";
import React, { useState, useEffect } from 'react';

export default function RoutePage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading tickets:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Merge loaded tickets with initial static customer support tickets
  const defaultTickets = [
    { id: 'TCK-201', subject: 'Payment Delay - Order #1092', partnerName: 'Sarah Connor', type: 'Customer Support', priority: 'High', status: 'Open', date: '09 Aug 2026' }
  ];

  const allTickets = [
    ...tickets.map(t => ({
      id: t.id,
      subject: t.subject,
      partnerName: t.partnerName,
      type: t.type || 'Bank Transfer',
      priority: t.amount && t.amount > 10000 ? 'High' : 'Medium',
      status: t.status,
      date: t.date
    })),
    ...defaultTickets
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-base font-bold text-slate-800">Support & Verification Tickets</h3>
          <p className="text-xs text-slate-400 mt-1">Resolve customer support inquiries and vendor bank payment validations.</p>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400">Loading support tickets...</div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b">
                <th className="p-3">Ticket ID</th>
                <th className="p-3">Subject / Type</th>
                <th className="p-3">Requested By</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
              {allTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono text-slate-500">{t.id}</td>
                  <td className="p-3">
                    <p className="text-slate-900">{t.subject}</p>
                    <span className="text-[9px] text-slate-400 font-semibold">{t.type}</span>
                  </td>
                  <td className="p-3 text-slate-650">{t.partnerName}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] border ${
                      t.priority === 'High' 
                        ? 'bg-red-50 text-red-650 border-red-100' 
                        : 'bg-blue-50 text-blue-650 border-blue-100'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-semibold">{t.date}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] border ${
                      t.status === 'Open' 
                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                        : t.status === 'Resolved' || t.status === 'Success'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
