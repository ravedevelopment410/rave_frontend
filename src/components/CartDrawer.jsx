import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, MessageCircle, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import CheckoutModal from './CheckoutModal';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    rawSubtotal,
    discountAmount,
    shippingFee,
    isFreeShipping,
    finalTotal,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 50;
  const progressToFreeShip = Math.min(100, (rawSubtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShip = Math.max(0, freeShippingThreshold - rawSubtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCouponCode(couponInput.trim());
    setCouponLoading(false);
    setCouponInput('');
  };

  const handleSimulateCheckout = () => {
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      clearCart();
      setShowCheckoutSuccess(false);
      setIsCartOpen(false);
    }, 2800);
  };

  const handleWhatsAppCheckout = () => {
    const itemsText = cart
      .map(item => `• ${item.name} x${item.quantity} ($${((item.discountPrice || item.price) * item.quantity).toFixed(2)})`)
      .join('\n');

    const message = encodeURIComponent(
      `🖥️ *New Order Inquiry for Aravez (Rave Services)*\n\n` +
      `*Items:*\n${itemsText}\n\n` +
      `*Subtotal:* $${rawSubtotal.toFixed(2)}\n` +
      (appliedCoupon ? `*Discount (${appliedCoupon.code}):* -$${discountAmount.toFixed(2)}\n` : '') +
      `*Shipping:* ${shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}\n` +
      `*Total Payable:* $${finalTotal.toFixed(2)}\n\n` +
      `Please confirm my order and shipping details!`
    );

    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between relative">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#ea0028]" />
              <h2 className="text-lg font-bold text-[#1d1d1d]">Your Shopping Bag</h2>
              <span className="bg-[#ea0028] text-white text-xs font-extrabold px-2 py-0.5 rounded-none">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-none hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-none bg-red-50 text-[#ea0028] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Your bag is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Explore our high-performance Interactive Panels, Projectors, Toughbook, Active LEDs, and VC Systems.
                </p>
                <Link
                  to="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#1d1d1d] hover:bg-[#ea0028] text-white text-xs font-bold px-6 py-3 rounded-none transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Explore Aravez Store</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const price = item.discountPrice || item.price;
                  return (
                    <div key={item._id} className="pt-4 first:pt-0 flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-none border border-gray-200 bg-gray-50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-[#ea0028] block">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-[#1d1d1d]">
                            ₹{Number(price).toLocaleString('en-IN')}
                          </span>
                          {item.discountPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{Number(item.price).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controller */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-gray-200 rounded-none bg-gray-50">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-[#ea0028] font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-[#ea0028] font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-400 hover:text-[#ea0028] transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50/50 space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{rawSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#ea0028] font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? 'text-[#ea0028] font-semibold' : 'text-gray-800'}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#1d1d1d] font-extrabold">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutModalOpen(true);
                  }}
                  className="w-full bg-[#1d1d1d] hover:bg-[#ea0028] text-white font-bold py-3.5 px-4 rounded-none shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Interactive Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </div>
  );
};

export default CartDrawer;
