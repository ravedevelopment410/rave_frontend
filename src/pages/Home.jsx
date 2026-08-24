import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Award, Star, ShoppingBag, CheckCircle, Heart } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import TrustBadges from '../components/TrustBadges';
import HeroSlider from '../components/HeroSlider';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const prods = await api.getProducts();
        setFeaturedProducts(prods);
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    window.addEventListener('aravez_catalog_updated', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('aravez_catalog_updated', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  // Filter products for landing page section:
  // ONLY show products explicitly marked as isFeatured or isBestSeller by Admin!
  const featuredOnly = featuredProducts.filter(p => p.isFeatured || p.isBestSeller);
  const landingBaseList = featuredOnly.length > 0 ? featuredOnly : featuredProducts;

  const filteredProducts = landingBaseList.filter(p => {
    if (activeTab === 'bestsellers') return p.isBestSeller;
    if (activeTab === 'skincare') return p.category === 'Botanical Skincare' || p.category === 'Touchbooks';
    if (activeTab === 'teas') return p.category === 'Organic Teas' || p.category === 'Projecters';
    return true;
  }).slice(0, 6);

  const testimonials = [
    {
      name: 'Sophia Sterling',
      role: 'Verified Buyer',
      rating: 5,
      comment: 'The Green Tea & Aloe Glow Serum is hands down the best organic skincare investment I have ever made. My skin texture has completely cleared up in just 2 weeks!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Dr. Marcus Vance',
      role: 'Holistic Practitioner',
      rating: 5,
      comment: 'Aravez sources botanical herbs of the highest adaptogenic purity. The Himalayan Herbal Elixir is now a daily essential for both myself and my patients.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Aria Chen',
      role: 'Yoga Instructor',
      rating: 5,
      comment: 'From the eco-friendly compostable packaging to the soothing aroma of the Emerald Mint Tea, Aravez represents the golden standard of conscious living.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. DYNAMIC HERO SLIDER (Manageable from Admin) */}
      <HeroSlider />


      {/* 2. TRUST BADGES */}
      <TrustBadges />



      {/* 4. FEATURED PRODUCTS WITH FILTER TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
            RAVE SERVICES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            Featured Audio-Visual & Display Products
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Explore high-performance Interactive Panels, Projectors, Touchbooks, Active LEDs, and Video Conferencing equipment.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: 'all', label: 'All Featured' },
              { id: 'bestsellers', label: '⭐ Best Sellers' },
              { id: 'skincare', label: '💻 Touchbooks & Panels' },
              { id: 'teas', label: '📽️ Projectors' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-emerald-50 text-gray-700 hover:bg-emerald-100/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-96 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-8 py-3.5 rounded-full border border-emerald-200 transition-colors text-sm"
          >
            <span>View Complete Aravez Store ({featuredProducts.length} Items)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. PROMOTIONAL OFFER SPOTLIGHT BANNER */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white shadow-2xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-block px-3 py-1 bg-amber-400 text-amber-950 rounded-full text-xs font-extrabold uppercase tracking-wider">
                  🔥 {offers[0].badge}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                  {offers[0].title}
                </h3>
                <p className="text-emerald-200 text-sm leading-relaxed max-w-lg">
                  {offers[0].subtitle}. {offers[0].description}
                </p>

                {/* Coupon Code Strip */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className="bg-emerald-900/90 border border-emerald-500/50 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                    <span className="text-xs text-emerald-300 font-medium">Coupon:</span>
                    <strong className="font-mono text-base font-bold tracking-widest text-emerald-300">
                      {offers[0].couponCode}
                    </strong>
                  </div>
                  <button
                    onClick={() => handleCopyCoupon(offers[0].couponCode)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-6 py-3 rounded-2xl text-xs transition-transform hover:scale-105"
                  >
                    Copy Code & Save {offers[0].discountPercent}%
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <img
                  src={offers[0].image}
                  alt={offers[0].title}
                  className="rounded-2xl max-h-72 object-cover border-2 border-emerald-400/30 shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. WHY CHOOSE ARAVEZ */}
      <section className="bg-emerald-50/50 py-16 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
              The Aravez Standard
            </span>
            <h2 className="font-serif text-3xl font-bold text-gray-900">
              Why Corporate & Commercial Clients Choose Aravez
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              We deliver genuine technology solutions, full brand warranty, and seamless technical support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">
                100% Genuine AV Hardware
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Authorized supply of Touchbooks, 4K Laser Projectors, Interactive Flat Panels, and Video Conferencing equipment with full brand warranty.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">
                Commercial Grade Tested
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Engineered for heavy-duty boardroom meetings, smart classrooms, auditorium systems, and high-performance home theaters.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">
                GST B2B Billing & Support
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Official B2B GST tax invoice for corporate input tax credit, pan-India insured shipping, and expert technical guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
            Real Experiences
          </span>
          <h2 className="font-serif text-3xl font-bold text-gray-900">
            Stories From Our Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-emerald-100/90 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm italic leading-relaxed mb-6">
                  "{item.comment}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border border-emerald-200"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                  <span className="text-xs text-emerald-700 font-medium">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
