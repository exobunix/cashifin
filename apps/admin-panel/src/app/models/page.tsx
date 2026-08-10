"use client";
import React, { useState, useEffect } from 'react';

const brandsList = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Dell', 'Lenovo', 'Xiaomi', 'Realme', 'Oppo', 'Vivo', 'Sony', 'LG', 'Microsoft'];
const categoriesList = ['Smartphones', 'Laptops', 'Tablets', 'Smartwatches', 'TVs', 'Gaming Consoles'];

export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentModel, setCurrentModel] = useState<any>(null);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [category, setCategory] = useState('Smartphones');
  const [imageUrl, setImageUrl] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [status, setStatus] = useState('Published');

  const loadData = () => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setName('');
    setBrand('Apple');
    setCategory('Smartphones');
    setImageUrl('');
    setBasePrice('');
    setMinPrice('');
    setMaxPrice('');
    setStatus('Published');
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !basePrice) return;

    const baseVal = parseFloat(basePrice);
    const minVal = minPrice ? parseFloat(minPrice) : Math.round(baseVal * 0.25);
    const maxVal = maxPrice ? parseFloat(maxPrice) : Math.round(baseVal * 1.15);

    const newM = {
      id: `MDL-${300 + models.length + 1}`,
      name,
      brand,
      category,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=150&auto=format&fit=crop',
      basePrice: `₹${baseVal.toLocaleString()}`,
      range: `₹${minVal.toLocaleString()} - ₹${maxVal.toLocaleString()}`,
      status,
      rawBase: baseVal,
      rawMin: minVal,
      rawMax: maxVal
    };

    const res = await fetch('/api/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', item: newM })
    });
    const result = await res.json();
    if (result.success) {
      setModels(result.data);
    }
    setShowAddModal(false);
  };

  const handleEditClick = (model: any) => {
    setCurrentModel(model);
    setName(model.name);
    setBrand(model.brand);
    setCategory(model.category || 'Smartphones');
    setImageUrl(model.imageUrl || '');
    setBasePrice(model.rawBase?.toString() || '15000');
    setMinPrice(model.rawMin?.toString() || '3000');
    setMaxPrice(model.rawMax?.toString() || '17000');
    setStatus(model.status);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !basePrice || !currentModel) return;

    const baseVal = parseFloat(basePrice);
    const minVal = minPrice ? parseFloat(minPrice) : Math.round(baseVal * 0.25);
    const maxVal = maxPrice ? parseFloat(maxPrice) : Math.round(baseVal * 1.15);

    const updatedM = {
      ...currentModel,
      name,
      brand,
      category,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=150&auto=format&fit=crop',
      basePrice: `₹${baseVal.toLocaleString()}`,
      range: `₹${minVal.toLocaleString()} - ₹${maxVal.toLocaleString()}`,
      status,
      rawBase: baseVal,
      rawMin: minVal,
      rawMax: maxVal
    };

    const res = await fetch('/api/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', item: updatedM })
    });
    const result = await res.json();
    if (result.success) {
      setModels(result.data);
    }
    setShowEditModal(false);
    setCurrentModel(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this model record?')) {
      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      const result = await res.json();
      if (result.success) {
        setModels(result.data);
      }
    }
  };

  const filtered = models.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.brand.toLowerCase().includes(search.toLowerCase()) ||
    (m.category && m.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-4 text-slate-800 text-xs">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-black">Device Models Mapped</h3>
          <p className="text-slate-400 font-semibold mt-1">View and update dynamic pricing bounds, categories, and image assets</p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search models or categories..."
            className="p-2.5 border rounded-lg w-64 bg-white focus:outline-none"
          />
          <button onClick={openAddModal} className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 shadow-sm">
            + Add Model
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b uppercase text-[10px] tracking-wider">
              <th className="p-3">Preview</th>
              <th className="p-3">Model</th>
              <th className="p-3">Category</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Base Price</th>
              <th className="p-3">Valuation Range</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((m, i) => (
              <tr key={i} className="hover:bg-slate-50 transition">
                <td className="p-3">
                  <img 
                    src={m.imageUrl || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=150&auto=format&fit=crop'} 
                    alt="Model" 
                    className="w-12 h-9 object-cover rounded border" 
                  />
                </td>
                <td className="p-3">
                  <p className="font-bold text-slate-850">{m.name}</p>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">{m.id}</p>
                </td>
                <td className="p-3">
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold text-[10px]">
                    {m.category || 'Smartphones'}
                  </span>
                </td>
                <td className="p-3 text-slate-500 font-bold">{m.brand}</td>
                <td className="p-3 font-black text-slate-700">{m.basePrice}</td>
                <td className="p-3 text-slate-400 font-mono">{m.range}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${m.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>{m.status}</span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => handleEditClick(m)} className="text-emerald-600 hover:text-emerald-800 font-bold">Edit</button>
                  <button onClick={() => handleDelete(m.id)} className="text-rose-500 hover:text-rose-750 font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl space-y-4">
            <h4 className="font-bold text-sm border-b pb-2">Add Device Model</h4>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Model Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="p-2 border rounded bg-slate-50" required /></div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 border rounded bg-slate-50">
                  {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Brand</label>
                <select value={brand} onChange={e => setBrand(e.target.value)} className="p-2 border rounded bg-slate-50">
                  {brandsList.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Image URL (Optional)</label><input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Unsplash image link" className="p-2 border rounded bg-slate-50" /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Base Price (INR)</label><input type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} className="p-2 border rounded bg-slate-50" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Min Price Limit</label><input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="p-2 border rounded bg-slate-50" /></div>
                <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Max Price Limit</label><input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="p-2 border rounded bg-slate-50" /></div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-500 text-white rounded font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl space-y-4">
            <h4 className="font-bold text-sm border-b pb-2 font-mono">Edit Model - {currentModel?.id}</h4>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Model Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="p-2 border rounded bg-slate-50" required /></div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 border rounded bg-slate-50">
                  {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Brand</label>
                <select value={brand} onChange={e => setBrand(e.target.value)} className="p-2 border rounded bg-slate-50">
                  {brandsList.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Image URL (Optional)</label><input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Unsplash image link" className="p-2 border rounded bg-slate-50" /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Base Price (INR)</label><input type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} className="p-2 border rounded bg-slate-50" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Min Price Limit</label><input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="p-2 border rounded bg-slate-50" /></div>
                <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Max Price Limit</label><input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="p-2 border rounded bg-slate-50" /></div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-500 text-white rounded font-bold">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
