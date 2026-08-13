"use client";
import React, { useState, useEffect } from 'react';

export default function RoutePage() {
  const [activeTab, setActiveTab] = useState<'gateway' | 'bank_transfer' | 'tickets'>('gateway');
  const [payments, setPayments] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected screenshot preview modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch payments
      const payRes = await fetch('/api/partner_payments');
      const payData = await payRes.json();
      setPayments(Array.isArray(payData) ? payData : []);

      // 2. Fetch tickets
      const tktRes = await fetch('/api/tickets');
      const tktData = await tktRes.json();
      setTickets(Array.isArray(tktData) ? tktData : []);

      // 3. Fetch partners
      const ptnRes = await fetch('/api/partners');
      const ptnData = await ptnRes.json();
      setPartners(Array.isArray(ptnData) ? ptnData : []);
    } catch (e) {
      console.error("Error loading wallet details:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const gatewayPayments = payments.filter((p: any) => p.method === 'Gateway');
  const bankPayments = payments.filter((p: any) => p.method === 'Bank Transfer');
  const bankTickets = tickets.filter((t: any) => t.type === 'Bank Transfer Payout');

  // Approve a bank transfer payment
  const handleApprove = async (ticket: any) => {
    try {
      // 1. Find corresponding payment record
      const paymentId = ticket.paymentId;
      const targetPayment = payments.find((p: any) => p.id === paymentId);
      if (!targetPayment) return;

      // 2. Find corresponding partner
      const partnerId = ticket.partnerId;
      const targetPartner = partners.find((p: any) => p.id === partnerId);
      if (!targetPartner) return;

      // 3. Calculate new wallet balance
      const currentWalletVal = parseInt(targetPartner.wallet.replace(/[^0-9]/g, '')) || 0;
      const newWalletVal = currentWalletVal + ticket.amount;

      // Update payment record in API
      const updatedPayment = { ...targetPayment, status: 'Success' };
      await fetch('/api/partner_payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item: updatedPayment })
      });

      // Update ticket record in API
      const updatedTicket = { ...ticket, status: 'Resolved' };
      await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item: updatedTicket })
      });

      // Update partner wallet balance in API
      const updatedPartner = { ...targetPartner, wallet: `₹${newWalletVal.toLocaleString()}` };
      await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item: updatedPartner })
      });

      alert(`Bank transfer request approved! ₹${ticket.amount.toLocaleString()} credited to partner ${targetPartner.name}.`);
      fetchData();
    } catch (e) {
      console.error("Approval error:", e);
    }
  };

  // Reject a bank transfer payment
  const handleReject = async (ticket: any) => {
    try {
      // 1. Find corresponding payment record
      const paymentId = ticket.paymentId;
      const targetPayment = payments.find((p: any) => p.id === paymentId);
      if (!targetPayment) return;

      // Update payment record in API
      const updatedPayment = { ...targetPayment, status: 'Failed' };
      await fetch('/api/partner_payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item: updatedPayment })
      });

      // Update ticket record in API
      const updatedTicket = { ...ticket, status: 'Rejected' };
      await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item: updatedTicket })
      });

      alert(`Bank transfer verification ticket rejected.`);
      fetchData();
    } catch (e) {
      console.error("Rejection error:", e);
    }
  };

  // Stats calculation
  const totalEscrow = partners.reduce((acc: number, curr: any) => {
    const rawVal = parseInt(curr.wallet.replace(/[^0-9]/g, '')) || 0;
    return acc + rawVal;
  }, 0);

  const totalGateway = gatewayPayments.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
  const totalBank = bankPayments.filter((p: any) => p.status === 'Success').reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  const getScreenshotUrl = (screenshot: string) => {
    if (screenshot && screenshot.startsWith('http') && !screenshot.startsWith('blob')) {
      return screenshot;
    }
    return 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=300&auto=format&fit=crop';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-800">💳 Partners Payments & Wallets</h3>
        <p className="text-xs text-slate-405 font-medium mt-0.5">Manage partner fund refills, verify manual bank transfers, and resolve validation tickets.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Partners Wallet Escrow</span>
          <p className="text-2xl font-black text-slate-850 mt-1.5">₹{totalEscrow.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Gateway Payments</span>
          <p className="text-2xl font-black text-emerald-650 mt-1.5">₹{totalGateway.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Approved Bank Transfers</span>
          <p className="text-2xl font-black text-blue-650 mt-1.5">₹{totalBank.toLocaleString()}</p>
        </div>
      </div>

      {/* Custom Tabs Navigation */}
      <div className="border-b border-slate-200 flex space-x-6 text-xs font-bold text-slate-450">
        <button 
          onClick={() => setActiveTab('gateway')}
          className={`pb-3 px-1 transition relative cursor-pointer ${
            activeTab === 'gateway' ? 'text-[#39b54a] border-b-2 border-[#39b54a]' : 'hover:text-slate-700'
          }`}
        >
          💳 Gateway Payments ({gatewayPayments.length})
        </button>
        <button 
          onClick={() => setActiveTab('bank_transfer')}
          className={`pb-3 px-1 transition relative cursor-pointer ${
            activeTab === 'bank_transfer' ? 'text-[#39b54a] border-b-2 border-[#39b54a]' : 'hover:text-slate-700'
          }`}
        >
          🏦 Bank Transfer Log ({bankPayments.length})
        </button>
        <button 
          onClick={() => setActiveTab('tickets')}
          className={`pb-3 px-1 transition relative cursor-pointer ${
            activeTab === 'tickets' ? 'text-[#39b54a] border-b-2 border-[#39b54a]' : 'hover:text-slate-700'
          }`}
        >
          🎫 Bank Verification Tickets ({bankTickets.filter((t: any) => t.status === 'Open').length} Open)
        </button>
      </div>

      {/* Main Data Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">Syncing database changes...</div>
        ) : (
          <>
            {activeTab === 'gateway' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold border-b">
                    <th className="p-4">Payment ID</th>
                    <th className="p-4">Partner Name</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                  {gatewayPayments.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">No Gateway payments registered yet.</td></tr>
                  ) : (
                    gatewayPayments.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono text-slate-500">{p.id}</td>
                        <td className="p-4 text-slate-900">{p.partnerName}</td>
                        <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-[#39b54a] border border-emerald-100">{p.method}</span></td>
                        <td className="p-4 text-[#39b54a]">₹{p.amount.toLocaleString()}</td>
                        <td className="p-4 text-slate-450 font-semibold">{p.date}</td>
                        <td className="p-4 text-center"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100">{p.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'bank_transfer' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold border-b">
                    <th className="p-4">Payment ID</th>
                    <th className="p-4">Partner Name</th>
                    <th className="p-4">Reference UTR</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Receipt</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                  {bankPayments.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">No bank transfer requests recorded yet.</td></tr>
                  ) : (
                    bankPayments.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono text-slate-500">{p.id}</td>
                        <td className="p-4 text-slate-900">{p.partnerName}</td>
                        <td className="p-4 font-mono text-slate-500">{p.reference || 'N/A'}</td>
                        <td className="p-4 text-slate-800">₹{p.amount.toLocaleString()}</td>
                        <td className="p-4 text-slate-450 font-semibold">{p.date}</td>
                        <td className="p-4">
                          {p.screenshot ? (
                            <button 
                              onClick={() => setPreviewImage(getScreenshotUrl(p.screenshot))}
                              className="text-blue-500 hover:underline text-[10px] font-black cursor-pointer"
                            >
                              👁 Preview Receipt
                            </button>
                          ) : 'No Screenshot'}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${
                            p.status === 'Success' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : p.status === 'Pending'
                              ? 'bg-amber-50 text-amber-600 border-amber-100'
                              : 'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'tickets' && (
              <div className="divide-y divide-slate-150">
                {bankTickets.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 font-semibold">No bank transfer support tickets found.</div>
                ) : (
                  bankTickets.map((t: any) => (
                    <div key={t.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50">
                      <div className="space-y-2 flex-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400 font-bold">{t.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            t.status === 'Open' ? 'bg-amber-50 text-amber-600 border border-amber-150' : 'bg-slate-100 text-slate-500'
                          }`}>{t.status}</span>
                        </div>
                        <h4 className="font-black text-sm text-slate-800">{t.subject}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-550 pt-1.5 font-semibold">
                          <div><p className="text-slate-400 font-normal">Partner</p><p className="font-bold">{t.partnerName}</p></div>
                          <div><p className="text-slate-400 font-normal">Requested Amount</p><p className="font-bold text-[#39b54a]">₹{t.amount.toLocaleString()}</p></div>
                          <div><p className="text-slate-400 font-normal">Ticket Raised</p><p className="font-bold">{t.date}</p></div>
                          <div>
                            <p className="text-slate-400 font-normal">Payment Reference</p>
                            <p className="font-bold font-mono text-slate-600">{
                              payments.find((p: any) => p.id === t.paymentId)?.reference || 'N/A'
                            }</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {t.screenshot && (
                          <button 
                            onClick={() => setPreviewImage(getScreenshotUrl(t.screenshot))}
                            className="p-1 border rounded-lg hover:border-[#39b54a] transition cursor-pointer"
                          >
                            <img src={getScreenshotUrl(t.screenshot)} alt="Receipt preview" className="h-14 w-20 object-cover rounded" />
                          </button>
                        )}
                        
                        {t.status === 'Open' && (
                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => handleApprove(t)}
                              className="px-4 py-2 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-lg text-[10px] shadow-3xs cursor-pointer text-center"
                            >
                              Approve Transfer
                            </button>
                            <button
                              onClick={() => handleReject(t)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-black rounded-lg text-[10px] shadow-3xs cursor-pointer text-center"
                            >
                              Reject & Flag
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Full screen receipt image modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <div className="bg-white p-3 rounded-2xl max-w-[500px] shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 text-xs font-bold bg-slate-100/80 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer shadow-3xs"
            >
              ✕
            </button>
            <img src={previewImage} alt="Payment Receipt Screenshot" className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto border" />
            <p className="text-[10px] text-slate-400 font-bold text-center mt-2.5">Bank Transfer Payment Proof</p>
          </div>
        </div>
      )}
    </div>
  );
}
