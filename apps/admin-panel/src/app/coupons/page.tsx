"use client";
import React, { useState, useEffect } from 'react';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiry, setExpiry] = useState('');

  const loadData = () => {
    fetch('/api/coupons')
      .then(res => res.json())
      .then(data => setCoupons(data || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discount) return;

    const newCoupon = {
      id: `CPN-${Date.now()}`,
      code: code.toUpperCase(),
      description: description || `Get extra ${discount} resale bonus`,
      discount,
      expiry: expiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', item: newCoupon })
    });
    const result = await res.json();
    if (result.success) {
      setCoupons(result.data);
    }
    
    setCode('');
    setDescription('');
    setDiscount('');
    setExpiry('');
    setShowAddModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      const result = await res.json();
      if (result.success) {
        setCoupons(result.data);
      }
    }
  };

  return (
    <div className="p-6 space-y-4 text-xs text-slate-800">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-black">Coupons & Offers</h3>
          <p className="text-slate-400 font-semibold mt-1">Manage buyback bonus codes and promotional offers</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 shadow-sm">
          + Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b uppercase text-[10px] tracking-wider">
              <th className="p-3">Coupon Code</th>
              <th className="p-3">Description</th>
              <th className="p-3">Resale Bonus</th>
              <th className="p-3">Expiry Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map((c) => (
              <tr key={c.id || c.code} className="hover:bg-slate-50 transition">
                <td className="p-3 font-black text-slate-900 font-mono text-sm">{c.code}</td>
                <td className="p-3 text-slate-500 font-medium">{c.description}</td>
                <td className="p-3 font-bold text-emerald-600">{c.discount}</td>
                <td className="p-3 text-slate-400 font-semibold">{c.expiry}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleDelete(c.id || c.code)} className="text-rose-500 hover:text-rose-705 font-bold">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">
                  No active coupons found. Click "+ Add Coupon" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl space-y-4">
            <h4 className="font-bold text-sm border-b pb-2">Add Coupon Code</h4>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Coupon Code</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="SAVE1000" className="p-2 border rounded bg-slate-50 font-mono uppercase" required />
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Resale Bonus (e.g. ₹1,000 Bonus)</label>
                <input type="text" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="₹1,000 Bonus" className="p-2 border rounded bg-slate-50" required />
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Description (Optional)</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Get extra ₹1,000 resale bonus" className="p-2 border rounded bg-slate-50" />
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Expiry Date (Optional)</label>
                <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="30 Sep 2026" className="p-2 border rounded bg-slate-50" />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-500 text-white rounded font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
