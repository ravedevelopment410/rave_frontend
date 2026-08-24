import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, Check, Shield, Sparkles, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
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
      `Hello Aravez! 🌿 I would like to order: ${product.name} (Qty: ${quantity}, Price: ₹${(activePrice * quantity).toLocaleString('en-IN')})`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-emerald-100 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-emerald-900 shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Main Image & Multi-Angle Thumbnails Gallery */}
        <div className="md:w-1/2 p-6 bg-emerald-50/40 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-emerald-100/60">
          
          {/* Main Active Image View */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-emerald-100 group p-4 flex items-center justify-center">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-contain transition-all duration-300 drop-shadow-sm"
            />

            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}

            {/* Prev / Next Image Overlay Buttons if multiple images exist */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev + 1) % productImages.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Multi-Image Thumbnails Bar (Up to 8+ direction images) */}
          {productImages.length > 1 && (
            <div className="w-full pt-4 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-1">
                <span>Multi-Angle Views ({productImages.length} Photos):</span>
                <span className="text-emerald-700 font-semibold">{activeImageIndex + 1} / {productImages.length}</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-500/40 scale-105 shadow-sm'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain p-1 bg-white" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right: Product Details & Pricing */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-gray-800">{product.rating}</span>
                <span className="text-gray-400 text-xs">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl font-bold text-gray-900 leading-snug mb-2">
              {product.name}
            </h2>

            {/* Price (In Rupees ₹) */}
            <div className="flex items-baseline gap-3 my-3">
              <span className="text-3xl font-extrabold text-emerald-950">
                ₹{Number(activePrice).toLocaleString('en-IN')}
              </span>
              {product.discountPrice && (
                <span className="text-base text-gray-400 line-through">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Save {discountPercent}%
                </span>
              )}
              <span className="text-xs text-gray-500 ml-auto bg-gray-100 px-2 py-1 rounded font-semibold">
                {product.volume || '1 Unit'}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Features list */}
            {product.features && (
              <div className="space-y-1.5 mb-6">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-1">
                  Key Product Highlights:
                </span>
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-200 rounded-2xl bg-gray-50/80 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 shadow-xs"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 shadow-xs"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddAndClose}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-2xl shadow-lg shadow-emerald-800/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag • ₹{(activePrice * quantity).toLocaleString('en-IN')}</span>
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-2xl border transition-colors ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-500'
                    : 'border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Direct WhatsApp Order */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-emerald-200 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Instant Order via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
