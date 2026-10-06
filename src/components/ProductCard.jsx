import React from 'react';
import { Eye, Heart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct, cart } = useCart();
  const isWishlisted = isInWishlist(product._id);
  const isInBag = cart.some((item) => item._id === product._id);

  const discountPercent = product.discountPrice && product.price
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const subtitleText = product.tagline || (product.features && product.features.slice(0, 2).join(' | ')) || `${product.category} Commercial Solution`;

  return (
    <div className="group bg-white rounded-none border border-gray-200/90 hover:border-gray-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden h-full p-3.5 sm:p-4">
      {/* Top Floating Badges & Wishlist */}
      <div className="flex items-center justify-between w-full mb-1 z-10">
        <div>
          {product.isBestSeller && (
            <span className="bg-[#1d1d1d] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-none shadow-xs uppercase tracking-wider">
              Best Seller
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`w-7 h-7 rounded-none border transition-all duration-200 shadow-xs flex items-center justify-center cursor-pointer ${
            isWishlisted
              ? 'bg-red-50 border-red-200 text-[#ea0028]'
              : 'bg-white/90 backdrop-blur-xs border-gray-200/80 text-gray-400 hover:text-[#ea0028] hover:bg-white'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#ea0028]' : ''}`} />
        </button>
      </div>

      {/* Product Image Area */}
      <div
        className="relative aspect-[4/3.2] w-full overflow-hidden cursor-pointer flex items-center justify-center mb-2"
        onClick={() => setQuickViewProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="bg-[#1d1d1d] hover:bg-[#ea0028] text-white text-[11px] font-bold px-3 py-1.5 rounded-none shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3
        onClick={() => setQuickViewProduct(product)}
        title={product.name}
        className="font-semibold text-[#1d1d1d] text-sm sm:text-[15px] uppercase font-mont tracking-normal line-clamp-1 hover:text-[#ea0028] transition-colors cursor-pointer mb-1"
      >
        {product.name}
      </h3>

      {/* Subtitle / Feature Line */}
      <p className="text-xs text-gray-500 line-clamp-1 mb-2.5 font-normal">
        {subtitleText}
      </p>

      {/* Price & Discount Pill Row */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base sm:text-lg font-semibold text-[#1d1d1d] font-mont">
            ₹{Number(product.discountPrice || product.price).toLocaleString('en-IN')}
          </span>
          {product.discountPrice && (
            <span className="text-[11px] sm:text-xs text-gray-400 line-through font-normal">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Portronics Red % OFF Pill */}
        {discountPercent > 0 && (
          <div className="bg-[#ea0028] text-white text-[10px] font-bold px-2 py-0.5 rounded-none border border-[#ea0028] shadow-xs tracking-wider shrink-0">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Full-width Aravez Red ADD TO CART Button */}
      <button
        onClick={() => addToCart(product, 1)}
        className={`w-full py-3 px-4 rounded-none text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-auto ${
          isInBag
            ? 'bg-[#1d1d1d] hover:bg-black text-white'
            : 'bg-[#ea0028] hover:bg-[#cc0020] text-white hover:shadow-md active:scale-98'
        }`}
        aria-label="Add to cart"
      >
        {isInBag ? (
          <>
            <Check className="w-4 h-4" />
            <span>ADDED TO CART</span>
          </>
        ) : (
          <span>ADD TO CART</span>
        )}
      </button>
    </div>
  );
};

export default ProductCard;
