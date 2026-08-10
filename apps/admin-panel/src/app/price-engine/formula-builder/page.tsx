"use client";
import React, { useState } from 'react';

const initialFormulas = [
  {
    "id": "FORM-01",
    "name": "Standard Age Depreciation",
    "formula": "expectedPrice * Math.pow(0.97, ageMonths)",
    "type": "Depreciation"
  },
  {
    "id": "FORM-02",
    "name": "Premium Segment Adjustment",
    "formula": "baseVal * demandMultiplier * supplyMultiplier",
    "type": "Multiplier"
  },
  {
    "id": "FORM-03",
    "name": "Warehouse Stock Cap",
    "formula": "stockCount > 100 ? baseVal * 0.95 : baseVal",
    "type": "Overstock Adjustment"
  },
  {
    "id": "FORM-04",
    "name": "Logistics Overhead Penalty",
    "formula": "pickupDistance > 30 ? baseVal - 200 : baseVal",
    "type": "Overhead deduction"
  }
];

export default function FormulasPage() {
  const [formulas, setFormulas] = useState(initialFormulas);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newExp, setNewExp] = useState('');
  const [newType, setNewType] = useState('Depreciation');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newExp) return;
    setFormulas([...formulas, {
      id: `FORM-0${formulas.length + 1}`,
      name: newName,
      formula: newExp,
      type: newType
    }]);
    setNewName('');
    setNewExp('');
    setShowModal(false);
  };

  const filtered = formulas.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Formula Expression Builder</h3>
          <p className="text-xs text-slate-400">View and update active depreciation and multiplier formulas</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search formulas..."
            className="p-2 border rounded text-xs w-64 bg-white"
          />
          <button onClick={() => setShowModal(true)} className="px-3 py-1.5 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600">
            Create Formula
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3">Formula ID</th>
              <th className="p-3">Name</th>
              <th className="p-3 font-mono">Expression</th>
              <th className="p-3">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(f => (
              <tr key={f.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{f.id}</td>
                <td className="p-3 font-bold text-slate-800">{f.name}</td>
                <td className="p-3 font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded">{f.formula}</td>
                <td className="p-3 text-slate-500 font-bold">{f.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-slate-800 border-b pb-2">Create Custom Formula</h4>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Formula Name</label><input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="p-2 border rounded" placeholder="e.g. Volume adjust" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Expression Formula</label><input type="text" value={newExp} onChange={e => setNewExp(e.target.value)} className="p-2 border rounded font-mono" placeholder="expectedPrice * 0.95" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Type</label><input type="text" value={newType} onChange={e => setNewType(e.target.value)} className="p-2 border rounded" placeholder="Depreciation" required /></div>
              <div className="flex justify-end space-x-2 pt-3"><button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button><button type="submit" className="px-3 py-1.5 bg-emerald-500 text-white rounded font-bold">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
