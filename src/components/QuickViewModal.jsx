import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, Check, Shield, Sparkles, MessageCircle, ChevronLeft, ChevronRight, Share2, ArrowLeft, Truck, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';

const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('features');

  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setActiveTab('features');
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = isInWishlist(product._id);
  const activePrice = product.discountPrice || product.price;

  // Extract all images array (fallback to main product.image)
  const productImages = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : []);

  const currentImage = productImages[activeImageIndex] || product.image;

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddAndClose = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello Aravez! 📺 I would like to inquire/order: ${product.name} (Qty: ${quantity}, Total Price: ₹${(activePrice * quantity).toLocaleString('en-IN')})`
    );
    window.open(`https://wa.me/919814903739?text=${text}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Aravez Commercial AV!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100/95 backdrop-blur-md overflow-y-auto animate-fade-in flex flex-col min-h-screen">
      
      {/* Top Fixed Header Bar */}
      <div className="sticky top-0 z-30 bg-emerald-950 text-white px-6 py-4 shadow-xl border-b border-emerald-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuickViewProduct(null)}
            className="p-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-all flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
          <div className="h-6 w-[1px] bg-emerald-800" />
          <div className="hidden sm:block">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-2.5 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Share Product"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => toggleWishlist(product)}
            className={`p-2.5 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              isWishlisted
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-emerald-900/80 text-emerald-200 border-emerald-800 hover:bg-emerald-800 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            <span className="hidden sm:inline">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
          </button>

          <button
            onClick={() => setQuickViewProduct(null)}
            className="p-2 rounded-xl bg-emerald-900/80 hover:bg-rose-700 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Full-Page Product Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Span 6): Full-Size Product Gallery & Multi-Angle Thumbnails */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            
            {/* Big Main Active Photo Container */}
            <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 group p-6 flex items-center justify-center">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain transition-all duration-300 drop-shadow-md group-hover:scale-105"
              />

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-md tracking-wider">
                  {discountPercent}% OFF
                </span>
              )}

              {product.isBestSeller && (
                <span className="absolute top-4 right-4 bg-amber-500 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  ★ Best Seller
                </span>
              )}

              {/* Prev / Next Image Navigation Overlay Buttons */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg opacity-80 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % productImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg opacity-80 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Multi-Angle Thumbnails Gallery Bar */}
            {productImages.length > 1 && (
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                  <span>Multi-Angle Photos Gallery ({productImages.length} Views):</span>
                  <span className="text-emerald-700 font-semibold">{activeImageIndex + 1} of {productImages.length}</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-1">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all p-1 bg-slate-50 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-500/50 scale-105 shadow-sm'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (Span 6): Detailed Specifications & Action Section */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                  {product.category}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {product.name}
              </h1>

              {/* Price & Commercial Quotation Box */}
              <div className="p-5 bg-gradient-to-r from-emerald-950 to-teal-900 text-white rounded-2xl shadow-md space-y-2">
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                  Commercial Price Quotation (GST Included)
                </span>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    ₹{Number(activePrice).toLocaleString('en-IN')}
                  </span>
                  {product.discountPrice && (
                    <span className="text-lg text-emerald-200/60 line-through">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-extrabold text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-300/30">
                      Save ₹{(Number(product.price) - Number(activePrice)).toLocaleString('en-IN')} ({discountPercent}% OFF)
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-end text-xs text-emerald-200 pt-1 border-t border-emerald-800/80">
                  <span className="text-emerald-400 font-semibold">✓ In Stock & Ready to Ship</span>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Product Overview:
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {product.description}
                </p>
              </div>

            </div>

            {/* Commercial Purchase Action Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-lg space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Select Quantity & Proceed to Order:
              </span>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Quantity Counter */}
                <div className="flex items-center justify-between border-2 border-slate-200 rounded-2xl bg-slate-50 p-1.5 sm:w-36">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-200 text-slate-800 font-black text-lg shadow-xs flex items-center justify-center cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="text-base font-extrabold text-slate-900 px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-200 text-slate-800 font-black text-lg shadow-xs flex items-center justify-center cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart / Secure Checkout Button */}
                <button
                  onClick={handleAddAndClose}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Bag • ₹{(activePrice * quantity).toLocaleString('en-IN')}</span>
                </button>
              </div>

              {/* Instant WhatsApp Order / Inquiry */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 border border-emerald-300 transition-colors shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4.5 h-4.5 text-emerald-700" />
                <span>Instant Inquiry & Order via WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

        {/* Interactive Bottom Tabs Card for Features & Technical Specifications */}
        {((product.features && product.features.length > 0) || product.specifications) && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            
            {/* Tab Selector Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4 overflow-x-auto no-scrollbar">
              {product.features && product.features.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('features')}
                  className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'features'
                      ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-950/20 scale-102'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Key Features & Highlights</span>
                </button>
              )}

              {product.specifications && (
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'specs'
                      ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-950/20 scale-102'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Technical Specifications</span>
                </button>
              )}
            </div>

            {/* Tab Panel Content */}
            <div className="animate-fade-in pt-1">
              {activeTab === 'features' && product.features && product.features.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-base text-slate-900">
                    Product Key Features & Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100/80">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'specs' && product.specifications && (
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-base text-slate-900">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(typeof product.specifications === 'string'
                      ? product.specifications.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
                      : Array.isArray(product.specifications) ? product.specifications : [product.specifications]
                    ).map((spec, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100/80">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default QuickViewModal;
