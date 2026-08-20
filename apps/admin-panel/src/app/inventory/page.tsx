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
  const [newPhotos, setNewPhotos] = useState<string[]>([]);

  // Form states for editing
  const [editStock, setEditStock] = useState('0');
  const [editMinStock, setEditMinStock] = useState('5');
  const [editLocation, setEditLocation] = useState('');
  const [editPhotos, setEditPhotos] = useState<string[]>([]);

  // Viewer and Sharing states
  const [activePhotoViewer, setActivePhotoViewer] = useState<string[] | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [sharingItem, setSharingItem] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showMultiShareModal, setShowMultiShareModal] = useState(false);

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
          price: m.basePrice || '₹15,000',
          photos: []
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      fileList.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                if (isEdit) {
                  setEditPhotos(prev => [...prev, compressedDataUrl]);
                } else {
                  setNewPhotos(prev => [...prev, compressedDataUrl]);
                }
              }
            };
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number, isEdit: boolean) => {
    if (isEdit) {
      setEditPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewPhotos(prev => prev.filter((_, i) => i !== index));
    }
  };

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
      price: matchedModel.basePrice || '₹15,000',
      photos: newPhotos
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
    setNewPhotos([]);
    setShowAddModal(false);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updatedItem = {
      ...editingItem,
      stock: parseInt(editStock) || 0,
      minStock: parseInt(editMinStock) || 5,
      location: editLocation,
      photos: editPhotos
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

          <button 
            onClick={() => {
              if (filtered.length === 0) {
                alert('No stock item to share.');
                return;
              }
              const summaryText = `📦 *Cashify Inventory Summary* (${filtered.length} Items)\n----------------------------------------\n` + 
                filtered.map(item => `• *${item.modelName}* - ${item.stock} Units (${item.location})`).join('\n') + 
                `\n----------------------------------------\nGenerated on: ${new Date().toLocaleDateString()}`;
              navigator.clipboard.writeText(summaryText);
              alert('Filtered inventory summary copied to clipboard!');
            }}
            className="px-3 py-1.5 bg-blue-500 text-white rounded text-xs font-bold hover:bg-blue-600"
          >
            Share Filtered Stock
          </button>

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
              <th className="p-3 w-8">
                <input 
                  type="checkbox"
                  checked={filtered.length > 0 && selectedIds.length === filtered.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(filtered.map(i => i.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                  className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
              </th>
              <th className="p-3">INV ID</th>
              <th className="p-3">Device Model</th>
              <th className="p-3">Photos</th>
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
                  <td className="p-3 w-8">
                    <input 
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(prev => [...prev, item.id]);
                        } else {
                          setSelectedIds(prev => prev.filter(id => id !== item.id));
                        }
                      }}
                      className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                  </td>
                  <td className="p-3 font-bold text-slate-500 font-mono">{item.id}</td>
                  <td className="p-3 font-bold text-slate-800">
                    <span className="block">{item.modelName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">ID: {item.modelId}</span>
                  </td>
                  <td className="p-3">
                    {item.photos && item.photos.length > 0 ? (
                      <div 
                        className="flex -space-x-2 overflow-hidden cursor-pointer"
                        onClick={() => {
                          setActivePhotoViewer(item.photos);
                          setActivePhotoIndex(0);
                        }}
                      >
                        {item.photos.slice(0, 3).map((photo: string, index: number) => (
                          <img 
                            key={index}
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover bg-slate-100" 
                            src={photo} 
                            alt="" 
                          />
                        ))}
                        {item.photos.length > 3 && (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 text-[10px] font-bold text-slate-600">
                            +{item.photos.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-300 text-[10px] italic">No photos</span>
                    )}
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
                        setEditPhotos(item.photos || []);
                      }} 
                      className="text-blue-500 font-bold hover:underline mr-4"
                    >
                      Quick Edit
                    </button>
                    <button 
                      onClick={() => setSharingItem(item)} 
                      className="text-emerald-500 font-bold hover:underline mr-4"
                    >
                      Share
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
              <div>
                <label className="block text-slate-400 font-bold mb-1">Upload Photos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => handlePhotoUpload(e, false)}
                  className="w-full p-2 border rounded bg-white text-xs"
                />
                {newPhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {newPhotos.map((photo, index) => (
                      <div key={index} className="relative group w-16 h-16 border rounded overflow-hidden bg-slate-50">
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(index, false)}
                          className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
              <div>
                <label className="block text-slate-400 font-bold mb-1">Upload Photos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => handlePhotoUpload(e, true)}
                  className="w-full p-2 border rounded bg-white text-xs"
                />
                {editPhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {editPhotos.map((photo, index) => (
                      <div key={index} className="relative group w-16 h-16 border rounded overflow-hidden bg-slate-50">
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(index, true)}
                          className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* Lightbox / Photo Viewer Modal */}
      {activePhotoViewer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
          <div className="relative max-w-3xl w-full flex flex-col items-center">
            <button 
              onClick={() => setActivePhotoViewer(null)} 
              className="absolute -top-12 right-0 text-white font-bold text-lg hover:text-slate-300 bg-white/10 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ✕
            </button>
            <div className="w-full h-[500px] flex items-center justify-center rounded-xl overflow-hidden bg-slate-900">
              <img 
                src={activePhotoViewer[activePhotoIndex]} 
                alt="Inventory Preview" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            {activePhotoViewer.length > 1 && (
              <div className="flex justify-between items-center w-full mt-4">
                <button 
                  onClick={() => setActivePhotoIndex(prev => (prev === 0 ? activePhotoViewer.length - 1 : prev - 1))}
                  className="px-4 py-2 bg-white/20 text-white rounded font-bold hover:bg-white/30 text-xs"
                >
                  ◀ Prev
                </button>
                <span className="text-white text-xs font-semibold">
                  {activePhotoIndex + 1} / {activePhotoViewer.length}
                </span>
                <button 
                  onClick={() => setActivePhotoIndex(prev => (prev === activePhotoViewer.length - 1 ? 0 : prev + 1))}
                  className="px-4 py-2 bg-white/20 text-white rounded font-bold hover:bg-white/30 text-xs"
                >
                  Next ▶
                </button>
              </div>
            )}
            <div className="flex space-x-2 mt-4 overflow-x-auto max-w-full p-2">
              {activePhotoViewer.map((photo, index) => (
                <img 
                  key={index}
                  src={photo}
                  alt=""
                  onClick={() => setActivePhotoIndex(index)}
                  className={`h-12 w-12 object-cover rounded cursor-pointer ring-2 ${activePhotoIndex === index ? 'ring-emerald-500' : 'ring-transparent'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {sharingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl space-y-4 text-slate-800">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm">Share Inventory: {sharingItem.modelName}</h3>
              <button onClick={() => setSharingItem(null)} className="text-slate-400 font-bold">✕</button>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border text-xs font-mono whitespace-pre-wrap select-all">
              {`📦 *Cashify Inventory Details*
----------------------------
*ID:* ${sharingItem.id}
*Device:* ${sharingItem.modelName}
*Brand:* ${sharingItem.brand}
*Category:* ${sharingItem.category}
*Base Price:* ${sharingItem.price}
*Current Stock:* ${sharingItem.stock} Units
*Warehouse:* ${sharingItem.location}
*Status:* ${(sharingItem.stock || 0) <= (sharingItem.minStock || 5) ? '🚨 Reorder Needed' : '✅ Good Stock'}`}
            </div>

            <div className="space-y-2 pt-2">
              <button 
                onClick={() => {
                  const shareText = `📦 *Cashify Inventory Details*\n----------------------------\n*ID:* ${sharingItem.id}\n*Device:* ${sharingItem.modelName}\n*Brand:* ${sharingItem.brand}\n*Category:* ${sharingItem.category}\n*Base Price:* ${sharingItem.price}\n*Current Stock:* ${sharingItem.stock} Units\n*Warehouse:* ${sharingItem.location}\n*Status:* ${(sharingItem.stock || 0) <= (sharingItem.minStock || 5) ? '🚨 Reorder Needed' : '✅ Good Stock'}`;
                  navigator.clipboard.writeText(shareText);
                  alert('Copied to clipboard!');
                }}
                className="w-full py-2 bg-emerald-50 text-emerald-600 rounded text-xs font-bold hover:bg-emerald-100 flex items-center justify-center space-x-2 border border-emerald-200"
              >
                <span>📋 Copy to Clipboard</span>
              </button>
              
              <button 
                onClick={() => {
                  const shareText = encodeURIComponent(`📦 *Cashify Inventory Details*\n----------------------------\n*ID:* ${sharingItem.id}\n*Device:* ${sharingItem.modelName}\n*Brand:* ${sharingItem.brand}\n*Category:* ${sharingItem.category}\n*Base Price:* ${sharingItem.price}\n*Current Stock:* ${sharingItem.stock} Units\n*Warehouse:* ${sharingItem.location}\n*Status:* ${(sharingItem.stock || 0) <= (sharingItem.minStock || 5) ? '🚨 Reorder Needed' : '✅ Good Stock'}`);
                  window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
                }}
                className="w-full py-2 bg-green-500 text-white rounded text-xs font-bold hover:bg-green-600 flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>💬 Share on WhatsApp</span>
              </button>

              <button 
                onClick={() => {
                  const subject = encodeURIComponent(`Inventory Details: ${sharingItem.modelName}`);
                  const body = encodeURIComponent(`Here are the current inventory details for ${sharingItem.modelName}:\n\nID: ${sharingItem.id}\nDevice: ${sharingItem.modelName}\nBrand: ${sharingItem.brand}\nCategory: ${sharingItem.category}\nBase Price: ${sharingItem.price}\nCurrent Stock: ${sharingItem.stock} Units\nWarehouse: ${sharingItem.location}\nStatus: ${(sharingItem.stock || 0) <= (sharingItem.minStock || 5) ? 'Reorder Needed' : 'Good Stock'}`);
                  window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                }}
                className="w-full py-2 bg-blue-500 text-white rounded text-xs font-bold hover:bg-blue-600 flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>✉️ Share via Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Selection Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-6 z-40 border border-slate-800 animate-bounce-short">
          <span className="text-xs font-bold">{selectedIds.length} items selected</span>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowMultiShareModal(true)}
              className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-bold hover:bg-emerald-600 transition"
            >
              Share Selected
            </button>
            <button 
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-full text-xs font-bold hover:bg-slate-700 transition"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Multi Share Modal */}
      {showMultiShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl space-y-4 text-slate-800 animate-fade-in">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm">Share Selected Inventory ({selectedIds.length} Devices)</h3>
              <button onClick={() => setShowMultiShareModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            
            <div className="space-y-1 text-xs">
              <label className="block text-slate-400 font-bold">Shareable Catalog Link</label>
              <div className="bg-slate-50 p-3 rounded-lg border font-mono break-all select-all text-[11px] text-blue-600">
                {`${window.location.origin}/share?ids=${selectedIds.join(',')}`}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button 
                onClick={() => {
                  const shareText = `${window.location.origin}/share?ids=${selectedIds.join(',')}`;
                  navigator.clipboard.writeText(shareText);
                  alert('Shareable link copied to clipboard!');
                }}
                className="w-full py-2 bg-emerald-50 text-emerald-600 rounded text-xs font-bold hover:bg-emerald-100 flex items-center justify-center space-x-2 border border-emerald-200"
              >
                <span>📋 Copy Catalog Link</span>
              </button>
              
              <button 
                onClick={() => {
                  const shareText = encodeURIComponent(`Check out our electronic device inventory catalog here: ${window.location.origin}/share?ids=${selectedIds.join(',')}`);
                  window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
                }}
                className="w-full py-2 bg-green-500 text-white rounded text-xs font-bold hover:bg-green-600 flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>💬 Share Link on WhatsApp</span>
              </button>

              <button 
                onClick={() => {
                  const subject = encodeURIComponent(`Shared Device Catalog - ${selectedIds.length} Items`);
                  const body = encodeURIComponent(`Here is the link to view the details of our shared electronic device catalog:\n\n${window.location.origin}/share?ids=${selectedIds.join(',')}`);
                  window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                }}
                className="w-full py-2 bg-blue-500 text-white rounded text-xs font-bold hover:bg-blue-600 flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>✉️ Send Catalog via Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
