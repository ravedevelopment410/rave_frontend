import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { api } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aravez_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('aravez_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('aravez_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('aravez_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aravez_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('aravez_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('aravez_coupon');
    }
  }, [appliedCoupon]);

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    addToast(`Added "${product.name}" to your bag! 🌿`, 'success');
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
    addToast('Item removed from your bag', 'info');
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item._id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item._id === product._id);
      if (exists) {
        addToast(`Removed "${product.name}" from Wishlist`, 'info');
        return prev.filter(item => item._id !== product._id);
      } else {
        addToast(`Added "${product.name}" to your Wishlist ❤️`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (id) => wishlist.some(item => item._id === id);

  // Coupon application
  const applyCouponCode = async (code) => {
    try {
      const res = await api.validateCoupon(code, rawSubtotal);
      if (res.success) {
        setAppliedCoupon(res.coupon);
        addToast(res.message, 'success');
        return { success: true };
      }
    } catch (err) {
      addToast(err.message || 'Invalid coupon code', 'error');
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon code removed', 'info');
  };

  // Financial Calculations
  const rawSubtotal = cart.reduce((total, item) => {
    const activePrice = item.discountPrice || item.price;
    return total + activePrice * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon
    ? (rawSubtotal * appliedCoupon.discountPercent) / 100
    : 0;

  const isFreeShipping = rawSubtotal >= 50 || appliedCoupon?.code === 'FREESHIP';
  const shippingFee = cart.length === 0 || isFreeShipping ? 0 : 5.99;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount + shippingFee);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        appliedCoupon,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCouponCode,
        removeCoupon,
        rawSubtotal,
        discountAmount,
        shippingFee,
        isFreeShipping,
        finalTotal,
        totalCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
