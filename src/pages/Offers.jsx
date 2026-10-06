import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Tag, Clock, ArrowRight, Gift, Percent, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 48 });
  const { addToast } = useToast();
  const { applyCouponCode, setIsCartOpen } = useCart();

  useEffect(() => {
    const fetchOffers = async () => {
      const data = await api.getOffers();
      setOffers(data);
    };
    fetchOffers();

    // Countdown timer tick
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyAndApply = async (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Coupon code "${code}" copied & ready! ✂️`, 'success');
    await applyCouponCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const bundles = [
    {
      title: 'Morning Radiance Glow Kit',
      items: 'Green Tea Serum + Cleanse Whipped Foam + Jade Roller',
      originalPrice: 110.00,
      bundlePrice: 79.00,
      savePercent: 28,
      image: 'https://images.unsplash.com/photo-1608248597359-009a25b6a716?auto=format&fit=crop&w=600&q=80',
      badge: 'TOP SELLING KIT',
    },
    {
      title: 'Deep Rest & Immune Harmony Pack',
      items: 'Himalayan Herbal Elixir + Zen Lavender Infusion Tea',
      originalPrice: 80.00,
      bundlePrice: 58.00,
      savePercent: 27,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      badge: 'WELLNESS BUNDLE',
    },
    {
      title: 'Artisan Tea Master Collection',
      items: 'Emerald Mint Loose Leaf + Zen Lavender + Bamboo Infuser',
      originalPrice: 65.00,
      bundlePrice: 48.00,
      savePercent: 26,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      badge: 'TEA LOVERS SPECIAL',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO BANNER WITH COUNTDOWN */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-amber-400 text-amber-950 font-bold text-xs uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Limited Botanical Flash Deals</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Aravez Exclusive Offers <span className="italic font-serif text-emerald-300">&</span> Coupons
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto">
            Enjoy special seasonal promotions, subscriber coupons, and curated value bundles. Copy any coupon below to automatically apply it to your cart.
          </p>

          {/* Flash Countdown Widget */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mr-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Deal Closes In:</span>
            </div>
            {[
              { val: timeLeft.hours, label: 'HRS' },
              { val: timeLeft.minutes, label: 'MIN' },
              { val: timeLeft.seconds, label: 'SEC' },
            ].map((t, idx) => (
              <div key={idx} className="bg-emerald-900/90 border border-emerald-600/50 rounded-none px-3.5 py-2 min-w-[54px]">
                <div className="font-mono text-lg sm:text-xl font-extrabold text-amber-300">
                  {String(t.val).padStart(2, '0')}
                </div>
                <div className="text-[9px] text-emerald-300 tracking-wider font-bold">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. ACTIVE COUPONS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
            Claimable Vouchers
          </span>
          <h2 className="font-serif text-3xl font-bold text-gray-900">
            Available Discount Codes
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            Click on any coupon code to automatically copy and apply it to your active shopping bag.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-white rounded-none border-2 border-dashed border-emerald-200 p-6 sm:p-8 hover:border-emerald-500 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-none uppercase tracking-wider mb-2">
                    {offer.badge}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
                    {offer.title}
                  </h3>
                  <p className="text-emerald-700 font-semibold text-sm mt-1">
                    {offer.subtitle}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-none bg-emerald-50 text-emerald-800 flex flex-col items-center justify-center shrink-0 border border-emerald-100">
                  <Percent className="w-4 h-4 text-emerald-600" />
                  <span className="font-black text-sm">{offer.discountPercent}%</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                {offer.description} (Minimum spend: ${offer.minSpend})
              </p>

              {/* Coupon Box Action */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:w-auto bg-emerald-50 border border-emerald-200 rounded-none px-4 py-2 flex items-center justify-between sm:justify-start gap-3">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span className="font-mono text-base font-bold text-emerald-900 tracking-wider">
                    {offer.couponCode}
                  </span>
                </div>

                <button
                  onClick={() => handleCopyAndApply(offer.couponCode)}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-none font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    copiedCode === offer.couponCode
                      ? 'bg-emerald-800 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:scale-105'
                  }`}
                >
                  {copiedCode === offer.couponCode ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied & Applied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CURATED BUNDLE DEALS */}
      <section className="bg-emerald-50/60 py-16 sm:py-20 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
              Bundle & Save
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
              Curated Botanical Ritual Sets
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Save up to 30% when you buy complementary botanical care rituals together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bundles.map((bundle, idx) => (
              <div
                key={idx}
                className="bg-white rounded-none overflow-hidden border border-emerald-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-video">
                  <img
                    src={bundle.image}
                    alt={bundle.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-amber-500 text-amber-950 text-[10px] font-extrabold px-3 py-1 rounded-none shadow-md">
                    {bundle.badge}
                  </span>
                  <span className="absolute top-3 right-3 bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-none shadow-md">
                    SAVE {bundle.savePercent}%
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
                      {bundle.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Includes: {bundle.items}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-emerald-950">
                          ${bundle.bundlePrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ${bundle.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/products"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2.5 rounded-none transition-colors flex items-center gap-1.5"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW TO REDEEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-none p-8 sm:p-12 border border-emerald-100 shadow-sm text-center">
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-8">
            How to Redeem Your Offers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-none bg-emerald-100 text-emerald-800 font-extrabold text-lg flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="font-bold text-base text-gray-900">Copy Coupon</h4>
              <p className="text-xs text-gray-500">
                Click any coupon button above to save code (e.g. ARAVEZ20) to your clipboard.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-none bg-emerald-100 text-emerald-800 font-extrabold text-lg flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="font-bold text-base text-gray-900">Add to Bag</h4>
              <p className="text-xs text-gray-500">
                Choose your desired botanical remedies and ensure minimum spend is met.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-none bg-emerald-100 text-emerald-800 font-extrabold text-lg flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="font-bold text-base text-gray-900">Instant Discount</h4>
              <p className="text-xs text-gray-500">
                Paste the code into your Bag drawer to unlock instant savings & free delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Offers;
