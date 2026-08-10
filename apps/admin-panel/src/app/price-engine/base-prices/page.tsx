"use client";
import React, { useState, useEffect } from 'react';

export default function BasePricesPage() {
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states
  const [basePrice, setBasePrice] = useState('');
  const [demandMult, setDemandMult] = useState('');
  const [supplyMult, setSupplyMult] = useState('');

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = () => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data || []));
  };

  const handleEditClick = (model: any) => {
    setSelectedModel(model);
    setBasePrice(model.rawBase?.toString() || '15000');
    setDemandMult(model.demandMult?.replace('x', '') || '1.00');
    setSupplyMult(model.supplyMult?.replace('x', '') || '1.00');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel || !basePrice) return;

    const baseVal = parseFloat(basePrice);
    const minVal = Math.round(baseVal * 0.25);
    const maxVal = Math.round(baseVal * 1.15);

    const updatedModel = {
      ...selectedModel,
      basePrice: `₹${baseVal.toLocaleString()}`,
      range: `₹${minVal.toLocaleString()} - ₹${maxVal.toLocaleString()}`,
      rawBase: baseVal,
      rawMin: minVal,
      rawMax: maxVal,
      demandMult: `${parseFloat(demandMult).toFixed(2)}x`,
      supplyMult: `${parseFloat(supplyMult).toFixed(2)}x`
    };

    const res = await fetch('/api/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', item: updatedModel })
    });
    const result = await res.json();
    if (result.success) {
      setModels(result.data);
    }
    setShowEditModal(false);
    setSelectedModel(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing configuration?')) return;
    const res = await fetch('/api/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const result = await res.json();
    if (result.success) {
      setModels(result.data);
    }
  };

  const filtered = models.filter((m: any) => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4 text-slate-800">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Base Price Configurations</h3>
          <p className="text-xs text-slate-400">View and update expected values, demand multipliers, and supply indices</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search models..."
          className="p-2 border rounded text-xs w-64 bg-white focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3">Model</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Expected Base Price</th>
              <th className="p-3">Valuation Range Limit</th>
              <th className="p-3">Demand Mult.</th>
              <th className="p-3">Supply Mult.</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((m: any) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{m.name}</td>
                <td className="p-3 text-slate-500">{m.brand}</td>
                <td className="p-3 font-semibold text-slate-700">{m.basePrice}</td>
                <td className="p-3 text-slate-400 font-mono">{m.range}</td>
                <td className="p-3 font-mono text-emerald-600 font-bold">{m.demandMult || '1.00x'}</td>
                <td className="p-3 font-mono text-amber-600 font-bold">{m.supplyMult || '1.00x'}</td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => handleEditClick(m)} className="text-emerald-600 hover:text-emerald-800 font-bold">✏️ Edit</button>
                  <button onClick={() => handleDelete(m.id)} className="text-rose-500 hover:text-rose-700 font-bold">🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl space-y-4">
            <h4 className="font-bold text-sm border-b pb-2">Edit Base Price Config - {selectedModel?.name}</h4>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Expected Base Price (INR)</label>
                <input 
                  type="number" 
                  value={basePrice} 
                  onChange={e => setBasePrice(e.target.value)} 
                  className="p-2 border rounded" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="font-bold text-slate-500 mb-1">Demand Multiplier</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={demandMult} 
                    onChange={e => setDemandMult(e.target.value)} 
                    className="p-2 border rounded" 
                    placeholder="1.00" 
                    required 
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold text-slate-500 mb-1">Supply Multiplier</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={supplyMult} 
                    onChange={e => setSupplyMult(e.target.value)} 
                    className="p-2 border rounded" 
                    placeholder="1.00" 
                    required 
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold transition">Update Config</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
