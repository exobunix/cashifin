"use client";
import React, { useState, useEffect } from 'react';

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState('faqs'); // 'faqs' | 'benefits' | 'articles' | 'logos' | 'banners' | 'stores' | 'testimonials' | 'whychoose' | 'howitworks' | 'footer'
  
  // States for collections
  const [faqs, setFaqs] = useState<any[]>([]);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [logos, setLogos] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [whyChooseUs, setWhyChooseUs] = useState<any[]>([]);
  const [howItWorks, setHowItWorks] = useState<any[]>([]);
  const [footerContent, setFooterContent] = useState<any[]>([]);

  // Modals & form state controllers
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');

  const [showBenefitModal, setShowBenefitModal] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<any>(null);
  const [benefitTitle, setBenefitTitle] = useState('');
  const [benefitDesc, setBenefitDesc] = useState('');
  const [benefitIcon, setBenefitIcon] = useState('💰');

  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [artTitle, setArtTitle] = useState('');
  const [artDesc, setArtDesc] = useState('');
  const [artDate, setArtDate] = useState('');
  const [artImg, setArtImg] = useState('');

  // Logo config states
  const [userLogo, setUserLogo] = useState('');
  const [partnerLogo, setPartnerLogo] = useState('');
  const [adminLogo, setAdminLogo] = useState('');

  // Banner states
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [banTitle, setBanTitle] = useState('');
  const [banSubtitle, setBanSubtitle] = useState('');
  const [banBtn, setBanBtn] = useState('');
  const [banBg, setBanBg] = useState('');

  // Store states
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeTimings, setStoreTimings] = useState('');
  const [storeTags, setStoreTags] = useState('');
  const [storeImg, setStoreImg] = useState('');
  const [storeStatus, setStoreStatus] = useState('Open Now');

  // Testimonial states
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [testName, setTestName] = useState('');
  const [testCity, setTestCity] = useState('');
  const [testQuote, setTestQuote] = useState('');
  const [testRating, setTestRating] = useState('⭐⭐⭐⭐⭐');

  // Why Choose states
  const [showWcuModal, setShowWcuModal] = useState(false);
  const [editingWcu, setEditingWcu] = useState<any>(null);
  const [wcuTag, setWcuTag] = useState('');
  const [wcuTitle, setWcuTitle] = useState('');
  const [wcuDesc, setWcuDesc] = useState('');

  // How It Works states
  const [showHiwModal, setShowHiwModal] = useState(false);
  const [editingHiw, setEditingHiw] = useState<any>(null);
  const [hiwStep, setHiwStep] = useState('1');
  const [hiwTitle, setHiwTitle] = useState('');
  const [hiwDesc, setHiwDesc] = useState('');

  // Footer Content configurations
  const [footerAbout, setFooterAbout] = useState('');
  const [footerCareers, setFooterCareers] = useState('');
  const [footerPress, setFooterPress] = useState('');
  const [footerContact, setFooterContact] = useState('');
  const [footerAgreement, setFooterAgreement] = useState('');
  const [footerPrivacy, setFooterPrivacy] = useState('');
  const [footerDataWipe, setFooterDataWipe] = useState('');

  const loadData = () => {
    fetch('/api/faqs').then(r => r.json()).then(d => setFaqs(d || []));
    fetch('/api/benefits').then(r => r.json()).then(d => setBenefits(d || []));
    fetch('/api/articles').then(r => r.json()).then(d => setArticles(d || []));
    fetch('/api/logos').then(r => r.json()).then(d => {
      const config = d?.[0] || {};
      setLogos(d || []);
      setUserLogo(config.userLogo || '/logo.jpg');
      setPartnerLogo(config.partnerLogo || '');
      setAdminLogo(config.adminLogo || '/logo.jpg');
    });
    fetch('/api/banners').then(r => r.json()).then(d => setBanners(d || []));
    fetch('/api/stores').then(r => r.json()).then(d => setStores(d || []));
    fetch('/api/testimonials').then(r => r.json()).then(d => setTestimonials(d || []));
    fetch('/api/whyChooseUs').then(r => r.json()).then(d => setWhyChooseUs(d || []));
    fetch('/api/howItWorks').then(r => r.json()).then(d => setHowItWorks(d || []));
    fetch('/api/footerContent').then(r => r.json()).then(d => {
      const config = d?.[0] || {};
      setFooterContent(d || []);
      setFooterAbout(config.aboutUs || '');
      setFooterCareers(config.careers || '');
      setFooterPress(config.pressReleases || '');
      setFooterContact(config.contactUs || '');
      setFooterAgreement(config.sellerAgreement || '');
      setFooterPrivacy(config.privacyPolicy || '');
      setFooterDataWipe(config.dataWipe || '');
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Logos Save Handler
  const handleSaveLogos = async (e: React.FormEvent) => {
    e.preventDefault();
    const configId = logos[0]?.id || 'logos_config';
    const item = {
      id: configId,
      userLogo,
      partnerLogo,
      adminLogo
    };

    await fetch('/api/logos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: logos.length > 0 ? 'update' : 'create', item })
    });
    alert('Logos Configuration updated successfully.');
    loadData();
  };

  // Footer Config Save Handler
  const handleSaveFooter = async (e: React.FormEvent) => {
    e.preventDefault();
    const configId = footerContent[0]?.id || 'footer_config';
    const item = {
      id: configId,
      aboutUs: footerAbout,
      careers: footerCareers,
      pressReleases: footerPress,
      contactUs: footerContact,
      sellerAgreement: footerAgreement,
      privacyPolicy: footerPrivacy,
      dataWipe: footerDataWipe
    };

    await fetch('/api/footerContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: footerContent.length > 0 ? 'update' : 'create', item })
    });
    alert('Footer content details updated successfully.');
    loadData();
  };

  // FAQ CRUD
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = editingFaq ? 'update' : 'create';
    const item = editingFaq 
      ? { ...editingFaq, q: faqQ, a: faqA } 
      : { id: `FAQ-${Date.now().toString().slice(-4)}`, q: faqQ, a: faqA };

    await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, item })
    });
    setShowFaqModal(false);
    loadData();
  };

  const handleDeleteFaq = async (id: string) => {
    if (confirm('Delete this FAQ record?')) {
      await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      loadData();
    }
  };

  // Benefit CRUD
  const handleSaveBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = editingBenefit ? 'update' : 'create';
    const item = editingBenefit 
      ? { ...editingBenefit, title: benefitTitle, desc: benefitDesc, icon: benefitIcon }
      : { id: `BEN-${Date.now().toString().slice(-4)}`, title: benefitTitle, desc: benefitDesc, icon: benefitIcon };

    await fetch('/api/benefits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, item })
    });
    setShowBenefitModal(false);
    loadData();
  };

  const handleDeleteBenefit = async (id: string) => {
    if (confirm('Delete this benefit card?')) {
      await fetch('/api/benefits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      loadData();
    }
  };

  // Article CRUD
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = editingArticle ? 'update' : 'create';
    const item = editingArticle
      ? { ...editingArticle, title: artTitle, desc: artDesc, date: artDate, imageUrl: artImg }
      : { id: `ART-${Date.now().toString().slice(-4)}`, title: artTitle, desc: artDesc, date: artDate, imageUrl: artImg };

    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, item })
    });
    setShowArticleModal(false);
    loadData();
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Delete this trending article?')) {
      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      loadData();
    }
  };

  // Banner CRUD
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = editingBanner ? 'update' : 'create';
    const item = editingBanner
      ? { ...editingBanner, title: banTitle, subtitle: banSubtitle, btn: banBtn, bg: banBg }
      : { id: `BAN-${Date.now().toString().slice(-4)}`, title: banTitle, subtitle: banSubtitle, btn: banBtn, bg: banBg };

    await fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, item })
    });
    setShowBannerModal(false);
    loadData();
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Delete this banner?')) {
      await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      loadData();
    }
  };

  // Store CRUD
  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = editingStore ? 'update' : 'create';
    const tagsArray = storeTags.split(',').map(t => t.trim()).filter(Boolean);
    const item = editingStore
      ? { ...editingStore, name: storeName, address: storeAddress, phone: storePhone, timings: storeTimings, tags: tagsArray, imageUrl: storeImg, status: storeStatus }
      : { id: `STR-${Date.now().toString().slice(-4)}`, name: storeName, address: storeAddress, phone: storePhone, timings: storeTimings, tags: tagsArray, imageUrl: storeImg, status: storeStatus };

    await fetch('/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, item })
    });
    setShowStoreModal(false);
    loadData();
  };

  const handleDeleteStore = async (id: string) => {
    if (confirm('Delete this store location?')) {
      await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      loadData();
    }
  };

  // Testimonial CRUD
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = editingTestimonial ? 'update' : 'create';
    const item = editingTestimonial
      ? { ...editingTestimonial, name: testName, city: testCity, quote: testQuote, rating: testRating }
      : { id: `TST-${Date.now().toString().slice(-4)}`, name: testName, city: testCity, quote: testQuote, rating: testRating };

    await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, item })
    });
    setShowTestimonialModal(false);
    loadData();
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Delete this customer review?')) {
      await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      loadData();
    }
  };

  // Why Choose Us CRUD
  const handleSaveWcu = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = editingWcu ? 'update' : 'create';
    const item = editingWcu
      ? { ...editingWcu, tag: wcuTag, title: wcuTitle, desc: wcuDesc }
      : { id: `WCU-${Date.now().toString().slice(-4)}`, tag: wcuTag, title: wcuTitle, desc: wcuDesc };

    await fetch('/api/whyChooseUs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, item })
    });
    setShowWcuModal(false);
    loadData();
  };

  // How It Works CRUD
  const handleSaveHiw = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = editingHiw ? 'update' : 'create';
    const item = editingHiw
      ? { ...editingHiw, step: hiwStep, title: hiwTitle, desc: hiwDesc }
      : { id: `HIW-${Date.now().toString().slice(-4)}`, step: hiwStep, title: hiwTitle, desc: hiwDesc };

    await fetch('/api/howItWorks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, item })
    });
    setShowHiwModal(false);
    loadData();
  };

  return (
    <div className="p-8 space-y-6 text-xs text-slate-800">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-xl font-black">CMS Layout & Media Management</h1>
          <p className="text-slate-400 font-semibold mt-1">Configure user app logos, banners, offline store locator addresses, footer details, value sections, and customer testimonials</p>
        </div>
      </div>

      {/* Tabs list (Two-row wrap for clean layout) */}
      <div className="flex flex-wrap gap-1.5 border-b pb-3">
        {[
          { key: 'faqs', label: 'FAQs' },
          { key: 'benefits', label: 'Exclusive Benefits' },
          { key: 'articles', label: 'Trending Articles' },
          { key: 'logos', label: 'Brand Logos' },
          { key: 'banners', label: 'Hero Banners' },
          { key: 'stores', label: 'Cashifin Stores' },
          { key: 'testimonials', label: 'Customer Reviews' },
          { key: 'whychoose', label: 'Why Choose Us' },
          { key: 'howitworks', label: 'How It Works' },
          { key: 'footer', label: 'Footer & Contacts' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2 font-bold rounded-lg border transition ${
              activeTab === tab.key 
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditingFaq(null); setFaqQ(''); setFaqA(''); setShowFaqModal(true); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-sm">
              + Add New FAQ
            </button>
          </div>
          <div className="bg-white border rounded-xl overflow-hidden shadow-3xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-4">Question</th>
                  <th className="p-4">Answer Snippet</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faqs.map(faq => (
                  <tr key={faq.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-800">{faq.q}</td>
                    <td className="p-4 text-slate-400 max-w-md truncate">{faq.a}</td>
                    <td className="p-4 text-right space-x-2.5">
                      <button onClick={() => { setEditingFaq(faq); setFaqQ(faq.q); setFaqA(faq.a); setShowFaqModal(true); }} className="text-emerald-500 hover:underline font-bold">Edit</button>
                      <button onClick={() => handleDeleteFaq(faq.id)} className="text-red-500 hover:underline font-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Benefits Tab */}
      {activeTab === 'benefits' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditingBenefit(null); setBenefitTitle(''); setBenefitDesc(''); setBenefitIcon('💰'); setShowBenefitModal(true); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-sm">
              + Add Exclusive Benefit
            </button>
          </div>
          <div className="bg-white border rounded-xl overflow-hidden shadow-3xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-4">Icon</th>
                  <th className="p-4">Benefit Title</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {benefits.map(ben => (
                  <tr key={ben.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 text-lg">{ben.icon}</td>
                    <td className="p-4 font-bold text-slate-800">{ben.title}</td>
                    <td className="p-4 text-slate-400 max-w-sm">{ben.desc}</td>
                    <td className="p-4 text-right space-x-2.5">
                      <button onClick={() => { setEditingBenefit(ben); setBenefitTitle(ben.title); setBenefitDesc(ben.desc); setBenefitIcon(ben.icon); setShowBenefitModal(true); }} className="text-emerald-500 hover:underline font-bold">Edit</button>
                      <button onClick={() => handleDeleteBenefit(ben.id)} className="text-red-500 hover:underline font-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Articles Tab */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditingArticle(null); setArtTitle(''); setArtDesc(''); setArtDate(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })); setArtImg(''); setShowArticleModal(true); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-sm">
              + Add Trending Article
            </button>
          </div>
          <div className="bg-white border rounded-xl overflow-hidden shadow-3xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-4">Preview</th>
                  <th className="p-4">Article Title</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map(art => (
                  <tr key={art.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <img src={art.imageUrl} alt="Article Thumbnail" className="w-12 h-8 object-cover rounded border" />
                    </td>
                    <td className="p-4 font-bold text-slate-800 max-w-xs truncate">{art.title}</td>
                    <td className="p-4 text-slate-400">{art.date}</td>
                    <td className="p-4 text-right space-x-2.5">
                      <button onClick={() => { setEditingArticle(art); setArtTitle(art.title); setArtDesc(art.desc); setArtDate(art.date); setArtImg(art.imageUrl); setShowArticleModal(true); }} className="text-emerald-500 hover:underline font-bold">Edit</button>
                      <button onClick={() => handleDeleteArticle(art.id)} className="text-red-500 hover:underline font-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Brand Logos Configuration Tab */}
      {activeTab === 'logos' && (
        <form onSubmit={handleSaveLogos} className="bg-white border p-6 rounded-2xl shadow-3xs space-y-4 max-w-lg">
          <h3 className="font-extrabold text-sm border-b pb-2 text-[#0c213a]">Logo Asset Variables</h3>
          <div className="flex flex-col">
            <label className="font-bold text-slate-500 mb-1">Customer Web Logo Path / URL</label>
            <input type="text" value={userLogo} onChange={e => setUserLogo(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50 font-mono text-[10px]" required />
          </div>
          <div className="flex flex-col">
            <label className="font-bold text-slate-500 mb-1">Partner Web/App Logo Path / URL</label>
            <input type="text" value={partnerLogo} onChange={e => setPartnerLogo(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50 font-mono text-[10px]" required />
          </div>
          <div className="flex flex-col">
            <label className="font-bold text-slate-500 mb-1">Admin Panel Header Logo Path / URL</label>
            <input type="text" value={adminLogo} onChange={e => setAdminLogo(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50 font-mono text-[10px]" required />
          </div>
          <div className="pt-2">
            <button type="submit" className="px-5 py-2.5 bg-[#39b54a] text-white font-bold rounded-lg shadow-sm">
              Save Logos Config
            </button>
          </div>
        </form>
      )}

      {/* Hero Banners Tab */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditingBanner(null); setBanTitle(''); setBanSubtitle(''); setBanBtn(''); setBanBg(''); setShowBannerModal(true); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-sm">
              + Add New Banner
            </button>
          </div>
          <div className="bg-white border rounded-xl overflow-hidden shadow-3xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-4">Heading</th>
                  <th className="p-4">Subheading</th>
                  <th className="p-4">Button CTA</th>
                  <th className="p-4">Background Style</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {banners.map(ban => (
                  <tr key={ban.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-800">{ban.title}</td>
                    <td className="p-4 text-slate-500 font-semibold max-w-xs truncate">{ban.subtitle}</td>
                    <td className="p-4 font-mono font-bold">{ban.btn}</td>
                    <td className="p-4 text-slate-400 font-mono">{ban.bg}</td>
                    <td className="p-4 text-right space-x-2.5">
                      <button onClick={() => { setEditingBanner(ban); setBanTitle(ban.title); setBanSubtitle(ban.subtitle); setBanBtn(ban.btn); setBanBg(ban.bg); setShowBannerModal(true); }} className="text-emerald-500 hover:underline font-bold">Edit</button>
                      <button onClick={() => handleDeleteBanner(ban.id)} className="text-red-500 hover:underline font-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cashifin Experience Stores Tab */}
      {activeTab === 'stores' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditingStore(null); setStoreName(''); setStoreAddress(''); setStorePhone(''); setStoreTimings(''); setStoreTags(''); setStoreImg(''); setStoreStatus('Open Now'); setShowStoreModal(true); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-sm">
              + Add Store Location
            </button>
          </div>
          <div className="bg-white border rounded-xl overflow-hidden shadow-3xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-4">Photo</th>
                  <th className="p-4">Store Name</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Phone / Timings</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stores.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <img src={st.imageUrl} alt={st.name} className="w-12 h-9 object-cover rounded border" />
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      <span className="block">{st.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{st.status}</span>
                    </td>
                    <td className="p-4 text-slate-400 max-w-xs">{st.address}</td>
                    <td className="p-4 font-semibold text-slate-500">
                      <span className="block">{st.phone}</span>
                      <span className="text-[10px] text-slate-400">{st.timings}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(st.tags || []).map((t: string, idx: number) => (
                          <span key={idx} className="bg-slate-100 px-1 py-0.2 rounded text-[8px] text-slate-500 font-bold">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2.5">
                      <button onClick={() => { setEditingStore(st); setStoreName(st.name); setStoreAddress(st.address); setStorePhone(st.phone); setStoreTimings(st.timings); setStoreTags((st.tags || []).join(', ')); setStoreImg(st.imageUrl); setStoreStatus(st.status); setShowStoreModal(true); }} className="text-emerald-500 hover:underline font-bold">Edit</button>
                      <button onClick={() => handleDeleteStore(st.id)} className="text-red-500 hover:underline font-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditingTestimonial(null); setTestName(''); setTestCity(''); setTestQuote(''); setTestRating('⭐⭐⭐⭐⭐'); setShowTestimonialModal(true); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-sm">
              + Add Customer Review
            </button>
          </div>
          <div className="bg-white border rounded-xl overflow-hidden shadow-3xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Quote Review</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {testimonials.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-805">{t.name}</td>
                    <td className="p-4 text-slate-500 font-bold">📍 {t.city}</td>
                    <td className="p-4 text-slate-400 italic max-w-sm">"{t.quote}"</td>
                    <td className="p-4">{t.rating}</td>
                    <td className="p-4 text-right space-x-2.5">
                      <button onClick={() => { setEditingTestimonial(t); setTestName(t.name); setTestCity(t.city); setTestQuote(t.quote); setTestRating(t.rating); setShowTestimonialModal(true); }} className="text-emerald-500 hover:underline font-bold">Edit</button>
                      <button onClick={() => handleDeleteTestimonial(t.id)} className="text-red-500 hover:underline font-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Why Choose Cashifin Tab */}
      {activeTab === 'whychoose' && (
        <div className="space-y-4">
          <div className="bg-white border rounded-xl overflow-hidden shadow-3xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-4">Tag</th>
                  <th className="p-4">Heading Title</th>
                  <th className="p-4">Description Text</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {whyChooseUs.map(wcu => (
                  <tr key={wcu.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-black">{wcu.tag}</span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{wcu.title}</td>
                    <td className="p-4 text-slate-400 max-w-sm">{wcu.desc}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setEditingWcu(wcu); setWcuTag(wcu.tag); setWcuTitle(wcu.title); setWcuDesc(wcu.desc); setShowWcuModal(true); }} className="text-emerald-500 hover:underline font-bold">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* How It Works Tab */}
      {activeTab === 'howitworks' && (
        <div className="space-y-4">
          <div className="bg-white border rounded-xl overflow-hidden shadow-3xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-4">Step #</th>
                  <th className="p-4">Step Title</th>
                  <th className="p-4">Description Text</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {howItWorks.map(hiw => (
                  <tr key={hiw.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-mono font-bold text-lg text-emerald-600">{hiw.step}</td>
                    <td className="p-4 font-bold text-slate-805">{hiw.title}</td>
                    <td className="p-4 text-slate-400 max-w-sm">{hiw.desc}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setEditingHiw(hiw); setHiwStep(hiw.step); setHiwTitle(hiw.title); setHiwDesc(hiw.desc); setShowHiwModal(true); }} className="text-emerald-500 hover:underline font-bold">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer content blocks */}
      {activeTab === 'footer' && (
        <form onSubmit={handleSaveFooter} className="bg-white border p-6 rounded-2xl shadow-3xs space-y-4 max-w-xl">
          <h3 className="font-extrabold text-sm border-b pb-2 text-[#0c213a]">Corporate Footer Information Blocks</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">About Us Description</label>
              <textarea value={footerAbout} onChange={e => setFooterAbout(e.target.value)} rows={3} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Careers Description</label>
              <textarea value={footerCareers} onChange={e => setFooterCareers(e.target.value)} rows={3} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Press Releases Description</label>
              <textarea value={footerPress} onChange={e => setFooterPress(e.target.value)} rows={3} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Contact Us Details (Address/Hotline)</label>
              <textarea value={footerContact} onChange={e => setFooterContact(e.target.value)} rows={3} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Seller Agreement Text</label>
              <textarea value={footerAgreement} onChange={e => setFooterAgreement(e.target.value)} rows={3} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Privacy Policy Description</label>
              <textarea value={footerPrivacy} onChange={e => setFooterPrivacy(e.target.value)} rows={3} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col col-span-2">
              <label className="font-bold text-slate-500 mb-1">Data Wipe Certification Standards</label>
              <textarea value={footerDataWipe} onChange={e => setFooterDataWipe(e.target.value)} rows={3} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" className="px-5 py-2.5 bg-[#39b54a] text-white font-bold rounded-lg shadow-sm">
              Save Footer Content
            </button>
          </div>
        </form>
      )}

      {/* Modal overlays */}
      
      {/* FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveFaq} className="bg-white p-6 rounded-2xl w-[450px] space-y-4 border shadow-xl">
            <h3 className="font-black text-sm text-slate-800">{editingFaq ? 'Edit FAQ Card' : 'Add FAQ Card'}</h3>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Question Text</label>
              <input type="text" value={faqQ} onChange={e => setFaqQ(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Detailed Answer</label>
              <textarea value={faqA} onChange={e => setFaqA(e.target.value)} rows={4} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setShowFaqModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold">Save FAQ</button>
            </div>
          </form>
        </div>
      )}

      {/* Benefit Modal */}
      {showBenefitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveBenefit} className="bg-white p-6 rounded-2xl w-[450px] space-y-4 border shadow-xl">
            <h3 className="font-black text-sm text-slate-800">{editingBenefit ? 'Edit Benefit' : 'Add Benefit'}</h3>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Emoji Icon</label>
              <input type="text" value={benefitIcon} onChange={e => setBenefitIcon(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50 w-24" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Benefit Title</label>
              <input type="text" value={benefitTitle} onChange={e => setBenefitTitle(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Description</label>
              <textarea value={benefitDesc} onChange={e => setBenefitDesc(e.target.value)} rows={3} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setShowBenefitModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold">Save Benefit</button>
            </div>
          </form>
        </div>
      )}

      {/* Article Modal */}
      {showArticleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveArticle} className="bg-white p-6 rounded-2xl w-[500px] space-y-4 border shadow-xl">
            <h3 className="font-black text-sm text-slate-800">{editingArticle ? 'Edit Article' : 'Add Article'}</h3>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Article Title</label>
              <input type="text" value={artTitle} onChange={e => setArtTitle(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Description</label>
              <textarea value={artDesc} onChange={e => setArtDesc(e.target.value)} rows={3} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Image URL (Unsplash Link)</label>
              <input type="text" value={artImg} onChange={e => setArtImg(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50 text-[10px]" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Publish Date</label>
              <input type="text" value={artDate} onChange={e => setArtDate(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setShowArticleModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold">Save Article</button>
            </div>
          </form>
        </div>
      )}

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveBanner} className="bg-white p-6 rounded-2xl w-[450px] space-y-4 border shadow-xl">
            <h3 className="font-black text-sm text-slate-800">{editingBanner ? 'Edit Hero Banner' : 'Add Hero Banner'}</h3>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Heading Title</label>
              <input type="text" value={banTitle} onChange={e => setBanTitle(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Subheading Description</label>
              <input type="text" value={banSubtitle} onChange={e => setBanSubtitle(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Button CTA Text</label>
              <input type="text" value={banBtn} onChange={e => setBanBtn(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Background CSS Classes (e.g. bg-[#39b54a])</label>
              <input type="text" value={banBg} onChange={e => setBanBg(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50 font-mono text-[10px]" required />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setShowBannerModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold">Save Banner</button>
            </div>
          </form>
        </div>
      )}

      {/* Store Modal */}
      {showStoreModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveStore} className="bg-white p-6 rounded-2xl w-[500px] space-y-4 border shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-sm text-slate-800">{editingStore ? 'Edit Store Address' : 'Add Store Address'}</h3>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Store Outlet Name</label>
              <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Detailed Street Address</label>
              <textarea value={storeAddress} onChange={e => setStoreAddress(e.target.value)} rows={2} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Store Phone Contact</label>
              <input type="text" value={storePhone} onChange={e => setStorePhone(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Working Hours Timings</label>
              <input type="text" value={storeTimings} onChange={e => setStoreTimings(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Tags (Comma-separated, e.g. Instant Payouts, Accessories)</label>
              <input type="text" value={storeTags} onChange={e => setStoreTags(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50 text-[10px]" />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Store Image URL</label>
              <input type="text" value={storeImg} onChange={e => setStoreImg(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50 text-[10px]" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Status (e.g. Open Now)</label>
              <input type="text" value={storeStatus} onChange={e => setStoreStatus(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setShowStoreModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold">Save Store</button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonial Modal */}
      {showTestimonialModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveTestimonial} className="bg-white p-6 rounded-2xl w-[450px] space-y-4 border shadow-xl">
            <h3 className="font-black text-sm text-slate-800">{editingTestimonial ? 'Edit Review' : 'Add Review'}</h3>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Customer Name</label>
              <input type="text" value={testName} onChange={e => setTestName(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">City / Location</label>
              <input type="text" value={testCity} onChange={e => setTestCity(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Review Quote Text</label>
              <textarea value={testQuote} onChange={e => setTestQuote(e.target.value)} rows={3} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Stars Rating Level</label>
              <input type="text" value={testRating} onChange={e => setTestRating(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setShowTestimonialModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold">Save Review</button>
            </div>
          </form>
        </div>
      )}

      {/* Why Choose Us Modal */}
      {showWcuModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveWcu} className="bg-white p-6 rounded-2xl w-[450px] space-y-4 border shadow-xl">
            <h3 className="font-black text-sm text-slate-800">Edit Why Choose Us Card</h3>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Tag (Icon + Title)</label>
              <input type="text" value={wcuTag} onChange={e => setWcuTag(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Title Heading</label>
              <input type="text" value={wcuTitle} onChange={e => setWcuTitle(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Detailed Description</label>
              <textarea value={wcuDesc} onChange={e => setWcuDesc(e.target.value)} rows={3} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setShowWcuModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* How It Works Modal */}
      {showHiwModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveHiw} className="bg-white p-6 rounded-2xl w-[450px] space-y-4 border shadow-xl">
            <h3 className="font-black text-sm text-slate-800">Edit How It Works Step</h3>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Step Number</label>
              <input type="text" value={hiwStep} onChange={e => setHiwStep(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50 w-24" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Step Title Heading</label>
              <input type="text" value={hiwTitle} onChange={e => setHiwTitle(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Detailed Description</label>
              <textarea value={hiwDesc} onChange={e => setHiwDesc(e.target.value)} rows={3} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setShowHiwModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
