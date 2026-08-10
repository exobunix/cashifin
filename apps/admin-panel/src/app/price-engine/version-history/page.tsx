"use client";
import React, { useState } from 'react';

const initialVersions = [
  {
    "version": "v2.4.1",
    "date": "06 Aug 2026, 04:12 PM",
    "description": "Updated screen replacement deduction rules",
    "author": "Adarsh Admin",
    "status": "Active"
  },
  {
    "version": "v2.4.0",
    "date": "01 Aug 2026, 09:30 AM",
    "description": "Added MacBook Pro M3 category pricing bounds",
    "author": "Adarsh Admin",
    "status": "Rolled Back"
  },
  {
    "version": "v2.3.9",
    "date": "15 Jul 2026, 11:20 AM",
    "description": "Initial Q3 pricing formulas deployment",
    "author": "Adarsh Admin",
    "status": "Backup"
  },
  {
    "version": "v2.3.8",
    "date": "02 Jul 2026, 10:15 AM",
    "description": "Emergency hotfix for battery health penalties",
    "author": "Adarsh Admin",
    "status": "Backup"
  },
  {
    "version": "v2.3.7",
    "date": "20 Jun 2026, 03:45 PM",
    "description": "Initial launch of smartwatch dynamic evaluation",
    "author": "Adarsh Admin",
    "status": "Backup"
  }
];

export default function VersionsPage() {
  const [versions, setVersions] = useState(initialVersions);

  const handleRollback = (ver: string) => {
    alert(`Rollback request sent for ${ver}. Reverting pricing formulas to this database state.`);
    setVersions(versions.map(v => {
      if (v.version === ver) return { ...v, status: 'Active' };
      if (v.status === 'Active') return { ...v, status: 'Backup' };
      return v;
    }));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="border-b pb-4 mb-4">
        <h3 className="text-base font-bold text-slate-800">Engine Version & Rollback</h3>
        <p className="text-xs text-slate-400">View configuration update logs and rollback versions</p>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3">Version</th>
              <th className="p-3">Deployment Time</th>
              <th className="p-3">Description</th>
              <th className="p-3">Author</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {versions.map((v) => (
              <tr key={v.version} className="hover:bg-slate-50">
                <td className="p-3 font-black text-slate-900 font-mono">{v.version}</td>
                <td className="p-3 text-slate-400">{v.date}</td>
                <td className="p-3 text-slate-600">{v.description}</td>
                <td className="p-3 text-slate-500">{v.author}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    v.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>{v.status}</span>
                </td>
                <td className="p-3 text-center">
                  {v.status !== 'Active' && v.status !== 'Rolled Back' && (
                    <button onClick={() => handleRollback(v.version)} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-950 text-white rounded text-[10px] font-bold transition">
                      Rollback
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
