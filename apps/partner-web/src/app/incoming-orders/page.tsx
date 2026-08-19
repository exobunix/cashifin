"use client";
import React, { useState, useEffect } from 'react';

export default function IncomingOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter for orders assigned to MobileHub Store (any suffix) and status is Pending or Assigned
          const partnerOrders = data.filter(o => 
            (o.partner && o.partner.toLowerCase().includes('mobilehub store')) && 
            ['Pending', 'Assigned'].includes(o.status)
          );
          
          setOrders(partnerOrders);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (id: string, action: string) => {
    const targetOrder = orders.find(o => o.id === id);
    if (!targetOrder) return;

    let updatedOrder = { ...targetOrder };
    if (action === 'accept') {
      updatedOrder.status = 'Scheduled';
    } else {
      updatedOrder.partner = '';
      updatedOrder.status = 'Pending';
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item: updatedOrder })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Order ${id} has been ${action}ed!`);
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
      alert('Action failed, please try again.');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-800">📥 Incoming Doorstep Pickup Requests</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Accept inspection leads in your assigned region pincodes.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-xs transition cursor-pointer"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-sm font-bold text-slate-500 animate-pulse">Loading requests...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b">
                <th className="p-4">Order ID</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Device Details</th>
                <th className="p-4">Offered Price</th>
                <th className="p-4">Preferred Slot</th>
                <th className="p-4">Distance</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
              {orders.map((o) => {
                const clientName = o.client || o.customer || o.customerName || 'N/A';
                const clientDistance = o.distance || '1.5 KM';
                const clientPincode = o.pincode || '110016';
                const deviceName = o.device || o.name || 'N/A';

                return (
                  <tr key={o.id} className="hover:bg-slate-100 transition-all cursor-pointer" onClick={() => setSelectedOrderDetails(o)}>
                    <td className="p-4">
                      <span className="bg-slate-100 px-2.5 py-1 rounded text-slate-800 hover:bg-[#39b54a] hover:text-white transition-all">{o.id}</span>
                    </td>
                    <td className="p-4 text-slate-900">{clientName}</td>
                    <td className="p-4">{deviceName}</td>
                    <td className="p-4 text-[#39b54a] font-black">{o.price}</td>
                    <td className="p-4 text-slate-500">{o.slot || o.date}</td>
                    <td className="p-4 font-mono text-slate-550">{clientDistance} ({clientPincode})</td>
                    <td className="p-4 text-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleAction(o.id, 'accept')} className="px-3.5 py-1.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-lg text-[10px] shadow-3xs transition cursor-pointer">Accept</button>
                      <button onClick={() => handleAction(o.id, 'decline')} className="px-3.5 py-1.5 bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100 font-black rounded-lg text-[10px] transition cursor-pointer">Decline</button>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No active incoming jobs assigned to you. When the admin assigns you a new order, it will appear here!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 backdrop-blur-xs" onClick={() => setSelectedOrderDetails(null)}>
          <div className="bg-white p-6 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 space-y-5 animate-scale-up text-xs text-slate-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">{selectedOrderDetails.id}</span>
                <h4 className="font-black text-slate-800 text-sm mt-1">Order Details</h4>
              </div>
              <button 
                onClick={() => setSelectedOrderDetails(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold transition flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-semibold text-slate-650">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Client Name</span>
                  <span className="text-slate-800 font-black">{selectedOrderDetails.client || selectedOrderDetails.customer || selectedOrderDetails.customerName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Phone Number</span>
                  <span className="text-slate-800 font-bold">{selectedOrderDetails.phone || selectedOrderDetails.customerPhone || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 block uppercase">Collection Address</span>
                  <span className="text-slate-800 font-bold leading-normal">📍 {selectedOrderDetails.address || selectedOrderDetails.customerAddress || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-semibold text-slate-650">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Device Model</span>
                  <span className="text-slate-800 font-black">{selectedOrderDetails.device || selectedOrderDetails.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Offered Value</span>
                  <span className="text-emerald-600 font-black">{selectedOrderDetails.price}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Preferred Slot</span>
                  <span className="text-slate-800 font-bold">{selectedOrderDetails.slot || selectedOrderDetails.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Distance / Region</span>
                  <span className="text-slate-800 font-bold">{selectedOrderDetails.distance || 'N/A'} ({selectedOrderDetails.pincode || 'N/A'})</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedOrderDetails(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-center transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
