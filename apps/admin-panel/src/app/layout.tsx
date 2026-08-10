"use client";


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

import React, { useState, useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [logoConfig, setLogoConfig] = useState<any>({ adminLogo: '/logo.jpg' });

  useEffect(() => {
    fetch('/api/logos')
      .then(r => r.json())
      .then(d => {
        if (d?.[0]) setLogoConfig(d[0]);
      })
      .catch(() => {});

    const playChime = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch (e) {
        console.error(e);
      }
    };

    const interval = setInterval(() => {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(data => {
          const unread = (data || []).find((n: any) => n.target === 'admin' && !n.read);
          if (unread) {
            setToastMsg(unread.message);
            playChime();

            // Mark read
            fetch('/api/notifications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'update', item: { ...unread, read: true } })
            }).catch(() => {});

            setTimeout(() => setToastMsg(null), 5000);
          }
        }).catch(() => {});
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const sidebarItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Users', path: '/users', icon: '👤' },
    { label: 'Partners', path: '/partners', icon: '🤝' },
    { label: 'Orders', path: '/orders', icon: '📦' },
    { label: 'Pickups', path: '/pickups', icon: '🚚' },
    { label: 'Categories', path: '/categories', icon: '🗂️' },
    { label: 'Brands', path: '/brands', icon: '🏷️' },
    { label: 'Refurbished Devices', path: '/models', icon: '✨' },
    { label: 'Inventory', path: '/inventory', icon: '🗃️' },
    { label: 'Price Engine', path: '/price-engine/questions', icon: '⚙️', matches: '/price-engine' }
  ];

  const subEngineItems = [
    { label: 'Dashboard', path: '/price-engine/dashboard' },
    { label: 'Base Prices', path: '/price-engine/base-prices' },
    { label: 'Questions', path: '/price-engine/questions' },
    { label: 'Rules Engine', path: '/price-engine/rules-engine' },
    { label: 'Bonus Rules', path: '/price-engine/bonus-rules' },
    { label: 'Formula Builder', path: '/price-engine/formula-builder' },
    { label: 'Price Simulation', path: '/price-engine/price-simulation' },
    { label: 'Version History', path: '/price-engine/version-history' }
  ];

  const bottomItems = [
    { label: 'Coupons & Offers', path: '/coupons', icon: '🎫' },
    { label: 'Wallet & Payments', path: '/wallet', icon: '💳' },
    { label: 'Settlements', path: '/settlements', icon: '💰' },
    { label: 'Support Tickets', path: '/support', icon: '🎫' },
    { label: 'Audit Logs', path: '/audit-logs', icon: '📋' },
    { label: 'CMS Management', path: '/cms', icon: '📝' }
  ];

  const isPriceEngineActive = pathname.startsWith('/price-engine');

  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#f8fafc] text-slate-800 antialiased font-sans flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto shrink-0">
          <div>
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
              <img src={logoConfig.adminLogo || '/logo.jpg'} alt="CASHIFIN" className="h-10 w-auto rounded-lg object-contain" style={{ height: '40px', width: 'auto' }} />
            </div>

            {/* Navigation Links */}
            <nav className="p-3 space-y-0.5">
              {sidebarItems.map((item, idx) => {
                const isActive = item.matches ? pathname.startsWith(item.matches) : pathname === item.path;
                return (
                  <div key={idx}>
                    <Link
                      href={item.path}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition ${
                        isActive 
                          ? 'bg-[#39b54a]/10 text-emerald-600' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm mr-2.5">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.label === 'Price Engine' && <span className="ml-auto text-[8px]">{isPriceEngineActive ? '▼' : '►'}</span>}
                    </Link>
                    {item.label === 'Price Engine' && isPriceEngineActive && (
                      <div className="pl-8 pr-3 py-1 space-y-1">
                        {subEngineItems.map((sub) => {
                          const isSubActive = pathname === sub.path;
                          return (
                            <Link
                              key={sub.path}
                              href={sub.path}
                              className={`w-full text-left py-1 text-[11px] font-semibold block transition ${
                                isSubActive ? 'text-[#39b54a] font-bold' : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Bottom Items Separator */}
              <div className="border-t border-slate-100 my-2 pt-2"></div>

              {bottomItems.map((item, idx) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={idx}
                    href={item.path}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      isActive 
                        ? 'bg-[#39b54a]/10 text-emerald-600' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm mr-2.5">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Support Panel */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
              <p className="text-xs font-bold text-emerald-800 flex items-center space-x-1.5">
                <span>💬</span>
                <span>Need Help?</span>
              </p>
              <p className="text-[10px] text-emerald-600 mt-1">Contact system support team for queries.</p>
            </div>
          </div>
        </aside>

        {/* Main Work Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center space-x-4 w-96">
              <span className="text-slate-400 text-sm">☰</span>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for orders, users, partners..."
                  className="w-full pl-9 pr-12 py-1.5 bg-slate-50 rounded-lg text-xs border border-slate-200 focus:outline-none focus:border-emerald-400 text-slate-700"
                />
                <span className="absolute left-3 top-2 text-slate-400 text-xs">🔍</span>
                <span className="absolute right-3 top-2 px-1 py-0.5 text-[9px] bg-slate-200 text-slate-500 rounded border border-slate-300 font-mono">Ctrl + K</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-1.5 text-slate-500 hover:bg-slate-50 rounded-lg transition relative">
                <span>🔔</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-white text-[8px] font-bold flex items-center justify-center">12</span>
              </button>
              <button className="p-1.5 text-slate-500 hover:bg-slate-50 rounded-lg transition relative">
                <span>💬</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#39b54a] rounded-full text-white text-[8px] font-bold flex items-center justify-center">5</span>
              </button>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 leading-none">Admin User</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Super Admin</p>
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic Page body */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Toast Alert Notification */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3.5 z-50 animate-bounce">
            <span className="text-xl">🔔</span>
            <div className="text-xs font-bold">
              <p className="text-emerald-400 uppercase tracking-wider text-[9px]">Notification Alert</p>
              <p className="mt-0.5">{toastMsg}</p>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
