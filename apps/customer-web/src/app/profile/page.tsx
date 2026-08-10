"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UserProfilePage() {
  const [activeLocation, setActiveLocation] = useState('Gurgaon');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [detectingLoc, setDetectingLoc] = useState(false);

  const handleSelectCity = (city: string) => {
    setActiveLocation(city);
    localStorage.setItem('cashifin_location', city);
    setShowLocationModal(false);
  };

  const handleDetectLocation = async () => {
    setDetectingLoc(true);
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data && data.city) {
        const detectedCity = data.city;
        setActiveLocation(detectedCity);
        localStorage.setItem('cashifin_location', detectedCity);
      } else {
        setActiveLocation('Gurgaon');
        localStorage.setItem('cashifin_location', 'Gurgaon');
      }
    } catch (err) {
      setActiveLocation('Gurgaon');
      localStorage.setItem('cashifin_location', 'Gurgaon');
    }
    setDetectingLoc(false);
    setShowLocationModal(false);
  };

  useEffect(() => {
    const loc = localStorage.getItem('cashifin_location');
    if (loc) {
      setActiveLocation(loc);
    }
  }, []);

  const [orders, setOrders] = useState<any[]>([]);
  const [pickups, setPickups] = useState<any[]>([]);
  const [userName, setUserName] = useState('adarsh Deep Sachan');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [userEmail, setUserEmail] = useState('adarsh.sachan@gmail.com');
  const [userAddress, setUserAddress] = useState('B-45, Sector 62, Noida, UP');
  const [editSuccess, setEditSuccess] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Fetch orders & pickups dynamically from shared DB api
    fetch('/api/orders').then(r => r.json()).then(d => setOrders(d || []));
    fetch('/api/pickups').then(r => r.json()).then(d => setPickups(d || []));
  }, []);

  // Split into Buyback (Selling) vs Refurbished (Purchases)
  const buybackOrders = orders.filter(o => !o.customerName && (o.customer === userName || o.customer === 'Jane Doe' || !o.customer));
  const purchaseOrders = orders.filter(o => o.customerName === userName || o.customerName === 'Jane Doe' || o.customerName === 'adarsh Deep Sachan');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 3000);
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold">Pending Verification</span>;
      case 'Completed':
        return <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">Paid Out</span>;
      default:
        return <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">{status}</span>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cashifin_user');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navigation Header */}
      <div className="bg-white border-b border-slate-100 px-10 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-40">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <img src="/logo.jpg" alt="CASHIFIN" className="h-16 w-auto rounded-lg object-contain py-1" />
        </Link>
        <div className="flex items-center space-x-6 text-xs font-bold text-slate-650">
          <Link href="/" className="hover:text-[#39b54a]">← Return to Home</Link>
          <span className="border-l pl-4"><span className="cursor-pointer" onClick={() => setShowLocationModal(true)}>📍 {activeLocation} ▼</span></span>
          <span className="text-[#39b54a] cursor-pointer" onClick={handleLogout}>👤 {userName} (Logout)</span>
        </div>
      </div>

      <div className="px-10 py-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Left side: Profile Settings */}
        <div className="bg-white p-6 rounded-2xl border shadow-3xs space-y-5 h-fit">
          <div>
            <h2 className="text-base font-black text-slate-850">My Profile</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage your personal pickup preferences</p>
          </div>

          {editSuccess && (
            <div className="bg-emerald-50 text-emerald-800 text-[10px] font-bold p-3 rounded-lg border border-emerald-100">
              ✓ Profile preferences updated successfully!
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Full Name</label>
              <input 
                type="text" 
                value={userName} 
                onChange={e => setUserName(e.target.value)} 
                className="p-2.5 border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-[#39b54a]" 
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Email Address</label>
              <input 
                type="email" 
                value={userEmail} 
                onChange={e => setUserEmail(e.target.value)} 
                className="p-2.5 border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-[#39b54a]" 
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Phone Number</label>
              <input 
                type="text" 
                value={userPhone} 
                onChange={e => setUserPhone(e.target.value)} 
                className="p-2.5 border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-[#39b54a]" 
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Default Address</label>
              <textarea 
                value={userAddress} 
                onChange={e => setUserAddress(e.target.value)} 
                rows={3}
                className="p-2.5 border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-[#39b54a]" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-2.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-lg transition"
            >
              Save Profile Changes
            </button>
            <button 
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-650 font-black rounded-lg border border-red-200 transition mt-2"
            >
              Logout from Account
            </button>
          </form>
        </div>

        {/* Right side: Orders & Pickups */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Buyback (Selling) */}
          <div className="bg-white p-6 rounded-2xl border shadow-3xs space-y-4">
            <div>
              <h2 className="text-base font-black text-slate-850">My Device Sales (Buybacks)</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Click any card to track doorstep pickup and appraisal details</p>
            </div>

            <div className="space-y-3.5">
              {buybackOrders.map((ord: any) => {
                const pickup = pickups.find(p => p.orderId === ord.id);
                return (
                  <div 
                    key={ord.id} 
                    onClick={() => { setSelectedOrder(ord); setShowDetailsModal(true); }}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3 hover:border-[#39b54a] transition cursor-pointer hover:bg-slate-50/80 group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-[#39b54a] font-bold tracking-wider uppercase group-hover:underline">{ord.id}</span>
                        <h4 className="font-extrabold text-xs text-slate-850 mt-0.5">{ord.device}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-800">{ord.price}</span>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{ord.date}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center pt-3.5 border-t border-slate-200/80 gap-2">
                      <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-semibold">
                        <span>Status:</span>
                        {getOrderStatusBadge(ord.status)}
                      </div>
                      {pickup && (
                        <span className="text-[9px] bg-teal-50 text-[#39b54a] px-2 py-0.5 rounded font-bold border border-teal-100">
                          🗓️ Scheduled: {pickup.slot}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {buybackOrders.length === 0 && (
                <p className="text-center py-6 text-slate-400 text-xs font-semibold">No sell bookings found.</p>
              )}
            </div>
          </div>

          {/* Section 2: Refurbished Purchase Orders */}
          <div className="bg-white p-6 rounded-2xl border shadow-3xs space-y-4">
            <div>
              <h2 className="text-base font-black text-slate-850">My Refurbished Purchases</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Click any card to track order dispatch status and delivery details</p>
            </div>

            <div className="space-y-3.5">
              {purchaseOrders.map((ord: any) => (
                <div 
                  key={ord.id} 
                  onClick={() => { setSelectedOrder(ord); setShowDetailsModal(true); }}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3 hover:border-[#39b54a] transition cursor-pointer hover:bg-slate-50/80 group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-blue-500 font-bold tracking-wider uppercase group-hover:underline">{ord.id}</span>
                      <h4 className="font-extrabold text-xs text-slate-850 mt-0.5">{ord.device}</h4>
                      <p className="text-[9px] text-slate-400 mt-1">Delivery to: {ord.customerAddress || 'Default Address'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-800">{ord.price}</span>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{ord.date}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between items-center pt-3.5 border-t border-slate-200/80 gap-2">
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-semibold">
                      <span>Status:</span>
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">{ord.status || 'Pending Verification'}</span>
                    </div>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold border">
                      🚚 Standard Delivery
                    </span>
                  </div>
                </div>
              ))}
              {purchaseOrders.length === 0 && (
                <p className="text-center py-6 text-slate-400 text-xs font-semibold">No purchase orders found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    
      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-2xl space-y-4 text-slate-800 border relative">
            <button 
              onClick={() => setShowLocationModal(false)} 
              className="absolute top-4 right-4 text-xs font-bold bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            <div className="text-center space-y-1.5 pb-2 border-b">
              <h3 className="font-black text-sm text-slate-850">Select Your Location</h3>
              <p className="text-[9px] text-slate-400">Choose your city to view correct doorstep evaluator schedules</p>
            </div>

            <button 
              onClick={handleDetectLocation}
              disabled={detectingLoc}
              className="w-full py-2.5 bg-[#39b54a]/10 hover:bg-[#39b54a]/15 text-[#39b54a] font-black rounded-lg text-xs flex items-center justify-center space-x-2 border border-dashed border-[#39b54a] transition"
            >
              <span>📍</span>
              <span>{detectingLoc ? 'Detecting Location...' : 'Use Current Location'}</span>
            </button>

            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Popular Cities</p>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold">
                {['Gurgaon', 'Delhi', 'Noida', 'Bangalore', 'Mumbai', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune'].map(city => (
                  <button 
                    key={city}
                    onClick={() => handleSelectCity(city)}
                    className="p-2 border rounded-lg hover:border-[#39b54a] hover:bg-slate-50 transition"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[450px] shadow-2xl space-y-5 text-slate-800 border relative text-xs">
            <button 
              onClick={() => { setSelectedOrder(null); setShowDetailsModal(false); }}
              className="absolute top-4 right-4 text-xs font-bold bg-slate-100 hover:bg-slate-200 w-6 h-6 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            <div className="border-b pb-3.5">
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase">{selectedOrder.id}</span>
              <h3 className="font-black text-sm text-slate-800 mt-2">{selectedOrder.device}</h3>
              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Placed on {selectedOrder.date}</p>
            </div>

            {/* Tracking progress milestones timeline */}
            <div className="space-y-4">
              <p className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Order Progress status</p>
              
              <div className="space-y-3 pl-3 relative border-l border-slate-200 ml-1.5">
                {/* Milestone 1 */}
                <div className="relative">
                  <span className="absolute -left-[17px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center ring-4 ring-emerald-50"></span>
                  <div className="pl-2">
                    <p className="font-bold text-slate-800">Order Booking Confirmed</p>
                    <p className="text-[9px] text-slate-400">Evaluating slots assigned</p>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="relative">
                  <span className="absolute -left-[17px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center ring-4 ring-emerald-50"></span>
                  <div className="pl-2">
                    <p className="font-bold text-slate-800">In Appraisal / Evaluation Dispatch</p>
                    <p className="text-[9px] text-slate-400">Our representative has received the credentials</p>
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="relative">
                  <span className="absolute -left-[17px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-blue-50 animate-pulse"></span>
                  <div className="pl-2">
                    <p className="font-bold text-slate-850">Doorstep pickup / delivery schedule</p>
                    <p className="text-[9px] text-[#39b54a] font-semibold">{selectedOrder.customerAddress || 'Scheduled Slot Pickups'}</p>
                  </div>
                </div>

                {/* Milestone 4 */}
                <div className="relative">
                  <span className="absolute -left-[17px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-slate-100"></span>
                  <div className="pl-2">
                    <p className="font-bold text-slate-400">Evaluation complete / cash disbursed</p>
                    <p className="text-[9px] text-slate-400">Order successfully completed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border space-y-2 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-450 font-bold">Transaction Value</span>
                <span className="font-black text-[#39b54a] text-xs">{selectedOrder.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-455 font-bold">Contact Name</span>
                <span className="font-bold text-slate-700">{selectedOrder.customerName || userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-455 font-bold">Contact Phone</span>
                <span className="font-bold text-slate-700">{selectedOrder.customerPhone || userPhone}</span>
              </div>
            </div>

            <button 
              onClick={() => { setSelectedOrder(null); setShowDetailsModal(false); }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
</div>
  );
}