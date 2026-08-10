"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// High-fidelity image mappings from Unsplash for refurbished devices
const deviceImages: { [key: string]: string[] } = {
  "macbook-pro-2024": [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=150&auto=format&fit=crop"
  ],
  "macbook-pro-2023-16": [
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=150&auto=format&fit=crop"
  ],
  "macbook-pro-2023-14": [
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=150&auto=format&fit=crop"
  ],
  "macbook-pro-2023-m2": [
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=150&auto=format&fit=crop"
  ],
  "macbook-air-2025": [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=150&auto=format&fit=crop"
  ],
  "phone-0": [
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=150&auto=format&fit=crop"
  ],
  "phone-1": [
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=150&auto=format&fit=crop"
  ],
  "phone-2": [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=150&auto=format&fit=crop"
  ],
  "phone-3": [
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=150&auto=format&fit=crop"
  ],
  "phone-4": [
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=150&auto=format&fit=crop"
  ]
};

const refurbishedDevices = {
  "macbook-pro-2024": { name: 'Apple MacBook Pro 2024', spec: 'Apple M4 Pro 14 Inch, 16GB / 512GB SSD, Space Black', price: 164399, oldPrice: 265999, discount: '37%', rating: '5.0★', reviews: '12 reviews' },
  "macbook-pro-2023-16": { name: 'Apple MacBook Pro 2023 16"', spec: 'Apple M3 Pro Chip, 18GB / 512GB SSD, Space Gray', price: 143471, oldPrice: 198449, discount: '26%', rating: '4.7★', reviews: '8 reviews' },
  "macbook-pro-2023-14": { name: 'Apple MacBook Pro 2023 14"', spec: 'Apple M3 Pro Chip, 18GB / 512GB SSD, Silver', price: 135631, oldPrice: 192999, discount: '28%', rating: '5.0★', reviews: '15 reviews' },
  "macbook-pro-2023-m2": { name: 'Apple MacBook Pro 2023 M2', spec: 'Apple M2 Pro Chip, 16GB / 512GB SSD, Space Gray', price: 110151, oldPrice: 148999, discount: '24%', rating: '4.6★', reviews: '6 reviews' },
  "macbook-air-2025": { name: 'Apple MacBook Air 2025', spec: 'Apple M4 15 Inch, 16GB / 256GB SSD, Starlight', price: 98391, oldPrice: 136999, discount: '26%', rating: '4.8★', reviews: '19 reviews' },
  "phone-0": { name: 'Samsung Galaxy S21 Ultra 5G', spec: 'Exynos 2100 Processor, 12GB RAM / 256GB Storage, Phantom Black', price: 36299, oldPrice: 73600, discount: '51%', rating: '4.5★', reviews: '24 reviews' },
  "phone-1": { name: 'Samsung Galaxy S24 Ultra 5G', spec: 'Snapdragon 8 Gen 3, 12GB RAM / 512GB Storage, Titanium Gray', price: 68699, oldPrice: 134999, discount: '49%', rating: '4.8★', reviews: '42 reviews' },
  "phone-2": { name: 'Samsung Galaxy S20 FE 5G', spec: 'Snapdragon 865, 8GB RAM / 128GB Storage, Cloud Navy', price: 16799, oldPrice: 34999, discount: '52%', rating: '4.5★', reviews: '31 reviews' },
  "phone-3": { name: 'Samsung Galaxy S25 Edge', spec: 'Exynos 2400 Processor, 12GB RAM / 256GB Storage, Ocean Blue', price: 56499, oldPrice: 125999, discount: '55%', rating: '4.8★', reviews: '18 reviews' },
  "phone-4": { name: 'OnePlus 12 - Refurbished', spec: 'Snapdragon 8 Gen 3, 16GB RAM / 512GB Storage, Silky Black', price: 38299, oldPrice: 64999, discount: '41%', rating: '4.8★', reviews: '27 reviews' }
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
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

  const deviceId = params.id || "macbook-pro-2024";
  const [dbDevice, setDbDevice] = useState<any>(null);

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        const found = data.find((m: any) => m.id === params.id);
        if (found) {
          setDbDevice(found);
        }
      })
      .catch(err => console.log('Error loading db device:', err));
  }, [params.id]);

  // Resolve matching specifications dynamically from DB seeder or fallback to static stubs
  const staticDevice = (refurbishedDevices as any)[deviceId] || refurbishedDevices["macbook-pro-2024"];
  const device = dbDevice ? {
    name: dbDevice.name,
    spec: `${dbDevice.brand} Certified Grade-A Refurbished Device — ${dbDevice.category}`,
    price: dbDevice.rawBase || parseFloat(dbDevice.basePrice.replace(/[^0-9]/g, '')),
    oldPrice: Math.round((dbDevice.rawBase || parseFloat(dbDevice.basePrice.replace(/[^0-9]/g, ''))) * 1.5),
    discount: '33%',
    rating: '4.8★',
    reviews: '15 reviews'
  } : staticDevice;

  const [activeThumb, setActiveThumb] = useState(0);
  const [condition, setCondition] = useState('Fair');
  const [cartAdded, setCartAdded] = useState(false);

  // Cart UI States
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  
  // Checkout Inputs
  const [checkName, setCheckName] = useState('adarsh Deep Sachan');
  const [checkPhone, setCheckPhone] = useState('+91 98765 43210');
  const [checkAddress, setCheckAddress] = useState('B-45, Sector 62, Noida, UP');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem('cashifin_cart') || '[]');
    setCartItems(items);
  };

  useEffect(() => {
    loadCart();
    // Watch storage changes
    const syncCart = () => loadCart();
    window.addEventListener('storage', syncCart);
    return () => window.removeEventListener('storage', syncCart);
  }, []);

  const handleAddToCart = () => {
    const item = {
      id: deviceId,
      name: device.name,
      spec: device.spec,
      price: activePrice,
      image: gallery[0],
      condition: condition
    };
    const currentCart = JSON.parse(localStorage.getItem('cashifin_cart') || '[]');
    const exists = currentCart.some((i: any) => i.id === item.id && i.condition === item.condition);
    if (!exists) {
      currentCart.push(item);
      localStorage.setItem('cashifin_cart', JSON.stringify(currentCart));
      setCartItems(currentCart);
    }
    setCartAdded(true);
    setShowCartDrawer(true);
  };

  const handleRemoveFromCart = (index: number) => {
    const currentCart = JSON.parse(localStorage.getItem('cashifin_cart') || '[]');
    currentCart.splice(index, 1);
    localStorage.setItem('cashifin_cart', JSON.stringify(currentCart));
    setCartItems(currentCart);
    setCartAdded(false);
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((acc, curr) => acc + curr.price, 0);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacingOrder(true);

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-5)}`,
      device: cartItems.map(i => `${i.name} (${i.condition})`).join(', '),
      price: `₹${calculateCartTotal().toLocaleString()}`,
      customerName: checkName,
      customerPhone: checkPhone,
      customerAddress: checkAddress,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', item: newOrder })
      });

      // Trigger notifications for Admin & Customer
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          item: {
            id: `NTF-${Date.now()}-adm`,
            target: 'admin',
            message: `New Refurbished purchase placed: ${newOrder.id} for ${newOrder.device} at ${newOrder.price}`,
            read: false,
            date: newOrder.date
          }
        })
      });

      if (checkPhone) {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            item: {
              id: `NTF-${Date.now()}-cust`,
              target: checkPhone,
              message: `Your Refurbished purchase ${newOrder.id} has been registered!`,
              read: false,
              date: newOrder.date
            }
          })
        });
      }

      // Clear Cart
      localStorage.removeItem('cashifin_cart');
      setCartItems([]);
      setOrderComplete(true);
      setShowCheckoutModal(false);
    } catch (err) {
      alert('Failed to place refurbished order');
    }
    setPlacingOrder(false);
  };

  // Dynamic pricing calculation based on selected Condition:
  // Superb = Full original price
  // Good = 8% discount from Superb
  // Fair = 18% discount from Superb
  const getDynamicPrice = () => {
    let base = device.price;
    if (condition === 'Good') {
      base = Math.round(device.price * 0.92);
    } else if (condition === 'Fair') {
      base = Math.round(device.price * 0.82);
    }
    return base;
  };

  const activePrice = getDynamicPrice();
  const activeDiscount = Math.round(((device.oldPrice - activePrice) / device.oldPrice) * 100);

  // Retrieve matching image gallery list dynamically based on category
  const getGallery = () => {
    const name = (device.name || '').toLowerCase();
    const cat = dbDevice ? (dbDevice.category || '').toLowerCase() : (deviceId.includes('macbook') ? 'laptop' : 'phone');

    if (cat.includes('laptop') || name.includes('macbook')) {
      return deviceImages["macbook-pro-2024"];
    }
    if (cat.includes('tablet')) {
      return [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=150&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=150&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=150&auto=format&fit=crop"
      ];
    }
    if (cat.includes('watch')) {
      return [
        "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=150&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=150&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=150&auto=format&fit=crop"
      ];
    }
    return deviceImages[deviceId] || deviceImages["phone-0"];
  };
  
  const gallery = getGallery();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-10 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-40">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <img src="/logo.jpg" alt="CASHIFIN" className="h-16 w-auto rounded-lg object-contain py-1" />
        </Link>
        <div className="flex items-center space-x-6 text-xs font-bold text-slate-650">
          <span><span className="cursor-pointer" onClick={() => setShowLocationModal(true)}>📍 {activeLocation} ▼</span></span>
          <button onClick={() => setShowCartDrawer(true)} className="relative flex items-center space-x-1.5 hover:text-[#39b54a] font-bold">
            <span>🛒</span>
            <span>Cart ({cartItems.length})</span>
          </button>
          <Link href="/profile" className="hover:text-[#39b54a]">👤 adarsh Deep Sachan</Link>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-10 py-4 text-[10px] text-slate-400 font-semibold space-x-1.5 border-b bg-white">
        <Link href="/" className="hover:text-[#39b54a]">Home</Link>
        <span>&gt;</span>
        <span className="hover:text-[#39b54a]">Buy Refurbished Devices</span>
        <span>&gt;</span>
        <span className="text-slate-600">{device.name}</span>
      </div>

      {/* Main product display */}
      <div className="flex-1 bg-white px-10 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left column: Gallery */}
        <div className="flex space-x-4">
          {/* Thumbnails stack using real images */}
          <div className="flex flex-col space-y-3 shrink-0">
            {gallery.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveThumb(idx)}
                className={`w-14 h-14 bg-slate-100 rounded-lg border overflow-hidden flex items-center justify-center transition ${
                  activeThumb === idx ? 'border-2 border-[#39b54a]' : 'border-slate-200'
                }`}
              >
                <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Large image view with selected thumbnail */}
          <div className="flex-1 bg-slate-50 border rounded-2xl overflow-hidden flex items-center justify-center relative aspect-square p-6">
            <span className="absolute top-4 left-4 bg-[#39b54a] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full z-10 shadow">CASHIFIN ASSURED</span>
            <img 
              src={gallery[activeThumb]} 
              alt="Device Image" 
              className="w-full h-full object-contain max-h-[350px] transition-all duration-300 transform hover:scale-105"
            />
          </div>
        </div>

        {/* Right column: Specs and pricing */}
        <div className="space-y-6 text-xs text-slate-700">
          {/* Title and Ratings */}
          <div className="space-y-2">
            <h1 className="text-xl font-black text-slate-850 leading-tight">{device.name} - Refurbished</h1>
            <p className="text-slate-400 font-semibold">{device.spec}</p>
            <div className="flex items-center space-x-2 pt-1">
              <span className="bg-emerald-500 text-white font-bold px-2 py-0.5 rounded text-[10px]">{device.rating}</span>
              <span className="text-slate-400 font-bold">{device.reviews}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="space-y-2.5 border-t border-b py-4">
            <div className="flex items-center space-x-3">
              <span className="text-rose-500 font-extrabold text-base">-{activeDiscount}%</span>
              <span className="text-2xl font-black text-slate-850">₹{activePrice.toLocaleString()}</span>
              <span className="text-slate-400 line-through font-semibold">₹{device.oldPrice.toLocaleString()}</span>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100 flex justify-between items-center text-[10px] font-bold text-amber-800 max-w-sm">
              <span>Get it for ₹{(activePrice - 600).toLocaleString()} with GOLD 🪙</span>
              <span className="cursor-pointer underline">Apply</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold pt-1">₹1,796/month EMI available. <span className="text-blue-500 cursor-pointer hover:underline">View Plans</span></p>
          </div>

          {/* Condition Selectors */}
          <div className="space-y-3">
            <div className="flex justify-between items-center max-w-sm">
              <h3 className="font-extrabold text-slate-800 text-xs">Select Condition</h3>
              <span className="text-[10px] text-blue-500 hover:underline cursor-pointer">Learn More</span>
            </div>
            <div className="flex space-x-3">
              {['Fair', 'Good', 'Superb'].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setCondition(cond)}
                  className={`px-6 py-2.5 rounded-lg text-xs font-bold border transition ${
                    condition === cond 
                      ? 'border-2 border-[#39b54a] text-[#39b54a] bg-teal-50/10' 
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
            <div className="bg-emerald-50 text-emerald-800 text-[10px] font-bold p-3 rounded-lg border border-emerald-100 flex items-center space-x-1.5 max-w-sm">
              <span>✓</span>
              <span>All devices have a default 6 Months warranty out of the box</span>
            </div>
          </div>

          {/* Buy Action */}
          <div className="pt-4 flex space-x-3 max-w-sm">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-xl tracking-wider transition uppercase shadow-md"
            >
              {cartAdded ? '✓ ADDED IN CART' : 'BUY NOW'}
            </button>
          </div>
        </div>
      </div>
    
      
      {/* Dynamic Cart Drawer */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
          <div className="bg-white w-[380px] h-full flex flex-col p-6 shadow-2xl animate-slide-in relative text-slate-800">
            <button 
              onClick={() => setShowCartDrawer(false)}
              className="absolute top-6 left-6 text-xs font-bold bg-slate-100 hover:bg-slate-200 w-7 h-7 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            <div className="text-center pt-8 border-b pb-4">
              <h3 className="text-sm font-black text-slate-805">My Shopping Cart</h3>
              <p className="text-[9px] text-slate-400 mt-1">Review items to proceed checkout</p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 py-3 space-y-3">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex space-x-3 pt-3 text-[10px]">
                  <img src={item.image} alt="Cart item" className="w-14 h-14 object-cover rounded border" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-slate-800 truncate">{item.name}</h4>
                    <p className="text-[9px] text-slate-400 truncate">{item.spec}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="bg-[#39b54a]/10 text-[#39b54a] px-1 py-0.2 rounded font-black uppercase text-[8px]">{item.condition}</span>
                      <span className="font-black text-slate-700">₹{item.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveFromCart(idx)} className="text-red-500 hover:text-red-700 font-bold self-start">🗑️</button>
                </div>
              ))}
              {cartItems.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-20 text-slate-400">
                  <span className="text-4xl">🛒</span>
                  <p className="text-xs font-bold">Your cart is empty.</p>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-baseline font-bold">
                  <span className="text-[10px] text-slate-400 uppercase">Subtotal Price</span>
                  <span className="text-sm text-[#39b54a] font-black">₹{calculateCartTotal().toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => {
                    setShowCartDrawer(false);
                    setShowCheckoutModal(true);
                  }}
                  className="w-full py-3 bg-[#39b54a] hover:bg-[#2fa03e] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-2xl space-y-4 text-slate-800 border relative">
            <button onClick={() => setShowCheckoutModal(false)} className="absolute top-4 right-4 text-xs font-bold bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center">✕</button>
            <div className="text-center pb-2 border-b">
              <h3 className="font-black text-sm text-[#39b54a]">Checkout Refurbished Order</h3>
              <p className="text-[9px] text-slate-400">Enter delivery details to book evaluate evaluator</p>
            </div>
            <form onSubmit={handlePlaceOrder} className="space-y-3.5 text-xs">
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Full Name</label>
                <input type="text" value={checkName} onChange={e => setCheckName(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Phone Number</label>
                <input type="text" value={checkPhone} onChange={e => setCheckPhone(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Delivery Address</label>
                <textarea value={checkAddress} onChange={e => setCheckAddress(e.target.value)} rows={2} className="p-2.5 border rounded-lg bg-slate-50" required />
              </div>
              <div className="flex justify-between items-baseline font-bold pt-2 border-t text-[10px]">
                <span className="text-slate-400 uppercase">Amount Payable</span>
                <span className="text-sm text-[#39b54a] font-black">₹{calculateCartTotal().toLocaleString()}</span>
              </div>
              <button 
                type="submit" 
                disabled={placingOrder}
                className="w-full py-3 bg-[#39b54a] text-white font-black rounded-lg hover:bg-[#2fa03e]"
              >
                {placingOrder ? 'Placing Order...' : 'Confirm Refurbished Order'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Complete Success Overlay */}
      {orderComplete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl w-[360px] text-center space-y-4 border text-slate-800">
            <span className="text-5xl block animate-bounce">🎉</span>
            <h3 className="font-black text-sm text-[#39b54a]">Order Placed Successfully!</h3>
            <p className="text-[10px] text-slate-450 leading-relaxed">
              Your refurbished device order has been placed. You can track status inside your account orders dashboard.
            </p>
            <button 
              onClick={() => {
                setOrderComplete(false);
                window.location.href = '/profile';
              }} 
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg text-xs"
            >
              Go to My Profile
            </button>
          </div>
        </div>
      )}
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
</div>
  );
}
