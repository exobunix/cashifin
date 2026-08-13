"use client";
import React, { useState, useEffect } from 'react';

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);

  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newCat, setNewCat] = useState('Smartphones');
  const [newLogoUrl, setNewLogoUrl] = useState('');

  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editCat, setEditCat] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditLogoUrl(reader.result as string);
        } else {
          setNewLogoUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const loadData = () => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => setBrands(data || []));

    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSlug) return;
    
    const newItem = {
      id: `BRD-${(brands.length + 1).toString().padStart(3, '0')}`,
      name: newName,
      slug: newSlug,
      category: newCat,
      logoUrl: newLogoUrl
    };

    const res = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', item: newItem })
    });
    const result = await res.json();
    if (result.success) {
      setBrands(result.data);
    }
    
    setNewName('');
    setNewSlug('');
    setNewLogoUrl('');
    setShowAddModal(false);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand || !editName || !editSlug) return;

    const updatedItem = {
      ...editingBrand,
      name: editName,
      slug: editSlug,
      category: editCat,
      logoUrl: editLogoUrl
    };

    const res = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', item: updatedItem })
    });
    const result = await res.json();
    if (result.success) {
      setBrands(result.data);
    }
    setEditingBrand(null);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const result = await res.json();
    if (result.success) {
      setBrands(result.data);
    }
  };

  const getBrandModelsCount = (brandName: string) => {
    return models.filter((m: any) => (m.brand || '').toLowerCase() === brandName.toLowerCase()).length;
  };

  const getBrandCategories = (brandName: string) => {
    const matched = models.filter((m: any) => (m.brand || '').toLowerCase() === brandName.toLowerCase());
    const uniqueCats = Array.from(new Set(matched.map((m: any) => m.category)));
    return uniqueCats.length > 0 ? uniqueCats.join(', ') : 'None';
  };

  const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Brands Management</h3>
          <p className="text-xs text-slate-400">Add or manage manufacture brands</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search brands..."
            className="p-2 border rounded text-xs w-64 bg-white"
          />
          <button onClick={() => setShowAddModal(true)} className="px-3 py-1.5 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600">
            + Brand
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3">Brand ID</th>
              <th className="p-3">Logo</th>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Models Count</th>
              <th className="p-3">Categories</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{b.id}</td>
                <td className="p-3">
                  <div className="w-12 h-8 rounded border bg-slate-50 flex items-center justify-center overflow-hidden p-0.5">
                    <img 
                      src={b.logoUrl || 'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=120&auto=format&fit=crop'} 
                      alt="" 
                      className="max-h-full max-w-full object-contain" 
                    />
                  </div>
                </td>
                <td className="p-3 font-bold text-slate-800">{b.name}</td>
                <td className="p-3 font-mono text-slate-500">{b.slug}</td>
                <td className="p-3 text-slate-600 font-bold">{getBrandModelsCount(b.name)} Models</td>
                <td className="p-3 text-slate-500 font-bold">{getBrandCategories(b.name)}</td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => {
                      setEditingBrand(b);
                      setEditName(b.name);
                      setEditSlug(b.slug);
                      setEditCat(b.category || '');
                      setEditLogoUrl(b.logoUrl || '');
                    }} 
                    className="text-blue-500 font-bold hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="text-rose-500 font-bold hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-slate-800 border-b pb-2">Add Manufacturer Brand</h4>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Brand Name</label><input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="p-2 border rounded" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Slug</label><input type="text" value={newSlug} onChange={e => setNewSlug(e.target.value)} className="p-2 border rounded font-mono" placeholder="nothing" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Applicable Category</label><input type="text" value={newCat} onChange={e => setNewCat(e.target.value)} className="p-2 border rounded" placeholder="Smartphones" required /></div>
              
              <div className="flex flex-col">
                <label className="font-bold text-slate-400 mb-1">Logo Preview & Upload</label>
                <div className="flex items-center space-x-3 mt-1 mb-2">
                  <div className="w-14 h-14 rounded-lg border bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                    {newLogoUrl ? (
                      <img src={newLogoUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-350">No Logo</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, false)}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
                <input type="text" value={newLogoUrl} onChange={e => setNewLogoUrl(e.target.value)} className="p-2 border rounded text-[10px] text-slate-450" placeholder="Or paste logo URL" />
              </div>

              <div className="flex justify-end space-x-2 pt-3"><button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button><button type="submit" className="px-3 py-1.5 bg-emerald-500 text-white rounded font-bold">Save</button></div>
            </form>
          </div>
        </div>
      )}

      {editingBrand && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-slate-800 border-b pb-2">Edit Manufacturer Brand</h4>
            <form onSubmit={handleEditSave} className="space-y-3 text-xs">
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Brand Name</label><input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="p-2 border rounded" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Slug</label><input type="text" value={editSlug} onChange={e => setEditSlug(e.target.value)} className="p-2 border rounded font-mono" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Categories (Comma separated)</label><input type="text" value={editCat} onChange={e => setEditCat(e.target.value)} className="p-2 border rounded" required /></div>
              
              <div className="flex flex-col">
                <label className="font-bold text-slate-400 mb-1">Logo Preview & Upload</label>
                <div className="flex items-center space-x-3 mt-1 mb-2">
                  <div className="w-14 h-14 rounded-lg border bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                    {editLogoUrl ? (
                      <img src={editLogoUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-350">No Logo</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, true)}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
                <input type="text" value={editLogoUrl} onChange={e => setEditLogoUrl(e.target.value)} className="p-2 border rounded text-[10px] text-slate-450" placeholder="Or paste logo URL" />
              </div>

              <div className="flex justify-end space-x-2 pt-3"><button type="button" onClick={() => setEditingBrand(null)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button><button type="submit" className="px-3 py-1.5 bg-emerald-500 text-white rounded font-bold">Update</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
