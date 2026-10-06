const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://rave-backend-0vqv.onrender.com/api';

// Rich Hero Banner Sliders for Aravez Home Page
let FALLBACK_SLIDERS = [];

let FALLBACK_PRODUCTS = [];

let FALLBACK_OFFERS = [
  {
    _id: 'aravez-offer-1',
    title: 'Grand Welcome Deal',
    subtitle: 'Flat 20% OFF on your very first Aravez order',
    badge: 'NEW CUSTOMER',
    couponCode: 'ARAVEZ20',
    discountPercent: 20,
    minSpend: 40,
    validTill: 'Valid all year',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'Experience natural botanical luxury. Use code ARAVEZ20 at checkout on orders above $40.',
    isActive: true,
    accentColor: 'emerald',
  },
  {
    _id: 'aravez-offer-2',
    title: 'Green Glow Botanical Bundle',
    subtitle: 'Save 30% when you buy Serum & Clay Mask together',
    badge: 'BEST VALUE',
    couponCode: 'GLOW30',
    discountPercent: 30,
    minSpend: 60,
    validTill: 'Limited Time',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    description: 'Get our award-winning Serum + Matcha Purifying Mask bundle and unlock glowing skin naturally.',
    isActive: true,
    accentColor: 'teal',
  },
  {
    _id: 'aravez-offer-3',
    title: 'Earth Day Wellness Super Saver',
    subtitle: 'Flat 15% OFF across all Organic Herbal Teas & Tinctures',
    badge: 'HERBAL SPECIAL',
    couponCode: 'EARTH15',
    discountPercent: 15,
    minSpend: 30,
    validTill: 'Seasonal Offer',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    description: 'Nourish your wellness rituals with hand-picked herbal tea blends and organic elixirs.',
    isActive: true,
    accentColor: 'green',
  },
  {
    _id: 'aravez-offer-4',
    title: 'Free Worldwide Eco Shipping',
    subtitle: 'Complimentary carbon-neutral express shipping on orders over $50',
    badge: 'FREE DELIVERY',
    couponCode: 'FREESHIP',
    discountPercent: 10,
    minSpend: 50,
    validTill: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1608248597359-009a25b6a716?auto=format&fit=crop&w=800&q=80',
    description: 'Enjoy 100% plastic-free, carbon-neutral shipping straight to your doorstep without extra charges.',
    isActive: true,
    accentColor: 'emerald',
  },
];

let FALLBACK_CONTACTS = [];

let FALLBACK_SUBSCRIBERS = [];

let FALLBACK_REVIEWS = [];

