const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://rave-backend-0vqv.onrender.com/api';

// Rich Hero Banner Sliders for Aravez Home Page
let FALLBACK_SLIDERS = [
  {
    _id: 'slider-1',
    badge: '🌿 100% Certified Botanical Wellness',
    title: 'Pure Botanical Care for Radiant Skin & Soul.',
    subtitle: 'Discover Aravez — artisanal skincare, herbal adaptogens, and organic loose-leaf teas consciously crafted from wildcrafted earth botanicals.',
    btnText: 'Shop Best Sellers',
    btnLink: '/products',
    secondaryBtnText: 'Explore Offers (Up to 30% OFF)',
    secondaryBtnLink: '/offers',
    image: 'https://images.unsplash.com/photo-1608248597359-009a25b6a716?auto=format&fit=crop&w=1200&q=80',
    floatingText: 'Code: ARAVEZ20 (20% OFF)',
    isActive: true,
    order: 1,
  },
  {
    _id: 'slider-2',
    badge: '✨ Ancient Ayurvedic Intelligence',
    title: 'Restorative Herbal Elixirs & Adaptogen Tonics.',
    subtitle: 'Calm daily stress, awaken cellular longevity, and fortify immune resilience with sacred Himalayan botanicals and Shilajit drops.',
    btnText: 'Explore Herbal Wellness',
    btnLink: '/products?category=Herbal+Wellness',
    secondaryBtnText: 'Read Our Story',
    secondaryBtnLink: '/about',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    floatingText: '100% Wildcrafted Himalayan Herbs',
    isActive: true,
    order: 2,
  },
  {
    _id: 'slider-3',
    badge: '🍵 Mountain Cloud-Forest Harvest',
    title: 'Artisan Loose-Leaf Organic Teas & Infusions.',
    subtitle: 'Slow down with high-elevation organic green teas, soothing French lavender blossoms, and fragrant night-blooming jasmine.',
    btnText: 'Discover Tea Collection',
    btnLink: '/products?category=Organic+Teas',
    secondaryBtnText: 'View Tea Deals',
    secondaryBtnLink: '/offers',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
    floatingText: 'Zero Artificial Aromas • Biodegradable',
    isActive: true,
    order: 3,
  },
];

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

let FALLBACK_CONTACTS = [
  {
    _id: 'contact-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 555-019-2834',
    subject: 'Product Recommendation',
    message: 'Hello, which of your herbal elixirs do you recommend for chronic stress and skin redness?',
    status: 'New',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'contact-2',
    name: 'Liam Henderson',
    email: 'liam.h@wellnessclub.org',
    phone: '+1 555-438-9921',
    subject: 'Wholesale & Partnerships',
    message: 'We run a boutique eco-spa in Seattle and would love to carry your bulk loose-leaf teas and face serums.',
    status: 'In Progress',
    createdAt: new Date().toISOString(),
  },
];

let FALLBACK_SUBSCRIBERS = [
  { _id: 'sub-1', email: 'clara.m@greenliving.com', createdAt: new Date().toISOString() },
  { _id: 'sub-2', email: 'julian.vance@herbalcare.org', createdAt: new Date().toISOString() },
  { _id: 'sub-3', email: 'serena.botanicals@gmail.com', createdAt: new Date().toISOString() },
];

