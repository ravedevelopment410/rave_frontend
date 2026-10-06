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
  Camera,
  ChevronDown,
  Loader2,
  Lock,
  EyeOff,
  LogOut,
  Star,
  Quote
} from 'lucide-react';
import { api, isDummyOrder } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from './Products';

const Admin = () => {
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('aravez_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const allowedEmails = ['contact@aravez.store', 'vdhiman@yahoo.com'];
    const targetPassword = 'vdhiman@739';

    if (
      allowedEmails.includes(loginEmail.trim().toLowerCase()) &&
      loginPassword === targetPassword
    ) {
      sessionStorage.setItem('aravez_admin_auth', 'true');
      setIsAuthenticated(true);
      addToast('Welcome back, Admin! Access Granted 🔐', 'success');
    } else {
      setLoginError('Invalid Email or Password! Access Denied.');
      addToast('Invalid credentials!', 'error');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aravez_admin_auth');
    setIsAuthenticated(false);
    setLoginEmail('');
    setLoginPassword('');
    addToast('Admin logged out successfully', 'info');
  };

  // Data states
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isAddOfferOpen, setIsAddOfferOpen] = useState(false);
  const [isAddSliderOpen, setIsAddSliderOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [isUploadingSliderImage, setIsUploadingSliderImage] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isUploadingReviewAvatar, setIsUploadingReviewAvatar] = useState(false);

  const sliderFileInputRef = useRef(null);
  const quickSliderInputRef = useRef(null);
  const productFileInputRef = useRef(null);
  const reviewFileInputRef = useRef(null);

  // Product Form State
  const initialProductForm = {
    name: '',
    category: 'Toughbook',
    customCategory: '',
    price: '',
    discountPrice: '',
    discountPercent: '',
    image: '',
    images: [],
    description: '',
    features: '',
    specifications: '',
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
    image: '',
    isActive: true,
  };
  const [sliderForm, setSliderForm] = useState(initialSliderForm);

  // Review Form State
  const initialReviewForm = {
    name: '',
    role: 'Commercial Client',
    businessName: '',
    rating: 5,
    comment: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isActive: true,
  };
  const [reviewForm, setReviewForm] = useState(initialReviewForm);

  // Load all admin data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [prods, offs, msgs, ords, slds, revs] = await Promise.all([
        api.getProducts(),
        api.getOffers(),
        api.getContacts(),
        api.getOrders(),
        api.getSliders(),
        api.getReviews(),
      ]);
      setProducts(prods);
      setOffers(offs);
      setContacts(Array.isArray(msgs) ? msgs.filter(m => m && m.name !== 'Elena Rostova' && m.name !== 'Liam Henderson') : []);
      setOrders(Array.isArray(ords) ? ords.filter(o => !isDummyOrder(o)) : []);
      setSliders(slds);
      setReviews(revs);
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
    window.addEventListener('aravez_reviews_updated', loadAdminData);
    return () => {
      window.removeEventListener('aravez_orders_updated', loadAdminData);
      window.removeEventListener('aravez_reviews_updated', loadAdminData);
    };
  }, []);

  // --- LOCAL & CLOUDINARY FILE UPLOAD HANDLERS ---
  const handleSliderFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingSliderImage(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        try {
          const uploadRes = await api.uploadImage(base64, 'aravez_sliders');
          const finalUrl = uploadRes.url || base64;
          setSliderForm(prev => ({
            ...prev,
            image: finalUrl,
          }));
        } catch (err) {
          setSliderForm(prev => ({
            ...prev,
            image: base64,
          }));
        } finally {
          setIsUploadingSliderImage(false);
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

    setIsUploadingPhotos(true);
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
          setIsUploadingPhotos(false);
          setProductForm(prev => {
            const currentList = prev.images && prev.images.length > 0 ? prev.images : (prev.image ? [prev.image] : []);
            const updatedImages = [...currentList, ...loadedUrls];
            return {
              ...prev,
              images: updatedImages,
              image: prev.image || updatedImages[0],
            };
          });
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

    const finalCategory = productForm.category === 'Other'
      ? (productForm.customCategory?.trim() || 'Other')
      : productForm.category;

    // Process features into array:
    // If entered line-by-line (with newlines), split strictly by line to preserve internal commas!
    // If entered on a single line with commas, split by comma.
    let featuresArray = [];
    if (typeof productForm.features === 'string' && productForm.features.trim()) {
      const raw = productForm.features.trim();
      if (raw.includes('\n')) {
        featuresArray = raw
          .split(/\r?\n/)
          .map(f => f.replace(/^[•\-\*]\s*/, '').trim())
          .filter(Boolean);
      } else if (raw.includes(',')) {
        featuresArray = raw
          .split(',')
          .map(f => f.replace(/^[•\-\*]\s*/, '').trim())
          .filter(Boolean);
      } else {
        featuresArray = [raw.replace(/^[•\-\*]\s*/, '').trim()];
      }
    } else if (Array.isArray(productForm.features)) {
      featuresArray = productForm.features;
    }

    // Process specifications into a clean newline-separated string
    let specsString = '';
    if (typeof productForm.specifications === 'string') {
      specsString = productForm.specifications
        .split(/\r?\n/)
        .map(s => s.trim())
        .filter(Boolean)
        .join('\n');
    } else if (Array.isArray(productForm.specifications)) {
      specsString = productForm.specifications.join('\n');
    }

    const payload = {
      ...productForm,
      category: finalCategory,
      price: Number(productForm.price),
      discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : null,
      image: mainImage,
      images: allImages,
      features: featuresArray,
      specifications: specsString,
      rating: editingProduct ? editingProduct.rating : 4.9,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 1,
    };
    delete payload.customCategory;

    try {
      if (editingProduct) {
        const updated = await api.updateProduct(editingProduct._id, payload);
        setProducts(prev => prev.map(p => (p._id === editingProduct._id ? { ...p, ...payload, ...updated } : p)));
        window.dispatchEvent(new Event('aravez_catalog_updated'));
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

    const isStdCategory = PRODUCT_CATEGORIES.includes(product.category) && product.category !== 'All Products';
    const cat = isStdCategory ? product.category : 'Other';
    const customCat = isStdCategory ? '' : (product.category || '');

    const feats = Array.isArray(product.features)
      ? product.features.join('\n')
      : (product.features || '');

    let specs = '';
    if (Array.isArray(product.specifications)) {
      specs = product.specifications.join('\n');
    } else if (product.specifications && typeof product.specifications === 'object') {
      specs = Object.entries(product.specifications).map(([k, v]) => `${k}: ${v}`).join('\n');
    } else {
      specs = product.specifications || '';
    }

    setProductForm({
      name: product.name,
      category: cat,
      customCategory: customCat,
      price: product.price,
      discountPercent: pct,
      discountPrice: dp,
      image: product.image || imgs[0] || '',
      images: imgs,
      description: product.description || '',
      features: feats,
      specifications: specs,
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
      image: sliderForm.image,
      isActive: sliderForm.isActive !== false,
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
      image: slide.image,
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

  // --- REVIEWS ACTIONS ---
  const handleReviewAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingReviewAvatar(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        try {
          const uploadRes = await api.uploadImage(base64, 'aravez_reviews');
          const finalUrl = uploadRes.url || base64;
          setReviewForm(prev => ({ ...prev, avatar: finalUrl }));
        } catch {
          setReviewForm(prev => ({ ...prev, avatar: base64 }));
        } finally {
          setIsUploadingReviewAvatar(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveReview = async (e) => {
    if (e) e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) {
      addToast('Please provide customer name and review comment', 'error');
      return;
    }

    try {
      if (editingReview) {
        const updated = await api.updateReview(editingReview._id, reviewForm);
        setReviews(prev => prev.map(r => (r._id === editingReview._id ? { ...r, ...reviewForm, ...updated } : r)));
        addToast(`Review from "${reviewForm.name}" updated successfully!`, 'success');
      } else {
        const created = await api.createReview(reviewForm);
        setReviews(prev => [created, ...prev.filter(r => r._id !== created._id)]);
        addToast(`Review from "${reviewForm.name}" published to Landing Page! ⭐`, 'success');
      }
      setIsAddReviewOpen(false);
      setEditingReview(null);
      setReviewForm(initialReviewForm);
    } catch (err) {
      addToast('Failed to save review', 'error');
    }
  };

  const handleEditReview = (rev) => {
    setEditingReview(rev);
    setReviewForm({
      name: rev.name || '',
      role: rev.role || 'Commercial Client',
      businessName: rev.businessName || '',
      rating: rev.rating || 5,
      comment: rev.comment || '',
      avatar: rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isActive: rev.isActive !== false,
    });
    setIsAddReviewOpen(true);
  };

  const handleDeleteReview = async (id, name) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    try {
      await api.deleteReview(id);
      setReviews(prev => prev.filter(r => r._id !== id));
      addToast('Review deleted', 'info');
    } catch (err) {
      addToast('Failed to delete review', 'error');
    }
  };

  const handleToggleReviewActive = async (rev) => {
    const newActive = !rev.isActive;
    try {
      await api.updateReview(rev._id, { ...rev, isActive: newActive });
      setReviews(prev => prev.map(r => (r._id === rev._id ? { ...r, isActive: newActive } : r)));
      addToast('Review visibility updated', 'success');
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedCatFilter === 'All' || p.category === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 selection:bg-[#ea0028] selection:text-white">
        <div className="max-w-md w-full bg-[#1d1d1d] border border-gray-800 border-t-4 border-t-[#ea0028] rounded-none p-6 sm:p-10 shadow-2xl space-y-8 animate-fade-in">
          
          {/* Header Badge & Title */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-none bg-[#ea0028] text-white mx-auto flex items-center justify-center shadow-lg shadow-red-950/40">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Aravez Admin Portal
              </h1>
              <p className="text-xs text-gray-400 mt-1 font-medium">
                Enter authorized admin credentials to access store dashboard
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5 text-left">
            {loginError && (
              <div className="p-3.5 rounded-none bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold text-center animate-shake">
                ⚠️ {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                Admin Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder=""
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-[#141414] border border-gray-700 rounded-none py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ea0028] focus:ring-2 focus:ring-[#ea0028]/20 transition-all font-mono"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                Admin Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder=""
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-[#141414] border border-gray-700 rounded-none py-3 pl-10 pr-10 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ea0028] focus:ring-2 focus:ring-[#ea0028]/20 transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ea0028] hover:bg-[#cc0020] text-white font-extrabold py-3.5 px-6 rounded-none text-xs sm:text-sm shadow-xl shadow-red-950/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-white" />
              <span>Unlock Admin Workspace</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-800">
            <Link to="/" className="text-xs text-gray-400 hover:text-[#ea0028] transition-colors font-medium">
              ← Return to Main Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-800 pb-20">
      
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#1d1d1d] text-white border-b border-gray-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Brand / Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-[#ea0028] text-white flex items-center justify-center font-black text-xl shadow-md tracking-tighter">
                A
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white block">
                  Aravez Admin Control
                </span>
                <span className="text-[10px] text-[#ea0028] font-semibold tracking-wider uppercase">
                  Live AV Management Suite
                </span>
              </div>
            </div>

            {/* View Live Store & Logout Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={loadAdminData}
                className="p-2 rounded-none bg-[#2a2a2a] hover:bg-[#333333] text-gray-200 hover:text-white transition-colors cursor-pointer border border-gray-700"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                to="/"
                target="_blank"
                className="bg-[#2a2a2a] hover:bg-[#ea0028] text-white text-xs font-semibold px-4 py-2 rounded-none flex items-center gap-1.5 transition-all shadow-sm border border-gray-700"
              >
                <span>View Live Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-950/40 hover:bg-[#ea0028] text-red-200 hover:text-white text-xs font-semibold px-3.5 py-2 rounded-none flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-red-800/40"
                title="Lock & Logout Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center overflow-x-auto gap-2 p-1.5 bg-white rounded-none border border-gray-200 shadow-xs">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, count: null },
            { id: 'sliders', label: 'Hero Sliders', icon: Sliders, count: sliders.length },
            { id: 'products', label: 'Products Manager', icon: Package, count: products.length },
            { id: 'contacts', label: 'Customer Inquiries', icon: Mail, count: contacts.length },
            { id: 'orders', label: 'Orders Manager', icon: ShoppingBag, count: orders.length },
            { id: 'reviews', label: 'Reviews Manager', icon: Star, count: reviews.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-none text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#1d1d1d] text-white border-[#ea0028] shadow-md'
                    : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-none font-bold ${
                      isActive ? 'bg-[#ea0028] text-white' : 'bg-gray-100 text-gray-600'
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
              <div className="bg-white p-6 rounded-none border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Home Sliders</span>
                  <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{sliders.length}</h3>
                  <span className="text-xs text-gray-600 font-semibold mt-1 inline-block">Active Hero Banners</span>
                </div>
                <div className="w-12 h-12 rounded-none bg-red-50 text-[#ea0028] flex items-center justify-center">
                  <Sliders className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-none border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Products</span>
                  <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{products.length}</h3>
                  <span className="text-xs text-[#ea0028] font-bold mt-1 inline-block">
                    {products.filter(p => p.inStock).length} In Stock
                  </span>
                </div>
                <div className="w-12 h-12 rounded-none bg-gray-100 text-[#1d1d1d] flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-none border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
                  <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{orders.length}</h3>
                  <span className="text-xs text-gray-600 font-semibold mt-1 inline-block">Paid Online Orders</span>
                </div>
                <div className="w-12 h-12 rounded-none bg-amber-50 text-amber-700 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-none border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Inquiries</span>
                  <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{contacts.length}</h3>
                  <span className="text-xs text-rose-600 font-semibold mt-1 inline-block">Customer Messages</span>
                </div>
                <div className="w-12 h-12 rounded-none bg-rose-50 text-rose-700 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Quick Action Cards */}
              <div className="lg:col-span-6 bg-[#1d1d1d] text-white border border-gray-800 rounded-none p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10 space-y-4">
                  <span className="inline-block px-3 py-1 bg-[#2a2a2a] text-[#ea0028] border border-red-500/30 rounded-none text-xs font-bold uppercase tracking-wider">
                    ⚡ Quick Operations
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Manage Your Aravez Store & Home Sliders
                  </h2>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
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
                    className="bg-[#ea0028] hover:bg-[#cc0020] text-white font-bold px-5 py-2.5 rounded-none text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-105 cursor-pointer"
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
                    className="bg-[#2a2a2a] hover:bg-gray-800 text-white font-bold px-5 py-2.5 rounded-none text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-105 border border-gray-700 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#ea0028]" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Recent Inquiries Preview */}
              <div className="lg:col-span-6 bg-white rounded-none p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Recent Customer Inquiries</h3>
                  <button
                    onClick={() => setActiveTab('contacts')}
                    className="text-xs font-bold text-[#ea0028] hover:underline cursor-pointer"
                  >
                    View all ({contacts.length}) →
                  </button>
                </div>

                {contacts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No customer messages yet.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 space-y-3">
                    {contacts.slice(0, 3).map((item) => (
                      <div key={item._id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-gray-900">{item.name}</span>
                            <span className="text-[10px] bg-red-50 text-[#ea0028] font-bold px-2 py-0.5 rounded-none">
                              {item.subject}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-1">{item.message}</p>
                          <span className="text-[10px] text-gray-400">{item.email}</span>
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
            
            {/* Header & Regular Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <h3 className="font-bold text-2xl text-slate-900">Active Home Page Hero Sliders</h3>
                <p className="text-xs text-slate-500 mt-1">Total {sliders.length} slides currently configured.</p>
              </div>
              <button
                onClick={() => {
                  setEditingSlider(null);
                  setSliderForm(initialSliderForm);
                  setIsAddSliderOpen(true);
                }}
                className="bg-[#ea0028] hover:bg-[#cc0020] text-white font-bold px-6 py-3 rounded-none text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer"
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
                  className="bg-white rounded-none border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-video bg-slate-100">
                    <img
                      src={slide.image}
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#1d1d1d]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-none backdrop-blur-md shadow-xs">
                      Slide #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleToggleSliderActive(slide)}
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-none shadow-sm cursor-pointer transition-colors ${
                        slide.isActive !== false
                          ? 'bg-[#ea0028] text-white hover:bg-[#cc0020]'
                          : 'bg-slate-600 text-white hover:bg-slate-700'
                      }`}
                    >
                      {slide.isActive !== false ? '● Active' : '✕ Hidden'}
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Banner Slide #{idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditSlider(slide)}
                        className="p-2 rounded-none bg-white hover:bg-red-50 text-slate-600 hover:text-[#ea0028] border border-slate-200 transition-colors cursor-pointer"
                        title="Edit Slide"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlider(slide._id, `Slide #${idx + 1}`)}
                        className="p-2 rounded-none bg-white hover:bg-rose-100 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
            <div className="bg-white rounded-none p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search product by title or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-none py-2.5 pl-9 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>

                <select
                  value={selectedCatFilter}
                  onChange={(e) => setSelectedCatFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-none py-2.5 px-3 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
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
                className="w-full md:w-auto bg-[#ea0028] hover:bg-[#cc0020] text-white font-bold px-6 py-3 rounded-none text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-none border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4">Badges</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-12 text-slate-400">
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
                                className="w-12 h-12 object-cover rounded-none border border-slate-200 bg-slate-100 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{p.name}</h4>
                                <span className="text-[11px] text-slate-400">{p.volume || 'Standard'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-red-50 text-[#ea0028] border border-red-100 font-bold px-2.5 py-1 rounded-none text-[11px]">
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
                            <div className="flex gap-1 flex-wrap">
                              {p.isBestSeller && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-none">
                                  Best Seller
                                </span>
                              )}
                              {p.isFeatured && (
                                <span className="bg-red-100 text-[#ea0028] border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-none">
                                  Featured
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="p-2 rounded-none bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-[#ea0028] border border-slate-200 transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id, p.name)}
                                className="p-2 rounded-none bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors cursor-pointer"
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
                <h3 className="font-bold text-2xl text-slate-900">Customer Messages & Inquiries</h3>
                <p className="text-xs text-slate-500 mt-1">Direct inquiries submitted through the Contact Us form.</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Total: {contacts.length} Inquiries
              </span>
            </div>

            <div className="space-y-4">
              {contacts.length === 0 ? (
                <div className="bg-white rounded-none p-12 text-center border border-slate-200 text-slate-400 text-xs">
                  No inquiries received yet.
                </div>
              ) : (
                contacts.map((msg) => (
                  <div
                    key={msg._id}
                    className="bg-white rounded-none p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-slate-900 text-sm">{msg.name}</h4>
                        <span className="bg-red-50 text-[#ea0028] border border-red-100 text-[10px] font-bold px-2.5 py-0.5 rounded-none">
                          {msg.subject}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span>📧 {msg.email}</span>
                        {msg.phone && <span>📞 {msg.phone}</span>}
                        {msg.createdAt && <span>🗓️ {new Date(msg.createdAt).toLocaleDateString()}</span>}
                      </div>
                      <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-none border border-slate-100 leading-relaxed mt-2">
                        "{msg.message}"
                      </p>
                    </div>

                    <div className="flex md:flex-col justify-end items-end gap-2 shrink-0">
                      <a
                        href={`mailto:${msg.email}?subject=Aravez Care: In response to your inquiry`}
                        className="bg-[#ea0028] hover:bg-[#cc0020] text-white text-xs font-bold px-4 py-2 rounded-none transition-colors"
                      >
                        Reply via Email
                      </a>
                      <button
                        onClick={() => handleDeleteContact(msg._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
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
                <h3 className="font-bold text-2xl text-slate-900">Customer Orders Manager</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Track online paid orders, customer delivery details, and update shipment status.
                </p>
              </div>
              <div className="bg-red-50 text-[#ea0028] px-4 py-2 rounded-none text-xs font-bold border border-red-200 shadow-xs flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#ea0028]" />
                <span>Total Orders: {orders.length}</span>
              </div>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-none p-12 text-center border border-slate-200 text-slate-400 text-xs">
                  No customer orders received yet.
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord._id || ord.orderId}
                    className="bg-white rounded-none p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                  >
                    {/* Top Row: Order ID & Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm bg-slate-100 text-slate-900 px-3 py-1 rounded-none">
                          {ord.orderId}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          🗓️ {ord.createdAt ? new Date(ord.createdAt).toLocaleString('en-IN') : 'Recent Order'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-[#1d1d1d] text-white text-xs font-bold px-3 py-1 rounded-none">
                          {ord.paymentStatus || 'PAID'} ({ord.paymentMethod || 'Online Payment'})
                        </span>
                        
                        <select
                          value={ord.status || 'Processing'}
                          onChange={(e) => handleUpdateOrderStatus(ord.orderId || ord._id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1 rounded-none border focus:outline-none cursor-pointer ${
                            ord.status === 'Delivered'
                              ? 'bg-[#1d1d1d] text-white border-gray-800'
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
                      <div className="md:col-span-5 bg-slate-50 p-4 rounded-none border border-slate-100 space-y-1.5">
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
                          <span className="text-[#ea0028] text-base font-extrabold">₹{Number(ord.totalAmount).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleDeleteOrder(ord.orderId || ord._id)}
                        className="text-xs text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer"
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

        {/* ======================= REVIEWS MANAGER TAB ======================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in">
            {/* Action Bar */}
            <div className="bg-white p-6 rounded-none border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <span>Stories & Reviews Manager</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage real customer stories, ratings, client photos, and corporate testimonials shown on the landing page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingReview(null);
                  setReviewForm(initialReviewForm);
                  setIsAddReviewOpen(true);
                }}
                className="bg-[#ea0028] hover:bg-[#cc0020] text-white text-xs font-bold px-5 py-3 rounded-none flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Review</span>
              </button>
            </div>

            {/* Reviews Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.length === 0 ? (
                <div className="col-span-full bg-white rounded-none p-12 text-center border border-dashed border-slate-300">
                  <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-700 text-base">No Customer Reviews Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Click "Add New Review" to publish your first client story with star rating, photo, and company name to the landing page!
                  </p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="bg-white rounded-none p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4 relative group"
                  >
                    <div>
                      {/* Top Row: Rating & Active Status */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleReviewActive(rev)}
                          className={`text-[11px] font-bold px-3 py-1 rounded-none border transition-all cursor-pointer ${
                            rev.isActive !== false
                              ? 'bg-red-50 text-[#ea0028] border-red-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {rev.isActive !== false ? '● Live on Landing' : '✕ Hidden'}
                        </button>
                      </div>

                      {/* Comment Message */}
                      <p className="text-xs text-slate-700 italic leading-relaxed pt-3">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Customer Profile & Actions Footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={rev.name}
                          className="w-10 h-10 rounded-none object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{rev.name}</h4>
                          <span className="text-[11px] text-slate-600 font-medium block truncate">
                            {rev.businessName ? `${rev.businessName} • ${rev.role}` : rev.role}
                          </span>
                        </div>
                      </div>

                      {/* Edit / Delete Buttons */}
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleEditReview(rev)}
                          className="p-2 rounded-none bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-[#ea0028] border border-slate-200 transition-colors cursor-pointer"
                          title="Edit Review"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev._id, rev.name)}
                          className="p-2 rounded-none bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* ----------------- FULL SCREEN HERO SLIDER CREATION & EDITING STUDIO ----------------- */}
      {isAddSliderOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100/95 backdrop-blur-md overflow-y-auto animate-fade-in flex flex-col min-h-screen">
          {/* Top Sticky Navigation Bar */}
          <div className="sticky top-0 z-30 bg-[#1d1d1d] text-white px-6 py-4 shadow-xl border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddSliderOpen(false)}
                className="p-2 rounded-none bg-[#2a2a2a] hover:bg-[#333333] text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <X className="w-5 h-5" />
                <span>Close Studio</span>
              </button>
              <div className="h-6 w-[1px] bg-gray-700" />
              <div>
                <h2 className="font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#ea0028]" />
                  <span>{editingSlider ? 'Edit Hero Banner Slide' : 'Hero Banner Creation Studio'}</span>
                </h2>
                <span className="text-[11px] text-gray-400">Upload banner image & set headline text for landing page carousel</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddSliderOpen(false)}
                className="px-4 py-2 rounded-none text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleSaveSlider(e)}
                className="bg-[#ea0028] hover:bg-[#cc0020] text-white font-bold px-6 py-2.5 rounded-none text-xs shadow-lg shadow-red-950/40 transition-all transform hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingSlider ? 'Save & Update Slide' : 'Publish Banner Slide'}</span>
              </button>
            </div>
          </div>

          {/* Studio Workspace Content */}
          <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
            <form onSubmit={handleSaveSlider} className="space-y-6 text-xs">
              <div className="bg-white rounded-none p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Upload Hero Banner Image</h3>
                    <p className="text-xs text-slate-500">Select image from PC (Recommended size: 100% width x 60vh height)</p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={sliderFileInputRef}
                  accept="image/*"
                  onChange={handleSliderFileChange}
                  className="hidden"
                />

                {sliderForm.image ? (
                  <div className="relative rounded-none overflow-hidden border-2 border-[#ea0028] bg-slate-100 aspect-video flex items-center justify-center group shadow-md">
                    <img
                      src={sliderForm.image}
                      alt="Selected preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#111111]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => sliderFileInputRef.current?.click()}
                        className="bg-white text-slate-900 font-bold px-4 py-2.5 rounded-none text-xs shadow-md hover:bg-red-50 hover:text-[#ea0028] transition-colors cursor-pointer"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setSliderForm(prev => ({ ...prev, image: '' }))}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-none text-xs shadow-md transition-colors cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => !isUploadingSliderImage && sliderFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-none p-10 text-center transition-all flex flex-col items-center justify-center gap-3 group ${
                      isUploadingSliderImage
                        ? 'border-[#ea0028] bg-red-50/50 cursor-wait'
                        : 'border-slate-300 hover:border-[#ea0028] bg-slate-50/50 hover:bg-red-50/20 cursor-pointer'
                    }`}
                  >
                    {isUploadingSliderImage ? (
                      <>
                        <div className="w-16 h-16 rounded-none bg-red-100 text-[#ea0028] flex items-center justify-center shadow-xs">
                          <Loader2 className="w-8 h-8 animate-spin text-[#ea0028]" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-base block">Uploading Banner Image to Cloudinary...</span>
                          <span className="text-xs text-[#ea0028] font-medium">Processing high-res image, please wait...</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-none bg-red-50 text-[#ea0028] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                          <UploadCloud className="w-8 h-8" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-base block">Click to Browse Local Computer Image</span>
                          <span className="text-xs text-slate-500">Supports JPG, PNG, WEBP files</span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Or Manual URL Add */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Or paste direct image URL:
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={sliderForm.image.startsWith('data:') ? '' : sliderForm.image}
                    onChange={(e) => setSliderForm({ ...sliderForm, image: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea0028] font-medium"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddSliderOpen(false)}
                    className="px-6 py-3 rounded-none border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#ea0028] hover:bg-[#cc0020] text-white font-extrabold px-8 py-3 rounded-none text-xs shadow-lg shadow-red-950/20 transition-transform hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{editingSlider ? 'Update Slide' : 'Publish Banner Slide to Home Page'}</span>
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- FULL SCREEN REVIEW CREATION & EDITING STUDIO ----------------- */}
      {isAddReviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100/95 backdrop-blur-md overflow-y-auto animate-fade-in flex flex-col min-h-screen">
          {/* Top Sticky Navigation Bar */}
          <div className="sticky top-0 z-30 bg-[#1d1d1d] text-white px-6 py-4 shadow-xl border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddReviewOpen(false)}
                className="p-2 rounded-none bg-[#2a2a2a] hover:bg-[#333333] text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <X className="w-5 h-5" />
                <span>Close Studio</span>
              </button>
              <div className="h-6 w-[1px] bg-gray-700" />
              <div>
                <h2 className="font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>{editingReview ? 'Edit Community Review' : 'Create New Community Review'}</span>
                </h2>
                <span className="text-xs text-gray-400">
                  Manage client testimonials, ratings & business feedback for Aravez Landing Page
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveReview}
                className="bg-[#ea0028] hover:bg-[#cc0020] text-white text-xs font-bold px-6 py-2.5 rounded-none shadow-lg shadow-red-950/40 flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingReview ? 'Update Review' : 'Publish Review'}</span>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
            <form onSubmit={handleSaveReview} className="space-y-6">
              
              {/* Reviewer Details Card */}
              <div className="bg-white rounded-none p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                <h3 className="font-bold text-lg text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#ea0028]" />
                  <span>Client & Organization Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Customer / Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea0028] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Business / Organization Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Educational Trust / TechCorp"
                      value={reviewForm.businessName}
                      onChange={(e) => setReviewForm({ ...reviewForm, businessName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea0028] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Designation / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. IT Director / Verified Client"
                      value={reviewForm.role}
                      onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea0028] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Rating (1 to 5 Stars)</label>
                    <div className="flex items-center gap-2 pt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="p-1 cursor-pointer transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= reviewForm.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-extrabold text-slate-700 ml-2">
                        {reviewForm.rating} of 5 Stars
                      </span>
                    </div>
                  </div>
                </div>

                {/* Avatar / Photo Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Client Photo / Company Logo</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-none border border-slate-200">
                    <img
                      src={reviewForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-none object-cover border-2 border-red-200 shadow-sm shrink-0"
                    />
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="file"
                        ref={reviewFileInputRef}
                        accept="image/*"
                        onChange={handleReviewAvatarUpload}
                        className="hidden"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={isUploadingReviewAvatar}
                          onClick={() => reviewFileInputRef.current?.click()}
                          className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold px-4 py-2 rounded-none border border-slate-200 shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          {isUploadingReviewAvatar ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ea0028]" />
                              <span>Uploading Photo...</span>
                            </>
                          ) : (
                            <>
                              <Camera className="w-3.5 h-3.5 text-[#ea0028]" />
                              <span>Upload Photo / Logo</span>
                            </>
                          )}
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Or enter direct photo URL..."
                        value={reviewForm.avatar}
                        onChange={(e) => setReviewForm({ ...reviewForm, avatar: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-none px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea0028] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Review Message / Feedback *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write client testimonial or feedback regarding Aravez AV installation, products, or service..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea0028] resize-y leading-relaxed font-medium"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="reviewIsActive"
                    checked={reviewForm.isActive}
                    onChange={(e) => setReviewForm({ ...reviewForm, isActive: e.target.checked })}
                    className="accent-[#ea0028] w-4 h-4 rounded-none cursor-pointer"
                  />
                  <label htmlFor="reviewIsActive" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Show immediately in "Stories From Our Community" on Landing Page
                  </label>
                </div>

              </div>

              {/* Bottom Submit Action */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddReviewOpen(false)}
                  className="px-6 py-3 rounded-none bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-none bg-[#ea0028] hover:bg-[#cc0020] text-xs font-bold text-white shadow-lg shadow-red-950/20 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingReview ? 'Save & Update Review' : 'Publish Review to Storefront'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ----------------- FULL SCREEN PRODUCT CREATION & EDITING STUDIO ----------------- */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100/95 backdrop-blur-md overflow-y-auto animate-fade-in flex flex-col min-h-screen">
          {/* Top Sticky Navigation Bar */}
          <div className="sticky top-0 z-30 bg-[#1d1d1d] text-white px-6 py-4 shadow-xl border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="p-2 rounded-none bg-[#2a2a2a] hover:bg-[#333333] text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <X className="w-5 h-5" />
                <span>Close Studio</span>
              </button>
              <div className="h-6 w-[1px] bg-gray-700" />
              <div>
                <h2 className="font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#ea0028]" />
                  <span>{editingProduct ? `Editing: "${editingProduct.name}"` : 'Add New Product Studio'}</span>
                </h2>
                <span className="text-[11px] text-gray-400">Fill details & upload images to publish product to live store</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="px-4 py-2 rounded-none text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleSaveProduct(e)}
                className="bg-[#ea0028] hover:bg-[#cc0020] text-white font-bold px-6 py-2.5 rounded-none text-xs shadow-lg shadow-red-950/40 transition-all transform hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingProduct ? 'Save & Update Product' : 'Publish Product to Website'}</span>
              </button>
            </div>
          </div>

          {/* Studio Workspace Content */}
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
            <form id="product-form" onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">

              {/* Left Column (Span 5): Product Media & Multi-Photo Upload */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Media Card */}
                <div className="bg-white rounded-none p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">Product Media & Gallery</h3>
                      <p className="text-[11px] text-slate-500">Upload 8+ high-res images for multi-angle view</p>
                    </div>
                    <span className="text-xs font-bold text-[#ea0028] bg-red-50 border border-red-100 px-2.5 py-1 rounded-none">
                      {productForm.images?.length || (productForm.image ? 1 : 0)} Photos
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

                  {/* Multi-Photo Big Dropzone Button */}
                  <div
                    onClick={() => !isUploadingPhotos && productFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-none p-6 text-center transition-all flex flex-col items-center justify-center gap-3 group ${
                      isUploadingPhotos
                        ? 'border-[#ea0028] bg-red-50/50 cursor-wait'
                        : 'border-slate-300 hover:border-[#ea0028] bg-slate-50/50 hover:bg-red-50/20 cursor-pointer'
                    }`}
                  >
                    {isUploadingPhotos ? (
                      <>
                        <div className="w-14 h-14 rounded-none bg-red-100 text-[#ea0028] flex items-center justify-center shadow-xs">
                          <Loader2 className="w-8 h-8 animate-spin text-[#ea0028]" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">Uploading Photos to Cloudinary...</span>
                          <span className="text-[11px] text-[#ea0028] font-medium">Processing high-res images, please wait...</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-none bg-red-50 text-[#ea0028] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                          <FolderOpen className="w-7 h-7" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">Click to Browse & Upload Photos from PC</span>
                          <span className="text-[11px] text-slate-500">Select multiple images at once (Supports JPG, PNG, WEBP)</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Or Manual URL Add */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] font-semibold whitespace-nowrap">Or Add Image URL:</span>
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
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-none px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                    />
                  </div>

                  {/* Uploaded Gallery Grid */}
                  {(productForm.images && productForm.images.length > 0) ? (
                    <div className="pt-2 space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Uploaded Photos (Click "Set Cover" to choose main photo):
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {productForm.images.map((img, idx) => {
                          const isMain = productForm.image === img || (!productForm.image && idx === 0);
                          return (
                            <div
                              key={idx}
                              className={`relative aspect-square rounded-none overflow-hidden border-2 shadow-xs group ${
                                isMain ? 'border-[#ea0028] ring-2 ring-red-500/40' : 'border-slate-200 bg-slate-50'
                              }`}
                            >
                              <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                              {isMain && (
                                <span className="absolute top-1 left-1 bg-[#ea0028] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-none shadow">
                                  ★ Main Cover
                                </span>
                              )}
                              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                                {!isMain && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetMainProductImage(img)}
                                    className="bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded-none shadow hover:bg-red-50 hover:text-[#ea0028]"
                                  >
                                    Set Cover
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProductImage(idx)}
                                  className="bg-rose-600 text-white p-1 rounded-none hover:bg-rose-700 cursor-pointer"
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
                    <div className="mt-2 flex items-center gap-3 p-3 bg-red-50 rounded-none border border-red-200">
                      <img src={productForm.image} alt="Preview" className="w-14 h-14 rounded-none object-cover border" />
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">Main Cover Loaded</span>
                        <span className="text-[11px] text-slate-500">Ready for catalog</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Display & Stock Settings Box */}
                <div className="bg-white rounded-none p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="font-bold text-base text-slate-900">Visibility & Display Badges</h3>
                  <div className="space-y-3">

                    <label className="flex items-center justify-between p-3.5 rounded-none bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                      <div>
                        <span className="font-bold text-slate-800 block text-xs">⭐ Best Seller Badge</span>
                        <span className="text-[11px] text-slate-500">Show under Best Seller filter</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={productForm.isBestSeller}
                        onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                        className="accent-[#ea0028] w-5 h-5 rounded-none cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-none bg-red-50/80 border border-red-200 cursor-pointer hover:bg-red-100/70 transition-colors">
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">🌟 Mark as Featured</span>
                        <span className="text-[11px] text-[#ea0028] font-medium">Display on Home Landing Page</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={productForm.isFeatured}
                        onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                        className="accent-[#ea0028] w-5 h-5 rounded-none cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

              </div>

              {/* Right Column (Span 7): Product Information Form */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Basic Information Card */}
                <div className="bg-white rounded-none p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
                  <h3 className="font-bold text-lg text-slate-900 pb-2 border-b border-slate-100">
                    Product Core Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-800 mb-1.5">Product Title / Model Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aravez 75-inch 4K Interactive Flat Panel Display"
                        value={productForm.name ?? ''}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                      />
                    </div>

                    <div className="sm:col-span-2 relative">
                      <label className="block font-bold text-slate-800 mb-1.5">Category *</label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-none px-4 py-3 text-xs sm:text-sm font-bold text-left flex items-center justify-between text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea0028] shadow-xs cursor-pointer transition-colors"
                      >
                        <span>{productForm.category || 'Select Category'}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180 text-[#ea0028]' : ''}`} />
                      </button>

                      {/* Custom Downward Opening Options Dropdown */}
                      {isCategoryDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white border border-slate-200 rounded-none shadow-2xl overflow-hidden max-h-64 overflow-y-auto divide-y divide-slate-100 animate-fade-in">
                          {PRODUCT_CATEGORIES.filter(c => c !== 'All Products').map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setProductForm({ ...productForm, category: c });
                                setIsCategoryDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                productForm.category === c
                                  ? 'bg-red-50 text-[#ea0028] font-bold'
                                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              <span>{c}</span>
                              {productForm.category === c && <Check className="w-4 h-4 text-[#ea0028] shrink-0" />}
                            </button>
                          ))}
                        </div>
                      )}

                      {productForm.category === 'Other' && (
                        <div className="mt-3 p-3 bg-red-50 rounded-none border border-red-200">
                          <label className="block font-bold text-slate-900 mb-1 text-xs">Specify Custom Category Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Smart Teleprompters / Mounting Rigs"
                            value={productForm.customCategory ?? ''}
                            onChange={(e) => setProductForm({ ...productForm, customCategory: e.target.value })}
                            className="w-full bg-white border border-red-300 rounded-none px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & Discount Card */}
                <div className="bg-white rounded-none p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="font-bold text-lg text-slate-900 pb-2 border-b border-slate-100">
                    Pricing & Commercial Quotation (₹ INR)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 sm:p-5 rounded-none border border-slate-200">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Original Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g. 150000"
                        value={productForm.price ?? ''}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-none px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Discount (% OFF)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="e.g. 15"
                        value={productForm.discountPercent ?? ''}
                        onChange={(e) => handleDiscountPercentChange(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-none px-3.5 py-2.5 font-bold text-[#ea0028] focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Discount Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 127500"
                        value={productForm.discountPrice ?? ''}
                        onChange={(e) => handleDiscountPriceChange(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-none px-3.5 py-2.5 font-bold text-[#ea0028] focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                      />
                    </div>
                  </div>

                  {productForm.price > 0 && (
                    <div className="bg-[#1d1d1d] text-white rounded-none p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-[#ea0028] text-white px-2.5 py-1 rounded-none font-bold uppercase tracking-wider">
                          Summary
                        </span>
                        <span>MRP: <strong>₹{Number(productForm.price).toLocaleString('en-IN')}</strong></span>
                        {productForm.discountPercent > 0 && (
                          <span className="text-amber-300 font-extrabold">({productForm.discountPercent}% OFF)</span>
                        )}
                      </div>
                      <div className="text-sm font-black text-white">
                        Selling Price: <span className="text-[#ea0028]">₹{Number(productForm.discountPrice || productForm.price).toLocaleString('en-IN')}</span>
                        {productForm.discountPrice && (
                          <span className="text-xs text-gray-300 font-normal ml-2">
                            (Savings: ₹{(Number(productForm.price) - Number(productForm.discountPrice)).toLocaleString('en-IN')})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Features & Specifications Card */}
                <div className="bg-white rounded-none p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
                  <h3 className="font-bold text-lg text-slate-900 pb-2 border-b border-slate-100">
                    Features & Technical Specifications
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                        Key Features
                      </label>
                      <textarea
                        rows={6}
                        placeholder="• 20-Point Multi-Touch Glass&#10;• Built-in 4K Camera & 8-Array Mic&#10;• Dual OS Android 11 & Windows 11&#10;• Anti-glare Toughened Glass"
                        value={productForm.features ?? ''}
                        onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ea0028] resize-y text-xs font-medium leading-relaxed min-h-[140px]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                        Technical Specifications
                      </label>
                      <textarea
                        rows={6}
                        placeholder="Screen Size: 75 inch 4K UHD&#10;Brightness: 450 cd/m²&#10;Touch Points: 20-Point IR Touch&#10;Warranty: 3 Years Onsite Warranty"
                        value={productForm.specifications ?? ''}
                        onChange={(e) => setProductForm({ ...productForm, specifications: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ea0028] resize-y text-xs font-mono leading-relaxed min-h-[140px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Full Product Description *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Detailed commercial description, installation guidelines, compatibility and warranty info..."
                      value={productForm.description ?? ''}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ea0028] resize-y text-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* Bottom Submit Action */}
                <div className="pt-4 flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-6 py-3 rounded-none border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#ea0028] hover:bg-[#cc0020] text-white font-extrabold px-8 py-3 rounded-none text-xs shadow-lg shadow-red-950/20 transition-transform hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingProduct ? 'Save & Update Product' : 'Publish Product to Catalog'}</span>
                  </button>
                </div>

              </div>

            </form>
          </div>
        </div>
      )}



    </div>
  );
};

export default Admin;
