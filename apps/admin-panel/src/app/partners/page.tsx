"use client";
import React, { useState, useEffect } from 'react';

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => setPartners(data || []));
  }, []);

  const handleToggleBlock = async (id: string) => {
    const target = partners.find(p => p.id === id);
    if (!target) return;

    const updated = { ...target, status: target.status === 'Online' ? 'Blocked' : 'Online' };
    const res = await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', item: updated })
    });
    const result = await res.json();
    if (result.success) {
      setPartners(result.data);
    }
  };

  const handleApproveKYC = async (id: string) => {
    const target = partners.find(p => p.id === id);
    if (!target) return;

    const updated = { ...target, score: '100% (Approved)' };
    const res = await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', item: updated })
    });
    const result = await res.json();
    if (result.success) {
      setPartners(result.data);
    }
    setSelectedPartner(null);
  };

  const handleApproveParticularDoc = async (partnerId: string, docType: string) => {
    const target = partners.find((p: any) => p.id === partnerId);
    if (!target) return;

    let propKey = '';
    if (docType === 'aadhaar') propKey = 'aadhaarStatus';
    else if (docType === 'pan') propKey = 'panStatus';
    else if (docType === 'police') propKey = 'policeStatus';
    else if (docType === 'photo') propKey = 'photoStatus';

    if (!propKey) return;

    const updated = { ...target, [propKey]: 'Approved' };

    let approvedCount = 0;
    if (updated.aadhaarStatus === 'Approved') approvedCount++;
    if (updated.panStatus === 'Approved') approvedCount++;
    if (updated.policeStatus === 'Approved') approvedCount++;
    if (updated.photoStatus === 'Approved' || updated.photoStatus === 'Verified') approvedCount++;

    const scoreVal = 70 + approvedCount * 7.5;
    if (approvedCount === 4) {
      updated.score = '100% (Approved)';
    } else {
      updated.score = `${Math.round(scoreVal)}%`;
    }

    const res = await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', item: updated })
    });
    const result = await res.json();
    if (result.success) {
      setPartners(result.data);
      const updatedPartner = result.data.find((p: any) => p.id === partnerId);
      setSelectedPartner(updatedPartner || updated);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const result = await res.json();
    if (result.success) {
      setPartners(result.data);
    }
  };

  const filtered = partners.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()));

  const [selectedDocTab, setSelectedDocTab] = useState('aadhaar');

  const getDocPreviewUrl = () => {
    switch (selectedDocTab) {
      case 'aadhaar':
        return 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=500';
      case 'pan':
        return 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?q=80&w=500';
      case 'police':
        return 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=500';
      case 'photo':
        return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500';
      default:
        return '';
    }
  };

  const getCurrentDocStatus = () => {
    if (!selectedPartner) return '';
    const sp = selectedPartner as any;
    switch (selectedDocTab) {
      case 'aadhaar':
        return sp.aadhaarStatus || 'Submitted';
      case 'pan':
        return sp.panStatus || 'Submitted';
      case 'police':
        return sp.policeStatus || 'Reviewing';
      case 'photo':
        return sp.photoStatus || 'Verified';
      default:
        return '';
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Pickup Partners & Vendors ({partners.length} Mapped)</h3>
          <p className="text-xs text-slate-400">Approve documentations and manage status</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search partners..."
          className="p-2 border rounded text-xs w-64 bg-white"
        />
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3">Partner ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Location Zone</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Wallet</th>
              <th className="p-3">KYC Verification</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p: any) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{p.id}</td>
                <td className="p-3 font-bold">{p.name}</td>
                <td className="p-3 text-slate-500">{p.location}</td>
                <td className="p-3 text-amber-500 font-bold">⭐ {p.rating}</td>
                <td className="p-3 font-semibold text-slate-700">{p.wallet}</td>
                <td className="p-3 font-bold text-slate-600">{p.score}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${p.status === 'Online' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{p.status}</span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => { setSelectedPartner(p); setSelectedDocTab('aadhaar'); }} className="text-emerald-500 hover:text-emerald-700 font-semibold">
                    📂 KYC Docs
                  </button>
                  <button onClick={() => handleToggleBlock(p.id)} className="text-slate-500 hover:text-slate-800 font-semibold">
                    {p.status === 'Online' ? '🔒 Block' : '🔓 Active'}
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-rose-500 hover:text-rose-700 font-semibold">
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPartner && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-[800px] max-w-full shadow-2xl overflow-hidden flex flex-col text-slate-800">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <div>
                <h4 className="font-bold text-sm">KYC Registration Documents</h4>
                <p className="text-[10px] text-slate-400">Partner: {(selectedPartner as any).name} ({(selectedPartner as any).id})</p>
              </div>
              <button onClick={() => setSelectedPartner(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>
            
            <div className="flex flex-1 min-h-[380px]">
              {/* Left tab list */}
              <div className="w-[320px] border-r bg-slate-50 p-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocTab('aadhaar')}
                  className={`w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-all ${(selectedDocTab === 'aadhaar') ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-800' : 'bg-white hover:bg-slate-100'}`}
                >
                  <span className="truncate">📄 Aadhaar Card (Front/Back)</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ml-2 ${((selectedPartner as any).aadhaarStatus === 'Approved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {((selectedPartner as any).aadhaarStatus || 'Submitted')}
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedDocTab('pan')}
                  className={`w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-all ${(selectedDocTab === 'pan') ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-800' : 'bg-white hover:bg-slate-100'}`}
                >
                  <span className="truncate">📄 PAN Card (Tax ID)</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ml-2 ${((selectedPartner as any).panStatus === 'Approved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {((selectedPartner as any).panStatus || 'Submitted')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDocTab('police')}
                  className={`w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-all ${(selectedDocTab === 'police') ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-800' : 'bg-white hover:bg-slate-100'}`}
                >
                  <span className="truncate">📄 Police Verification</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ml-2 ${((selectedPartner as any).policeStatus === 'Approved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {((selectedPartner as any).policeStatus || 'Reviewing')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDocTab('photo')}
                  className={`w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-all ${(selectedDocTab === 'photo') ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-800' : 'bg-white hover:bg-slate-100'}`}
                >
                  <span className="truncate">📷 Profile Photo Verification</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ml-2 ${((selectedPartner as any).photoStatus === 'Approved' || (selectedPartner as any).photoStatus === 'Verified') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {((selectedPartner as any).photoStatus || 'Verified')}
                  </span>
                </button>
              </div>

              {/* Right preview box */}
              <div className="flex-1 p-4 bg-slate-100 flex flex-col items-center justify-between min-h-[300px]">
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                  <div className="bg-white p-2 rounded-lg shadow-sm border max-w-full max-h-[280px] flex items-center justify-center overflow-hidden">
                    <img
                      src={getDocPreviewUrl()}
                      alt="KYC Document Preview"
                      className="object-contain max-h-[260px] rounded"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 capitalize font-medium">Previewing: {selectedDocTab} document file</span>
                </div>

                <div className="w-full bg-white p-3 rounded-xl border mt-2 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 capitalize">{selectedDocTab} Status: </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getCurrentDocStatus() === 'Approved' || getCurrentDocStatus() === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {getCurrentDocStatus()}
                    </span>
                  </div>
                  {getCurrentDocStatus() !== 'Approved' && getCurrentDocStatus() !== 'Verified' && (
                    <button
                      type="button"
                      onClick={() => handleApproveParticularDoc((selectedPartner as any).id, selectedDocTab)}
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold text-[10px] transition-all shadow-sm"
                    >
                      ✓ Approve This Doc
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 p-4 border-t bg-slate-50">
              <button type="button" onClick={() => setSelectedPartner(null)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded font-bold text-xs">Cancel</button>
              <button type="button" onClick={() => handleApproveKYC((selectedPartner as any).id)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold text-xs shadow-sm">Approve KYC</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
