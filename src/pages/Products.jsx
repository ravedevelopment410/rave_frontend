import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, Heart, Layers, ChevronDown, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export const PRODUCT_CATEGORIES = [
  'All Products',
  'Toughbook',
  'Projectors',
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
  'Other',
];

export const normalizeCategory = (cat) => {
  if (!cat) return '';
  const c = cat.toString().trim().toLowerCase();
  // Projectors matching (handles Projectors, Projecters, Projector)
  if (c === 'projectors' || c === 'projecters' || c === 'projector') return 'projectors';
  // Toughbook matching (handles Toughbook, Toughbooks, Touchbook, Touchbooks)
  if (c === 'toughbook' || c === 'toughbooks' || c === 'touchbook' || c === 'touchbooks') return 'toughbook';
  // Interactive Panels matching (handles Interactive Panel, Interactive Panels, IFPD, Smart Panels)
  if (c === 'interactive panel' || c === 'interactive panels' || c === 'interactive flat panel') return 'interactive panels';
  // Signages matching
  if (c === 'signage' || c === 'signages' || c === 'digital signage') return 'signages';
  // Active LED matching
  if (c === 'active led' || c === 'active leds' || c === 'led wall') return 'active led';
  // Home Theater matching
  if (c === 'home theater' || c === 'home theatre') return 'home theater';
  // Audio Video Receiver matching
  if (c === 'audio video receiver' || c === 'av receiver' || c === 'avr') return 'audio video receiver';
  // Speakers matching
  if (c === 'speaker' || c === 'speakers') return 'speakers';
  // HDMI Cables matching
  if (c === 'hdmi cable' || c === 'hdmi cables') return 'hdmi cables';
  // TV matching
  if (c === 'tv' || c === 'smart tv' || c === 'commercial tv' || c === 'tvs') return 'tv';
  // Projector Lamps matching
  if (c === 'projector lamp' || c === 'projector lamps') return 'projector lamps';
  // Professional Lamps matching
  if (c === 'professional lamp' || c === 'professional lamps') return 'professional lamps';
  // Professional Audio matching
  if (c === 'professional audio' || c === 'pro audio') return 'professional audio';
  // Teleprompters matching
  if (c === 'teleprompter' || c === 'teleprompters') return 'teleprompters';
  // VC Cameras matching
  if (c === 'vc camera' || c === 'vc cameras') return 'vc cameras';
  // VC Solutions matching
  if (c === 'vc solution' || c === 'vc solutions') return 'vc solutions';
  // Video Conferencing Equipments matching
  if (c === 'video conferencing equipments' || c === 'video conferencing equipment' || c === 'video conferencing') return 'video conferencing equipments';
  return c;
};

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
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

  // Pagination State (12 cards per page for balanced 4-col / 3-col grids)
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const productsGridRef = useRef(null);

  const { wishlist } = useCart();

  // Reset to first page when any filter, search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy, maxPrice, onlyInStock, onlyWishlist]);

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
        const queryParams = {};
        if (searchQuery && searchQuery.trim()) {
          queryParams.search = searchQuery.trim();
        }
        if (sortBy) {
          queryParams.sort = sortBy;
        }
        const data = await api.getProducts(queryParams);
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
    setCurrentPage(1);
    setSearchParams({});
  };

  // Predefined standard categories (excluding All Products and Other)
  const isStandardCategory = (catName) => {
    if (!catName) return false;
    const norm = normalizeCategory(catName);
    return PRODUCT_CATEGORIES.some(
      c => c !== 'All Products' && c !== 'Other' && normalizeCategory(c) === norm
    );
  };

  // Dynamically include any custom category names created by Admin
  const customCategoriesInCatalog = Array.from(
    new Set(
      products
        .map(p => p.category)
        .filter(c => c && !PRODUCT_CATEGORIES.some(pc => normalizeCategory(pc) === normalizeCategory(c)))
    )
  );

  const categories = [
    ...PRODUCT_CATEGORIES.filter(c => c !== 'Other'),
    ...customCategoriesInCatalog,
    'Other'
  ];

  // Robust category matching function
  const matchesCategory = (productCat, selectedCat) => {
    if (!selectedCat || selectedCat === 'All' || selectedCat === 'All Products') return true;

    const normProduct = normalizeCategory(productCat);
    const normSelected = normalizeCategory(selectedCat);

    if (selectedCat === 'Other' || normSelected === 'other') {
      return !productCat || normProduct === 'other' || !isStandardCategory(productCat);
    }

    return normProduct === normSelected || (productCat && productCat.toLowerCase() === selectedCat.toLowerCase());
  };

  // Client-side combined filtering (category & price & in-stock & wishlist)
  const displayedProducts = products.filter((p) => {
    if (!matchesCategory(p.category, selectedCategory)) {
      return false;
    }

    const activePrice = p.discountPrice || p.price;
    if (maxPrice < 500000 && activePrice > maxPrice) return false;
    if (onlyInStock && !p.inStock) return false;
    if (onlyWishlist && !wishlist.some((w) => w._id === p._id)) return false;
    return true;
  });

  // Pagination Logic (9 items per page)
  const totalPages = Math.ceil(displayedProducts.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = displayedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (productsGridRef.current) {
        productsGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (validCurrentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Top Categories Scrollable Bar */}
      <div className="bg-white rounded-none border border-gray-200 shadow-xs space-y-3 p-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none bg-[#1d1d1d] text-white flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Categories</h2>
              <span className="text-[10px] text-[#ea0028] font-bold tracking-wide uppercase">Select category to filter</span>
            </div>
          </div>
          <span className="text-[11px] text-gray-400 font-medium hidden sm:inline-block">Scroll horizontally →</span>
        </div>

        {/* Scrollable Pills List */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat || (cat === 'All Products' && (selectedCategory === 'All' || selectedCategory === 'All Products'));
            const count = (cat === 'All Products' || cat === 'All')
              ? products.length
              : products.filter(p => matchesCategory(p.category, cat)).length;

            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOnlyWishlist(false);
                }}
                className={`px-4 py-2 rounded-none text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1d1d1d] text-white shadow-md'
                    : 'bg-gray-50 hover:bg-red-50 hover:text-[#ea0028] text-gray-700 border border-gray-200'
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-none font-extrabold ${isSelected ? 'bg-[#ea0028] text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-none p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="Search products by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-none py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ea0028] text-gray-800"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Category Downward Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2 relative">
            <span className="text-xs text-gray-500 shrink-0 font-medium">Category:</span>
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-none py-2.5 px-3.5 text-xs sm:text-sm text-gray-800 font-bold flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#ea0028] shadow-xs cursor-pointer transition-colors"
              >
                <span className="truncate">{selectedCategory === 'All' ? 'All Products' : selectedCategory}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Downward opening menu */}
              {isCatDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCatDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-gray-200 rounded-none shadow-xl max-h-64 overflow-y-auto py-1.5 animate-fade-in divide-y divide-gray-100">
                    {categories.map((c) => {
                      const isSelected = selectedCategory === c || (c === 'All Products' && (selectedCategory === 'All' || selectedCategory === 'All Products'));
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(c === 'All Products' ? 'All' : c);
                            setOnlyWishlist(false);
                            setIsCatDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#1d1d1d] text-white font-bold'
                              : 'text-gray-700 hover:bg-red-50 hover:text-[#ea0028]'
                          }`}
                        >
                          <span>{c}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#ea0028]" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-2 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-none py-2.5 px-3 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
            >
              <option value="newest">★ Newest Uploads</option>
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
                <strong className="text-[#1d1d1d] font-bold">
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
                className="w-full accent-[#ea0028] cursor-pointer h-1.5 bg-gray-200 rounded-none"
              />
            </div>

            {/* Wishlist toggle */}
            <button
              onClick={() => setOnlyWishlist(!onlyWishlist)}
              title="Filter Wishlist"
              className={`p-2.5 rounded-none border transition-colors ${
                onlyWishlist
                  ? 'bg-red-50 border-red-200 text-[#ea0028]'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${onlyWishlist ? 'fill-[#ea0028] text-[#ea0028]' : ''}`} />
            </button>

            {/* Reset */}
            <button
              onClick={handleResetFilters}
              title="Reset All Filters"
              className="p-2.5 rounded-none border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Products Grid & Pagination Section */}
      <div ref={productsGridRef} className="scroll-mt-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <div key={n} className="h-72 rounded-none bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="bg-white rounded-none p-12 text-center border border-gray-200 shadow-xs max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-none bg-red-50 text-[#ea0028] flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No products found</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We couldn't find any products matching your current search or filter combination.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-[#1d1d1d] hover:bg-[#ea0028] text-white text-xs font-bold px-6 py-2.5 rounded-none transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
              <span>
                Showing <strong className="text-gray-900 font-bold">{startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, displayedProducts.length)}</strong> of <strong className="text-gray-900 font-bold">{displayedProducts.length}</strong> products
              </span>
              {onlyWishlist && (
                <span className="text-[#ea0028] font-semibold">Viewing Saved Wishlist items</span>
              )}
            </div>

            {/* Exactly 12 Products Per Page (4x3 Grid on XL screens) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Numbered Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white rounded-none p-4 sm:p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <span className="text-xs text-gray-500 font-medium order-2 sm:order-1">
                  Page <strong className="text-gray-900 font-bold">{validCurrentPage}</strong> of <strong className="text-gray-900 font-bold">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1.5 order-1 sm:order-2 flex-wrap justify-center">
                  {/* First Page button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(1)}
                    disabled={validCurrentPage === 1}
                    className="p-2 sm:p-2.5 rounded-none border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-[#ea0028] hover:border-red-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer"
                    title="First Page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(validCurrentPage - 1)}
                    disabled={validCurrentPage === 1}
                    className="px-3 py-2 sm:py-2.5 rounded-none border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-[#ea0028] hover:border-red-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((num, idx) => {
                    if (num === '...') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400 font-bold text-xs">
                          ...
                        </span>
                      );
                    }
                    const isActive = num === validCurrentPage;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handlePageChange(num)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-none text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          isActive
                            ? 'bg-[#ea0028] text-white shadow-sm'
                            : 'border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-[#ea0028] hover:border-red-200 bg-white'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(validCurrentPage + 1)}
                    disabled={validCurrentPage === totalPages}
                    className="px-3 py-2 sm:py-2.5 rounded-none border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-[#ea0028] hover:border-red-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last Page button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={validCurrentPage === totalPages}
                    className="p-2 sm:p-2.5 rounded-none border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-[#ea0028] hover:border-red-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer"
                    title="Last Page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Products;
