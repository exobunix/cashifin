"use client";
import React, { useState } from 'react';

export default function IncomingOrders() {
  const [orders, setOrders] = useState([
    { id: 'ORD-8921', client: 'Aman Sharma', device: 'iPhone 14 Pro Max 256GB', price: '₹72,999', slot: 'Tomorrow, 10:00 AM', pincode: '110016', distance: '1.2 KM' },
    { id: 'ORD-8918', client: 'Priya Patel', device: 'MacBook Air M2 8/256GB', price: '₹68,500', slot: 'Tomorrow, 02:00 PM', pincode: '110024', distance: '3.4 KM' },
    { id: 'ORD-8915', client: 'Vikram Singh', device: 'Samsung Galaxy S23 Ultra', price: '₹55,000', slot: '08 May, 11:30 AM', pincode: '110502', distance: '4.8 KM' },
    { id: 'ORD-8902', client: 'Ritu Sen', device: 'Sony PlayStation 5 Slim', price: '₹34,000', slot: '09 May, 04:00 PM', pincode: '110016', distance: '2.1 KM' }
  ]);

  const handleAction = (id: string, action: string) => {
    alert(`Order ${id} has been ${action}ed!`);
    setOrders(orders.filter(o => o.id !== id));
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-800">📥 Incoming Doorstep Pickup Requests</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Accept inspection leads in your assigned region pincodes.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-4">Order ID</th>
              <th className="p-4">Client Name</th>
              <th className="p-4">Device Details</th>
              <th className="p-4">Offered Price</th>
              <th className="p-4">Preferred Slot</th>
              <th className="p-4">Distance</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="p-4"><span className="bg-slate-100 px-2.5 py-1 rounded text-slate-800">{o.id}</span></td>
                <td className="p-4 text-slate-900">{o.client}</td>
                <td className="p-4">{o.device}</td>
                <td className="p-4 text-[#39b54a] font-black">{o.price}</td>
                <td className="p-4 text-slate-500">{o.slot}</td>
                <td className="p-4 font-mono text-slate-550">{o.distance} ({o.pincode})</td>
                <td className="p-4 text-center space-x-2">
                  <button onClick={() => handleAction(o.id, 'accept')} className="px-3.5 py-1.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-lg text-[10px] shadow-3xs transition">Accept</button>
                  <button onClick={() => handleAction(o.id, 'decline')} className="px-3.5 py-1.5 bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100 font-black rounded-lg text-[10px] transition">Decline</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">No active incoming jobs. We will notify you when new requests arrive!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
