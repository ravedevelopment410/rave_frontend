import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Package,
  Tag,
  Mail,
  Users,
  Plus,
  Trash2,
  Edit,
  Search,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Eye,
  RefreshCw,
  Sparkles,
  TrendingUp,
  X,
  Check,
  Percent,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Image as ImageIcon,
  UploadCloud,
  FolderOpen,
  Camera
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from './Products';

const Admin = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Data states
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sliders, setSliders] = useState([]);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddOfferOpen, setIsAddOfferOpen] = useState(false);
  const [isAddSliderOpen, setIsAddSliderOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);

  const sliderFileInputRef = useRef(null);
  const quickSliderInputRef = useRef(null);
  const productFileInputRef = useRef(null);

  // Product Form State
  const initialProductForm = {
    name: '',
    tagline: '',
    category: 'Touchbooks',
    price: '',
    discountPrice: '',
    image: '',
    description: '',
    volume: '1 Unit',
    inStock: true,
    isFeatured: false,
    isBestSeller: false,
  };
  const [productForm, setProductForm] = useState(initialProductForm);

  // Offer Form State
  const initialOfferForm = {
    title: '',
    subtitle: '',
    badge: 'EXCLUSIVE DEAL',
    couponCode: '',
    discountPercent: 15,
    minSpend: 40,
    validTill: 'Limited Time',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: '',
    isActive: true,
  };
  const [offerForm, setOfferForm] = useState(initialOfferForm);

  // Slider Form State
  const initialSliderForm = {
    badge: '🌿 100% Certified Botanical Wellness',
    title: '',
    subtitle: 'Handcrafted botanical remedies and organic wellness for mind and body.',
    btnText: 'Shop Best Sellers',
    btnLink: '/products',
    secondaryBtnText: 'Explore Offers',
    secondaryBtnLink: '/offers',
    image: '',
    floatingText: 'Special Botanical Drop',
    isActive: true,
  };
  const [sliderForm, setSliderForm] = useState(initialSliderForm);

  // Load all admin data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [prods, offs, msgs, ords, slds] = await Promise.all([
        api.getProducts(),
        api.getOffers(),
        api.getContacts(),
        api.getOrders(),
        api.getSliders(),
      ]);
      setProducts(prods);
      setOffers(offs);
      setContacts(msgs);
      setOrders(ords);
      setSliders(slds);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      addToast('Error loading management data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();

    window.addEventListener('aravez_orders_updated', loadAdminData);
    return () => {
      window.removeEventListener('aravez_orders_updated', loadAdminData);
    };
  }, []);

  // --- LOCAL & CLOUDINARY FILE UPLOAD HANDLERS ---
  const handleSliderFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const base64 = reader.result;
        addToast('Uploading image to Cloudinary...', 'info');
        try {
          const uploadRes = await api.uploadImage(base64, 'aravez_sliders');
          const finalUrl = uploadRes.url || base64;
          setSliderForm(prev => ({
            ...prev,
            image: finalUrl,
            title: prev.title || cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
          }));
          if (uploadRes.isCloudinary) {
            addToast('Image uploaded to Cloudinary CDN! 🌩️', 'success');
          } else {
            addToast(`Image "${file.name}" loaded!`, 'success');
          }
        } catch (err) {
          setSliderForm(prev => ({
            ...prev,
            image: base64,
            title: prev.title || cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickSliderUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const autoTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        const base64 = reader.result;
        addToast('Uploading slide to Cloudinary...', 'info');
        let finalUrl = base64;
        try {
          const uploadRes = await api.uploadImage(base64, 'aravez_sliders');
          if (uploadRes.url) finalUrl = uploadRes.url;
        } catch (err) {}

        const newSlidePayload = {
          ...initialSliderForm,
          image: finalUrl,
          title: autoTitle,
        };
        try {
          const created = await api.createSlider(newSlidePayload);
          setSliders(prev => [created, ...prev.filter(s => s._id !== created._id)]);
          addToast(`Slide "${autoTitle}" published to Home Page! 🌩️`, 'success');
        } catch (err) {
          console.error('Slider quick upload error:', err);
          addToast('Failed to publish slide', 'error');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- MULTI-IMAGE & PRICE DISCOUNT CALCULATOR HANDLERS ---
  const handlePriceChange = (val) => {
    const p = parseFloat(val) || 0;
    const pct = parseFloat(productForm.discountPercent) || 0;
    let discP = productForm.discountPrice;
    if (p > 0 && pct > 0) {
      discP = (p - (p * pct / 100)).toFixed(2);
    }
    setProductForm(prev => ({
      ...prev,
      price: val,
      discountPrice: discP,
    }));
  };

  const handleDiscountPercentChange = (val) => {
    const pct = parseFloat(val) || 0;
    const p = parseFloat(productForm.price) || 0;
    let discP = productForm.discountPrice;
    if (p > 0 && pct >= 0 && pct <= 100) {
      discP = (p - (p * pct / 100)).toFixed(2);
    }
    setProductForm(prev => ({
      ...prev,
      discountPercent: val,
      discountPrice: discP,
    }));
  };

  const handleDiscountPriceChange = (val) => {
    const discP = parseFloat(val) || 0;
    const p = parseFloat(productForm.price) || 0;
    let pct = productForm.discountPercent;
    if (p > 0 && discP > 0 && discP < p) {
      pct = Math.round(((p - discP) / p) * 100);
    }
    setProductForm(prev => ({
      ...prev,
      discountPrice: val,
      discountPercent: pct,
    }));
  };

  const handleProductFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    addToast(`Uploading ${files.length} photo(s) to Cloudinary...`, 'info');
    let loadedUrls = [];
    let completed = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        try {
          const uploadRes = await api.uploadImage(base64, 'aravez_products');
          loadedUrls.push(uploadRes.url || base64);
        } catch {
          loadedUrls.push(base64);
        }
        completed++;
        if (completed === files.length) {
          setProductForm(prev => {
            const currentList = prev.images && prev.images.length > 0 ? prev.images : (prev.image ? [prev.image] : []);
            const updatedImages = [...currentList, ...loadedUrls];
            return {
              ...prev,
              images: updatedImages,
              image: prev.image || updatedImages[0],
            };
          });
          addToast(`${files.length} product photo(s) uploaded! 🌩️`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveProductImage = (indexToRemove) => {
    setProductForm(prev => {
      const updatedImages = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      const newMainImage = updatedImages.length > 0 ? (updatedImages.includes(prev.image) ? prev.image : updatedImages[0]) : '';
      return {
        ...prev,
        images: updatedImages,
        image: newMainImage,
      };
    });
  };

  const handleSetMainProductImage = (imgUrl) => {
    setProductForm(prev => ({
      ...prev,
      image: imgUrl,
    }));
    addToast('Set as main cover photo', 'info');
  };

  // --- PRODUCT ACTIONS ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const allImages = productForm.images && productForm.images.length > 0 ? productForm.images : (productForm.image ? [productForm.image] : []);
    const mainImage = productForm.image || allImages[0];

    if (!productForm.name || !productForm.price || !mainImage) {
      addToast('Please provide product name, price and at least 1 image', 'error');
      return;
    }

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : null,
      image: mainImage,
      images: allImages,
      rating: editingProduct ? editingProduct.rating : 4.9,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 1,
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload);
        setProducts(prev => prev.map(p => (p._id === editingProduct._id ? { ...p, ...payload } : p)));
        addToast(`Product "${payload.name}" updated successfully!`, 'success');
      } else {
        const created = await api.createProduct(payload);
        setProducts(prev => [created, ...prev]);
        window.dispatchEvent(new Event('aravez_catalog_updated'));
        addToast(`Product "${payload.name}" added to catalog!`, 'success');
      }
      setIsAddProductOpen(false);
      setEditingProduct(null);
      setProductForm(initialProductForm);
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    const p = product.price || 0;
    const dp = product.discountPrice || '';
    const pct = (p > 0 && dp) ? Math.round(((p - dp) / p) * 100) : '';
    const imgs = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

    setProductForm({
      name: product.name,
      tagline: product.tagline || '',
      category: product.category,
      price: product.price,
      discountPercent: pct,
      discountPrice: dp,
      image: product.image || imgs[0] || '',
      images: imgs,
      description: product.description,
      volume: product.volume || '1 Unit',
      inStock: product.inStock,
      isFeatured: product.isFeatured || false,
      isBestSeller: product.isBestSeller || false,
    });
    setIsAddProductOpen(true);
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from Aravez catalog?`)) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      addToast(`"${name}" removed from catalog`, 'info');
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const handleToggleStock = async (product) => {
    const newStock = !product.inStock;
    try {
      await api.updateProduct(product._id, { inStock: newStock });
      setProducts(prev =>
        prev.map(p => (p._id === product._id ? { ...p, inStock: newStock } : p))
      );
      addToast(`Stock status updated for ${product.name}`, 'success');
    } catch (err) {
      addToast('Failed to toggle stock', 'error');
    }
  };

  // --- OFFER ACTIONS ---
  const handleSaveOffer = async (e) => {
    e.preventDefault();
    if (!offerForm.title || !offerForm.couponCode || !offerForm.discountPercent) {
      addToast('Please fill all required offer fields', 'error');
      return;
    }

    const payload = {
      ...offerForm,
      couponCode: offerForm.couponCode.trim().toUpperCase(),
      discountPercent: Number(offerForm.discountPercent),
      minSpend: Number(offerForm.minSpend || 0),
    };

    try {
      const created = await api.createOffer(payload);
      setOffers(prev => [created, ...prev]);
      addToast(`Coupon "${payload.couponCode}" activated!`, 'success');
      setIsAddOfferOpen(false);
      setOfferForm(initialOfferForm);
    } catch (err) {
      addToast('Failed to create offer', 'error');
    }
  };

  const handleDeleteOffer = async (id, code) => {
    if (!window.confirm(`Delete coupon code ${code}?`)) return;
    try {
      await api.deleteOffer(id);
      setOffers(prev => prev.filter(o => o._id !== id));
      addToast(`Offer ${code} deleted`, 'info');
    } catch (err) {
      addToast('Failed to delete offer', 'error');
    }
  };

  // --- SLIDER ACTIONS ---
  const handleSaveSlider = async (e) => {
    e.preventDefault();
    if (!sliderForm.image) {
      addToast('Please select or provide an image for the slide', 'error');
      return;
    }

    const payload = {
      ...sliderForm,
      title: sliderForm.title || 'Pure Botanical Care for Radiant Skin & Soul.',
      subtitle: sliderForm.subtitle || 'Discover Aravez artisanal skincare and botanical wellness.',
    };

    try {
      if (editingSlider) {
        await api.updateSlider(editingSlider._id, payload);
        setSliders(prev => prev.map(s => (s._id === editingSlider._id ? { ...s, ...payload } : s)));
        addToast('Hero Slide updated successfully!', 'success');
      } else {
        const created = await api.createSlider(payload);
        setSliders(prev => [created, ...prev.filter(s => s._id !== created._id)]);
        addToast('New Hero Slide published to Home page!', 'success');
      }
      setIsAddSliderOpen(false);
      setEditingSlider(null);
      setSliderForm(initialSliderForm);
    } catch (err) {
      addToast('Failed to save slider', 'error');
    }
  };

  const handleEditSlider = (slide) => {
    setEditingSlider(slide);
    setSliderForm({
      badge: slide.badge || '🌿 100% Certified Botanical Wellness',
      title: slide.title,
      subtitle: slide.subtitle,
      btnText: slide.btnText || 'Shop Collection',
      btnLink: slide.btnLink || '/products',
      secondaryBtnText: slide.secondaryBtnText || '',
      secondaryBtnLink: slide.secondaryBtnLink || '',
      image: slide.image,
      floatingText: slide.floatingText || '',
      isActive: slide.isActive !== false,
    });
    setIsAddSliderOpen(true);
  };

  const handleDeleteSlider = async (id, title) => {
    if (!window.confirm(`Delete slide "${title}"?`)) return;
    try {
      await api.deleteSlider(id);
      setSliders(prev => prev.filter(s => s._id !== id));
      addToast('Slide removed', 'info');
    } catch (err) {
      addToast('Failed to delete slide', 'error');
    }
  };

  const handleToggleSliderActive = async (slide) => {
    const newActive = !slide.isActive;
    try {
      await api.updateSlider(slide._id, { isActive: newActive });
      setSliders(prev =>
        prev.map(s => (s._id === slide._id ? { ...s, isActive: newActive } : s))
      );
      addToast(`Slide active status updated`, 'success');
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  // --- CONTACT ACTIONS ---
  const handleDeleteContact = async (id) => {
    try {
      await api.deleteContact(id);
      setContacts(prev => prev.filter(c => c._id !== id));
      addToast('Message removed', 'info');
    } catch (err) {
      addToast('Failed to delete message', 'error');
    }
  };

  // --- ORDER ACTIONS ---
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => ((o.orderId === orderId || o._id === orderId) ? { ...o, status } : o)));
      addToast(`Order ${orderId} status set to ${status}`, 'success');
    } catch (err) {
      addToast('Failed to update order status', 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await api.deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.orderId !== orderId && o._id !== orderId));
      addToast(`Order ${orderId} deleted`, 'info');
    } catch (err) {
      addToast('Failed to delete order', 'error');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedCatFilter === 'All' || p.category === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* Top Admin Navigation Bar */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Brand / Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold text-xl shadow-md">
                🌿
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-white block">
                  Aravez Admin Control
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                  Live Management Suite
                </span>
              </div>
            </div>

            {/* View Live Store Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={loadAdminData}
                className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                to="/"
                target="_blank"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>View Live Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center overflow-x-auto gap-2 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, count: null },
            { id: 'sliders', label: 'Hero Sliders', icon: Sliders, count: sliders.length },
            { id: 'products', label: 'Products Manager', icon: Package, count: products.length },
            { id: 'contacts', label: 'Customer Inquiries', icon: Mail, count: contacts.length },
            { id: 'orders', label: 'Orders Manager', icon: ShoppingBag, count: orders.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ----------------- TAB 1: OVERVIEW ----------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Home Sliders</span>
                  <h3 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">{sliders.length}</h3>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">Active Hero Banners</span>
                </div>
                <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sliders className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
                  <h3 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">{products.length}</h3>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
                    {products.filter(p => p.inStock).length} In Stock
                  </span>
                </div>
                <div className="w-13 h-13 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                  <h3 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">{orders.length}</h3>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">Paid Online Orders</span>
                </div>
                <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inquiries</span>
                  <h3 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">{contacts.length}</h3>
                  <span className="text-xs text-rose-600 font-semibold mt-1 inline-block">Customer Messages</span>
                </div>
                <div className="w-13 h-13 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Quick Action Cards */}
              <div className="lg:col-span-6 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10 space-y-4">
                  <span className="inline-block px-3 py-1 bg-emerald-800 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    ⚡ Quick Operations
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                    Manage Your Aravez Store & Home Sliders
                  </h2>
                  <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
                    Upload new promotional hero slides directly from your computer, add products, or manage customer messages.
                  </p>
                </div>

                <div className="relative z-10 pt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setEditingSlider(null);
                      setSliderForm(initialSliderForm);
                      setIsAddSliderOpen(true);
                    }}
                    className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-105"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Slide from PC</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm(initialProductForm);
                      setIsAddProductOpen(true);
                    }}
                    className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4 text-emerald-700" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Recent Inquiries Preview */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-slate-900">Recent Customer Inquiries</h3>
                  <button
                    onClick={() => setActiveTab('contacts')}
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    View all ({contacts.length}) →
                  </button>
                </div>

                {contacts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No customer messages yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 space-y-3">
                    {contacts.slice(0, 3).map((item) => (
                      <div key={item._id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-800">{item.name}</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md">
                              {item.subject}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.message}</p>
                          <span className="text-[10px] text-slate-400">{item.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ----------------- TAB 2: HERO SLIDERS MANAGER ----------------- */}
        {activeTab === 'sliders' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Quick Upload from Local Drive Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border border-emerald-700/60">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-emerald-700 text-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
                  📁 Local Drive Direct Upload
                </span>
                <h3 className="font-serif text-2xl font-bold">Select Slide Image from Your PC / Laptop</h3>
                <p className="text-emerald-100/80 text-xs max-w-xl">
                  Apne computer se koi bhi image select karein. Ye turant Home page ke hero slider mein upload ho jayegi!
                </p>
              </div>

              {/* Hidden file input for quick upload */}
              <input
                type="file"
                ref={quickSliderInputRef}
                accept="image/*"
                onChange={handleQuickSliderUpload}
                className="hidden"
              />

              <button
                onClick={() => quickSliderInputRef.current?.click()}
                className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold px-7 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5 shadow-xl transition-all hover:scale-105 shrink-0"
              >
                <FolderOpen className="w-5 h-5 text-emerald-700" />
                <span>Choose Local Image File</span>
              </button>
            </div>

            {/* Header & Regular Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Active Home Page Hero Sliders</h3>
                <p className="text-xs text-slate-500 mt-1">Total {sliders.length} slides currently configured.</p>
              </div>
              <button
                onClick={() => {
                  setEditingSlider(null);
                  setSliderForm(initialSliderForm);
                  setIsAddSliderOpen(true);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Slide</span>
              </button>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sliders.map((slide, idx) => (
                <div
                  key={slide._id || idx}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-slate-100">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
                      Slide #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleToggleSliderActive(slide)}
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                        slide.isActive !== false
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-600 text-white'
                      }`}
                    >
                      {slide.isActive !== false ? '● Active' : 'Hidden'}
                    </button>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                        {slide.badge}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                        {slide.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {slide.subtitle}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">
                        Btn: <strong className="text-slate-700">{slide.btnText}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSlider(slide)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 transition-colors"
                          title="Edit Slide"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSlider(slide._id, slide.title)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: PRODUCTS MANAGER ----------------- */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            {/* Action Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search product by title or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>

                <select
                  value={selectedCatFilter}
                  onChange={(e) => setSelectedCatFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c === 'All Products' ? 'All' : c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm(initialProductForm);
                  setIsAddProductOpen(true);
                }}
                className="w-full md:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4">Stock Status</th>
                      <th className="py-4 px-4">Badges</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-slate-400">
                          No products found matching filters.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-12 object-cover rounded-xl border border-slate-200 bg-slate-100 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{p.name}</h4>
                                <span className="text-[11px] text-slate-400">{p.volume || 'Standard'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-md text-[11px]">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-900">₹{Number(p.discountPrice || p.price).toLocaleString('en-IN')}</div>
                            {p.discountPrice && (
                              <div className="text-[10px] text-slate-400 line-through">₹{Number(p.price).toLocaleString('en-IN')}</div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`px-3 py-1 rounded-full font-bold text-[10px] transition-colors ${
                                p.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                            >
                              {p.inStock ? '● In Stock' : '✕ Out of Stock'}
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-1 flex-wrap">
                              {p.isBestSeller && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                  Best Seller
                                </span>
                              )}
                              {p.isFeatured && (
                                <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 transition-colors"
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id, p.name)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: CONTACTS & MESSAGES ----------------- */}
        {activeTab === 'contacts' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Customer Messages & Inquiries</h3>
                <p className="text-xs text-slate-500 mt-1">Direct inquiries submitted through the Contact Us form.</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Total: {contacts.length} Inquiries
              </span>
            </div>

            <div className="space-y-4">
              {contacts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 text-xs">
                  No inquiries received yet.
                </div>
              ) : (
                contacts.map((msg) => (
                  <div
                    key={msg._id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-slate-900 text-sm">{msg.name}</h4>
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {msg.subject}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span>📧 {msg.email}</span>
                        {msg.phone && <span>📞 {msg.phone}</span>}
                        {msg.createdAt && <span>🗓️ {new Date(msg.createdAt).toLocaleDateString()}</span>}
                      </div>
                      <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed mt-2">
                        "{msg.message}"
                      </p>
                    </div>

                    <div className="flex md:flex-col justify-end items-end gap-2 shrink-0">
                      <a
                        href={`mailto:${msg.email}?subject=Aravez Care: In response to your inquiry`}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                      >
                        Reply via Email
                      </a>
                      <button
                        onClick={() => handleDeleteContact(msg._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB 5: ORDERS MANAGER ----------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Customer Orders Manager</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Track online paid orders, customer delivery details, and update shipment status.
                </p>
              </div>
              <div className="bg-emerald-50 text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200 shadow-xs flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                <span>Total Orders: {orders.length}</span>
              </div>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 text-xs">
                  No customer orders received yet.
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord._id || ord.orderId}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                  >
                    {/* Top Row: Order ID & Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm bg-slate-100 text-slate-900 px-3 py-1 rounded-xl">
                          {ord.orderId}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          🗓️ {ord.createdAt ? new Date(ord.createdAt).toLocaleString('en-IN') : 'Recent Order'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                          {ord.paymentStatus || 'PAID'} ({ord.paymentMethod || 'Online Payment'})
                        </span>
                        
                        <select
                          value={ord.status || 'Processing'}
                          onChange={(e) => handleUpdateOrderStatus(ord.orderId || ord._id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1 rounded-full border focus:outline-none cursor-pointer ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-700 text-white border-emerald-800'
                              : ord.status === 'Shipped'
                              ? 'bg-blue-600 text-white border-blue-700'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                        >
                          <option value="Processing">⏳ Processing</option>
                          <option value="Shipped">🚚 Shipped</option>
                          <option value="Delivered">✅ Delivered</option>
                        </select>
                      </div>
                    </div>

                    {/* Middle Row: Customer Info & Items List */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                      
                      {/* Customer & Delivery Column */}
                      <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{ord.customer?.name}</h4>
                        <p className="text-slate-600">📞 <strong>Phone:</strong> {ord.customer?.phone}</p>
                        <p className="text-slate-600">📧 <strong>Email:</strong> {ord.customer?.email}</p>
                        <p className="text-slate-600">📍 <strong>Delivery Address:</strong> {ord.customer?.address}</p>
                      </div>

                      {/* Items Column */}
                      <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                        <div>
                          <span className="font-bold text-slate-700 block mb-2">Ordered Hardware Items:</span>
                          <ul className="space-y-1.5 divide-y divide-slate-100">
                            {ord.items?.map((item, idx) => (
                              <li key={idx} className="pt-1.5 first:pt-0 flex items-center justify-between">
                                <span className="font-semibold text-slate-800 line-clamp-1">{item.name} × {item.quantity}</span>
                                <span className="font-mono text-slate-600">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-sm">
                          <span className="text-slate-700">Total Order Amount:</span>
                          <span className="text-emerald-800 text-base">₹{Number(ord.totalAmount).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleDeleteOrder(ord.orderId || ord._id)}
                        className="text-xs text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Order</span>
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* ----------------- ADD / EDIT HERO SLIDER MODAL (With Local File Upload) ----------------- */}
      {isAddSliderOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fade-in">
            <button
              onClick={() => setIsAddSliderOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-6">
              {editingSlider ? 'Edit Hero Slide' : 'Upload New Hero Slide to Home Page'}
            </h3>

            <form onSubmit={handleSaveSlider} className="space-y-5 text-xs">
              
              {/* Local File Selector Dropzone */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  1. Select Image from Local Drive *
                </label>
                
                <input
                  type="file"
                  ref={sliderFileInputRef}
                  accept="image/*"
                  onChange={handleSliderFileChange}
                  className="hidden"
                />

                {sliderForm.image ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-100 aspect-video flex items-center justify-center group">
                    <img
                      src={sliderForm.image}
                      alt="Selected preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => sliderFileInputRef.current?.click()}
                        className="bg-white text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setSliderForm(prev => ({ ...prev, image: '' }))}
                        className="bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => sliderFileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-bold text-emerald-900 text-sm block">Click to Browse Local Computer Image</span>
                      <span className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP files</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Or manual URL fallback */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Or paste direct image URL (Optional):
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={sliderForm.image.startsWith('data:') ? '' : sliderForm.image}
                  onChange={(e) => setSliderForm({ ...sliderForm, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Slide Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="🌿 100% Certified Botanical Wellness"
                    value={sliderForm.badge}
                    onChange={(e) => setSliderForm({ ...sliderForm, badge: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Floating Tagline (Optional)</label>
                  <input
                    type="text"
                    placeholder="Code: ARAVEZ20 (20% OFF)"
                    value={sliderForm.floatingText}
                    onChange={(e) => setSliderForm({ ...sliderForm, floatingText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hero Main Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Pure Botanical Care for Radiant Skin & Soul."
                  value={sliderForm.title}
                  onChange={(e) => setSliderForm({ ...sliderForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hero Subtitle / Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Discover Aravez — artisanal skincare, herbal adaptogens, and organic loose-leaf teas..."
                  value={sliderForm.subtitle}
                  onChange={(e) => setSliderForm({ ...sliderForm, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Buttons Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    placeholder="Shop Best Sellers"
                    value={sliderForm.btnText}
                    onChange={(e) => setSliderForm({ ...sliderForm, btnText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Button Link</label>
                  <input
                    type="text"
                    placeholder="/products"
                    value={sliderForm.btnLink}
                    onChange={(e) => setSliderForm({ ...sliderForm, btnLink: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSliderOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-7 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{editingSlider ? 'Update Slide' : 'Upload & Publish Slide'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- ADD / EDIT PRODUCT MODAL (With Local File Upload) ----------------- */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fade-in">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product to Aravez'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aravez Pure Rosehip Oil"
                    value={productForm.name ?? ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {PRODUCT_CATEGORIES.filter(c => c !== 'All Products').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Discount Row (In Indian Rupees ₹) */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 100"
                    value={productForm.price ?? ''}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount (% OFF)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 20"
                    value={productForm.discountPercent ?? ''}
                    onChange={(e) => handleDiscountPercentChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 80"
                    value={productForm.discountPrice ?? ''}
                    onChange={(e) => handleDiscountPriceChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit / Pack Size</label>
                  <input
                    type="text"
                    placeholder="1 Unit / Box"
                    value={productForm.volume ?? ''}
                    onChange={(e) => setProductForm({ ...productForm, volume: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Price Calculation Live Summary Box */}
              {productForm.price > 0 && (
                <div className="bg-emerald-900 text-white rounded-xl p-3 text-xs flex flex-wrap items-center justify-between gap-2 shadow-inner">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-700 px-2 py-0.5 rounded font-bold">Price Summary</span>
                    <span>Original: <strong>₹{Number(productForm.price).toLocaleString('en-IN')}</strong></span>
                    {productForm.discountPercent > 0 && (
                      <span className="text-amber-300 font-bold">({productForm.discountPercent}% OFF)</span>
                    )}
                  </div>
                  <div className="text-sm font-extrabold text-emerald-300">
                    Final Price: ₹{Number(productForm.discountPrice || productForm.price).toLocaleString('en-IN')}
                    {productForm.discountPrice && (
                      <span className="text-xs text-emerald-200 font-normal ml-2">
                        (You Save: ₹{(Number(productForm.price) - Number(productForm.discountPrice)).toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Multi-Image File Upload (8+ photos at once) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700">
                    Product Photos * <span className="text-xs font-normal text-emerald-700">(Select 8+ images for multi-angle product gallery)</span>
                  </label>
                  <span className="text-xs text-slate-500 font-semibold">
                    Total: {productForm.images?.length || (productForm.image ? 1 : 0)} photos
                  </span>
                </div>

                <input
                  type="file"
                  ref={productFileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleProductFilesChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => productFileInputRef.current?.click()}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4 text-emerald-300" />
                    <span>Select 8+ Photos from PC (Multi-Select)</span>
                  </button>

                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs text-slate-400">or add URL:</span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          e.preventDefault();
                          const url = e.target.value.trim();
                          setProductForm(prev => {
                            const imgs = [...(prev.images || []), url];
                            return { ...prev, images: imgs, image: prev.image || url };
                          });
                          e.target.value = '';
                          addToast('Photo URL added to gallery', 'info');
                        }
                      }}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Uploaded Gallery Thumbnails Grid */}
                {(productForm.images && productForm.images.length > 0) ? (
                  <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">
                      Uploaded Photos Gallery (Click "Set Main" to choose cover photo):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {productForm.images.map((img, idx) => {
                        const isMain = productForm.image === img || (!productForm.image && idx === 0);
                        return (
                          <div
                            key={idx}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 shadow-xs group ${
                              isMain ? 'border-emerald-600 ring-2 ring-emerald-500/50' : 'border-slate-200'
                            }`}
                          >
                            <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                            {isMain && (
                              <span className="absolute top-1 left-1 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                ★ Main
                              </span>
                            )}
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                              {!isMain && (
                                <button
                                  type="button"
                                  onClick={() => handleSetMainProductImage(img)}
                                  className="bg-white text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded shadow"
                                >
                                  Set Main
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveProductImage(idx)}
                                className="bg-rose-600 text-white p-1 rounded-full hover:bg-rose-700"
                                title="Remove photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : productForm.image && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                    <img src={productForm.image} alt="Preview" className="w-10 h-10 rounded-lg object-cover border" />
                    <span>Photo loaded</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Tagline</label>
                <input
                  type="text"
                  placeholder="Deep cellular hydration with organic botanicals"
                  value={productForm.tagline ?? ''}
                  onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed botanical ingredients and benefits..."
                  value={productForm.description ?? ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Display & Visibility Settings:</span>
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="accent-emerald-600 w-4.5 h-4.5 rounded"
                    />
                    <span>In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700" title="Show under Best Sellers filter">
                    <input
                      type="checkbox"
                      checked={productForm.isBestSeller}
                      onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                      className="accent-emerald-600 w-4.5 h-4.5 rounded"
                    />
                    <span>⭐ Mark as Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-emerald-800 bg-emerald-100/60 px-3 py-1.5 rounded-xl border border-emerald-300/80 shadow-xs" title="Show on Home Landing Page (Handcrafted With Passion section)">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="accent-emerald-600 w-4.5 h-4.5 rounded"
                    />
                    <span>🌟 Mark as Featured (Show on Landing Page)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



    </div>
  );
};

export default Admin;