const getStoredCustomReviews = () => {
  try {
    const raw = localStorage.getItem('aravez_custom_reviews');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveStoredCustomReview = (newReview) => {
  try {
    const existing = getStoredCustomReviews();
    const updated = [newReview, ...existing.filter(r => r._id !== newReview._id)];
    localStorage.setItem('aravez_custom_reviews', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom review to localStorage:', e);
  }
};

const removeStoredCustomReview = (id) => {
  try {
    const existing = getStoredCustomReviews();
    const updated = existing.filter(r => r._id !== id);
    localStorage.setItem('aravez_custom_reviews', JSON.stringify(updated));
  } catch (e) {}
};

const getDeletedReviewIds = () => {
  try {
    const raw = localStorage.getItem('aravez_deleted_reviews');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const trackDeletedReviewId = (id) => {
  try {
    const existing = getDeletedReviewIds();
    if (!existing.includes(id)) {
      localStorage.setItem('aravez_deleted_reviews', JSON.stringify([...existing, id]));
    }
  } catch (e) {}
};

const getStoredCustomProducts = () => {
  try {
    const raw = localStorage.getItem('aravez_custom_products');
    if (!raw) return [];
    const list = JSON.parse(raw);
    return list.map(p => {
      let cat = p.category;
      if (cat && (cat.toLowerCase() === 'projecters' || cat.toLowerCase() === 'projector')) {
        cat = 'Projectors';
      } else if (cat && (cat.toLowerCase() === 'touchbooks' || cat.toLowerCase() === 'touchbook')) {
        cat = 'Toughbook';
      }
      return { ...p, category: cat };
    });
  } catch (e) {
    return [];
  }
};

const saveStoredCustomProduct = (newProduct) => {
  try {
    const existing = getStoredCustomProducts();
    const updated = [newProduct, ...existing.filter(p => p._id !== newProduct._id)];
    localStorage.setItem('aravez_custom_products', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom product to localStorage:', e);
  }
};

const getStoredCustomSliders = () => {
  try {
    const raw = localStorage.getItem('aravez_custom_sliders');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveStoredCustomSlider = (newSlider) => {
  try {
    const existing = getStoredCustomSliders();
    const updated = [newSlider, ...existing.filter(s => s._id !== newSlider._id)];
    localStorage.setItem('aravez_custom_sliders', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom slider to localStorage:', e);
  }
};

const removeStoredCustomSlider = (id) => {
  try {
    const existing = getStoredCustomSliders();
    const updated = existing.filter(s => s._id !== id);
    localStorage.setItem('aravez_custom_sliders', JSON.stringify(updated));
  } catch (e) {}
};

const getDeletedSliderIds = () => {
  try {
    const raw = localStorage.getItem('aravez_deleted_sliders');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const trackDeletedSliderId = (id) => {
  try {
    const existing = getDeletedSliderIds();
    if (!existing.includes(id)) {
      localStorage.setItem('aravez_deleted_sliders', JSON.stringify([...existing, id]));
    }
  } catch (e) {}
};

export const api = {
  // Products
  async getProducts(params = {}) {
    let list = [];
    try {
      const cleanParams = {};
      if (params && typeof params === 'object') {
        Object.keys(params).forEach(k => {
          const val = params[k];
          if (val !== undefined && val !== null && val !== '' && val !== 'undefined' && val !== 'null') {
            cleanParams[k] = val;
          }
        });
      }
      const query = new URLSearchParams(cleanParams).toString();
      const url = query ? `${API_BASE}/products?${query}` : `${API_BASE}/products`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      list = data.data || [];
    } catch (err) {
      console.warn('Using offline product fallback data:', err.message);
      list = [...FALLBACK_PRODUCTS];
    }

    // Merge custom products saved via Admin (always place custom uploaded products FIRST at the top)
    const customStored = getStoredCustomProducts();
    const customStoredMap = new Map(customStored.map(p => [p._id, p]));
    // Merge any updated fields from customStored into backend list
    const enrichedList = list.map(p => (customStoredMap.has(p._id) ? { ...p, ...customStoredMap.get(p._id) } : p));
    const nonCustomList = enrichedList.filter(p => !customStoredMap.has(p._id));
    list = [...customStored, ...nonCustomList];

    if (params.category && params.category !== 'All' && params.category !== 'All Products') {
      const qCat = params.category.toLowerCase();
      list = list.filter(p => {
        if (!p.category) return false;
        const pCat = p.category.toLowerCase();
        if (qCat === 'projectors' || qCat === 'projecters' || qCat === 'projector') {
          return pCat === 'projectors' || pCat === 'projecters' || pCat === 'projector';
        }
        if (qCat === 'toughbook' || qCat === 'touchbook' || qCat === 'touchbooks' || qCat === 'toughbooks') {
          return pCat === 'toughbook' || pCat === 'touchbook' || pCat === 'touchbooks' || pCat === 'toughbooks';
        }
        return pCat === qCat;
      });
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }
    if (params.minPrice) list = list.filter(p => p.price >= Number(params.minPrice));
    if (params.maxPrice) list = list.filter(p => p.price <= Number(params.maxPrice));
    if (params.featured === 'true') list = list.filter(p => p.isFeatured);
    if (params.bestSeller === 'true') list = list.filter(p => p.isBestSeller);
    if (params.sort === 'price-low') list.sort((a, b) => a.price - b.price);
    if (params.sort === 'price-high') list.sort((a, b) => b.price - a.price);
    if (params.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (params.sort === 'popular') list.sort((a, b) => b.reviewsCount - a.reviewsCount);

    return list;
  },

  async getProductById(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      const customStored = getStoredCustomProducts();
      const customMatch = customStored.find(p => p._id === id);
      return customMatch ? { ...data.data, ...customMatch } : data.data;
    } catch (err) {
      const customStored = getStoredCustomProducts();
      return customStored.find(p => p._id === id) || FALLBACK_PRODUCTS.find(p => p._id === id) || FALLBACK_PRODUCTS[0];
    }
  },

  async createProduct(productData) {
    let createdProd = null;
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        createdProd = data.data;
      }
    } catch (err) {
      console.warn('Backend create product fallback:', err.message);
    }

    const mergedProd = { ...productData, ...(createdProd || {}), _id: createdProd?._id || `aravez-prod-${Date.now()}` };
    FALLBACK_PRODUCTS = [mergedProd, ...FALLBACK_PRODUCTS.filter(p => p._id !== mergedProd._id)];
    saveStoredCustomProduct(mergedProd);
    window.dispatchEvent(new Event('aravez_catalog_updated'));
    return mergedProd;
  },

  async updateProduct(id, productData) {
    let updatedProd = null;
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        updatedProd = data.data;
      }
    } catch (err) {
      console.warn('Backend update product fallback:', err.message);
    }

    const mergedProd = { ...productData, ...(updatedProd || {}), _id: id };
    const idx = FALLBACK_PRODUCTS.findIndex(p => p._id === id);
    if (idx !== -1) {
      FALLBACK_PRODUCTS[idx] = { ...FALLBACK_PRODUCTS[idx], ...mergedProd };
    } else {
      FALLBACK_PRODUCTS.unshift(mergedProd);
    }

    saveStoredCustomProduct(mergedProd);
    window.dispatchEvent(new Event('aravez_catalog_updated'));
    return mergedProd;
  },

  async deleteProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete product');
    } catch (err) {
      console.warn('Backend delete fallback:', err.message);
    }
    FALLBACK_PRODUCTS = FALLBACK_PRODUCTS.filter(p => p._id !== id);
    try {
      const existing = getStoredCustomProducts().filter(p => p._id !== id);
      localStorage.setItem('aravez_custom_products', JSON.stringify(existing));
    } catch (e) {}
    return { success: true, message: 'Deleted successfully' };
  },

  // Offers
  async getOffers() {
    try {
      const res = await fetch(`${API_BASE}/offers`);
      if (!res.ok) throw new Error('Failed to fetch offers');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return FALLBACK_OFFERS;
    }
  },

  async createOffer(offerData) {
    try {
      const res = await fetch(`${API_BASE}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create offer');
      return data.data;
    } catch (err) {
      const newOff = { ...offerData, _id: `aravez-offer-${Date.now()}` };
      FALLBACK_OFFERS.unshift(newOff);
      return newOff;
    }
  },

  async deleteOffer(id) {
    try {
      const res = await fetch(`${API_BASE}/offers/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete offer');
      return data;
    } catch (err) {
      FALLBACK_OFFERS = FALLBACK_OFFERS.filter(o => o._id !== id);
      return { success: true, message: 'Offer deleted' };
    }
  },

  async validateCoupon(code, cartTotal = 0) {
    try {
      const res = await fetch(`${API_BASE}/offers/validate-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid coupon');
      return data;
    } catch (err) {
      const norm = (code || '').trim().toUpperCase();
      const match = FALLBACK_OFFERS.find(o => o.couponCode === norm);
      if (!match) throw new Error(err.message || 'Coupon code not recognized');
      if (cartTotal < match.minSpend) {
        throw new Error(`Minimum spend of $${match.minSpend} required for coupon ${match.couponCode}`);
      }
      return {
        success: true,
        message: `Coupon "${match.couponCode}" applied successfully!`,
        coupon: {
          code: match.couponCode,
          discountPercent: match.discountPercent,
          discountAmount: (cartTotal * match.discountPercent) / 100,
        },
      };
    }
  },

  // Contact
  async getContacts() {
    try {
      const res = await fetch(`${API_BASE}/contact`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return FALLBACK_CONTACTS;
    }
  },

  async submitContact(formData) {
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send message');
      return data;
    } catch (err) {
      FALLBACK_CONTACTS.unshift({ ...formData, _id: `contact-${Date.now()}`, createdAt: new Date().toISOString() });
      return {
        success: true,
        message: `Thank you, ${formData.name}! Your message has been received. Our Aravez care team will contact you shortly.`,
      };
    }
  },

  async deleteContact(id) {
    try {
      const res = await fetch(`${API_BASE}/contact/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete message');
      return data;
    } catch (err) {
      FALLBACK_CONTACTS = FALLBACK_CONTACTS.filter(c => c._id !== id);
      return { success: true };
    }
  },

  // Newsletter
  async getSubscribers() {
    try {
      const res = await fetch(`${API_BASE}/newsletter`);
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return FALLBACK_SUBSCRIBERS;
    }
  },

  async subscribeNewsletter(email) {
    try {
      const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Subscription failed');
      return data;
    } catch (err) {
      FALLBACK_SUBSCRIBERS.unshift({ _id: `sub-${Date.now()}`, email, createdAt: new Date().toISOString() });
      return {
        success: true,
        message: 'Welcome to the Aravez Inner Circle! Use coupon ARAVEZ20 on your first order.',
      };
    }
  },

  // Hero Sliders
  async getSliders() {
    let list = [];
    try {
      const res = await fetch(`${API_BASE}/sliders`);
      if (res.ok) {
        const data = await res.json();
        list = data.data || [];
      }
    } catch (err) {
      list = [...FALLBACK_SLIDERS];
    }

    // Merge custom uploaded sliders saved in localStorage (always place custom uploaded sliders FIRST at the top)
    const customStored = getStoredCustomSliders();
    const customStoredIds = new Set(customStored.map(s => s._id));
    const nonCustomList = list.filter(s => !customStoredIds.has(s._id));
    list = [...customStored, ...nonCustomList];

    // Filter out deleted sliders (by ID and by image URL)
    const deletedIds = new Set(getDeletedSliderIds());
    list = list.filter(s => !deletedIds.has(s._id) && !deletedIds.has(s.image));

    return list;
  },

  async createSlider(sliderData) {
    let createdSlide = null;
    const payload = {
      title: sliderData.title || 'Banner Slide',
      subtitle: sliderData.subtitle || 'Aravez Commercial AV',
      ...sliderData,
    };
    try {
      const res = await fetch(`${API_BASE}/sliders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        createdSlide = data.data;
      }
    } catch (err) {
      console.warn('Backend create slider fallback:', err.message);
    }

    if (!createdSlide) {
      createdSlide = { ...payload, _id: `slider-${Date.now()}` };
    }

    if (createdSlide) {
      FALLBACK_SLIDERS = [createdSlide, ...FALLBACK_SLIDERS.filter(s => s._id !== createdSlide._id)];
      saveStoredCustomSlider(createdSlide);

      // Remove from deleted tracking if re-added
      try {
        const existingDeleted = getDeletedSliderIds().filter(id => id !== createdSlide._id && id !== createdSlide.image);
        localStorage.setItem('aravez_deleted_sliders', JSON.stringify(existingDeleted));
      } catch (e) {}

      window.dispatchEvent(new Event('aravez_catalog_updated'));
    }
    return createdSlide;
  },

  async updateSlider(id, sliderData) {
    let updatedSlide = null;
    const payload = {
      title: sliderData.title || 'Banner Slide',
      subtitle: sliderData.subtitle || 'Aravez Commercial AV',
      ...sliderData,
    };
    try {
      const res = await fetch(`${API_BASE}/sliders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        updatedSlide = data.data;
      }
    } catch (err) {
      const idx = FALLBACK_SLIDERS.findIndex(s => s._id === id);
      if (idx !== -1) {
        FALLBACK_SLIDERS[idx] = { ...FALLBACK_SLIDERS[idx], ...payload };
        updatedSlide = FALLBACK_SLIDERS[idx];
      } else {
        updatedSlide = { ...payload, _id: id };
      }
    }

    if (updatedSlide) {
      saveStoredCustomSlider(updatedSlide);
      window.dispatchEvent(new Event('aravez_catalog_updated'));
    }
    return updatedSlide;
  },

  async deleteSlider(id) {
    let targetImage = '';
    const customStored = getStoredCustomSliders();
    const targetSlide = customStored.find(s => s._id === id);
    if (targetSlide) targetImage = targetSlide.image;

    try {
      const res = await fetch(`${API_BASE}/sliders/${id}`, {
        method: 'DELETE',
      });
      await res.json();
    } catch (err) {
      console.warn('Backend delete slider fallback:', err.message);
    }
    FALLBACK_SLIDERS = FALLBACK_SLIDERS.filter(s => s._id !== id);
    removeStoredCustomSlider(id);
    trackDeletedSliderId(id);
    if (targetImage) trackDeletedSliderId(targetImage);

    window.dispatchEvent(new Event('aravez_catalog_updated'));
    return { success: true, message: 'Slider deleted successfully' };
  },

  // Cloudinary Upload (Cloud Name: mybhmjbd)
  async uploadImage(imagePayload, folder = 'aravez_uploads') {
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imagePayload, folder }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      return data;
    } catch (err) {
      console.warn('Backend Cloudinary API error:', err);
      return { success: true, url: imagePayload, isCloudinary: false };
    }
  },

  // Razorpay Payment Gateway APIs
  async getRazorpayKey() {
    try {
      const res = await fetch(`${API_BASE}/payment/get-key`);
      if (res.ok) {
        const data = await res.json();
        return data.keyId || '';
      }
    } catch (err) {
      console.warn('Failed to fetch Razorpay key from backend:', err);
    }
    return '';
  },

  async createRazorpayOrder(amount, currency = 'INR', receipt = '') {
    const res = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, receipt }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to initiate Razorpay order');
    }
    return data;
  },

  async verifyRazorpayPayment(verificationData) {
    const res = await fetch(`${API_BASE}/payment/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Payment signature verification failed');
    }
    return data;
  },

  // Orders Management (Synchronized with MongoDB & LocalStorage backup)
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          // Strictly filter out any dummy orders, only return genuine user orders
          const serverOrders = data.data.filter(o => !isDummyOrder(o));
          const localOrders = getStoredOrders();
          const serverIds = new Set(serverOrders.map(o => o.orderId || o._id));
          const uniqueLocal = localOrders.filter(o => !serverIds.has(o.orderId) && !serverIds.has(o._id) && !isDummyOrder(o));
          return [...serverOrders, ...uniqueLocal];
        }
      }
    } catch (err) {
      console.warn('Backend orders fetch failed, falling back to local storage:', err);
    }
    return getStoredOrders();
  },

  async createOrder(orderData) {
    if (isDummyOrder(orderData)) return null;
    const generatedId = orderData._id || `ord-${Date.now()}`;
    const newOrd = {
      ...orderData,
      _id: generatedId,
      orderId: orderData.orderId || `ARAVEZ-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrd),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data && !isDummyOrder(data.data)) {
          saveStoredOrder(data.data);
          window.dispatchEvent(new Event('aravez_orders_updated'));
          return data.data;
        }
      }
    } catch (err) {
      console.warn('Failed to save order to server directly, saving locally:', err);
    }

    saveStoredOrder(newOrd);
    window.dispatchEvent(new Event('aravez_orders_updated'));
    return newOrd;
  },

  async updateOrderStatus(orderId, status) {
    try {
      await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('Failed to update status on server:', err);
    }

    const orders = getStoredOrders();
    const updated = orders.map(o => (o.orderId === orderId || o._id === orderId ? { ...o, status } : o));
    localStorage.setItem('aravez_placed_orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('aravez_orders_updated'));
    return { success: true };
  },

  async deleteOrder(orderId) {
    try {
      await fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Failed to delete order on server:', err);
    }

    const orders = getStoredOrders();
    const updated = orders.filter(o => o.orderId !== orderId && o._id !== orderId);
    localStorage.setItem('aravez_placed_orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('aravez_orders_updated'));
    return { success: true };
  },

  // Reviews & Testimonials Management
  async getReviews() {
    let list = [];
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      if (res.ok) {
        const data = await res.json();
        list = data.data || [];
      }
    } catch (err) {
      list = [...FALLBACK_REVIEWS];
    }

    const customStored = getStoredCustomReviews();
    const customStoredIds = new Set(customStored.map(r => r._id));
    const nonCustomList = list.filter(r => !customStoredIds.has(r._id));
    list = [...customStored, ...nonCustomList];

    // Filter out deleted reviews
    const deletedIds = new Set(getDeletedReviewIds());
    list = list.filter(r => !deletedIds.has(r._id));

    return list;
  },

  async createReview(reviewData) {
    let createdRev = null;
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        createdRev = data.data;
      }
    } catch (err) {
      console.warn('Backend create review fallback:', err.message);
    }

    const newRev = { ...reviewData, ...(createdRev || {}), _id: createdRev?._id || `rev-${Date.now()}` };
    FALLBACK_REVIEWS = [newRev, ...FALLBACK_REVIEWS.filter(r => r._id !== newRev._id)];
    saveStoredCustomReview(newRev);

    try {
      const existingDeleted = getDeletedReviewIds().filter(id => id !== newRev._id);
      localStorage.setItem('aravez_deleted_reviews', JSON.stringify(existingDeleted));
    } catch (e) {}

    window.dispatchEvent(new Event('aravez_reviews_updated'));
    return newRev;
  },

  async updateReview(id, reviewData) {
    let updatedRev = null;
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        updatedRev = data.data;
      }
    } catch (err) {
      console.warn('Backend update review fallback:', err.message);
    }

    const mergedRev = { ...reviewData, ...(updatedRev || {}), _id: id };
    const idx = FALLBACK_REVIEWS.findIndex(r => r._id === id);
    if (idx !== -1) {
      FALLBACK_REVIEWS[idx] = { ...FALLBACK_REVIEWS[idx], ...mergedRev };
    } else {
      FALLBACK_REVIEWS.unshift(mergedRev);
    }

    saveStoredCustomReview(mergedRev);
    window.dispatchEvent(new Event('aravez_reviews_updated'));
    return mergedRev;
  },

  async deleteReview(id) {
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: 'DELETE',
      });
      await res.json();
    } catch (err) {
      console.warn('Backend delete review fallback:', err.message);
    }
    FALLBACK_REVIEWS = FALLBACK_REVIEWS.filter(r => r._id !== id);
    removeStoredCustomReview(id);
    trackDeletedReviewId(id);
    window.dispatchEvent(new Event('aravez_reviews_updated'));
    return { success: true, message: 'Review deleted successfully' };
  },
};

