"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Premium SVG Icon Components
const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4 text-[#39b54a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-10 h-10 mx-auto text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="2" width="14" height="20" rx="3" strokeWidth="2" />
    <path d="M12 18h.01" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const LaptopIcon = () => (
  <svg className="w-10 h-10 mx-auto text-blue-650" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="12" rx="2" strokeWidth="2" />
    <path d="M1 20h22" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TVIcon = () => (
  <svg className="w-10 h-10 mx-auto text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="13" rx="2" strokeWidth="2" />
    <path d="M7 20h10" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 17v3" strokeWidth="2" />
  </svg>
);

const TabletIcon = () => (
  <svg className="w-10 h-10 mx-auto text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="16" height="18" rx="2" strokeWidth="2" />
    <path d="M12 18h.01" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const ConsoleIcon = () => (
  <svg className="w-10 h-10 mx-auto text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="12" rx="4" strokeWidth="2" />
    <circle cx="6" cy="12" r="1.5" fill="currentColor" />
    <path d="M16 10h2v4h-2z" strokeWidth="2" />
  </svg>
);

const WatchIcon = () => (
  <svg className="w-10 h-10 mx-auto text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="7" width="10" height="10" rx="3" strokeWidth="2" />
    <path d="M9 7V3h6v4M9 17v4h6v-4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SpeakerIcon = () => (
  <svg className="w-10 h-10 mx-auto text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="3" width="12" height="18" rx="3" strokeWidth="2" />
    <circle cx="12" cy="8" r="2.5" strokeWidth="2" />
    <circle cx="12" cy="15" r="3.5" strokeWidth="2" />
  </svg>
);

const categoriesList = [
  { name: 'Sell Phone', desc: 'Up to ₹1,00,000', component: <PhoneIcon /> },
  { name: 'Sell Laptop', desc: 'Up to ₹80,000', component: <LaptopIcon /> },
  { name: 'Sell TV', desc: 'Up to ₹60,000', component: <TVIcon /> },
  { name: 'Sell Tablet', desc: 'Up to ₹45,000', component: <TabletIcon /> },
  { name: 'Sell Gaming Consoles', desc: 'Up to ₹35,000', component: <ConsoleIcon /> },
  { name: 'Sell Smartwatch', desc: 'Up to ₹25,000', component: <WatchIcon /> },
  { name: 'Sell Smart Speakers', desc: 'Up to ₹15,050', component: <SpeakerIcon /> }
];

const refurbishedLaptops = [
  { id: 'MDL-1006', name: 'Apple MacBook Pro M3 16-inch', desc: 'Apple M3 Pro Chip, 16GB Unified RAM, 512GB SSD', price: '₹1,64,399', oldPrice: '₹2,65,999', discount: '37% OFF', rating: '5.0★' },
  { id: 'MDL-1007', name: 'Apple MacBook Pro M2 14-inch', desc: 'Apple M2 Pro Chip, 16GB Unified RAM, 512GB SSD', price: '₹1,43,471', oldPrice: '₹1,98,449', discount: '26% OFF', rating: '4.7★' },
  { id: 'MDL-1008', name: 'Apple MacBook Air M3 13-inch', desc: 'Apple M3 Chip, 8GB Unified RAM, 256GB SSD', price: '₹1,35,631', oldPrice: '₹1,92,999', discount: '28% OFF', rating: '5.0★' },
  { id: 'MDL-1009', name: 'Apple MacBook Air M2 15-inch', desc: 'Apple M2 Chip, 8GB Unified RAM, 256GB SSD', price: '₹1,10,151', oldPrice: '₹1,48,999', discount: '24% OFF', rating: '4.6★' }
];

const refurbishedPhones = [
  { id: 'MDL-2001', name: 'Apple iPhone 15 Pro Max', desc: 'A17 Pro Chip, 256GB Storage, Natural Titanium', price: '₹89,299', oldPrice: '₹1,59,900', discount: '44% OFF', rating: '4.9★', imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=300&auto=format&fit=crop' },
  { id: 'MDL-2002', name: 'OnePlus 12R', desc: 'Snapdragon 8 Gen 2, 16GB RAM / 256GB, Iron Gray', price: '₹32,499', oldPrice: '₹45,999', discount: '29% OFF', rating: '4.6★', imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&auto=format&fit=crop' },
  { id: 'MDL-2003', name: 'Google Pixel 8 Pro', desc: 'Google Tensor G3, 12GB RAM / 128GB, Bay Blue', price: '₹49,799', oldPrice: '₹1,09,999', discount: '54% OFF', rating: '4.7★', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop' },
  { id: 'MDL-2004', name: 'Samsung Galaxy S23 Ultra', desc: 'Snapdragon 8 Gen 2, 12GB RAM / 256GB, Phantom Black', price: '₹62,899', oldPrice: '₹1,24,999', discount: '49% OFF', rating: '4.8★', imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=300&auto=format&fit=crop' },
  { id: 'MDL-2005', name: 'Nothing Phone (2)', desc: 'Snapdragon 8+ Gen 1, 12GB RAM / 256GB, Dark Grey', price: '₹27,699', oldPrice: '₹49,999', discount: '44% OFF', rating: '4.5★', imageUrl: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=300&auto=format&fit=crop' }
];

export default function CashifinLandingPage() {
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

  // Add load hook
  useEffect(() => {
    const loc = localStorage.getItem('cashifin_location');
    if (loc) {
      setActiveLocation(loc);
    }
  }, []);

  const [user, setUser] = useState<{ name: string; loggedIn: boolean; phone?: string; email?: string; address?: string; }>({ name: '', loggedIn: false });
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  
  // Login input values
  const [loginPhone, setLoginPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Signup input values
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const cached = localStorage.getItem('cashifin_user');
    if (cached) {
      setUser(JSON.parse(cached));
    }
  }, []);

  const handleLogout = () => {
    const loggedOut = { name: '', loggedIn: false };
    localStorage.setItem('cashifin_user', JSON.stringify(loggedOut));
    setUser(loggedOut);
  };

  const handleSendOtp = () => {
    if (loginPhone.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async () => {
    setAuthError('');
    try {
      const res = await fetch('/api/users');
      const allUsers = await res.json();
      const match = allUsers.find((u: any) => u.phone === loginPhone || u.phone.replace(/\s+/g, '').includes(loginPhone));
      
      if (match) {
        const loggedIn = { name: match.name, phone: match.phone, email: match.email || 'user@cashifin.in', address: match.address || 'India', loggedIn: true };
        localStorage.setItem('cashifin_user', JSON.stringify(loggedIn));
        setUser(loggedIn);
        setShowLogin(false);
        setOtpSent(false);
        window.location.reload();
      } else {
        setShowLogin(false);
        setShowSignup(true);
      }
    } catch (e) {
      setAuthError('Authentication check failed. Please try again.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!signupName || !signupEmail) {
      setAuthError('Name and Email are required.');
      return;
    }

    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: signupName,
      email: signupEmail,
      phone: loginPhone,
      address: signupAddress,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      wallet: '₹0',
      status: 'Active'
    };

    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', item: newUser })
      });

      const loggedIn = { name: signupName, phone: loginPhone, email: signupEmail, address: signupAddress, loggedIn: true };
      localStorage.setItem('cashifin_user', JSON.stringify(loggedIn));
      setUser(loggedIn);
      setShowSignup(false);
      setOtpSent(false);
      window.location.reload();
    } catch (err) {
      setAuthError('Failed to register user database. Please try again.');
    }
  };

  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);
  const [brandSelectorOpen, setBrandSelectorOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Datasets from API
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [footerModalType, setFooterModalType] = useState<string | null>(null);
  const [showFooterModal, setShowFooterModal] = useState(false);
  const [showStoresModal, setShowStoresModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);

  const [showRefurbishedWizard, setShowRefurbishedWizard] = useState(false);
  const [refurbishedStep, setRefurbishedStep] = useState(1);
  const [refurbishedSelCategory, setRefurbishedSelCategory] = useState<string | null>(null);
  const [refurbishedSelBrand, setRefurbishedSelBrand] = useState<string | null>(null);
  const [refurbishedSelModel, setRefurbishedSelModel] = useState<any>(null);

  // Dynamic CMS States
  const [logoConfig, setLogoConfig] = useState<any>({ userLogo: '/logo.jpg' });
  const [bannersList, setBannersList] = useState<any[]>([]);
  const [storesList, setStoresList] = useState<any[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [whyChooseUsList, setWhyChooseUsList] = useState<any[]>([]);
  const [howItWorksList, setHowItWorksList] = useState<any[]>([]);
  const [footerConfig, setFooterConfig] = useState<any>({});

  // Refurbished Catalog Scope & Search
  const [refurbishedCatalogScope, setRefurbishedCatalogScope] = useState<string | null>(null);
  const [allDbModels, setAllDbModels] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (refurbishedCatalogScope) {
      fetch('/api/models')
        .then(res => res.json())
        .then(data => {
          setAllDbModels(data);
        })
        .catch(err => console.log('Error loading models:', err));
    }
  }, [refurbishedCatalogScope]);

  // Selections
  const [selCategory, setSelCategory] = useState<any>(null);
  const [selBrand, setSelBrand] = useState<any>(null);
  const [selModel, setSelModel] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [qId: string]: string }>({});
  const [modelSearch, setModelSearch] = useState('');

  // Checkout inputs
  const [custName, setCustName] = useState('adarsh Deep Sachan');
  const [custPhone, setCustPhone] = useState('+91 98765 43210');
  const [custAddress, setCustAddress] = useState('B-45, Sector 62, Noida, UP');
  const [custSlot, setCustSlot] = useState('Tomorrow, 10:00 AM - 01:00 PM');

  const banners = [
    { title: 'Sell old phone', subtitle: 'From your doorstep or at any of our 200 stores pan-India', btn: 'Sell Now', bg: 'bg-[#39b54a]' },
    { title: 'Upgrade to MacBook Pro', subtitle: 'Get up to ₹80,000 exchange credit instantly for old laptops', btn: 'Evaluate Laptop', bg: 'bg-gradient-to-r from-blue-500 to-indigo-650' },
    { title: 'Eco-Recycle Green Initiative', subtitle: 'Recycle dead batteries & electronics securely for extra reward cash', btn: 'Recycle Now', bg: 'bg-gradient-to-r from-emerald-600 to-teal-500' }
  ];

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d || []));
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(d || []));
    fetch('/api/models').then(r => r.json()).then(d => setModels(d || []));
    fetch('/api/questions').then(r => r.json()).then(d => setQuestions(d || []));
    fetch('/api/pricingRules').then(r => r.json()).then(d => setRules(d || []));
    fetch('/api/faqs').then(r => r.json()).then(d => setFaqs(d || []));
    fetch('/api/benefits').then(r => r.json()).then(d => setBenefits(d || []));
    fetch('/api/articles').then(r => r.json()).then(d => setArticles(d || []));

    // Fetch Dynamic CMS data
    fetch('/api/logos').then(r => r.json()).then(d => setLogoConfig(d?.[0] || { userLogo: '/logo.jpg' }));
    fetch('/api/banners').then(r => r.json()).then(d => setBannersList(d || []));
    fetch('/api/stores').then(r => r.json()).then(d => setStoresList(d || []));
    fetch('/api/testimonials').then(r => r.json()).then(d => setTestimonialsList(d || []));
    fetch('/api/whyChooseUs').then(r => r.json()).then(d => setWhyChooseUsList(d || []));
    fetch('/api/howItWorks').then(r => r.json()).then(d => setHowItWorksList(d || []));
    fetch('/api/footerContent').then(r => r.json()).then(d => setFooterConfig(d?.[0] || {}));

    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % (bannersList.length || banners.length || 3));
    }, 4500);

    setTimeout(() => {
      if (window.location.hash === '#faq-section') {
        const el = document.getElementById('faq-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);

    return () => clearInterval(interval);
  }, [bannersList.length]);

  // Web Audio chime sound player
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.error('Audio playback failed', e);
    }
  };

  const createNotification = async (target: string, message: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          item: {
            id: `NTF-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            target,
            message,
            read: false,
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          }
        })
      });
    } catch (err) {
      console.error('Failed to create notification', err);
    }
  };

  useEffect(() => {
    if (!user || !user.loggedIn || !user.phone) return;

    const interval = setInterval(() => {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            const unread = data.find((n: any) => n.target === user.phone && !n.read);
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
          }
        })
        .catch(err => console.log('Error checking customer notifications:', err));
    }, 4000);

    return () => clearInterval(interval);
  }, [user]);

  const startValuation = () => {
    setWizardStep(1);
    setSelCategory(null);
    setSelBrand(null);
    setSelModel(null);
    setAnswers({});
    setModelSearch('');
    setShowWizard(true);
  };

  const handleSelectCategory = (cat: any) => {
    setSelCategory(cat);
    setWizardStep(2);
  };

  const handleSelectBrand = (b: any) => {
    setSelBrand(b);
    setWizardStep(3);
  };

  const handleSelectModel = (m: any) => {
    setSelModel(m);
    setWizardStep(4);
  };

  const handleSelectAnswer = (qText: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [qText]: option
    }));
  };

  const calculateQuote = () => {
    if (!selModel) return 0;
    let base = selModel.rawBase || 35000;
    rules.forEach(rule => {
      const match = rule.condition.match(/IF "(.*)" is "(.*)"/);
      if (match) {
        const ruleQ = match[1];
        const ruleA = match[2];
        if (answers[ruleQ] === ruleA) {
          const pctMatch = rule.deduction.match(/Reduce (\d+)%/);
          if (pctMatch) {
            base -= (selModel.rawBase * parseInt(pctMatch[1])) / 100;
          }
          const flatMatch = rule.deduction.match(/Reduce ₹([\d,]+)/);
          if (flatMatch) {
            base -= parseInt(flatMatch[1].replace(/,/g, ''));
          }
        }
      }
    });
    return Math.max(selModel.rawMin || 3000, Math.round(base));
  };

  const currentQuote = calculateQuote();

  const handlePlaceOrder = async () => {
    const orderId = `ORD-${Date.now().toString().slice(-5)}`;
    const newOrder = {
      id: orderId,
      customer: custName,
      device: `${selModel.name} (${typeof selBrand === 'object' ? selBrand.name : selBrand})`,
      price: `₹${currentQuote.toLocaleString()}`,
      status: 'Pending',
      partner: 'Rohit Sharma',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', item: newOrder })
    });

    const newPickup = {
      orderId,
      slot: custSlot,
      address: custAddress,
      distance: '3.8 KM',
      partner: 'Rohit Sharma',
      status: 'Scheduled'
    };

    await fetch('/api/pickups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', item: newPickup })
    });

    // Trigger notifications for Admin, Partner, and Customer with sound
    await createNotification('admin', `New buyback order placed: ${orderId} for ${newOrder.device} at ${newOrder.price}`);
    await createNotification('partner', `New buyback pickup assigned: ${orderId} for ${newOrder.device}`);
    if (user && user.loggedIn && user.phone) {
      await createNotification(user.phone, `Your buyback order ${orderId} has been successfully registered!`);
    }

    setWizardStep(6);
  };

  const getCatName = () => typeof selCategory === 'object' ? selCategory.name : selCategory;
  const getBrandName = () => typeof selBrand === 'object' ? selBrand.name : selBrand;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* 1. Global Navigation Bar Header */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-12 lg:px-20 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-40 w-full">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.reload()}>
          <img src={logoConfig.userLogo || '/logo.jpg'} alt="CASHIFIN" className="h-24 w-auto rounded-lg object-contain py-1" style={{ height: '96px', width: 'auto' }} />
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-xl w-[450px] shadow-3xs hover:bg-white hover:border-[#39b54a]/60 transition">
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search for mobiles, accessories & More" 
            className="bg-transparent border-none text-xs ml-2.5 focus:outline-none w-full font-semibold"
          />
        </div>

        {/* Active Location Selection, Profile & Logout links */}
        <div className="flex items-center space-x-6 text-sm font-bold text-slate-650">
          <div onClick={() => setShowLocationModal(true)} className="cursor-pointer hover:text-[#39b54a] flex items-center space-x-1.5 transition">
            <LocationIcon />
            <span>{activeLocation} ▼</span>
          </div>

          <div className="flex items-center space-x-4">
            {user.loggedIn ? (
              <>
                <Link href="/profile" className="flex items-center space-x-1 hover:text-[#39b54a] transition">
                  <ProfileIcon />
                  <span className="truncate max-w-[120px]">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-red-500 hover:text-red-600 font-black cursor-pointer text-xs uppercase tracking-wider"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowLogin(true)} 
                className="px-4 py-2 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-lg text-xs transition shadow-3xs cursor-pointer"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Secondary Corporate Navigation Menu Bar */}
      <div className="bg-white border-b border-slate-100/60 px-4 md:px-12 lg:px-20 py-3 flex items-center space-x-8 text-sm font-bold text-slate-600 w-full overflow-x-auto whitespace-nowrap scrollbar-none">
        <div onClick={startValuation} className="cursor-pointer hover:text-[#39b54a] flex items-center space-x-1 transition">
          <span>Sell Phone</span>
        </div>
        <div onClick={() => { setSelCategory('Sell Laptop'); setBrandSelectorOpen(true); }} className="cursor-pointer hover:text-[#39b54a] flex items-center space-x-1 transition">
          <span>Sell Laptop</span>
        </div>
        <div onClick={() => { setSelCategory('Sell Tablet'); setBrandSelectorOpen(true); }} className="cursor-pointer hover:text-[#39b54a] flex items-center space-x-1 transition">
          <span>Sell Tablet</span>
        </div>
        <div onClick={() => { setSelCategory('Sell TV'); setBrandSelectorOpen(true); }} className="cursor-pointer hover:text-[#39b54a] flex items-center space-x-1 transition">
          <span>Sell TV</span>
        </div>
        <div onClick={() => { setSelCategory('Sell Smartwatch'); setBrandSelectorOpen(true); }} className="cursor-pointer hover:text-[#39b54a] flex items-center space-x-1 transition">
          <span>Sell Smartwatch</span>
        </div>
        <div onClick={() => { const el = document.getElementById('refurbished-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="cursor-pointer hover:text-[#39b54a] flex items-center space-x-1 transition">
          <span>Buy Refurbished Devices</span>
        </div>
        <div onClick={() => setShowStoresModal(true)} className="cursor-pointer hover:text-[#39b54a] flex items-center space-x-1 transition">
          <span>Cashifin Store</span>
        </div>
      </div>

      {/* 2.5. Cashifin Premium Hero Carousel Section */}
      <div className="bg-white border-b border-slate-100 relative overflow-hidden">
        {/* Subtle decorative grid lines background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

        {/* Carousel Slider Tracks */}
        {(bannersList.length > 0
          ? bannersList.map((b: any, index: number) => ({
              tag: 'Featured Banner',
              title: b.title,
              desc: b.subtitle,
              img: index % 3 === 0 
                ? "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop" 
                : index % 3 === 1 
                  ? "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400" 
                  : "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=400",
              action: startValuation,
              btnText: b.btn || 'Get Valuation Now',
              metricTag: 'BEST BUYBACK',
              metricVal: 'Doorstep Evaluations'
            }))
          : [
              {
                tag: 'Welcome to Cashifin Portal',
                title: <>Sell with Cashifin. <br /> <span className="text-[#39b54a]">Earn More.</span> Recycled Together.</>,
                desc: "Join India's trusted platform for selling old mobiles and electronic products. Start getting high valuations and instant doorstep cash payouts.",
                img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop",
                action: startValuation,
                btnText: 'Sell Your Device Now',
                metricTag: 'HIGHEST PAYOUT',
                metricVal: 'Up to 10% Extra Bonus'
              },
              {
                tag: 'Upgrade to MacBook',
                title: <>Trade In Laptop. <br /> Get Up to <span className="text-[#39b54a]">₹80,000</span> Credit.</>,
                desc: "Exchange your old laptop for the latest powerful Apple Silicon MacBooks. Free doorstep evaluations and military-grade secure data wipes.",
                img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop",
                action: () => { setSelCategory('Sell Laptop'); setBrandSelectorOpen(true); },
                btnText: 'Evaluate Laptop Now',
                metricTag: 'EXCHANGE BONUS',
                metricVal: 'Add ₹3,00,000 Extra Value'
              },
              {
                tag: 'Refurbished Device Deals',
                title: <>Premium Refurbished. <br /> Up to <span className="text-[#39b54a]">50% OFF</span> Store Price.</>,
                desc: "Own premium pre-owned flagship smartphones inspected via 34 quality checkpoints. Complete with a 6-month warranty and free delivery.",
                img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=400&auto=format&fit=crop",
                action: () => { const el = document.getElementById('refurbished-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); },
                btnText: 'Shop Refurbished Phones',
                metricTag: 'CASHIFIN ASSURED',
                metricVal: '6-Month Direct Warranty'
              }
            ]
        ).map((slide, idx) => {
          if (activeBannerSlide !== idx) return null;
          return (
            <div key={idx} className="px-4 md:px-12 lg:px-20 py-12 md:py-16 flex flex-col md:flex-row justify-between items-center gap-12 min-h-[420px] transition-all duration-700 animate-fadeIn">
              <div className="space-y-6 max-w-xl z-10">
                <span className="bg-[#39b54a]/10 text-[#39b54a] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  {slide.tag}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-[#0c213a] leading-tight">
                  {slide.title}
                </h1>
                <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                  {slide.desc}
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button 
                    onClick={slide.action} 
                    className="px-6 py-3.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-xl text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <span>{slide.btnText}</span>
                    <span>→</span>
                  </button>
                  <button 
                    onClick={() => { const el = document.getElementById('how-it-works'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                    className="px-5 py-3.5 border border-slate-200 hover:bg-slate-50 text-[#0c213a] font-bold rounded-xl text-sm transition cursor-pointer"
                  >
                    How it works
                  </button>
                </div>
                <div className="flex items-center space-x-6 text-xs text-slate-400 font-bold pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-1">
                    <span className="text-emerald-500">✔</span>
                    <span>Trusted by 10 Lakh+ Customers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-emerald-500">✔</span>
                    <span>100% Safe Data Wipes</span>
                  </div>
                </div>
              </div>

              {/* Hero image showcasing devices */}
              <div className="relative w-full md:w-[450px] h-[300px] z-10 flex items-center justify-center shrink-0">
                <div className="absolute w-[260px] h-[260px] rounded-full bg-[#39b54a]/5 -z-10 animate-pulse"></div>
                <img 
                  src={slide.img} 
                  alt={slide.tag} 
                  className="w-72 h-48 object-cover rounded-2xl shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition duration-300"
                />
                <div className="absolute top-10 right-4 bg-white px-3.5 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center space-x-2">
                  <span className="text-xl">📈</span>
                  <div>
                    <p className="text-xs font-bold text-slate-400">{slide.metricTag}</p>
                    <p className="text-sm font-black text-slate-800">{slide.metricVal}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Indicators */}
        <div className="flex justify-center space-x-2.5 pb-6">
          {[0, 1, 2].map(idx => (
            <button
              key={idx}
              onClick={() => setActiveBannerSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${activeBannerSlide === idx ? 'bg-[#39b54a] scale-110' : 'bg-slate-200 hover:bg-slate-300'}`}
            />
          ))}
        </div>
      </div>

      {/* 3 Quick Action Cards: Sell, Buy, Exchange */}
      <div className="px-4 md:px-12 lg:px-20 py-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Sell Card */}
          <div 
            onClick={() => {
              setSelCategory('Smartphones');
              setShowWizard(true);
              setWizardStep(1);
            }}
            className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50/50 p-6 rounded-2xl border border-emerald-100 hover:border-emerald-400 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 group flex items-center justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">Instant Payouts</span>
              <h3 className="text-lg font-black text-[#0c213a]">Sell Old Devices</h3>
              <p className="text-xs text-slate-500 font-medium">Get the best price quote instantly at your doorstep.</p>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-all mt-2">
                Sell Now <span className="ml-1">→</span>
              </span>
            </div>
            <div className="text-4xl bg-emerald-100/60 p-4 rounded-full group-hover:scale-110 transition duration-300">💰</div>
          </div>

          {/* Buy Card */}
          <div 
            onClick={() => {
              window.location.href = '/buy-refurbished';
            }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 rounded-2xl border border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 group flex items-center justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase">Verified Stock</span>
              <h3 className="text-lg font-black text-[#0c213a]">Buy Refurbished</h3>
              <p className="text-xs text-slate-500 font-medium">Shop certified devices with 6-month warranty.</p>
              <span className="inline-flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-all mt-2">
                Shop Now <span className="ml-1">→</span>
              </span>
            </div>
            <div className="text-4xl bg-blue-100/60 p-4 rounded-full group-hover:scale-110 transition duration-300">🛍️</div>
          </div>

          {/* Exchange Card */}
          <div 
            onClick={() => {
              setSelCategory('Smartphones');
              setShowWizard(true);
              setWizardStep(1);
            }}
            className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-2xl border border-amber-100 hover:border-amber-400 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 group flex items-center justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase">Upgrade Deal</span>
              <h3 className="text-lg font-black text-[#0c213a]">Exchange & Upgrade</h3>
              <p className="text-xs text-slate-500 font-medium">Trade-in your old phone for premium models.</p>
              <span className="inline-flex items-center text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-all mt-2">
                Upgrade Now <span className="ml-1">→</span>
              </span>
            </div>
            <div className="text-4xl bg-amber-100/60 p-4 rounded-full group-hover:scale-110 transition duration-300">🔄</div>
          </div>
        </div>
      </div>

      {/* 4. Our Services Grid (Circular Badges Row) */}
      <div className="px-4 md:px-12 lg:px-20 py-12 space-y-6 bg-slate-50">
        <h2 className="text-lg font-black text-[#0c213a] text-center">Sell Your Old Device Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-6 max-w-6xl mx-auto">
          {categoriesList.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelCategory(cat.name);
                setBrandSelectorOpen(true);
              }}
              className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-3xs hover:border-[#39b54a] hover:shadow-md cursor-pointer transition text-center flex flex-col items-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#39b54a]/10 flex items-center justify-center text-[#39b54a] transition group-hover:scale-110">
                {cat.component}
              </div>
              <div>
                <span className="font-extrabold text-sm text-[#0c213a] block">{cat.name}</span>
                <span className="text-xs text-slate-450 font-bold mt-0.5 block">{cat.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Cashifin Section (5 Column Cards Layout) */}
      <div className="px-4 md:px-12 lg:px-20 py-16 bg-white space-y-12">
        <h2 className="text-xl font-black text-[#0c213a] text-center">Why Choose Cashifin?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {(whyChooseUsList.length > 0 ? whyChooseUsList : [
            { tag: '💸 Payouts', title: 'Top Valuations', desc: 'Secure maximum appraised payout quotes based on our live diagnostics market benchmarks.' },
            { tag: '⚡ Speed', title: 'Instant Doorstep Cash', desc: 'Get paid instantly via UPI, bank transfer, or hand-to-hand wallet transfer on diagnostic signup verification.' },
            { tag: '📱 Scope', title: 'Wide Device Support', desc: 'We inspect and trade pre-owned phones, laptops, smartwatches, televisions, and gaming consoles.' },
            { tag: '🔒 Security', title: 'Military-Grade Wipes', desc: 'Complete reassurance: every collected hardware client item undergoes 3-pass disk sanitization standard.' },
            { tag: '🚚 Logistics', title: 'Free Home Pickups', desc: 'Enjoy zero evaluation costs or transportation fees. Our pickup agents visit your home for diagnostics.' }
          ]).map((item: any, idx: number) => (
            <div key={idx} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 hover:border-[#39b54a] hover:bg-white transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="bg-[#39b54a]/15 text-[#39b54a] font-black text-xs px-2.5 py-1 rounded-full uppercase">{item.tag}</span>
                <h4 className="font-extrabold text-sm text-[#0c213a] pt-1">{item.title}</h4>
                <p className="text-sm text-slate-450 font-semibold leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" className="px-4 md:px-12 lg:px-20 py-16 bg-slate-50 space-y-12">
        <h2 className="text-xl font-black text-[#0c213a] text-center">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center relative">
          {(howItWorksList.length > 0 ? howItWorksList : [
            { step: '1', title: 'Check Price', desc: 'Select your device model and state conditions to get appraised valuation.' },
            { step: '2', title: 'Schedule Pickup', desc: 'Choose a convenient date and doorstep evaluation time slot.' },
            { step: '3', title: 'Instant Pickup', desc: 'Our trained pickup agent verifies conditions at your doorstep.' },
            { step: '4', title: 'Instant Payment', desc: 'Get your full payout immediately in your preferred payment mode.' }
          ]).map((item: any, idx: number) => (
            <div key={idx} className="space-y-3 relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#39b54a] text-white flex items-center justify-center font-black text-sm shadow-md">
                {item.step}
              </div>
              <h4 className="font-extrabold text-sm text-[#0c213a] pt-1">{item.title}</h4>
              <p className="text-sm text-slate-400 font-semibold leading-relaxed max-w-[200px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buy Refurbished Phones Section */}
      <div id="refurbished-section" className="px-4 md:px-12 lg:px-20 py-16 bg-white border-t border-slate-100 space-y-8">
        <div className="flex justify-between items-baseline max-w-6xl mx-auto">
          <div>
            <h2 className="text-lg font-black text-[#0c213a]">Buy Refurbished Devices</h2>
            <p className="text-xs text-slate-450 font-bold mt-1 uppercase">34 Quality Checks Passed • 6-Month Warranty</p>
          </div>
          <span 
            onClick={() => setRefurbishedCatalogScope('Smartphones')} 
            className="text-sm font-black text-[#39b54a] hover:underline cursor-pointer"
          >
            View All
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {refurbishedPhones.map((phone: any) => (
            <div key={phone.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 hover:border-[#39b54a] transition flex flex-col justify-between relative overflow-hidden group">
              <span className="absolute top-3 left-3 bg-[#39b54a]/10 text-[#39b54a] text-xs font-black px-2 py-0.5 rounded-full z-10 shadow-3xs">
                CASHIFIN ASSURED
              </span>
              <div className="h-44 w-full flex items-center justify-center mt-3 overflow-hidden rounded-xl bg-white border">
                <img 
                  src={phone.imageUrl} 
                  alt={phone.name} 
                  className="h-36 w-auto object-contain transform group-hover:scale-105 transition" 
                />
              </div>
              <div className="mt-3.5 space-y-1">
                <h4 className="font-extrabold text-sm text-[#0c213a] truncate">{phone.name}</h4>
                <p className="text-xs text-slate-400 font-semibold truncate">{phone.desc}</p>
                <div className="flex items-center space-x-1.5 pt-1">
                  <span className="text-[#39b54a] font-bold text-xs uppercase bg-[#39b54a]/10 px-1 py-0.2 rounded">Pay Day Sale</span>
                  <span className="text-xs font-bold text-slate-400">⭐ {phone.rating}</span>
                </div>
              </div>
              <div className="mt-3.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-slate-800">{phone.price}</span>
                  <span className="text-xs text-slate-405 line-through ml-1.5">{phone.oldPrice}</span>
                </div>
                <Link 
                  href={`/refurbished/${phone.id}`}
                  className="px-2.5 py-1.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-bold rounded-lg text-xs shadow-3xs transition"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buy Refurbished Laptops Section */}
      <div className="px-4 md:px-12 lg:px-20 py-16 bg-slate-50 border-t border-slate-100 space-y-8">
        <div className="flex justify-between items-baseline max-w-6xl mx-auto">
          <div>
            <h2 className="text-lg font-black text-[#0c213a]">Refurbished Laptops</h2>
            <p className="text-xs text-slate-450 font-bold mt-1 uppercase">100% Inspected • Free Accessories Included</p>
          </div>
          <span 
            onClick={() => setRefurbishedCatalogScope('Laptops')} 
            className="text-sm font-black text-[#39b54a] hover:underline cursor-pointer"
          >
            View All
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {refurbishedLaptops.map((lap, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-[#39b54a] transition flex flex-col justify-between relative overflow-hidden group">
              <span className="absolute top-3 left-3 bg-[#39b54a]/10 text-[#39b54a] text-xs font-black px-2 py-0.5 rounded-full z-10">
                LAPTOP SALE
              </span>
              <div className="h-36 w-full flex items-center justify-center mt-3 overflow-hidden rounded-xl bg-slate-50 border">
                <img 
                  src={idx === 0 
                    ? "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300&auto=format&fit=crop"
                    : "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=300&auto=format&fit=crop"
                  } 
                  alt={lap.name} 
                  className="h-28 w-auto object-contain transform group-hover:scale-105 transition" 
                />
              </div>
              <div className="mt-3.5 space-y-1">
                <h4 className="font-extrabold text-sm text-[#0c213a] truncate">{lap.name}</h4>
                <p className="text-xs text-slate-400 font-semibold truncate">{lap.desc}</p>
                <div className="flex items-center space-x-1.5 pt-0.5">
                  <span className="text-[#39b54a] font-bold text-xs uppercase bg-[#39b54a]/10 px-1 py-0.2 rounded">Laptop Sale</span>
                  <span className="text-xs font-bold text-slate-400">⭐ {lap.rating}</span>
                </div>
              </div>
              <div className="mt-3.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-slate-800">{lap.price}</span>
                  <span className="text-xs text-slate-405 line-through ml-1.5">{lap.oldPrice}</span>
                </div>
                <Link 
                  href={`/refurbished/${lap.id}`}
                  className="px-2.5 py-1.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-bold rounded-lg text-xs shadow-3xs transition"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Articles / Tech News Section */}
      <div className="px-4 md:px-12 lg:px-20 py-16 bg-white space-y-12">
        <h2 className="text-xl font-black text-[#0c213a] text-center">Tech Insider & Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {articles.map((art, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between group">
              <div>
                <div className="h-44 overflow-hidden border-b">
                  <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300" />
                </div>
                <div className="p-5 space-y-3">
                  <span className="text-xs text-[#39b54a] font-black uppercase tracking-wider">{art.date}</span>
                  <h4 className="font-extrabold text-sm text-[#0c213a] leading-snug">{art.title}</h4>
                  <p className="text-xs text-slate-450 font-semibold line-clamp-3 leading-relaxed">{art.desc}</p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button 
                  onClick={() => { setSelectedArticle(art); setShowArticleModal(true); }}
                  className="text-xs font-black text-[#39b54a] hover:underline cursor-pointer"
                >
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Review Panel */}
      <div className="px-4 md:px-12 lg:px-20 py-16 bg-slate-50 space-y-12">
        <h2 className="text-xl font-black text-[#0c213a] text-center">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(testimonialsList.length > 0 ? testimonialsList : [
            { name: 'Mohit Sharma', city: 'Noida', quote: 'Cashifin gave me ₹38,000 for my old iPhone 13 Pro Max. Rohit Sharma visited, tested the device in 10 minutes, and paid instantly via UPI. Absolute bliss!', rating: '⭐⭐⭐⭐⭐' },
            { name: 'Priya Patel', city: 'Gurgaon', quote: 'Extremely professional laptop valuation. Traded my old Dell Inspiron laptop and got ₹24,000 credit directly. Data wipe certificate was shared via email within 24 hours!', rating: '⭐⭐⭐⭐⭐' },
            { name: 'Aditya Sen', city: 'Delhi', quote: 'Fabulous refurbished phone buying experience! Got a certified pre-owned Pixel 8 Pro at 50% discount. Works like absolute brand new. Strongly recommend Cashifin.', rating: '⭐⭐⭐⭐⭐' }
          ]).map((item: any, idx: number) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs flex flex-col justify-between">
              <p className="text-sm text-slate-500 font-semibold italic leading-relaxed">"{item.quote}"</p>
              <div className="flex justify-between items-center pt-5 border-t border-slate-100 mt-4">
                <div>
                  <h5 className="font-black text-xs text-[#0c213a]">{item.name}</h5>
                  <p className="text-[10px] text-slate-400 font-semibold">📍 {item.city}</p>
                </div>
                <span className="text-xs">{item.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div id="faq-section" className="px-4 md:px-12 lg:px-20 py-16 bg-white space-y-12">
        <h2 className="text-xl font-black text-[#0c213a] text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-3.5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-extrabold text-sm text-[#0c213a] flex justify-between items-center focus:outline-none"
              >
                <span>{faq.q}</span>
                <span>{activeFaq === idx ? '▲' : '▼'}</span>
              </button>
              {activeFaq === idx && (
                <div className="p-4 pt-0 border-t text-sm text-slate-500 leading-relaxed font-semibold">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 8. Corporate White Footer Section */}
      <div className="bg-white border-t border-slate-200 mt-auto w-full relative z-10">
        <div className="w-full px-4 md:px-12 lg:px-20 py-16 grid grid-cols-1 md:grid-cols-5 gap-12 text-sm text-slate-550">
          <div className="space-y-4 pr-6">
            <img src={logoConfig.userLogo || '/logo.jpg'} alt="CASHIFIN" className="h-24 w-auto rounded-lg object-contain" />
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              {footerConfig.aboutUs || "Cashifin is India's leading recommerce platform for selling old smartphones, laptops, tablets, smartwatches, and TVs. Get instant doorstep payouts and guaranteed secure data wipe."}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-500">
              <li onClick={startValuation} className="hover:text-[#39b54a] cursor-pointer transition">Sell Phone</li>
              <li onClick={() => { setSelCategory('Sell Laptop'); setBrandSelectorOpen(true); }} className="hover:text-[#39b54a] cursor-pointer transition">Sell Laptop</li>
              <li onClick={() => { setSelCategory('Sell Smartwatch'); setBrandSelectorOpen(true); }} className="hover:text-[#39b54a] cursor-pointer transition">Sell Smartwatch</li>
              <li onClick={() => { const el = document.getElementById('refurbished-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#39b54a] cursor-pointer transition">Buy Refurbished Devices</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-500">
              <li onClick={() => { setFooterModalType('About Us'); setShowFooterModal(true); }} className="hover:text-[#39b54a] cursor-pointer transition">About Us</li>
              <li onClick={() => { setFooterModalType('Careers'); setShowFooterModal(true); }} className="hover:text-[#39b54a] cursor-pointer transition">Careers</li>
              <li onClick={() => { setFooterModalType('Press Releases'); setShowFooterModal(true); }} className="hover:text-[#39b54a] cursor-pointer transition">Press Releases</li>
              <li onClick={() => { setFooterModalType('Contact Us'); setShowFooterModal(true); }} className="hover:text-[#39b54a] cursor-pointer transition">Contact Us</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Help & Support</h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-500">
              <li onClick={() => { const el = document.getElementById('faq-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#39b54a] cursor-pointer transition">FAQs</li>
              <li onClick={() => { setFooterModalType('Seller Agreement'); setShowFooterModal(true); }} className="hover:text-[#39b54a] cursor-pointer transition">Seller Agreement</li>
              <li onClick={() => { setFooterModalType('Privacy Policy'); setShowFooterModal(true); }} className="hover:text-[#39b54a] cursor-pointer transition">Privacy Policy</li>
              <li onClick={() => { setFooterModalType('Data Wipe Certificate'); setShowFooterModal(true); }} className="hover:text-[#39b54a] cursor-pointer transition">Data Wipe Certificate</li>
            </ul>
          </div>

          {/* Social Media Right Align Column */}
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Social Channels</h4>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">Follow our green recommence activities and catch the latest updates:</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map(sm => (
                <span key={sm} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold px-3 py-2 rounded-xl text-xs text-center cursor-pointer select-none transition block">
                  {sm}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-100 w-full relative z-10">
        <div className="w-full px-4 md:px-12 lg:px-20 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-semibold">
          <p>© 2026 Cashifin Recommerce Private Limited. All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 bg-slate-50 border px-4 py-2 rounded-xl flex items-center space-x-2.5">
            <span className="text-lg">📞</span>
            <div>
              <p className="text-[10px] text-slate-400 font-bold">NEED HELP? CONTACT SUPPORT</p>
              <p className="text-xs font-black text-slate-800">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Finder Modal */}
      {showStoresModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[600px] shadow-2xl space-y-4 text-slate-800 border relative overflow-hidden max-h-[85vh] flex flex-col text-xs">
            <button 
              onClick={() => setShowStoresModal(false)}
              className="absolute top-4 right-4 text-xs font-bold bg-slate-100 hover:bg-slate-200 w-7 h-7 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            <div className="border-b pb-3 shrink-0">
              <h3 className="font-black text-sm text-[#39b54a]">Cashifin Exclusive Experience Stores</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-bold">Visit nearest offline outlet for instant diagnostics check & payout disbursals</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {(storesList.length > 0 ? storesList : [
                {
                  id: "STR-001",
                  name: "Cashifin Exclusive Store — Gurgaon Galleria",
                  address: "Shop No. SF-24, 2nd Floor, Galleria Market, DLF Phase 4, Gurgaon, Haryana 122002",
                  phone: "+91 98765 00101",
                  timings: "11:00 AM - 09:00 PM",
                  tags: ["Instant Payouts", "Refurbished Stock", "Accessories Shop"],
                  imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=200&auto=format&fit=crop",
                  status: "Open Now"
                },
                {
                  id: "STR-002",
                  name: "Cashifin Exclusive Store — Noida Sector 18",
                  address: "Plot No. P-12, Sector 18, Opp. Wave Cinema Mall, Noida, Uttar Pradesh 201301",
                  phone: "+91 98765 00102",
                  timings: "11:00 AM - 09:30 PM",
                  tags: ["Instant Payouts", "Free Diagnostics", "Exchange Bonus"],
                  imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=200&auto=format&fit=crop",
                  status: "Open Now"
                }
              ]).map((st: any) => (
                <div key={st.id} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 p-3 bg-slate-50 rounded-xl border">
                  <img 
                    src={st.imageUrl} 
                    alt={st.name} 
                    className="w-full md:w-32 h-24 object-cover rounded-lg border" 
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-slate-850">{st.name}</h4>
                      <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.2 rounded font-bold text-xs uppercase">{st.status}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold">{st.address}</p>
                    <p className="text-xs text-slate-455 font-bold">Phone: {st.phone} | Timings: {st.timings}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {(st.tags || []).map((t: string, idx: number) => (
                        <span key={idx} className="bg-slate-200/60 px-1.5 py-0.2 rounded text-xs text-slate-500 font-bold">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowStoresModal(false)} className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg">Close Stores</button>
          </div>
        </div>
      )}

      {/* Interactive Scoped Refurbished Catalog Showcase Modal */}
      {refurbishedCatalogScope && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[800px] shadow-2xl space-y-4 text-slate-800 border relative overflow-hidden max-h-[85vh] flex flex-col text-xs">
            <button 
              onClick={() => { setRefurbishedCatalogScope(null); setSearchQuery(''); }}
              className="absolute top-4 right-4 text-xs font-bold bg-slate-100 hover:bg-slate-200 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <div className="border-b pb-3 shrink-0">
              <h3 className="font-black text-sm text-[#39b54a]">Cashifin Refurbished {refurbishedCatalogScope} Catalog</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-bold">
                Showing all active brands and certified pre-owned models in our database. Click any model to buy.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="shrink-0 relative">
              <input 
                type="text" 
                placeholder={`Search ${refurbishedCatalogScope.toLowerCase()} models...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:bg-white transition"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-6">
              {allDbModels.length === 0 ? (
                <div className="py-20 text-center text-slate-400 font-bold">Loading active catalog...</div>
              ) : (() => {
                // Filter by scope and search query
                const filtered = allDbModels.filter(m => {
                  const matchesScope = m.category.toLowerCase().includes(refurbishedCatalogScope.toLowerCase().slice(0, -1));
                  const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.brand.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesScope && matchesSearch;
                });

                if (filtered.length === 0) {
                  return <div className="py-20 text-center text-slate-450 font-bold">No models matching search criteria.</div>;
                }

                // Group by Brand
                const grouped: { [key: string]: any[] } = {};
                filtered.forEach(m => {
                  if (!grouped[m.brand]) grouped[m.brand] = [];
                  grouped[m.brand].push(m);
                });

                return Object.keys(grouped).map(brand => (
                  <div key={brand} className="space-y-3">
                    <h4 className="font-black text-slate-800 border-b pb-1 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                      <span className="w-1.5 h-3 bg-[#39b54a] rounded-sm"></span>
                      <span>{brand} {refurbishedCatalogScope}</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {grouped[brand].map((model: any) => {
                        const priceNum = model.rawBase || parseFloat(model.basePrice.replace(/[^0-9]/g, '')) || 15000;
                        const oldPrice = Math.round(priceNum * 1.45);
                        
                        // Pick dynamic gallery thumbnails
                        let imgUrl = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=150&auto=format&fit=crop";
                        if (refurbishedCatalogScope === 'Laptops') {
                          imgUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=150&auto=format&fit=crop";
                        }

                        return (
                          <div key={model.id} className="flex items-center space-x-3.5 p-3 bg-slate-50 rounded-2xl border border-slate-150 shadow-3xs hover:border-[#39b54a] transition">
                            <img src={imgUrl} alt={model.name} className="w-12 h-12 object-contain bg-white rounded-xl border p-1" />
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <p className="font-extrabold text-[10px] text-slate-800 truncate">{model.name}</p>
                              <p className="text-[8px] text-slate-400 font-semibold truncate">Grade-A pre-owned inspected device</p>
                              <div className="flex items-center space-x-1.5">
                                <span className="text-slate-800 font-black">{model.basePrice}</span>
                                <span className="text-[8px] text-slate-400 line-through">₹{oldPrice.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <Link 
                                href={`/refurbished/${model.id}`}
                                onClick={() => { setRefurbishedCatalogScope(null); setSearchQuery(''); }}
                                className="px-3 py-1.5 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-lg text-xs shadow-3xs transition inline-block cursor-pointer"
                              >
                                Buy Now
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>

            <button 
              onClick={() => { setRefurbishedCatalogScope(null); setSearchQuery(''); }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer"
            >
              Close Catalog
            </button>
          </div>
        </div>
      )}

      {/* Article Reader Modal */}
      {showArticleModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[550px] shadow-2xl space-y-5 text-slate-800 border relative overflow-hidden max-h-[90vh] flex flex-col text-xs">
            <button 
              onClick={() => { setSelectedArticle(null); setShowArticleModal(false); }}
              className="absolute top-4 right-4 text-xs font-bold bg-slate-100 hover:bg-slate-200 w-7 h-7 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="h-48 rounded-xl overflow-hidden border">
                <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-[#39b54a] font-black uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded">Tech Insider News</span>
                <h3 className="font-black text-sm text-slate-800 leading-snug">{selectedArticle.title}</h3>
                <p className="text-xs text-slate-405 font-bold">Published on {selectedArticle.date}</p>
              </div>
              <div className="text-xs text-slate-500 leading-relaxed font-semibold space-y-3.5 border-t pt-4">
                <p>{selectedArticle.desc}</p>
                <p>To secure the maximum value for your trade-ins, ensure to backup details and perform clean factory resets before logistics evaluation visits!</p>
              </div>
            </div>
            <button onClick={() => { setSelectedArticle(null); setShowArticleModal(false); }} className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg">Done Reading</button>
          </div>
        </div>
      )}

      {/* Appraisal Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[520px] shadow-2xl space-y-5 text-slate-800 border relative overflow-hidden max-h-[90vh] flex flex-col text-xs">
            <div className="flex justify-between items-center border-b pb-3.5 shrink-0">
              <div>
                <h3 className="font-black text-sm text-slate-855">Device Appraisal Engine</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-bold">Determine the instant buyback valuation</p>
              </div>
              <button onClick={() => setShowWizard(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-450 uppercase">Step 1 of 5: Select Category</span>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat: any) => (
                      <div 
                        key={cat.id} 
                        onClick={() => handleSelectCategory(cat)}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-150 cursor-pointer hover:border-[#39b54a] hover:bg-teal-50/10 text-center transition font-bold"
                      >
                        <span className="text-xl block mb-1">📱</span>
                        <span>{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <button className="text-slate-400 font-bold text-xs mb-2" onClick={() => setWizardStep(1)}>← Back</button>
                  <span className="text-xs font-bold text-slate-450 uppercase">Step 2 of 5: Select Manufacturer</span>
                  <div className="grid grid-cols-3 gap-3">
                    {brands.map((b: any) => (
                      <div 
                        key={b.id} 
                        onClick={() => handleSelectBrand(b)}
                        className="p-3 bg-slate-50 rounded-xl border cursor-pointer hover:border-[#39b54a] text-center transition font-bold"
                      >
                        <span>{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <button className="text-slate-400 font-bold text-xs mb-2" onClick={() => setWizardStep(2)}>← Back</button>
                  <span className="text-xs font-bold text-slate-450 uppercase">Step 3 of 5: Select Model</span>
                  <input
                    type="text"
                    value={modelSearch}
                    onChange={e => setModelSearch(e.target.value)}
                    placeholder="Search model name..."
                    className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:bg-white"
                  />
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                    {models
                      .filter(m => m.brand.toLowerCase() === getBrandName()?.toLowerCase())
                      .filter(m => m.name.toLowerCase().includes(modelSearch.toLowerCase()))
                      .map((m: any) => (
                        <div 
                          key={m.id} 
                          onClick={() => handleSelectModel(m)}
                          className="p-3 bg-slate-50 rounded-xl border cursor-pointer hover:border-[#39b54a] text-left transition font-bold flex justify-between items-center"
                        >
                          <span>{m.name}</span>
                          <span className="text-teal-600 font-black">{m.basePrice}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4">
                  <button className="text-slate-400 font-bold text-xs mb-2" onClick={() => setWizardStep(3)}>← Back</button>
                  <span className="text-xs font-bold text-slate-450 uppercase">Step 4 of 5: Diagnostics Survey</span>
                  <div className="space-y-3">
                    {questions
                      .filter(q => q.categories?.includes(getCatName()) && q.brands?.includes(getBrandName()))
                      .map((q: any) => (
                        <div key={q.id} className="p-3.5 bg-slate-50 rounded-xl border space-y-2">
                          <p className="font-bold text-slate-700">{q.text}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {['No Faults / Perfect', 'Faulty / Damaged'].map(opt => (
                              <button
                                key={opt}
                                onClick={() => handleSelectAnswer(q.text, opt === 'Faulty / Damaged' ? 'Cracked' : 'Perfect')}
                                className={`py-2 text-xs font-bold rounded-lg border transition ${
                                  answers[q.text] === (opt === 'Faulty / Damaged' ? 'Cracked' : 'Perfect')
                                    ? 'border-[#39b54a] bg-teal-50/10 text-[#39b54a]'
                                    : 'border-slate-200 bg-white'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between mt-4">
                    <div>
                      <span className="text-xs text-slate-400 font-bold">Estimated Quote</span>
                      <p className="text-lg font-black text-emerald-400">₹{currentQuote.toLocaleString()}</p>
                    </div>
                    <button onClick={() => setWizardStep(5)} className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold">Continue →</button>
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-4">
                  <button className="text-slate-400 font-bold text-xs mb-2" onClick={() => setWizardStep(4)}>← Back</button>
                  <span className="text-xs font-bold text-slate-450 uppercase">Step 5 of 5: Booking Details</span>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border">
                    <div className="flex flex-col">
                      <label className="font-bold text-slate-550 mb-1">Your Full Name</label>
                      <input type="text" value={custName} onChange={e => setCustName(e.target.value)} className="p-2.5 border rounded bg-white" />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold text-slate-550 mb-1">Phone Number</label>
                      <input type="text" value={custPhone} onChange={e => setCustPhone(e.target.value)} className="p-2.5 border rounded bg-white" />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold text-slate-550 mb-1">Pickup Address</label>
                      <input type="text" value={custAddress} onChange={e => setCustAddress(e.target.value)} className="p-2.5 border rounded bg-white" />
                    </div>
                  </div>
                  <button onClick={handlePlaceOrder} className="w-full py-3 bg-[#39b54a] text-white font-bold rounded-xl">Book Doorstep Pickup</button>
                </div>
              )}

              {wizardStep === 6 && (
                <div className="text-center py-6 space-y-4">
                  <span className="text-5xl block">🎉</span>
                  <h3 className="text-lg font-black text-slate-805">Appraisal Order Placed!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Pickup registered at <strong className="text-[#39b54a]">₹{currentQuote.toLocaleString()}</strong>. रोहित शर्मा will inspect and pay out instantly!
                  </p>
                  <button onClick={() => setShowWizard(false)} className="px-5 py-2 bg-slate-900 text-white rounded-lg">Finish</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[360px] shadow-2xl space-y-4 text-slate-800 border relative text-xs">
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 font-bold">✕</button>
            <h3 className="font-black text-sm text-[#39b54a] text-center">Login to Cashifin</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Enter Phone Number" value={loginPhone} onChange={e => setLoginPhone(e.target.value)} className="w-full p-2.5 border rounded-lg bg-slate-50" />
              {otpSent && <input type="text" placeholder="Enter 4-Digit OTP" value={otpCode} onChange={e => setOtpCode(e.target.value)} className="w-full p-2.5 border rounded-lg bg-slate-50" />}
              {otpSent ? (
                <button onClick={handleVerifyOtp} className="w-full py-2.5 bg-[#39b54a] text-white font-bold rounded-lg">Verify & Login</button>
              ) : (
                <button onClick={handleSendOtp} className="w-full py-2.5 bg-[#39b54a] text-white font-bold rounded-lg">Get OTP Code</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[380px] shadow-2xl space-y-4 text-slate-800 border relative text-xs">
            <button onClick={() => setShowSignup(false)} className="absolute top-4 right-4 font-bold">✕</button>
            <h3 className="font-black text-sm text-[#39b54a] text-center">Create Cashifin Account</h3>
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <input type="text" placeholder="Full Name" value={signupName} onChange={e => setSignupName(e.target.value)} className="w-full p-2.5 border rounded-lg" required />
              <input type="email" placeholder="Email Address" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} className="w-full p-2.5 border rounded-lg" required />
              <input type="text" placeholder="Address" value={signupAddress} onChange={e => setSignupAddress(e.target.value)} className="w-full p-2.5 border rounded-lg" />
              <button type="submit" className="w-full py-2.5 bg-[#39b54a] text-white font-bold rounded-lg">Sign Up</button>
            </form>
          </div>
        </div>
      )}

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[380px] shadow-2xl space-y-4 text-slate-800 border relative text-xs">
            <button onClick={() => setShowLocationModal(false)} className="absolute top-4 right-4 font-bold">✕</button>
            <h3 className="font-black text-sm text-center">Select Location</h3>
            <button onClick={handleDetectLocation} className="w-full py-2.5 bg-[#39b54a]/10 border border-[#39b54a] text-[#39b54a] font-bold rounded-lg">
              {detectingLoc ? 'Detecting Location...' : '📍 Use Current Location'}
            </button>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['Gurgaon', 'Delhi', 'Noida', 'Bangalore', 'Mumbai', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune'].map(city => (
                <button key={city} onClick={() => handleSelectCity(city)} className="p-2 border rounded-lg hover:border-[#39b54a]">{city}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Corporate Footer Modal */}
      {showFooterModal && footerModalType && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[450px] shadow-2xl space-y-4 text-slate-800 border relative overflow-hidden max-h-[80vh] flex flex-col text-xs">
            <button onClick={() => { setFooterModalType(null); setShowFooterModal(false); }} className="absolute top-4 right-4 font-bold">✕</button>
            <h3 className="font-black text-sm text-[#39b54a] border-b pb-2">{footerModalType}</h3>
            <div className="flex-1 overflow-y-auto space-y-3 text-slate-500 leading-relaxed font-semibold">
              {footerModalType === 'About Us' && <p>{footerConfig.aboutUs || "Cashifin is India's premier tech recommerce network built for digital life cycle circularity. Established in 2015, we disburse instant payouts transparently."}</p>}
              {footerModalType === 'Careers' && <p>{footerConfig.careers || "We are actively looking for logistics diagnostic checkers, React developer architects and pricing analysts. Contact careers@cashifin.com."}</p>}
              {footerModalType === 'Press Releases' && <p>{footerConfig.pressReleases || "Cashifin closed Series B funding of $12M in 2026 to expand physical experiential outlets globally."}</p>}
              {footerModalType === 'Contact Us' && <p>{footerConfig.contactUs || "Operations center support hotline: 1800-123-4567. Address: Sector 62, Noida, UP."}</p>}
              {footerModalType === 'Seller Agreement' && <p>{footerConfig.sellerAgreement || "By scheduling evaluations you legally certify device ownership and details criteria matching billing records."}</p>}
              {footerModalType === 'Privacy Policy' && <p>{footerConfig.privacyPolicy || "We encrypt all personal data variables securely and process ISO-compliant diagnostic formatting on logistics collections."}</p>}
              {footerModalType === 'Data Wipe Certificate' && <p>{footerConfig.dataWipe || "Every transaction receives digital sanitization documentation matching NIST SP 800-88 standards."}</p>}
            </div>
            <button onClick={() => { setFooterModalType(null); setShowFooterModal(false); }} className="w-full py-2 bg-slate-900 text-white font-bold rounded-lg mt-2">Close</button>
          </div>
        </div>
      )}

      {/* Brand Selector Modal */}
      {brandSelectorOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[420px] shadow-2xl space-y-4 text-slate-800 border relative text-xs">
            <button onClick={() => setBrandSelectorOpen(false)} className="absolute top-4 right-4 font-bold">✕</button>
            <h3 className="font-black text-sm border-b pb-2">Select Brand</h3>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pt-2">
              {brands
                .filter((b: any) => {
                  if (!selCategory) return true;
                  const cat = selCategory.replace('Sell ', '');
                  const cleanCat = cat === 'Phone' ? 'Smartphones' : cat === 'Laptop' ? 'Laptops' : cat === 'TV' ? 'TVs' : cat === 'Tablet' ? 'Tablets' : cat === 'Gaming Consoles' ? 'Gaming Consoles' : cat === 'Smartwatch' ? 'Smartwatches' : cat;
                  return b.categories?.includes(cleanCat);
                })
                .map((b: any) => (
                  <div 
                    key={b.id} 
                    onClick={() => {
                      const cat = (selCategory || 'Sell Phone').replace('Sell ', '');
                      const cleanCat = cat === 'Phone' ? 'Smartphones' : cat === 'Laptop' ? 'Laptops' : cat === 'TV' ? 'TVs' : cat === 'Tablet' ? 'Tablets' : cat === 'Gaming Consoles' ? 'Gaming Consoles' : cat === 'Smartwatch' ? 'Smartwatches' : cat;
                      window.location.href = `/sell/${encodeURIComponent(cleanCat.toLowerCase())}/${encodeURIComponent(b.name)}`;
                    }}
                    className="p-3 bg-slate-50 rounded-xl border cursor-pointer hover:border-[#39b54a] hover:bg-teal-50/10 text-center font-bold"
                  >
                    <span>{b.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Refurbished Buying Wizard Modal */}
      {showRefurbishedWizard && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-[520px] max-w-full shadow-2xl overflow-hidden flex flex-col text-slate-800 text-xs">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4 bg-slate-50">
              <div>
                <h3 className="font-black text-sm text-[#0c213a]">Buy Refurbished Devices</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">34 Quality Checks Passed • 6-Month Warranty</p>
              </div>
              <button 
                onClick={() => setShowRefurbishedWizard(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Wizard Steps body */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Step 1: Select Category */}
              {refurbishedStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-[#0c213a]">Choose Device Category</h4>
                  <div className="grid grid-cols-2 gap-3.5">
                    {categories.map((cat: any) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setRefurbishedSelCategory(cat.name);
                          setRefurbishedStep(2);
                        }}
                        className="p-4 bg-slate-50 hover:bg-teal-50/10 border border-slate-200 hover:border-[#39b54a] rounded-2xl cursor-pointer transition text-center space-y-2 group"
                      >
                        <span className="text-3xl block transition group-hover:scale-110">
                          {cat.name === 'Smartphones' ? '📱' : cat.name === 'Laptops' ? '💻' : cat.name === 'Tablets' ? '📁' : cat.name === 'Smartwatches' ? '⌚' : cat.name === 'TVs' ? '📺' : cat.name === 'Gaming Consoles' ? '🎮' : '🔌'}
                        </span>
                        <span className="font-black text-slate-850 block">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Select Brand */}
              {refurbishedStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-[#0c213a]">Choose Brand for {refurbishedSelCategory}</h4>
                    <button onClick={() => setRefurbishedStep(1)} className="text-[#39b54a] font-bold">← Back</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {brands
                      .filter(b => b.categories && b.categories.includes(refurbishedSelCategory))
                      .map((brand: any) => (
                        <div
                          key={brand.id}
                          onClick={() => {
                            setRefurbishedSelBrand(brand.name);
                            setRefurbishedStep(3);
                          }}
                          className="p-3 bg-slate-50 hover:bg-teal-50/10 border border-slate-200 hover:border-[#39b54a] rounded-xl cursor-pointer transition text-center font-bold text-slate-800"
                        >
                          {brand.name}
                        </div>
                      ))}
                    {brands.filter(b => b.categories && b.categories.includes(refurbishedSelCategory)).length === 0 && (
                      <div className="col-span-3 text-center py-6 text-slate-400 font-bold">No brands found for this category.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Select Model */}
              {refurbishedStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-[#0c213a]">Choose {refurbishedSelBrand} Model</h4>
                    <button onClick={() => setRefurbishedStep(2)} className="text-[#39b54a] font-bold">← Back</button>
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {models
                      .filter(m => m.category === refurbishedSelCategory && m.brand === refurbishedSelBrand)
                      .map((model: any) => (
                        <div
                          key={model.id}
                          onClick={() => {
                            setRefurbishedSelModel(model);
                            setRefurbishedStep(4);
                          }}
                          className="flex items-center space-x-3.5 p-3 bg-slate-50 hover:bg-white hover:border-[#39b54a] rounded-xl border border-slate-200 cursor-pointer transition shadow-3xs"
                        >
                          <img src={model.imageUrl} alt={model.name} className="w-10 h-10 object-contain bg-white rounded-lg border p-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-[11px] text-slate-800 truncate">{model.name}</p>
                            <p className="text-[9px] text-[#39b54a] font-black">{model.range || model.basePrice}</p>
                          </div>
                          <span className="text-slate-400 font-bold">→</span>
                        </div>
                      ))}
                    {models.filter(m => m.category === refurbishedSelCategory && m.brand === refurbishedSelBrand).length === 0 && (
                      <div className="text-center py-6 text-slate-400 font-bold">No models found for this brand selection.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Model Specifications & Details */}
              {refurbishedStep === 4 && refurbishedSelModel && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-[#0c213a]">Product Details & Pricing</h4>
                    <button onClick={() => setRefurbishedStep(3)} className="text-[#39b54a] font-bold">← Back</button>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border relative overflow-hidden">
                    <span className="absolute top-3 left-3 bg-[#39b54a]/10 text-[#39b54a] text-[9px] font-black px-2 py-0.5 rounded-full">
                      CASHIFIN ASSURED
                    </span>
                    <img src={refurbishedSelModel.imageUrl} alt={refurbishedSelModel.name} className="h-36 w-auto object-contain bg-white rounded-xl border p-2 mt-4" />
                    
                    <div className="text-center mt-4 space-y-1.5 w-full">
                      <h3 className="font-black text-sm text-slate-850">{refurbishedSelModel.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold">Brand: {refurbishedSelModel.brand} | Category: {refurbishedSelModel.category}</p>
                      
                      <div className="flex justify-center items-baseline space-x-1.5 pt-1">
                        <span className="text-[#39b54a] font-black text-sm">{refurbishedSelModel.basePrice}</span>
                        <span className="text-[10px] text-slate-400 font-bold">Base Refurbished Payout</span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border text-left mt-4 space-y-2">
                        <p className="font-extrabold text-[10px] text-slate-700">Refurbished Grading & Warranty:</p>
                        <ul className="space-y-1 text-slate-500 text-[10px] font-semibold">
                          <li>✓ 34 Hardwares checkpoints inspected successfully</li>
                          <li>✓ 6-Month cashifin warranty protection</li>
                          <li>✓ Free box charging accessories included</li>
                          <li>✓ 100% Secure doorstep delivery & replacement</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/refurbished/${refurbishedSelModel.id}`}
                    onClick={() => setShowRefurbishedWizard(false)}
                    className="w-full py-3 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-xl text-center block text-xs shadow-md transition"
                  >
                    Proceed to View Specs & Buy Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
    </div>
  );
}
