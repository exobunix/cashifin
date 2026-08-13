"use client";
import React, { useState, useEffect } from 'react';

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  
  // Reply form states
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState('Open');

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading tickets:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Merge loaded tickets with initial static customer support tickets
  const defaultTickets = [
    { 
      id: 'TCK-201', 
      subject: 'Payment Delay - Order #1092', 
      partnerName: 'Sarah Connor', 
      type: 'Customer Support', 
      priority: 'High', 
      status: 'Open', 
      date: '09 Aug 2026',
      messages: [
        { sender: 'Partner', text: 'Hi support, my payout for order #1092 is delayed. Please check why the payment hasn\'t reached my wallet.', date: '09 Aug 2026, 11:20 AM' }
      ]
    }
  ];

  const allTickets = [
    ...tickets.map(t => ({
      id: t.id,
      partnerId: t.partnerId,
      subject: t.subject,
      partnerName: t.partnerName,
      type: t.type || 'Bank Transfer',
      priority: t.amount && t.amount > 10000 ? 'High' : 'Medium',
      status: t.status,
      date: t.date,
      messages: t.messages || [
        { 
          sender: 'Partner', 
          text: t.subject.includes('verification') 
            ? `Hi Admin, I have submitted a bank transfer verification request. UTR is ${t.paymentId}. Please approve it.` 
            : `Hello Admin, I have a query regarding my ticket ${t.id}.`, 
          date: `${t.date}, 10:00 AM` 
        }
      ],
      rawItem: t // keep reference to full mongoose object
    })),
    ...defaultTickets.filter(dt => !tickets.some(t => t.id === dt.id))
  ];

  const handleRowClick = (t: any) => {
    setSelectedTicket(t);
    setNewStatus(t.status);
    setReplyText('');
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedTicket) return;

    const timeString = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const dateString = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    
    const newMsg = {
      sender: 'Admin',
      text: replyText,
      date: `${dateString}, ${timeString}`
    };

    const updatedMessages = [...selectedTicket.messages, newMsg];
    
    // Auto-update status to "Awaiting Partner Action" if admin replies and user hasn't explicitly set another active status
    let statusToUpdate = newStatus;
    if (statusToUpdate === 'Open') {
      statusToUpdate = 'Awaiting Partner Action';
    }

    const isDefaultStatic = selectedTicket.id === 'TCK-201' && !tickets.some(t => t.id === 'TCK-201');

    const ticketItem = isDefaultStatic ? {
      id: selectedTicket.id,
      partnerId: 'PTN-102',
      partnerName: selectedTicket.partnerName,
      subject: selectedTicket.subject,
      type: selectedTicket.type,
      status: statusToUpdate,
      date: selectedTicket.date,
      messages: updatedMessages
    } : {
      ...(selectedTicket.rawItem || selectedTicket),
      status: statusToUpdate,
      messages: updatedMessages
    };

    // Remove rawItem tag before sending to Mongo
    delete (ticketItem as any).rawItem;

    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: isDefaultStatic ? 'create' : 'update', 
        item: ticketItem 
      })
    });

    const result = await res.json();
    if (result.success) {
      // Refresh tickets list
      fetchTickets();
      // Keep modal open but update details
      setSelectedTicket({
        ...selectedTicket,
        status: statusToUpdate,
        messages: updatedMessages,
        rawItem: ticketItem
      });
      setNewStatus(statusToUpdate);
      setReplyText('');
    }
  };

  return (
    <div className="p-6 space-y-4 text-xs text-slate-800">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-base font-bold text-slate-800">Support & Verification Tickets</h3>
          <p className="text-xs text-slate-400 mt-1">Resolve customer support inquiries and vendor bank payment validations. Click on a ticket to view replies or change status.</p>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400">Loading support tickets...</div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b">
                <th className="p-3">Ticket ID</th>
                <th className="p-3">Subject / Type</th>
                <th className="p-3">Requested By</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
              {allTickets.map((t) => (
                <tr 
                  key={t.id} 
                  onClick={() => handleRowClick(t)}
                  className="hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <td className="p-3 font-mono text-slate-500">{t.id}</td>
                  <td className="p-3">
                    <p className="text-slate-900">{t.subject}</p>
                    <span className="text-[9px] text-slate-400 font-semibold">{t.type}</span>
                  </td>
                  <td className="p-3 text-slate-650">{t.partnerName}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] border ${
                      t.priority === 'High' 
                        ? 'bg-red-50 text-red-655 border-red-100' 
                        : 'bg-blue-50 text-blue-655 border-blue-100'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-semibold">{t.date}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] border ${
                      t.status === 'Open' 
                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                        : t.status === 'Resolved' || t.status === 'Success'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : t.status === 'Awaiting Partner Action'
                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
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

      {/* Ticket Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-[550px] shadow-2xl space-y-4 border overflow-hidden max-h-[90vh] flex flex-col p-6">
            <div className="flex justify-between items-center border-b pb-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 font-bold">{selectedTicket.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] border ${
                    selectedTicket.status === 'Open' 
                      ? 'bg-amber-50 text-amber-600 border-amber-100' 
                      : selectedTicket.status === 'Resolved' || selectedTicket.status === 'Success'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>{selectedTicket.status}</span>
                </div>
                <h3 className="font-black text-sm text-slate-800 mt-1">{selectedTicket.subject}</h3>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)} 
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages Section */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2 bg-slate-50 rounded-xl p-3.5 border border-slate-200 min-h-[220px]">
              {selectedTicket.messages.map((m: any, idx: number) => (
                <div 
                  key={idx} 
                  className={`flex flex-col max-w-[85%] space-y-0.5 ${
                    m.sender === 'Admin' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'Admin' 
                      ? 'bg-sellifyTeal-500 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border rounded-tl-none shadow-3xs'
                  }`}>
                    <p className="font-bold text-[9px] opacity-80 mb-0.5">{m.sender}</p>
                    <p>{m.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 px-1 font-semibold">{m.date}</span>
                </div>
              ))}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="space-y-3 shrink-0 pt-3 border-t">
              <div className="flex items-center gap-3">
                <div className="flex-1 flex flex-col">
                  <label className="font-bold text-slate-450 mb-1">Ticket Status</label>
                  <select 
                    value={newStatus} 
                    onChange={e => setNewStatus(e.target.value)} 
                    className="p-2 border rounded-xl bg-slate-50 font-bold"
                  >
                    <option value="Open">Open (Awaiting Admin)</option>
                    <option value="Awaiting Partner Action">Awaiting Partner Action</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-bold text-slate-450 mb-1">Type Reply</label>
                <textarea 
                  value={replyText} 
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Enter message for partner..."
                  className="p-2.5 border rounded-xl bg-slate-50 min-h-[64px] focus:outline-none focus:bg-white focus:border-sellifyTeal-500 transition"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setSelectedTicket(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-sellifyTeal-500 hover:bg-sellifyTeal-600 text-white rounded-xl font-bold">Send Reply</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