export const isDummyOrder = (o) => {
  if (!o) return true;
  const dummyIds = ['ord-1001', 'ord-1002', 'ARAVEZ-ORD-882914', 'ARAVEZ-ORD-773120'];
  if (dummyIds.includes(o._id) || dummyIds.includes(o.orderId)) return true;
  const name = (o.customer?.name || '').toLowerCase();
  if (name.includes('alok verma') || name.includes('sunil sharma') || name.includes('aura corp')) return true;
  const email = (o.customer?.email || '').toLowerCase();
  if (email.includes('alok.verma@auracorp.in') || email.includes('sunil.sharma@gmail.com')) return true;
  return false;
};

const SEED_ORDERS = [];

const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem('aravez_placed_orders');
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    const cleaned = list.filter(o => !isDummyOrder(o));
    // If dummy seed orders were stored in browser localStorage, clean them out permanently
    if (cleaned.length !== list.length) {
      localStorage.setItem('aravez_placed_orders', JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    return [];
  }
};

const saveStoredOrder = (newOrder) => {
  if (!newOrder || isDummyOrder(newOrder)) return;
  try {
    const existing = getStoredOrders();
    const updated = [newOrder, ...existing.filter(o => o._id !== newOrder._id && o.orderId !== newOrder.orderId)];
    localStorage.setItem('aravez_placed_orders', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save order to localStorage:', e);
  }
};

