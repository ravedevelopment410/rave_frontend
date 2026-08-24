import React from 'react';
import { Star, ShoppingBag, Eye, Heart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct, cart } = useCart();
  const isWishlisted = isInWishlist(product._id);
  const isInBag = cart.some(item => item._id === product._id);

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-3xl border border-emerald-100/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col relative">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs tracking-wide">
            {discountPercent}% OFF
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-500 text-amber-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
            Best Seller
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm ${
          isWishlisted
            ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
            : 'bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white'
        }`}
        aria-label="Toggle Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50/80 cursor-pointer p-3 flex items-center justify-center" onClick={() => setQuickViewProduct(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out drop-shadow-sm"
          loading="lazy"
        />

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="bg-white/95 hover:bg-white text-emerald-950 text-xs font-semibold px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span className="text-emerald-700 font-semibold tracking-wider uppercase text-[10px]">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-700 text-xs">{product.rating}</span>
            <span className="text-gray-400 text-[11px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Name */}
        <h3
          onClick={() => setQuickViewProduct(product)}
          className="font-serif font-bold text-gray-900 text-base leading-snug line-clamp-2 hover:text-emerald-700 transition-colors cursor-pointer mb-1"
        >
          {product.name}
        </h3>

        {/* Tagline / Subtitle */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
          {product.tagline || product.description}
        </p>

        {/* Price and Add-To-Bag Action */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-emerald-950">
                ₹{Number(product.discountPrice || product.price).toLocaleString('en-IN')}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 block">{product.volume || 'Standard'}</span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className={`p-2.5 rounded-2xl transition-all duration-200 shadow-sm flex items-center justify-center ${
              isInBag
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-800/20 hover:scale-105 active:scale-95'
            }`}
            aria-label="Add to cart"
          >
            {isInBag ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
