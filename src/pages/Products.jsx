import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, Heart, Layers } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export const PRODUCT_CATEGORIES = [
  'All Products',
  'Touchbooks',
  'Projecters',
  'Interactive Panels',
  'Signages',
  'Active LED',
  'Home Theater',
  'Audio Video Receiver',
  'Speakers',
  'HDMI Cables',
  'TV',
  'Projector Lamps',
  'Professional Lamps',
  'Professional Audio',
  'Teleprompters',
  'VC Cameras',
  'VC Solutions',
  'Video Conferencing Equipments',
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(500000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyWishlist, setOnlyWishlist] = useState(searchParams.get('filter') === 'wishlist');

  const { wishlist } = useCart();

  const categories = PRODUCT_CATEGORIES;

  // Sync URL search params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);

    const q = searchParams.get('search');
    if (q) setSearchQuery(q);

    const f = searchParams.get('filter');
    if (f === 'wishlist') setOnlyWishlist(true);
  }, [searchParams]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts({
          search: searchQuery || undefined,
          sort: sortBy,
        });
        setProducts(data);
      } catch (err) {
        console.error('Catalog fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();

    window.addEventListener('aravez_catalog_updated', fetchCatalog);
    window.addEventListener('storage', fetchCatalog);
    return () => {
      window.removeEventListener('aravez_catalog_updated', fetchCatalog);
      window.removeEventListener('storage', fetchCatalog);
    };
  }, [searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All Products');
    setSearchQuery('');
    setSortBy('popular');
    setMaxPrice(500000);
    setOnlyInStock(false);
    setOnlyWishlist(false);
    setSearchParams({});
  };

  // Client-side combined filtering (category & price & in-stock & wishlist)
  const displayedProducts = products.filter((p) => {
    const isAll = selectedCategory === 'All' || selectedCategory === 'All Products';
    if (!isAll && p.category && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    const activePrice = p.discountPrice || p.price;
    if (maxPrice < 500000 && activePrice > maxPrice) return false;
    if (onlyInStock && !p.inStock) return false;
    if (onlyWishlist && !wishlist.some((w) => w._id === p._id)) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Top Categories Scrollable Bar */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900 leading-tight">Categories</h2>
              <span className="text-[10px] text-emerald-700 font-semibold tracking-wide uppercase">Select category to filter</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-block">Scroll horizontally →</span>
        </div>

        {/* Scrollable Pills List */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat || (cat === 'All Products' && (selectedCategory === 'All' || selectedCategory === 'All Products'));
            const count = (cat === 'All Products' || cat === 'All')
              ? products.length
              : products.filter(p => p.category && p.category.toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOnlyWishlist(false);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20 scale-102 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 border border-slate-200/80'
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${isSelected ? 'bg-emerald-950/60 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="Search products by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs text-gray-500 shrink-0 font-medium">Category:</span>
            <select
              value={selectedCategory === 'All' ? 'All Products' : selectedCategory}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCategory(val === 'All Products' ? 'All' : val);
                setOnlyWishlist(false);
              }}
              className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl py-2.5 px-3 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-2 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl py-2.5 px-3 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">★ Newest Uploads (First)</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Price Range, Wishlist & Reset */}
          <div className="md:col-span-3 flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Max Price:</span>
                <strong className="text-emerald-900 font-bold">
                  {maxPrice >= 500000 ? 'Any Price' : `₹${maxPrice.toLocaleString('en-IN')}`}
                </strong>
              </div>
              <input
                type="range"
                min="500"
                max="500000"
                step="2500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
              />
            </div>

            {/* Wishlist toggle */}
            <button
              onClick={() => setOnlyWishlist(!onlyWishlist)}
              title="Filter Wishlist"
              className={`p-2.5 rounded-2xl border transition-colors ${
                onlyWishlist
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${onlyWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Reset */}
            <button
              onClick={handleResetFilters}
              title="Reset All Filters"
              className="p-2.5 rounded-2xl border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 rounded-3xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-gray-900">No remedies found</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            We couldn't find any products matching your current search or filter combination.
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
            <span>Showing <strong className="text-emerald-950 font-bold">{displayedProducts.length}</strong> botanical items</span>
            {onlyWishlist && (
              <span className="text-rose-600 font-semibold">Viewing Saved Wishlist items</span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
