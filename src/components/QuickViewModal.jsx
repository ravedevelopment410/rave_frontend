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
    if (quickViewProduct?.features && quickViewProduct.features.length > 0) {
      setActiveTab('features');
    } else if (quickViewProduct?.specifications) {
      setActiveTab('specs');
    } else {
      setActiveTab('features');
    }
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
      <div className="sticky top-0 z-30 bg-[#1d1d1d] text-white px-6 py-4 shadow-xl border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuickViewProduct(null)}
            className="p-2.5 rounded-none bg-[#2a2a2a] hover:bg-[#ea0028] text-gray-200 hover:text-white transition-all flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
          <div className="h-6 w-[1px] bg-gray-700" />
          <div className="hidden sm:block">
            <span className="text-xs font-bold uppercase tracking-wider text-white bg-[#ea0028] px-2.5 py-1 rounded-none">
              {product.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-none bg-[#2a2a2a] hover:bg-[#ea0028] text-gray-200 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Share Product"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => toggleWishlist(product)}
            className={`p-2.5 rounded-none border transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              isWishlisted
                ? 'bg-[#ea0028] text-white border-[#ea0028]'
                : 'bg-[#2a2a2a] text-gray-200 border-gray-700 hover:bg-[#ea0028] hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            <span className="hidden sm:inline">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
          </button>

          <button
            onClick={() => setQuickViewProduct(null)}
            className="p-2 rounded-none bg-[#2a2a2a] hover:bg-[#ea0028] text-white transition-colors cursor-pointer"
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
          <div className="lg:col-span-6 bg-white rounded-none p-6 border border-slate-200/90 shadow-sm space-y-4">
            
            {/* Big Main Active Photo Container */}
            <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-none overflow-hidden bg-slate-50 border border-slate-200/80 group p-6 flex items-center justify-center">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain transition-all duration-300 drop-shadow-md group-hover:scale-105"
              />

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-[#ea0028] text-white text-xs font-bold px-3.5 py-1 rounded-none shadow-md tracking-wider">
                  {discountPercent}% OFF
                </span>
              )}

              {product.isBestSeller && (
                <span className="absolute top-4 right-4 bg-[#1d1d1d] text-white text-xs font-black px-3 py-1 rounded-none shadow-md uppercase tracking-wider">
                  Best Seller
                </span>
              )}

              {/* Prev / Next Image Navigation Overlay Buttons */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-none bg-white/90 hover:bg-white text-slate-800 shadow-lg opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % productImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-none bg-white/90 hover:bg-white text-slate-800 shadow-lg opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
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
                  <span className="text-[#ea0028] font-semibold">{activeImageIndex + 1} of {productImages.length}</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-1">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`aspect-square rounded-none overflow-hidden border-2 transition-all p-1 bg-slate-50 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#ea0028] ring-2 ring-red-200 scale-105 shadow-sm'
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
            <div className="bg-white rounded-none p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#ea0028] bg-red-50 px-3 py-1 rounded-none">
                  {product.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
                {product.name}
              </h1>

              {/* Price & Commercial Quotation Box */}
              <div className="p-5 bg-[#1d1d1d] text-white rounded-none shadow-md space-y-2 border border-gray-800">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Commercial Price Quotation (GST Included)
                </span>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    ₹{Number(activePrice).toLocaleString('en-IN')}
                  </span>
                  {product.discountPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-extrabold text-white bg-[#ea0028] px-3 py-1 rounded-none">
                      Save ₹{(Number(product.price) - Number(activePrice)).toLocaleString('en-IN')} ({discountPercent}% OFF)
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-end text-xs text-gray-300 pt-1 border-t border-gray-700">
                  <span className="text-[#ea0028] font-bold">✓ In Stock & Ready to Ship</span>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Product Overview:
                </span>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal whitespace-pre-line">
                  {product.description}
                </p>
              </div>

            </div>

            {/* Commercial Purchase Action Bar */}
            <div className="bg-white rounded-none p-6 border border-gray-200 shadow-sm space-y-4">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Select Quantity & Proceed to Order:
              </span>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Quantity Counter */}
                <div className="flex items-center justify-between border-2 border-gray-200 rounded-none bg-gray-50 p-1.5 sm:w-36">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-none bg-white hover:bg-gray-200 text-gray-800 font-bold text-lg shadow-xs flex items-center justify-center cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="text-base font-extrabold text-gray-900 px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-none bg-white hover:bg-gray-200 text-gray-800 font-bold text-lg shadow-xs flex items-center justify-center cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart / Secure Checkout Button */}
                <button
                  onClick={handleAddAndClose}
                  className="flex-1 bg-[#ea0028] hover:bg-[#cc0020] text-white font-bold py-3.5 px-6 rounded-none shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Bag • ₹{(activePrice * quantity).toLocaleString('en-IN')}</span>
                </button>
              </div>

              {/* Instant WhatsApp Order / Inquiry */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-red-50 hover:bg-red-100 text-[#1d1d1d] text-xs font-bold py-3 px-4 rounded-none flex items-center justify-center gap-2 border border-red-200 transition-colors shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4.5 h-4.5 text-[#ea0028]" />
                <span>Instant Inquiry & Order via WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

        {/* Interactive Bottom Tabs Card for Features & Technical Specifications */}
        {((product.features && product.features.length > 0) || product.specifications) && (
          <div className="bg-white rounded-none p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            
            {/* Tab Selector Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4 overflow-x-auto no-scrollbar">
              {product.features && product.features.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('features')}
                  className={`px-6 py-3 rounded-none text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'features'
                      ? 'bg-[#1d1d1d] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#ea0028]" />
                  <span>Key Features & Highlights</span>
                </button>
              )}

              {product.specifications && (
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`px-6 py-3 rounded-none text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'specs'
                      ? 'bg-[#1d1d1d] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Shield className="w-4 h-4 text-[#ea0028]" />
                  <span>Technical Specifications</span>
                </button>
              )}
            </div>

            {/* Tab Panel Content */}
            <div className="animate-fade-in pt-1">
              {activeTab === 'features' && product.features && product.features.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h4 className="font-bold text-base text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#ea0028]" />
                      <span>Product Key Features & Highlights</span>
                    </h4>
                    <span className="text-[11px] font-bold text-[#ea0028] bg-red-50 px-2.5 py-1 rounded-none border border-red-100">
                      {product.features.length} Highlights
                    </span>
                  </div>

                  <div className="flex flex-col divide-y divide-gray-100 border border-gray-200 bg-white">
                    {product.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 sm:p-4 text-xs sm:text-sm text-gray-800 hover:bg-red-50/20 transition-colors"
                      >
                        <div className="w-5 h-5 rounded-none bg-red-50 text-[#ea0028] flex items-center justify-center shrink-0 mt-0.5 border border-red-100">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium leading-relaxed flex-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'specs' && product.specifications && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h4 className="font-bold text-base text-gray-900 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#ea0028]" />
                      <span>Technical Specifications & Parameters</span>
                    </h4>
                    <span className="text-[11px] font-bold text-[#ea0028] bg-red-50 px-3 py-1 rounded-none border border-red-100">
                      ✓ Commercial Grade AV
                    </span>
                  </div>

                  <div className="border border-gray-200 overflow-hidden bg-white">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <tbody className="divide-y divide-gray-200">
                        {(typeof product.specifications === 'string'
                          ? product.specifications.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
                          : Array.isArray(product.specifications) ? product.specifications : [product.specifications]
                        ).map((spec, idx) => {
                          const hasColon = typeof spec === 'string' && spec.includes(':');
                          if (hasColon) {
                            const colonIdx = spec.indexOf(':');
                            const k = spec.substring(0, colonIdx).trim();
                            const v = spec.substring(colonIdx + 1).trim();
                            return (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/70 hover:bg-red-50/20 transition-colors' : 'bg-white hover:bg-red-50/20 transition-colors'}>
                                <td className="py-3 px-4 sm:px-6 font-bold text-gray-700 w-1/3 sm:w-1/4 border-r border-gray-200 align-top">
                                  {k}
                                </td>
                                <td className="py-3 px-4 sm:px-6 font-medium text-gray-900 align-top">
                                  {v}
                                </td>
                              </tr>
                            );
                          }
                          return (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/70 hover:bg-red-50/20 transition-colors' : 'bg-white hover:bg-red-50/20 transition-colors'}>
                              <td colSpan="2" className="py-3 px-4 sm:px-6 font-medium text-gray-900">
                                <div className="flex items-start gap-2.5">
                                  <Check className="w-4 h-4 text-[#ea0028] shrink-0 mt-0.5" />
                                  <span>{spec}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
