"use client";
import React, { useState } from 'react';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [logoConfig, setLogoConfig] = useState<any>({ partnerLogo: '/logo.jpg' });

  React.useEffect(() => {
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
          const unread = (data || []).find((n: any) => n.target === 'partner' && !n.read);
          if (unread) {
            setToastMsg(unread.message);
            playChime();

            // Mark read
            fetch('/api/notifications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'update', item: { ...unread, read: true } })
            });

            setTimeout(() => setToastMsg(null), 5000);
          }
        }).catch(() => {});
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const sidebarLinks = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Orders', path: '/incoming-orders', icon: '📅' },
    { name: 'Products', path: '/active-jobs', icon: '📦' },
    { name: 'Payouts', path: '/wallet', icon: '💳' },
    { name: 'Earnings', path: '/earnings', icon: '💰' },
    { name: 'Customers', path: '/profile', icon: '👥' },
    { name: 'Reports', path: '/reports', icon: '📈' },
    { name: 'Marketing Tools', path: '/marketing', icon: '📣' },
    { name: 'Support', path: '/support', icon: '❓' },
    { name: 'Settings', path: '/settings', icon: '⚙️' }
  ];

  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 text-slate-800 antialiased font-sans flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 z-30">
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center space-x-2">
            <img src={logoConfig.partnerLogo || '/logo.jpg'} alt="Logo" className="h-10 w-auto rounded-lg object-contain" style={{ height: '40px', width: 'auto' }} />
            <div>
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-tight">Cashifin</h2>
              <p className="text-[9px] text-[#39b54a] font-bold uppercase tracking-wider -mt-0.5">Partner Portal</p>
            </div>
          </div>

          {/* Links navigation list */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {sidebarLinks.map(link => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                    active 
                      ? 'bg-[#39b54a]/10 text-[#39b54a]' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Refer Card bottom */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-emerald-50/50 border border-emerald-100/60 p-4 rounded-2xl text-center space-y-3">
              <span className="text-2xl block">🎁</span>
              <div>
                <h4 className="font-black text-xs text-slate-800">Refer & Earn More</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Refer new partners and earn extra commission.</p>
              </div>
              <button onClick={() => alert('Referral Link copied to clipboard!')} className="w-full py-2 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-xl text-[10px] transition cursor-pointer">
                Refer Now
              </button>
            </div>
          </div>
        </aside>

        {/* Right Main Content Block */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Top Bar Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-3xs shrink-0 z-20">
            {/* Search Input bar */}
            <div className="flex items-center bg-slate-50 border px-3.5 py-2 rounded-xl w-80 focus-within:bg-white focus-within:border-[#39b54a]/60 transition">
              <span className="text-slate-400 text-xs mr-2">🔍</span>
              <input 
                type="text" 
                placeholder="Search anything...          Ctrl + K" 
                className="bg-transparent border-none text-[11px] focus:outline-none w-full font-semibold"
              />
            </div>

            {/* Profile Dropdown & Notifications */}
            <div className="flex items-center space-x-5 text-xs">
              {/* Notification icon */}
              <button className="relative w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition">
                <span>🔔</span>
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full">3</span>
              </button>

              {/* Help button */}
              <button className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition">
                <span>❓</span>
              </button>

              {/* Partner identity */}
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-[#39b54a]/10 text-[#39b54a] font-black text-xs flex items-center justify-center">
                  MH
                </div>
                <div className="text-left hidden md:block">
                  <p className="font-extrabold text-[11px] text-slate-800">MobileHub Store</p>
                  <p className="text-[9px] text-slate-400 font-bold -mt-0.5">Partner ID: CFN12345</p>
                </div>
              </div>
            </div>
          </header>

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
