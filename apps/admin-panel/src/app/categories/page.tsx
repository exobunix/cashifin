"use client";
import React, { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  const loadData = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data || []));

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
      id: `CAT-${(categories.length + 1).toString().padStart(3, '0')}`,
      name: newName,
      slug: newSlug,
      imageUrl: newImageUrl
    };

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', item: newItem })
    });
    const result = await res.json();
    if (result.success) {
      setCategories(result.data);
    }
    
    setNewName('');
    setNewSlug('');
    setNewImageUrl('');
    setShowAddModal(false);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editName || !editSlug) return;

    const updatedItem = {
      ...editingCategory,
      name: editName,
      slug: editSlug,
      imageUrl: editImageUrl
    };

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', item: updatedItem })
    });
    const result = await res.json();
    if (result.success) {
      setCategories(result.data);
    }
    setEditingCategory(null);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const result = await res.json();
    if (result.success) {
      setCategories(result.data);
    }
  };

  const getDeviceCount = (categoryName: string) => {
    const cleanName = categoryName.toLowerCase();
    const count = models.filter((m: any) => {
      const modelCat = (m.category || '').toLowerCase();
      return modelCat.includes(cleanName.slice(0, -2)) || modelCat.includes(cleanName);
    }).length;
    return `${count} Devices`;
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Categories Management</h3>
          <p className="text-xs text-slate-400">Add or manage buyback product lines</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="p-2 border rounded text-xs w-64 bg-white"
          />
          <button onClick={() => setShowAddModal(true)} className="px-3 py-1.5 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600">
            + Category
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3">Category ID</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Device Count</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{c.id}</td>
                <td className="p-3">
                  <div className="w-10 h-10 rounded border bg-slate-50 flex items-center justify-center overflow-hidden">
                    <img 
                      src={c.imageUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200&auto=format&fit=crop'} 
                      alt="" 
                      className="max-h-full max-w-full object-contain" 
                    />
                  </div>
                </td>
                <td className="p-3 font-bold text-slate-800">{c.name}</td>
                <td className="p-3 font-mono text-slate-500">{c.slug}</td>
                <td className="p-3 text-slate-600 font-bold">{getDeviceCount(c.name)}</td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => {
                      setEditingCategory(c);
                      setEditName(c.name);
                      setEditSlug(c.slug);
                      setEditImageUrl(c.imageUrl || '');
                    }} 
                    className="text-blue-500 font-bold hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="text-rose-500 font-bold hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-slate-800 border-b pb-2">Add Product Category</h4>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Category Name</label><input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="p-2 border rounded" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Slug</label><input type="text" value={newSlug} onChange={e => setNewSlug(e.target.value)} className="p-2 border rounded font-mono" placeholder="smart-tvs" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Image URL</label><input type="text" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className="p-2 border rounded" placeholder="https://images.unsplash.com/..." /></div>
              <div className="flex justify-end space-x-2 pt-3"><button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button><button type="submit" className="px-3 py-1.5 bg-emerald-500 text-white rounded font-bold">Save</button></div>
            </form>
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-slate-800 border-b pb-2">Edit Product Category</h4>
            <form onSubmit={handleEditSave} className="space-y-3 text-xs">
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Category Name</label><input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="p-2 border rounded" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Slug</label><input type="text" value={editSlug} onChange={e => setEditSlug(e.target.value)} className="p-2 border rounded font-mono" required /></div>
              <div className="flex flex-col"><label className="font-bold text-slate-400 mb-1">Image URL</label><input type="text" value={editImageUrl} onChange={e => setEditImageUrl(e.target.value)} className="p-2 border rounded" required /></div>
              <div className="flex justify-end space-x-2 pt-3"><button type="button" onClick={() => setEditingCategory(null)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button><button type="submit" className="px-3 py-1.5 bg-emerald-500 text-white rounded font-bold">Update</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
