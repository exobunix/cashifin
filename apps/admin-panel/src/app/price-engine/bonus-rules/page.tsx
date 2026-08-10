"use client";
import React, { useState, useEffect } from 'react';

export default function BonusRulesPage() {
  const [bonuses, setBonuses] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState<any>(null);

  // Form states
  const [condition, setCondition] = useState('');
  const [bonusVal, setBonusVal] = useState('');
  const [mapping, setMapping] = useState('All Devices');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    fetchBonuses();
  }, []);

  const fetchBonuses = () => {
    fetch('/api/bonusRules')
      .then(res => res.json())
      .then(data => setBonuses(data || []));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!condition || !bonusVal) return;

    const newBonus = {
      id: `BONUS-0${bonuses.length + 1}`,
      condition,
      bonus: bonusVal,
      category: mapping,
      status
    };

    const res = await fetch('/api/bonusRules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', item: newBonus })
    });
    const result = await res.json();
    if (result.success) {
      setBonuses(result.data);
    }
    setCondition('');
    setBonusVal('');
    setShowAddModal(false);
  };

  const handleEditClick = (b: any) => {
    setSelectedBonus(b);
    setCondition(b.condition);
    setBonusVal(b.bonus);
    setMapping(b.category);
    setStatus(b.status);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!condition || !bonusVal || !selectedBonus) return;

    const updatedBonus = {
      ...selectedBonus,
      condition,
      bonus: bonusVal,
      category: mapping,
      status
    };

    const res = await fetch('/api/bonusRules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', item: updatedBonus })
    });
    const result = await res.json();
    if (result.success) {
      setBonuses(result.data);
    }
    setShowEditModal(false);
    setSelectedBonus(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bonus rule?')) return;
    const res = await fetch('/api/bonusRules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const result = await res.json();
    if (result.success) {
      setBonuses(result.data);
    }
  };

  const filtered = bonuses.filter((b: any) => b.condition.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-4 text-slate-800">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Bonus Rules Configurations</h3>
          <p className="text-xs text-slate-400">View and update active resale value bonuses</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search bonuses..."
            className="p-2 border rounded text-xs w-64 bg-white focus:outline-none"
          />
          <button 
            onClick={() => {
              setCondition('');
              setBonusVal('');
              setMapping('All Devices');
              setStatus('Active');
              setShowAddModal(true);
            }} 
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold transition shadow-xs"
          >
            Create Bonus
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3">Bonus ID</th>
              <th className="p-3">Condition (IF)</th>
              <th className="p-3">Bonus Added</th>
              <th className="p-3">Mapping</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((b: any) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{b.id}</td>
                <td className="p-3 font-bold text-slate-805">{b.condition}</td>
                <td className="p-3 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block my-1.5">{b.bonus}</td>
                <td className="p-3 text-slate-500">{b.category}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    b.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>{b.status}</span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => handleEditClick(b)} className="text-emerald-600 hover:text-emerald-800 font-bold">✏️ Edit</button>
                  <button onClick={() => handleDelete(b.id)} className="text-rose-500 hover:text-rose-700 font-bold">🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Bonus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl space-y-4">
            <h4 className="font-bold text-sm border-b pb-2">Create Resale Bonus</h4>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Condition (IF)</label><input type="text" value={condition} onChange={e => setCondition(e.target.value)} className="p-2 border rounded" placeholder="e.g. Original Box & Invoice Available" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Bonus Added Value</label><input type="text" value={bonusVal} onChange={e => setBonusVal(e.target.value)} className="p-2 border rounded" placeholder="e.g. Add ₹500 or Add 5% Extra" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Device Mapping</label><input type="text" value={mapping} onChange={e => setMapping(e.target.value)} className="p-2 border rounded" required /></div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold transition">Save Bonus</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Bonus Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl space-y-4">
            <h4 className="font-bold text-sm border-b pb-2">Edit Bonus - {selectedBonus?.id}</h4>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Condition (IF)</label><input type="text" value={condition} onChange={e => setCondition(e.target.value)} className="p-2 border rounded" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Bonus Added Value</label><input type="text" value={bonusVal} onChange={e => setBonusVal(e.target.value)} className="p-2 border rounded" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Device Mapping</label><input type="text" value={mapping} onChange={e => setMapping(e.target.value)} className="p-2 border rounded" required /></div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold transition">Update Bonus</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
