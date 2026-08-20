"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ShareCatalogContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndices, setActivePhotoIndices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const idsString = searchParams.get('ids');
    if (!idsString) {
      setLoading(false);
      return;
    }
    const ids = idsString.split(',');

    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => {
        const list = (data || []).filter((item: any) => ids.includes(item.id));
        setItems(list);
        
        // Initialize active photo indices
        const indices: { [key: string]: number } = {};
        list.forEach((item: any) => {
          indices[item.id] = 0;
        });
        setActivePhotoIndices(indices);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching inventory:', err);
        setLoading(false);
      });
  }, [searchParams]);

  const handleNextPhoto = (itemId: string, photosLength: number) => {
    setActivePhotoIndices(prev => ({
      ...prev,
      [itemId]: (prev[itemId] + 1) % photosLength
    }));
  };

  const handlePrevPhoto = (itemId: string, photosLength: number) => {
    setActivePhotoIndices(prev => ({
      ...prev,
      [itemId]: (prev[itemId] - 1 + photosLength) % photosLength
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Loading catalog...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans px-4 text-center">
        <span className="text-4xl">📦</span>
        <h2 className="mt-4 text-lg font-bold text-slate-800">No Inventory Found</h2>
        <p className="text-xs text-slate-400 max-w-xs mt-1">This catalog is empty or the shared inventory items do not exist anymore.</p>
        <a href="/inventory" className="mt-6 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition">
          Go to Inventory
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h1 className="text-sm font-black text-slate-800 tracking-tight uppercase">Cashify Shared Catalog</h1>
              <p className="text-[10px] text-slate-400 font-semibold">{items.length} Premium Devices Available</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-bold">
            Verified Stock
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-5xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(item => {
            const hasPhotos = item.photos && item.photos.length > 0;
            const photoIndex = activePhotoIndices[item.id] || 0;
            const isLowStock = (item.stock || 0) <= (item.minStock || 5);

            return (
              <div key={item.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition duration-300">
                {/* Photo Viewer section */}
                <div className="relative h-64 bg-slate-100 flex items-center justify-center group">
                  {hasPhotos ? (
                    <>
                      <img 
                        src={item.photos[photoIndex]} 
                        alt={item.modelName} 
                        className="w-full h-full object-cover" 
                      />
                      {item.photos.length > 1 && (
                        <>
                          <button 
                            onClick={() => handlePrevPhoto(item.id, item.photos.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 w-8 h-8 rounded-full flex items-center justify-center shadow-md text-xs font-bold transition"
                          >
                            ◀
                          </button>
                          <button 
                            onClick={() => handleNextPhoto(item.id, item.photos.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 w-8 h-8 rounded-full flex items-center justify-center shadow-md text-xs font-bold transition"
                          >
                            ▶
                          </button>
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                            {photoIndex + 1} / {item.photos.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-slate-300">
                      <span className="text-4xl block mb-2">📷</span>
                      <span className="text-[10px] italic">No photos available</span>
                    </div>
                  )}

                  {/* Stock Status Badge */}
                  <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-sm uppercase tracking-wider ${
                    isLowStock 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-emerald-500 text-white'
                  }`}>
                    {isLowStock ? 'Low Stock' : 'In Stock'}
                  </span>

                  {/* Price tag */}
                  <span className="absolute top-3 right-3 bg-slate-900 text-emerald-400 px-3 py-1 rounded-lg text-xs font-black shadow-md">
                    {item.price}
                  </span>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>{item.brand}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-800 leading-tight">{item.modelName}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Reference: {item.id}</p>
                  </div>

                  <div className="border-t pt-4 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Location</span>
                      <span className="font-semibold text-slate-700 mt-0.5 block">{item.location}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Stock Level</span>
                      <span className="font-semibold text-slate-700 mt-0.5 block">{item.stock} Units</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function ShareCatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Loading catalog...</p>
      </div>
    }>
      <ShareCatalogContent />
    </Suspense>
  );
}
