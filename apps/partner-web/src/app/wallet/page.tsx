"use client";
import React, { useState, useEffect } from 'react';

export default function Wallet() {
  const [balance, setBalance] = useState(8320);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [txns, setTxns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal controls
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showGatewayPayModal, setShowGatewayPayModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Bank states persisted via localStorage
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accName, setAccName] = useState('MobileHub Store');
  const [accNum, setAccNum] = useState('5010002148291');
  const [ifsc, setIfsc] = useState('HDFC0000104');

  // Temporary edit states
  const [tempBankName, setTempBankName] = useState('');
  const [tempAccName, setTempAccName] = useState('');
  const [tempAccNum, setTempAccNum] = useState('');
  const [tempIfsc, setTempIfsc] = useState('');

  // Add Funds form states
  const [addAmount, setAddAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'gateway' | 'bank_transfer'>('gateway');
  
  // Bank transfer states
  const [bankReference, setBankReference] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<any>(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      const API_BASE = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
        ? 'https://cashifin-admin-panel.vercel.app/api'
        : 'http://localhost:3001/api';
      // Fetch partner details to get the wallet balance
      const partnerRes = await fetch(`${API_BASE}/partners`);
      const partnersList = await partnerRes.json();
      const currentPartner = partnersList.find((p: any) => p.id === 'PTN-101') || partnersList[0];
      
      if (currentPartner) {
        setPartnerData(currentPartner);
        // Clean wallet balance (e.g. ₹8,450 -> 8450)
        const rawBalance = parseInt(currentPartner.wallet.replace(/[^0-9]/g, '')) || 0;
        setBalance(rawBalance);
      }

      // Fetch partner payments / transactions
      const paymentsRes = await fetch(`${API_BASE}/partner_payments`);
      const paymentsList = await paymentsRes.json();
      
      // Filter payments belonging to PTN-101
      const filteredPayments = paymentsList.filter((p: any) => p.partnerId === 'PTN-101' || p.partnerId === currentPartner?.id);
      
      // Map payments to transaction format
      const formattedTxns = filteredPayments.map((p: any) => ({
        id: p.id,
        desc: p.method === 'Gateway' 
          ? 'Refill Wallet via Payment Gateway' 
          : `Bank Refill Request (Ref: ${p.reference || 'N/A'})`,
        type: 'Credit',
        amt: `+₹${p.amount.toLocaleString()}`,
        date: p.date,
        status: p.status
      }));

      // Merge with default initial payouts if any
      const initialPayouts = [
        { id: 'TXN-9021', desc: 'Assigned Job ORD-8690 Payout Commission', type: 'Credit', amt: '+₹450', date: '06 May 2025', status: 'Success' },
        { id: 'TXN-9018', desc: 'Instant Payout to Bank Account', type: 'Debit', amt: '-₹18,500', date: '04 May 2025', status: 'Success' },
        { id: 'TXN-9015', desc: 'Assigned Job ORD-8654 Payout Commission', type: 'Credit', amt: '+₹380', date: '03 May 2025', status: 'Success' },
        { id: 'TXN-9002', desc: 'Referral Bonus MobileHub program', type: 'Credit', amt: '+₹1,000', date: '01 May 2025', status: 'Success' }
      ];

      setTxns([...formattedTxns, ...initialPayouts]);
    } catch (e) {
      console.error("Error loading wallet database:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();

    const savedBankName = localStorage.getItem('partner_bank_name');
    const savedAccName = localStorage.getItem('partner_acc_name');
    const savedAccNum = localStorage.getItem('partner_acc_num');
    const savedIfsc = localStorage.getItem('partner_ifsc');

    if (savedBankName) setBankName(savedBankName);
    if (savedAccName) setAccName(savedAccName);
    if (savedAccNum) setAccNum(savedAccNum);
    if (savedIfsc) setIfsc(savedIfsc);
  }, []);

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

  // Handle gateway checkout process
  const handleGatewayPayment = async () => {
    if (!addAmount || parseInt(addAmount) <= 0) return;
    setIsSubmitting(true);
    
    // Simulate gateway integration loading
    setTimeout(async () => {
      try {
        const addedVal = parseInt(addAmount);
        const newBalanceVal = balance + addedVal;
        const pId = partnerData?.id || 'PTN-101';
        const pName = partnerData?.name || 'Rohit Sharma';
        
        // 1. Create Gateway Payment Record
        const payId = `PAY-${Date.now().toString().slice(-6)}`;
        const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        
        const API_BASE = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
          ? 'https://cashifin-admin-panel.vercel.app/api'
          : 'http://localhost:3001/api';

        await fetch(`${API_BASE}/partner_payments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            item: {
              id: payId,
              partnerId: pId,
              partnerName: pName,
              method: 'Gateway',
              amount: addedVal,
              date: dateStr,
              status: 'Success'
            }
          })
        });

        // 2. Update Partner Wallet balance in DB
        const updatedPartner = {
          ...partnerData,
          wallet: `₹${newBalanceVal.toLocaleString()}`
        };
        await fetch(`${API_BASE}/partners`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update',
            item: updatedPartner
          })
        });

        setIsSubmitting(false);
        setShowGatewayPayModal(false);
        setShowAddFundsModal(false);
        setShowSuccessModal(true);
        setAddAmount('');
        fetchWalletData();
      } catch (err) {
        console.error("Gateway payment failed:", err);
        setIsSubmitting(false);
      }
    }, 2500);
  };

  // Handle raising a bank transfer ticket
  const handleBankTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addAmount || parseInt(addAmount) <= 0 || !bankReference) return;
    setIsSubmitting(true);

    try {
      const addedVal = parseInt(addAmount);
      const pId = partnerData?.id || 'PTN-101';
      const pName = partnerData?.name || 'Rohit Sharma';
      const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      
      const payId = `PAY-${Date.now().toString().slice(-6)}`;
      const ticketId = `TCK-${Date.now().toString().slice(-6)}`;
      
      // Use fallback default screenshot if none uploaded
      const finalScreenshot = screenshotUrl || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=500';

      const API_BASE = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
        ? 'https://cashifin-admin-panel.vercel.app/api'
        : 'http://localhost:3001/api';

      // 1. Create Pending Bank Transfer Payment record
      await fetch(`${API_BASE}/partner_payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          item: {
            id: payId,
            partnerId: pId,
            partnerName: pName,
            method: 'Bank Transfer',
            amount: addedVal,
            date: dateStr,
            status: 'Pending',
            reference: bankReference,
            screenshot: finalScreenshot
          }
        })
      });

      // 2. Create support ticket for verification
      await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          item: {
            id: ticketId,
            partnerId: pId,
            partnerName: pName,
            subject: `Bank Transfer verification (₹${addedVal.toLocaleString()})`,
            type: 'Bank Transfer Payout',
            amount: addedVal,
            date: dateStr,
            status: 'Open',
            screenshot: finalScreenshot,
            paymentId: payId
          }
        })
      });

      setIsSubmitting(false);
      setShowAddFundsModal(false);
      alert(`Bank transfer verification ticket ${ticketId} raised successfully! Once Admin verifies the transfer, your balance will update.`);
      
      // Reset form
      setAddAmount('');
      setBankReference('');
      setScreenshotFile(null);
      setScreenshotUrl('');
      fetchWalletData();
    } catch (err) {
      console.error("Bank transfer submission error:", err);
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshotFile(file);
      // Generate a object URL to display preview
      setScreenshotUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800">💳 Wallet Payouts & Settlement Balance</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Track your wallet balances, disburse client payouts, and trigger bank withdrawals.</p>
        </div>
        <button
          onClick={() => setShowAddFundsModal(true)}
          className="px-5 py-3 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
        >
          ➕ Request Add Funds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4 col-span-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Available Balance</span>
          <h2 className="text-3xl font-black text-[#39b54a]">₹{balance.toLocaleString()}</h2>
          <p className="text-[10px] text-slate-450 font-semibold">Ready for instant withdrawal transfer</p>
          <button 
            disabled
            className="w-full py-3 bg-slate-100 text-slate-400 font-black rounded-xl text-xs border cursor-not-allowed"
          >
            Auto-Settlement Active
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
        
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">Loading wallet history...</div>
        ) : (
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
                  <td className={`p-4 ${t.type === 'Credit' ? 'text-[#39b54a]' : 'text-slate-800'}`}>{t.amt}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${
                      t.status === 'Success' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : t.status === 'Pending'
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Request Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[480px] shadow-2xl space-y-4 text-slate-800 border relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowAddFundsModal(false)} 
              className="absolute top-4 right-4 text-xs font-bold bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            <div className="text-center space-y-1.5 pb-2 border-b">
              <h3 className="font-black text-sm text-slate-850">Request to Add Funds</h3>
              <p className="text-[9px] text-slate-400">Add funds using payment gateway or direct bank transfer</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-slate-450 text-xs font-bold mb-1">Amount to Add (₹)</label>
                <input 
                  type="number" 
                  value={addAmount} 
                  onChange={e => setAddAmount(e.target.value)} 
                  placeholder="Enter amount (e.g. 5000)" 
                  className="p-2.5 border rounded-xl bg-slate-50 font-bold text-sm" 
                  required 
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-450 text-xs font-bold mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gateway')}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'gateway' 
                        ? 'border-[#39b54a] bg-emerald-50/30 text-[#39b54a]' 
                        : 'border-slate-200 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg">💳</span>
                    <span>Payment Gateway</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'bank_transfer' 
                        ? 'border-[#39b54a] bg-emerald-50/30 text-[#39b54a]' 
                        : 'border-slate-200 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg">🏦</span>
                    <span>Bank Transfer</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'gateway' ? (
                <div className="pt-2">
                  <button
                    onClick={() => setShowGatewayPayModal(true)}
                    disabled={!addAmount || parseInt(addAmount) <= 0}
                    className="w-full py-3 bg-[#39b54a] hover:bg-[#2fa03e] disabled:bg-slate-200 text-white font-black rounded-xl text-xs shadow-3xs transition cursor-pointer"
                  >
                    Proceed to Payment Gateway
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBankTransferSubmit} className="space-y-4 pt-2 border-t text-xs font-bold">
                  <div className="bg-slate-50 p-3.5 border rounded-xl space-y-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Admin Bank Details</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                      <div><p className="text-slate-400 font-medium">Bank Name</p><p className="font-bold">ICICI Bank</p></div>
                      <div><p className="text-slate-400 font-medium">IFSC Code</p><p className="font-bold">ICIC0000004</p></div>
                      <div className="col-span-2"><p className="text-slate-400 font-medium">Account Name</p><p className="font-bold">Cashify Recommerce Pvt Ltd</p></div>
                      <div className="col-span-2"><p className="text-slate-400 font-medium">Account Number</p><p className="font-bold font-mono text-[#39b54a]">000405001289</p></div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-slate-450 mb-1">Transaction ID / Reference Number</label>
                    <input 
                      type="text" 
                      value={bankReference} 
                      onChange={e => setBankReference(e.target.value)} 
                      placeholder="e.g. UTR1287635292" 
                      className="p-2.5 border rounded-xl bg-slate-50 font-mono" 
                      required 
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-slate-450 mb-1">Attach Receipt / Payment Screenshot</label>
                    <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer relative hover:border-[#39b54a] transition">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        required={!screenshotUrl}
                      />
                      {screenshotUrl ? (
                        <div className="space-y-1.5">
                          <img src={screenshotUrl} alt="Preview" className="h-16 mx-auto rounded object-contain border" />
                          <p className="text-[10px] text-[#39b54a] font-black">✓ Screenshot attached ({screenshotFile?.name})</p>
                        </div>
                      ) : (
                        <div className="space-y-1 text-slate-400">
                          <span className="text-xl">📸</span>
                          <p className="text-[10px] font-bold">Click to upload transfer screenshot</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !addAmount || !bankReference}
                    className="w-full py-3 bg-[#39b54a] hover:bg-[#2fa03e] disabled:bg-slate-200 text-white font-black rounded-xl text-xs shadow-md transition cursor-pointer"
                  >
                    {isSubmitting ? 'Submitting...' : 'Raise Ticket & Request Verification'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Simulated Gateway Payment Modal */}
      {showGatewayPayModal && (
        <div className="fixed inset-0 bg-black/75 z-55 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[400px] text-center shadow-2xl space-y-6 text-slate-800 border relative">
            {isSubmitting ? (
              <div className="py-12 space-y-4 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]"></div>
                <p className="text-xs font-black text-slate-500">Contacting Bank Gateway & Processing payment...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-3xl">🏦</span>
                <h3 className="font-black text-base text-slate-800">Simulate Payment Gateway</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  You are paying <span className="font-black text-[#39b54a]">₹{parseInt(addAmount).toLocaleString()}</span> to Cashify Portal.
                </p>
                <div className="bg-slate-50 p-4 border rounded-xl text-left space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Merchant</span><span className="font-bold">Cashify Gateway</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Amount</span><span className="font-bold text-[#39b54a]">₹{parseInt(addAmount).toLocaleString()}</span></div>
                </div>
                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => setShowGatewayPayModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleGatewayPayment}
                    className="flex-1 py-2.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white text-xs font-bold rounded-xl"
                  >
                    Simulate Success
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 z-55 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[360px] text-center shadow-2xl space-y-4 text-slate-800 border relative">
            <span className="text-4xl text-[#39b54a] block animate-bounce">🎉</span>
            <h3 className="font-black text-sm text-slate-800">Payment Successful!</h3>
            <p className="text-xs text-slate-400 font-semibold">
              The amount has been successfully deducted from your bank and instantly credited to your wallet balance.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white text-xs font-bold rounded-xl"
            >
              Okay, Awesome
            </button>
          </div>
        </div>
      )}

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