const getStoredCustomProducts = () => {
  try {
    const raw = localStorage.getItem('aravez_custom_products');
    return raw ? JSON.parse(raw) : [];
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

export const api = {
  // Products
  async getProducts(params = {}) {
    let list = [];
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products?${query}`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      list = data.data || [];
    } catch (err) {
      console.warn('Using offline product fallback data:', err.message);
      list = [...FALLBACK_PRODUCTS];
    }

    // Merge custom products saved via Admin (always place custom uploaded products FIRST at the top)
    const customStored = getStoredCustomProducts();
    const customStoredIds = new Set(customStored.map(p => p._id));
    const nonCustomList = list.filter(p => !customStoredIds.has(p._id));
    list = [...customStored, ...nonCustomList];

    if (params.category && params.category !== 'All' && params.category !== 'All Products') {
      list = list.filter(p => p.category && p.category.toLowerCase() === params.category.toLowerCase());
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
      return data.data;
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
      if (!res.ok) throw new Error(data.message || 'Failed to create product');
      createdProd = data.data;
    } catch (err) {
      createdProd = { ...productData, _id: `aravez-prod-${Date.now()}` };
    }

    if (createdProd) {
      FALLBACK_PRODUCTS = [createdProd, ...FALLBACK_PRODUCTS.filter(p => p._id !== createdProd._id)];
      saveStoredCustomProduct(createdProd);
    }
    return createdProd;
  },

  async updateProduct(id, productData) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update product');
      return data.data;
    } catch (err) {
      const idx = FALLBACK_PRODUCTS.findIndex(p => p._id === id);
      if (idx !== -1) {
        FALLBACK_PRODUCTS[idx] = { ...FALLBACK_PRODUCTS[idx], ...productData };
        return FALLBACK_PRODUCTS[idx];
      }
      return productData;
    }
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
    try {
      const res = await fetch(`${API_BASE}/sliders`);
      if (!res.ok) throw new Error('Failed to fetch sliders');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return FALLBACK_SLIDERS;
    }
  },

  async createSlider(sliderData) {
    try {
      const res = await fetch(`${API_BASE}/sliders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sliderData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create slider');
      return data.data;
    } catch (err) {
      const newSlide = { ...sliderData, _id: `slider-${Date.now()}` };
      FALLBACK_SLIDERS.push(newSlide);
      return newSlide;
    }
  },

  async updateSlider(id, sliderData) {
    try {
      const res = await fetch(`${API_BASE}/sliders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sliderData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update slider');
      return data.data;
    } catch (err) {
      const idx = FALLBACK_SLIDERS.findIndex(s => s._id === id);
      if (idx !== -1) {
        FALLBACK_SLIDERS[idx] = { ...FALLBACK_SLIDERS[idx], ...sliderData };
        return FALLBACK_SLIDERS[idx];
      }
      return sliderData;
    }
  },

  async deleteSlider(id) {
    try {
      const res = await fetch(`${API_BASE}/sliders/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete slider');
      return data;
    } catch (err) {
      FALLBACK_SLIDERS = FALLBACK_SLIDERS.filter(s => s._id !== id);
      return { success: true };
    }
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

  // Orders Management
  async getOrders() {
    return getStoredOrders();
  },

  async createOrder(orderData) {
    const newOrd = {
      ...orderData,
      _id: orderData._id || `ord-${Date.now()}`,
    };
    saveStoredOrder(newOrd);
    window.dispatchEvent(new Event('aravez_orders_updated'));
    return newOrd;
  },

  async updateOrderStatus(orderId, status) {
    const orders = getStoredOrders();
    const updated = orders.map(o => (o.orderId === orderId || o._id === orderId ? { ...o, status } : o));
    localStorage.setItem('aravez_placed_orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('aravez_orders_updated'));
    return { success: true };
  },

  async deleteOrder(orderId) {
    const orders = getStoredOrders();
    const updated = orders.filter(o => o.orderId !== orderId && o._id !== orderId);
    localStorage.setItem('aravez_placed_orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('aravez_orders_updated'));
    return { success: true };
  },
};

const SEED_ORDERS = [
  {
    _id: 'ord-1001',
    orderId: 'ARAVEZ-ORD-882914',
    customer: {
      name: 'Dr. Alok Verma (Aura Corp)',
      phone: '9814012345',
      email: 'alok.verma@auracorp.in',
      address: 'Plot 45, Industrial Area Phase 1, Chandigarh - 160002',
    },
    items: [
      { name: 'Aravez Ultra 4K Laser Projector (6500 Lumens)', quantity: 1, price: 185000 },
      { name: 'Professional Teleprompter System 17"', quantity: 1, price: 45000 }
    ],
    totalAmount: 230000,
    paymentMethod: 'Online Payment (UPI)',
    paymentStatus: 'PAID',
    status: 'Processing',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    _id: 'ord-1002',
    orderId: 'ARAVEZ-ORD-773120',
    customer: {
      name: 'Sunil Sharma',
      phone: '9876543210',
      email: 'sunil.sharma@gmail.com',
      address: 'House No 1204, Sector 34-C, Chandigarh - 160022',
    },
    items: [
      { name: 'Interactive Flat Panel 75" (4K UHD Touchbook)', quantity: 1, price: 125000 }
    ],
    totalAmount: 125000,
    paymentMethod: 'Online Payment (Card)',
    paymentStatus: 'PAID',
    status: 'Shipped',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem('aravez_placed_orders');
    return raw ? JSON.parse(raw) : SEED_ORDERS;
  } catch (e) {
    return SEED_ORDERS;
  }
};

const saveStoredOrder = (newOrder) => {
  try {
    const existing = getStoredOrders();
    const updated = [newOrder, ...existing.filter(o => o._id !== newOrder._id && o.orderId !== newOrder.orderId)];
    localStorage.setItem('aravez_placed_orders', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save order to localStorage:', e);
  }
};

