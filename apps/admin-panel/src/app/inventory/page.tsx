"use client";
import React, { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states for creating new inventory tracking
  const [newModelId, setNewModelId] = useState('');
  const [newStock, setNewStock] = useState('0');
  const [newMinStock, setNewMinStock] = useState('5');
  const [newLocation, setNewLocation] = useState('Main Warehouse');

  // Form states for editing
  const [editStock, setEditStock] = useState('0');
  const [editMinStock, setEditMinStock] = useState('5');
  const [editLocation, setEditLocation] = useState('');

  const loadData = async () => {
    try {
      const [resInv, resCats, resBrands, resModels] = await Promise.all([
        fetch('/api/inventory').then(res => res.json()),
        fetch('/api/categories').then(res => res.json()),
        fetch('/api/brands').then(res => res.json()),
        fetch('/api/models').then(res => res.json())
      ]);

      setCategories(resCats || []);
      setBrands(resBrands || []);
      setModels(resModels || []);

      const invData = resInv || [];
      setInventory(invData);

      // Auto-generate inventory tracking entries if missing for new models
      const untrackedModels = (resModels || []).filter((m: any) => 
        !invData.some((inv: any) => inv.modelId === m.id)
      );

      if (untrackedModels.length > 0) {
        // Auto-seed untracked models in local state for convenient management
        const autoSeeded = untrackedModels.map((m: any, index: number) => ({
          id: `INV-AUTO-${Date.now().toString().slice(-4)}-${index}`,
          modelId: m.id,
          modelName: m.name,
          brand: m.brand,
          category: m.category || 'Smartphones',
          stock: 0,
          minStock: 5,
          location: 'Pending Assignment',
          price: m.basePrice || '₹15,000'
        }));
        setInventory(prev => [...prev, ...autoSeeded]);
      }
    } catch (e) {
      console.error('Error loading inventory data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelId) return;

    const matchedModel = models.find(m => m.id === newModelId);
    if (!matchedModel) return;

    const newItem = {
      id: `INV-${(inventory.length + 1).toString().padStart(3, '0')}`,
      modelId: newModelId,
      modelName: matchedModel.name,
      brand: matchedModel.brand,
      category: matchedModel.category || 'Smartphones',
      stock: parseInt(newStock) || 0,
      minStock: parseInt(newMinStock) || 5,
      location: newLocation || 'Main Warehouse',
      price: matchedModel.basePrice || '₹15,000'
    };

    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', item: newItem })
    });
    const result = await res.json();
    if (result.success) {
      setInventory(result.data);
    }

    setNewModelId('');
    setNewStock('0');
    setNewMinStock('5');
    setNewLocation('Main Warehouse');
    setShowAddModal(false);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updatedItem = {
      ...editingItem,
      stock: parseInt(editStock) || 0,
      minStock: parseInt(editMinStock) || 5,
      location: editLocation
    };

    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', item: updatedItem })
    });
    const result = await res.json();
    if (result.success) {
      setInventory(result.data);
    }
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const result = await res.json();
    if (result.success) {
      setInventory(result.data);
    }
  };

  // Filter dynamic list based on category, brand, search string
  const filtered = inventory.filter(item => {
    const matchesSearch = item.modelName.toLowerCase().includes(search.toLowerCase()) || 
                          item.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesBrand = !selectedBrand || item.brand.toLowerCase() === selectedBrand.toLowerCase();
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="p-6 space-y-4">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Inventory Stock Management</h3>
          <p className="text-xs text-slate-400">Track and update warehouse stock levels by device model category & brand</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Category Filter */}
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)}
            className="p-2 border rounded text-xs bg-white text-slate-600 font-semibold"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Brand Filter */}
          <select 
            value={selectedBrand} 
            onChange={e => setSelectedBrand(e.target.value)}
            className="p-2 border rounded text-xs bg-white text-slate-600 font-semibold"
          >
            <option value="">All Brands</option>
            {brands.map(b => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>

          {/* Search Box */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search models..."
            className="p-2 border rounded text-xs w-48 bg-white"
          />

          <button onClick={() => setShowAddModal(true)} className="px-3 py-1.5 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600">
            Track Model Stock
          </button>
        </div>
      </div>

      {/* Grid Dashboard Widgets */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Tracked Items</p>
            <h4 className="text-lg font-black text-slate-800 mt-1">{inventory.length}</h4>
          </div>
          <span className="text-xl">📦</span>
        </div>
        <div className="bg-white rounded-xl border p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total In-Stock Qty</p>
            <h4 className="text-lg font-black text-[#39b54a] mt-1">
              {inventory.reduce((sum, item) => sum + (item.stock || 0), 0)}
            </h4>
          </div>
          <span className="text-xl">📈</span>
        </div>
        <div className="bg-white rounded-xl border p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Low Stock Alerts</p>
            <h4 className="text-lg font-black text-rose-500 mt-1">
              {inventory.filter(item => (item.stock || 0) <= (item.minStock || 5)).length}
            </h4>
          </div>
          <span className="text-xl">⚠️</span>
        </div>
        <div className="bg-white rounded-xl border p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Warehouses Active</p>
            <h4 className="text-lg font-black text-blue-600 mt-1">
              {Array.from(new Set(inventory.map(item => item.location))).filter(Boolean).length}
            </h4>
          </div>
          <span className="text-xl">🏢</span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3">INV ID</th>
              <th className="p-3">Device Model</th>
              <th className="p-3">Category</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Base Price</th>
              <th className="p-3">Stock level</th>
              <th className="p-3">Alert Threshold</th>
              <th className="p-3">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => {
              const isLowStock = (item.stock || 0) <= (item.minStock || 5);
              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-500 font-mono">{item.id}</td>
                  <td className="p-3 font-bold text-slate-800">
                    <span className="block">{item.modelName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">ID: {item.modelId}</span>
                  </td>
                  <td className="p-3 text-slate-600 font-semibold">{item.category}</td>
                  <td className="p-3 text-slate-600 font-semibold">{item.brand}</td>
                  <td className="p-3 font-semibold text-emerald-600">{item.price}</td>
                  <td className="p-3 font-bold text-slate-800">
                    <span className={isLowStock ? 'text-rose-500 font-black' : 'text-slate-800'}>
                      {item.stock} Units
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 font-mono">{item.minStock} Units</td>
                  <td className="p-3 text-slate-500">{item.location}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      isLowStock 
                        ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                        : 'bg-emerald-50 text-[#39b54a] border border-emerald-100'
                    }`}>
                      {isLowStock ? 'Reorder Needed' : 'Good Stock'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => {
                        setEditingItem(item);
                        setEditStock(item.stock.toString());
                        setEditMinStock(item.minStock.toString());
                        setEditLocation(item.location);
                      }} 
                      className="text-blue-500 font-bold hover:underline mr-4"
                    >
                      Quick Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-rose-500 font-bold hover:underline">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-slate-800">Track New Stock Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Select Model to Track</label>
                <select
                  value={newModelId}
                  onChange={e => setNewModelId(e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                  required
                >
                  <option value="">Select a Model</option>
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.brand} - {m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Initial Stock Level</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={e => setNewStock(e.target.value)}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Min Threshold Alert level</label>
                <input
                  type="number"
                  value={newMinStock}
                  onChange={e => setNewMinStock(e.target.value)}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Warehouse Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. Warehouse Delhi"
                />
              </div>
              <div className="pt-2 flex space-x-2">
                <button type="submit" className="flex-1 py-2 bg-emerald-500 text-white rounded font-bold hover:bg-emerald-600">
                  Save
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 bg-slate-100 rounded font-bold hover:bg-slate-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-slate-800">Edit Stock Level: {editingItem.modelName}</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Current Stock Level</label>
                <input
                  type="number"
                  value={editStock}
                  onChange={e => setEditStock(e.target.value)}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Minimum Alert Threshold</label>
                <input
                  type="number"
                  value={editMinStock}
                  onChange={e => setEditMinStock(e.target.value)}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Warehouse Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="pt-2 flex space-x-2">
                <button type="submit" className="flex-1 py-2 bg-emerald-500 text-white rounded font-bold hover:bg-emerald-600">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-2 bg-slate-100 rounded font-bold hover:bg-slate-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
