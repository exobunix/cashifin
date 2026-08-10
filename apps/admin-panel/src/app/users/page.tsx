"use client";
import React, { useState, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data || []));
  }, []);

  const handleToggleBlock = async (id: string) => {
    const targetUser = users.find((u: any) => u.id === id);
    if (!targetUser) return;

    const updatedUser = { ...targetUser, status: targetUser.status === 'Active' ? 'Blocked' : 'Active' };
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', item: updatedUser })
    });
    const result = await res.json();
    if (result.success) {
      setUsers(result.data);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const result = await res.json();
    if (result.success) {
      setUsers(result.data);
    }
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Users Management ({users.length} Registered)</h3>
          <p className="text-xs text-slate-400">Block or delete client buyback profiles</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="p-2 border rounded text-xs w-64 bg-white"
        />
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3">User ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Date Joined</th>
              <th className="p-3">Wallet</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{u.id}</td>
                <td className="p-3 font-bold">{u.name}</td>
                <td className="p-3 text-slate-500">{u.email}</td>
                <td className="p-3">{u.phone}</td>
                <td className="p-3 text-slate-400">{u.date}</td>
                <td className="p-3 font-semibold text-slate-700">{u.wallet}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{u.status}</span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => handleToggleBlock(u.id)} className="text-slate-600 hover:text-slate-950 font-semibold">
                    {u.status === 'Active' ? '🔒 Block' : '🔓 Unblock'}
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="text-rose-500 hover:text-rose-700 font-semibold">
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
