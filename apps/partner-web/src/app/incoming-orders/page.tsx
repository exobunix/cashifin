"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function IncomingOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);

  const fetchOrders = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/orders').then(res => res.json()).catch(() => []),
      fetch('/api/pickups').then(res => res.json()).catch(() => [])
    ])
      .then(([ordersData, pickupsData]) => {
        if (Array.isArray(ordersData)) {
          // Filter for all orders assigned to MobileHub Store (any suffix) regardless of status
          const partnerOrders = ordersData.filter(o => 
            (o.partner && o.partner.toLowerCase().includes('mobilehub store'))
          );
          
          const merged = partnerOrders.map(o => {
            const pk = Array.isArray(pickupsData) ? pickupsData.find((p: any) => p.orderId === o.id) : null;
            return {
              ...o,
              address: o.address || o.customerAddress || pk?.address || 'B-45, Sector 62, Noida, UP',
              phone: o.phone || o.customerPhone || pk?.phone || '+91 98765 43210',
              slot: o.slot || pk?.slot || 'Tomorrow, 10:00 AM - 01:00 PM'
            };
          });
          
          setOrders(merged);
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
        alert(`Order ${id} has been ${action}ed successfully!`);
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
      alert('Action failed, please try again.');
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;
    const updatedOrder = { ...orderToUpdate, status: newStatus };
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item: updatedOrder })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        setSelectedOrderDetails(updatedOrder);
        alert(`Status updated to ${newStatus}!`);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-800">📥 Partner Order List & Doorstep Pickups</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Manage all assigned, active, and completed leads here.</p>
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
          <p className="text-sm font-bold text-slate-500 animate-pulse">Loading orders...</p>
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
                <th className="p-4">Current Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
              {orders.map((o) => {
                const clientName = o.client || o.customer || o.customerName || 'N/A';
                const deviceName = o.device || o.name || 'N/A';
                const isActiveInspection = ['Scheduled', 'In Inspection', 'Under Inspection', 'Verification Pending'].includes(o.status);

                return (
                  <tr key={o.id} className="hover:bg-slate-100 transition-all cursor-pointer animate-fade-in" onClick={() => setSelectedOrderDetails(o)}>
                    <td className="p-4">
                      <span className="bg-slate-100 px-2.5 py-1 rounded text-slate-800 hover:bg-[#39b54a] hover:text-white transition-all">{o.id}</span>
                    </td>
                    <td className="p-4 text-slate-900">{clientName}</td>
                    <td className="p-4">{deviceName}</td>
                    <td className="p-4 text-[#39b54a] font-black">{o.price}</td>
                    <td className="p-4 text-slate-500">{o.slot || o.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                        o.status === 'Completed' || o.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-600'
                          : o.status === 'Pending' || o.status === 'Assigned'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-teal-50 text-teal-600'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      {o.status === 'Assigned' || o.status === 'Pending' ? (
                        <>
                          <button onClick={() => handleAction(o.id, 'accept')} className="px-3 py-1 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-lg text-[10px] shadow-3xs transition cursor-pointer">Accept</button>
                          <button onClick={() => handleAction(o.id, 'decline')} className="px-3 py-1 bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100 font-black rounded-lg text-[10px] transition cursor-pointer">Decline</button>
                        </>
                      ) : isActiveInspection ? (
                        <Link 
                          href={`/inspection?orderId=${o.id}&name=${encodeURIComponent(deviceName)}&client=${encodeURIComponent(clientName)}&price=${encodeURIComponent(o.price)}`}
                          className="inline-block px-3.5 py-1 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-lg text-[10px] shadow-3xs transition cursor-pointer"
                        >
                          Start Inspection
                        </Link>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold italic">No actions needed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No orders assigned to you yet. When the admin assigns you an order, it will appear here!</td>
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
                <h4 className="font-black text-slate-800 text-sm mt-1">Order Complete Details</h4>
              </div>
              <button 
                onClick={() => setSelectedOrderDetails(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold transition flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer details */}
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

              {/* Device and status details */}
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
                  <span className="text-[10px] text-slate-450 block uppercase font-bold text-[#39b54a]">Change Status (Dynamic)</span>
                  <select
                    value={selectedOrderDetails.status}
                    onChange={(e) => handleUpdateStatus(selectedOrderDetails.id, e.target.value)}
                    className="mt-1 px-2 py-1 rounded-lg font-bold text-[10px] bg-white border border-slate-200 focus:outline-none cursor-pointer text-slate-700 focus:border-[#39b54a]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Inspection">In Inspection</option>
                    <option value="Under Inspection">Under Inspection</option>
                    <option value="Verification Pending">Verification Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Assigned Vendor</span>
                  <span className="text-slate-800 font-bold">{selectedOrderDetails.partner || 'N/A'}</span>
                </div>
              </div>

              {/* Diagnostic Answers */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Diagnostic Appraisal Answers</span>
                {selectedOrderDetails.answers && Object.keys(selectedOrderDetails.answers).length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {Object.keys(selectedOrderDetails.answers).map((qText) => (
                      <div key={qText} className="flex justify-between border-b pb-1 last:border-b-0">
                        <span className="text-slate-500 font-semibold">{qText}</span>
                        <span className={`font-black uppercase text-[9px] px-2 py-0.5 rounded ${
                          selectedOrderDetails.answers[qText] === 'Perfect' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>{selectedOrderDetails.answers[qText]}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-450 italic font-semibold">No diagnostic assessment answers recorded yet.</p>
                )}
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
