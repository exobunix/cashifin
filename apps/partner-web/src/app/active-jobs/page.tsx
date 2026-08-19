"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ActiveJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCall, setActiveCall] = useState<any>(null);

  useEffect(() => {
    fetch('/api/active_jobs')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0 && !data.error) {
          setJobs(data);
        } else {
          // Seed the initial jobs if database is empty or returns error
          const initialJobs = [
            { id: 'ORD-8711', name: 'MacBook Pro M3 16-Inch', price: '₹1,25,000', client: 'Arjun Reddy', phone: '+91 99887 76655', address: 'B-102, DLF Phase 3, Gurgaon', status: 'Scheduled' },
            { id: 'ORD-8705', name: 'OnePlus 11 5G 128GB', price: '₹28,500', client: 'Neha Gupta', phone: '+91 98112 23344', address: 'Plot 45, Sector 44, Noida', status: 'In Inspection' },
            { id: 'ORD-8692', name: 'Apple iPad Pro M2', price: '₹48,000', client: 'Kunal Kapoor', phone: '+91 97223 34455', address: 'Apartment 4B, GK-2, New Delhi', status: 'Verification Pending' }
          ];

          Promise.all(initialJobs.map(job =>
            fetch('/api/active_jobs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'create', item: job })
            })
          )).then(() => {
            setJobs(initialJobs);
          }).catch(() => {
            setJobs(initialJobs); // local fallback if write fails
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6 relative">
      <div>
        <h1 className="text-xl font-black text-slate-800">📦 Active Inspection Routes</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Manage accepted doorstep collection routes & start diagnosis checks.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-sm font-bold text-slate-500 animate-pulse">Loading active routes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs flex flex-col justify-between h-52">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">{job.id}</span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-black uppercase tracking-wider">{job.status}</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1">{job.name}</h4>
                <p className="text-[10px] text-slate-450 font-bold">Client: {job.client} | {job.price}</p>
                <p className="text-[10px] text-slate-400 leading-normal font-semibold">📍 {job.address}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Link 
                  href={`/inspection?orderId=${job.id}&name=${encodeURIComponent(job.name)}&client=${encodeURIComponent(job.client)}&price=${encodeURIComponent(job.price)}`} 
                  className="flex-1 text-center py-2.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white rounded-xl text-[10px] font-black shadow-3xs transition-all cursor-pointer flex items-center justify-center"
                >
                  Start Inspection
                </Link>
                <button 
                  onClick={() => setActiveCall({ name: job.client, phone: job.phone })}
                  className="px-3.5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-[10px] font-black transition cursor-pointer"
                >
                  📞 Call
                </button>
              </div>
            </div>
          ))}
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
    </div>
  );
}
