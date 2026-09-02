import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, Sparkles, PhoneCall } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { totalCartCount, wishlist, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Product', path: '/products' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-xs font-medium py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
        <span>⚡ RAVE SERVICES: Authorized Distributor of Touchbooks, Interactive Panels, Projectors & VC Systems!</span>
      </div>

      {/* Main Glass Navbar */}
      <header className="sticky top-0 z-40 glass-nav border-b border-emerald-100/70 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
                <span className="text-2xl">🖥️</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-emerald-950 group-hover:text-emerald-700 transition-colors">
                  AraveZ
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'text-emerald-900 bg-emerald-100/80 font-semibold shadow-xs'
                        : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/70'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Action Buttons: Search, Wishlist, Cart, Mobile Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Quick Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/products?filter=wishlist"
                className="p-2.5 rounded-full text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-full shadow-md shadow-emerald-800/20 hover:shadow-lg transition-all transform active:scale-95"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold">Bag</span>
                {totalCartCount > 0 && (
                  <span className="bg-emerald-400 text-emerald-950 text-xs font-extrabold px-2 py-0.5 rounded-full">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-gray-700 hover:bg-emerald-50 md:hidden"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="bg-white/95 border-t border-emerald-100 px-4 py-3 shadow-inner animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search Touchbooks, Projectors, Interactive Panels, VC Cameras, Home Theater..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-full py-2.5 pl-11 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-800"
                />
                <Search className="w-5 h-5 text-emerald-600 absolute left-3.5" />
                <button
                  type="submit"
                  className="absolute right-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-fade-in">
            <div className="pt-2 pb-3">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search AV products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-emerald-50/60 border border-emerald-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="w-4 h-4 text-emerald-600 absolute left-3" />
              </form>
            </div>

            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-900 font-semibold'
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`
                }
              >
                <span>{link.name}</span>
              </NavLink>
            ))}

            <div className="pt-4 border-t border-emerald-100 flex items-center justify-between text-xs text-gray-500 px-2">
              <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <PhoneCall className="w-3.5 h-3.5" /> Support: +91 9814903739
              </span>
              <span className="text-emerald-600 font-semibold">100% Genuine AV</span>
            </div>
          </div>
        )}
      </header>

    </>
  );
};

export default Navbar;
