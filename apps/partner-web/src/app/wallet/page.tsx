"use client";
import React, { useState, useEffect } from 'react';

export default function Wallet() {
  const [balance, setBalance] = useState(8320);
  const [txns, setTxns] = useState([
    { id: 'TXN-9021', desc: 'Assigned Job ORD-8690 Payout Commission', type: 'Credit', amt: '+₹450', date: '06 May 2025', status: 'Success' },
    { id: 'TXN-9018', desc: 'Instant Payout to Bank Account', type: 'Debit', amt: '-₹18,500', date: '04 May 2025', status: 'Success' },
    { id: 'TXN-9015', desc: 'Assigned Job ORD-8654 Payout Commission', type: 'Credit', amt: '+₹380', date: '03 May 2025', status: 'Success' },
    { id: 'TXN-9002', desc: 'Referral Bonus MobileHub program', type: 'Credit', amt: '+₹1,000', date: '01 May 2025', status: 'Success' }
  ]);

  // Bank states persisted via localStorage
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accName, setAccName] = useState('MobileHub Store');
  const [accNum, setAccNum] = useState('5010002148291');
  const [ifsc, setIfsc] = useState('HDFC0000104');
  const [showEditModal, setShowEditModal] = useState(false);

  // Temporary edit states
  const [tempBankName, setTempBankName] = useState('');
  const [tempAccName, setTempAccName] = useState('');
  const [tempAccNum, setTempAccNum] = useState('');
  const [tempIfsc, setTempIfsc] = useState('');

  useEffect(() => {
    const savedBankName = localStorage.getItem('partner_bank_name');
    const savedAccName = localStorage.getItem('partner_acc_name');
    const savedAccNum = localStorage.getItem('partner_acc_num');
    const savedIfsc = localStorage.getItem('partner_ifsc');

    if (savedBankName) setBankName(savedBankName);
    if (savedAccName) setAccName(savedAccName);
    if (savedAccNum) setAccNum(savedAccNum);
    if (savedIfsc) setIfsc(savedIfsc);
  }, []);

  const handleWithdraw = () => {
    if (balance <= 0) return;
    alert(`Withdrawal request for ₹${balance} successfully initiated to ${bankName} account Ending in *${accNum.slice(-4)}!`);
    setTxns([
      { id: `TXN-${Date.now().toString().slice(-4)}`, desc: `Instant Payout to ${bankName} A/c (*${accNum.slice(-4)})`, type: 'Debit', amt: `-₹${balance}`, date: 'Today', status: 'Success' },
      ...txns
    ]);
    setBalance(0);
  };

  const openEditModal = () => {
    setTempBankName(bankName);
    setTempAccName(accName);
    setTempAccNum(accNum);
    setTempIfsc(ifsc);
    setShowEditModal(true);
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    setBankName(tempBankName);
    setAccName(tempAccName);
    setAccNum(tempAccNum);
    setIfsc(tempIfsc);

    localStorage.setItem('partner_bank_name', tempBankName);
    localStorage.setItem('partner_acc_name', tempAccName);
    localStorage.setItem('partner_acc_num', tempAccNum);
    localStorage.setItem('partner_ifsc', tempIfsc);

    setShowEditModal(false);
    alert('Bank account details updated successfully!');
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-800">💳 Wallet Payouts & Settlement Balance</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Track your wallet balances, disburse client payouts, and trigger bank withdrawals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4 col-span-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Available Balance</span>
          <h2 className="text-3xl font-black text-[#39b54a]">₹{balance.toLocaleString()}</h2>
          <p className="text-[10px] text-slate-450 font-semibold">Ready for instant withdrawal transfer</p>
          <button 
            onClick={handleWithdraw}
            disabled={balance <= 0}
            className="w-full py-3 bg-[#39b54a] hover:bg-[#2fa03e] disabled:bg-slate-200 text-white font-black rounded-xl text-xs shadow-3xs transition cursor-pointer"
          >
            Settle to Bank Account
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4 col-span-2">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Settlement Method</h3>
            <button 
              onClick={openEditModal}
              className="text-xs text-[#39b54a] font-black hover:underline cursor-pointer"
            >
              ✍️ Update Bank Account
            </button>
          </div>
          <div className="p-4 bg-slate-50 border rounded-xl flex items-center justify-between">
            <div className="space-y-1 text-xs">
              <p className="font-black text-slate-700 font-bold">{bankName} Savings Account</p>
              <p className="text-[10px] text-slate-400 font-semibold">
                Account ending in *{accNum.slice(-4)} | IFSC: {ifsc} | Holder: {accName}
              </p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-black uppercase border border-emerald-100">Primary</span>
          </div>
          <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
            Payout requests are processed automatically through IMPS network. Payments are usually credited within 10-15 minutes of request registration.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Recent Transaction History</h3>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Description</th>
              <th className="p-4">Type</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
            {txns.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono text-slate-500">{t.id}</td>
                <td className="p-4 text-slate-900">{t.desc}</td>
                <td className="p-4">{t.type}</td>
                <td className="p-4 text-slate-450 font-semibold">{t.date}</td>
                <td className={`p-4 &{t.type === 'Credit' ? 'text-[#39b54a]' : 'text-slate-800'}`}>{t.amt}</td>
                <td className="p-4 text-center"><span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] border border-emerald-100">{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Bank Modal Dialog */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[420px] shadow-2xl space-y-4 text-slate-800 border relative">
            <button 
              onClick={() => setShowEditModal(false)} 
              className="absolute top-4 right-4 text-xs font-bold bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            <div className="text-center space-y-1.5 pb-2 border-b">
              <h3 className="font-black text-sm text-slate-850">Update Settlement Bank</h3>
              <p className="text-[9px] text-slate-400">Set bank destination parameters for logistics payouts</p>
            </div>

            <form onSubmit={handleSaveBank} className="space-y-3.5 text-xs font-bold">
              <div className="flex flex-col">
                <label className="text-slate-450 mb-1">Account Holder Name</label>
                <input type="text" value={tempAccName} onChange={e => setTempAccName(e.target.value)} className="p-2.5 border rounded-xl bg-slate-50" required />
              </div>
              <div className="flex flex-col">
                <label className="text-slate-450 mb-1">Bank Name</label>
                <input type="text" value={tempBankName} onChange={e => setTempBankName(e.target.value)} className="p-2.5 border rounded-xl bg-slate-50" required />
              </div>
              <div className="flex flex-col">
                <label className="text-slate-450 mb-1">Account Number</label>
                <input type="text" value={tempAccNum} onChange={e => setTempAccNum(e.target.value)} className="p-2.5 border rounded-xl bg-slate-50 font-mono" required />
              </div>
              <div className="flex flex-col">
                <label className="text-slate-450 mb-1">IFSC Code</label>
                <input type="text" value={tempIfsc} onChange={e => setTempIfsc(e.target.value)} className="p-2.5 border rounded-xl bg-slate-50 font-mono" required />
              </div>

              <div className="pt-2 flex space-x-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white rounded-xl">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
