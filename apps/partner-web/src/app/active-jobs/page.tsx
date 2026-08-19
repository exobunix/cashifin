"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ActiveJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCall, setActiveCall] = useState<any>(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState<any>(null);

  const fetchJobs = () => {
    setLoading(true);
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && !data.error) {
          // Filter for orders assigned to MobileHub Store (any suffix) and in active statuses
          const partnerJobs = data.filter(o => 
            (o.partner && o.partner.toLowerCase().includes('mobilehub store')) && 
            ['Scheduled', 'In Inspection', 'Under Inspection', 'Verification Pending'].includes(o.status)
          );
          
          setJobs(partnerJobs);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const jobToUpdate = jobs.find(j => j.id === orderId);
    if (!jobToUpdate) return;
    const updatedJob = { ...jobToUpdate, status: newStatus };
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item: updatedJob })
      });
      const data = await res.json();
      if (data.success) {
        setJobs(prev => prev.map(j => j.id === orderId ? updatedJob : j));
        setSelectedJobDetails(updatedJob);
        alert(`Status updated to ${newStatus}!`);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-800">📦 Active Inspection Routes</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Manage accepted doorstep collection routes & start diagnosis checks.</p>
        </div>
        <button 
          onClick={fetchJobs}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-xs transition cursor-pointer"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-sm font-bold text-slate-500 animate-pulse">Loading active routes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const clientName = job.client || job.customer || job.customerName || 'Client';
            const clientPhone = job.phone || job.customerPhone || '+91 99999 88888';
            const clientAddress = job.address || job.customerAddress || 'Address details missing';
            const deviceName = job.device || job.name || 'Device';

            return (
              <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs flex flex-col justify-between h-52 hover:border-[#39b54a] transition-all cursor-pointer" onClick={() => setSelectedJobDetails(job)}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">{job.id}</span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-black uppercase tracking-wider">{job.status}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1">{deviceName}</h4>
                  <p className="text-[10px] text-slate-450 font-bold">Client: {clientName} | {job.price}</p>
                  <p className="text-[10px] text-slate-400 leading-normal font-semibold line-clamp-2">📍 {clientAddress}</p>
                </div>
                <div className="flex gap-2 pt-4" onClick={(e) => e.stopPropagation()}>
                  <Link 
                    href={`/inspection?orderId=${job.id}&name=${encodeURIComponent(deviceName)}&client=${encodeURIComponent(clientName)}&price=${encodeURIComponent(job.price)}`} 
                    className="flex-1 text-center py-2.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white rounded-xl text-[10px] font-black shadow-3xs transition-all cursor-pointer flex items-center justify-center"
                  >
                    Start Inspection
                  </Link>
                  <button 
                    onClick={() => setActiveCall({ name: clientName, phone: clientPhone })}
                    className="px-3.5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-[10px] font-black transition cursor-pointer"
                  >
                    📞 Call
                  </button>
                </div>
              </div>
            );
          })}
          {jobs.length === 0 && (
            <div className="col-span-3 bg-white border p-10 rounded-2xl text-center text-slate-400 font-bold text-xs">
              No active routes assigned. Go to incoming requests to accept orders!
            </div>
          )}
        </div>
      )}

      {/* Flashing Phone Dialer overlay */}
      {activeCall && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 p-8 rounded-3xl w-[320px] shadow-2xl text-center space-y-6 text-white border border-slate-800">
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-2xl animate-pulse">
                📞
              </div>
              <h4 className="font-black text-sm">{activeCall.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{activeCall.phone}</p>
              <p className="text-[9px] text-[#39b54a] font-bold tracking-wider animate-bounce mt-2">DIALING CLIENT...</p>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <button 
                onClick={() => setActiveCall(null)}
                className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-xl font-bold transition shadow-md"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedJobDetails && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 backdrop-blur-xs" onClick={() => setSelectedJobDetails(null)}>
          <div className="bg-white p-6 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 space-y-5 animate-scale-up text-xs text-slate-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">{selectedJobDetails.id}</span>
                <h4 className="font-black text-slate-800 text-sm mt-1">Order Details</h4>
              </div>
              <button 
                onClick={() => setSelectedJobDetails(null)}
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
                  <span className="text-slate-800 font-black">{selectedJobDetails.client || selectedJobDetails.customer || selectedJobDetails.customerName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Phone Number</span>
                  <span className="text-slate-800 font-bold">{selectedJobDetails.phone || selectedJobDetails.customerPhone || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 block uppercase">Collection Address</span>
                  <span className="text-slate-800 font-bold leading-normal">📍 {selectedJobDetails.address || selectedJobDetails.customerAddress || 'N/A'}</span>
                </div>
              </div>

              {/* Device and status details */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-semibold text-slate-650">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Device Model</span>
                  <span className="text-slate-800 font-black">{selectedJobDetails.device || selectedJobDetails.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Offered Value</span>
                  <span className="text-emerald-600 font-black">{selectedJobDetails.price}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold text-[#39b54a]">Change Status (Dynamic)</span>
                  <select
                    value={selectedJobDetails.status}
                    onChange={(e) => handleUpdateStatus(selectedJobDetails.id, e.target.value)}
                    className="mt-1 px-2 py-1 rounded-lg font-bold text-[10px] bg-white border border-slate-200 focus:outline-none cursor-pointer text-slate-700 focus:border-[#39b54a]"
                  >
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
                  <span className="text-slate-800 font-bold">{selectedJobDetails.partner || 'N/A'}</span>
                </div>
              </div>

              {/* Diagnostic Answers */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Diagnostic Appraisal Answers</span>
                {selectedJobDetails.answers && Object.keys(selectedJobDetails.answers).length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {Object.keys(selectedJobDetails.answers).map((qText) => (
                      <div key={qText} className="flex justify-between border-b pb-1 last:border-b-0">
                        <span className="text-slate-500 font-semibold">{qText}</span>
                        <span className={`font-black uppercase text-[9px] px-2 py-0.5 rounded ${
                          selectedJobDetails.answers[qText] === 'Perfect' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>{selectedJobDetails.answers[qText]}</span>
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
                onClick={() => setSelectedJobDetails(null)}
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
