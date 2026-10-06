import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, Sparkles, PhoneCall, Monitor } from 'lucide-react';
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
      {/* Top Banner Announcement (Moving Marquee: Right to Left) */}
      <div className="bg-[#1d1d1d] text-white text-xs font-medium py-2 overflow-hidden border-b border-gray-800 select-none relative z-50">
        <div className="animate-marquee">
          {/* Primary Track */}
          <div className="flex items-center gap-10 shrink-0 px-4">
            {[1, 2, 3].map((item) => (
              <div key={`ticker-a-${item}`} className="flex items-center gap-3">
                <Sparkles className="w-3.5 h-3.5 text-[#ea0028] shrink-0 animate-pulse" />
                <span className="font-semibold tracking-wide text-white">⚡ RAVE SERVICES:</span>
                <span className="text-gray-200">Authorized Distributor of Touchbooks, Interactive Panels, Projectors &amp; VC Systems!</span>
                <span className="text-[#ea0028] font-bold ml-6">✦</span>
              </div>
            ))}
          </div>

          {/* Secondary Track (Seamless Loop) */}
          <div className="flex items-center gap-10 shrink-0 px-4" aria-hidden="true">
            {[1, 2, 3].map((item) => (
              <div key={`ticker-b-${item}`} className="flex items-center gap-3">
                <Sparkles className="w-3.5 h-3.5 text-[#ea0028] shrink-0 animate-pulse" />
                <span className="font-semibold tracking-wide text-white">⚡ RAVE SERVICES:</span>
                <span className="text-gray-200">Authorized Distributor of Touchbooks, Interactive Panels, Projectors &amp; VC Systems!</span>
                <span className="text-[#ea0028] font-bold ml-6">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* AraveZ Brand Typography in Mont (Inverted V 'Λ') */}
            <Link to="/" aria-label="AraveZ" className="flex items-baseline group select-none py-1 font-mont">
              <span className="text-4xl sm:text-5xl font-black text-[#1d1d1d] group-hover:text-[#ea0028] transition-colors font-mont tracking-wide">
                Λ
              </span>
              <span className="text-base sm:text-lg font-bold text-[#1d1d1d] group-hover:text-[#ea0028] transition-colors font-mont tracking-[0.08em] mx-1 pl-0.5">
                rave
              </span>
              <span className="text-4xl sm:text-5xl font-black text-[#1d1d1d] group-hover:text-[#ea0028] transition-colors font-mont tracking-wide">
                Z
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-none text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'text-[#ea0028] bg-red-50 font-bold border-b-2 border-[#ea0028]'
                        : 'text-gray-700 hover:text-[#ea0028] hover:bg-gray-100/70'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Action Buttons: Search, Wishlist, Cart, Mobile Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Quick Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-none text-gray-700 hover:text-[#ea0028] hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/products?filter=wishlist"
                className="p-2.5 rounded-none text-gray-700 hover:text-[#ea0028] hover:bg-gray-100 transition-colors relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#ea0028] text-white text-[10px] font-bold w-4 h-4 rounded-none flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-[#1d1d1d] hover:bg-[#ea0028] text-white px-4 py-2.5 rounded-none shadow-md hover:shadow-lg transition-all transform active:scale-95"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold">Bag</span>
                {totalCartCount > 0 && (
                  <span className="bg-[#ea0028] text-white text-xs font-extrabold px-1.5 py-0.5 rounded-none">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-none text-gray-700 hover:bg-gray-100 md:hidden"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="bg-white border-t border-gray-200 px-4 py-3 shadow-inner animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search Touchbooks, Projectors, Interactive Panels, VC Cameras, Home Theater..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full bg-gray-50 border border-gray-200 rounded-none py-2.5 pl-11 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-[#ea0028] focus:bg-white text-gray-800"
                />
                <Search className="w-5 h-5 text-gray-500 absolute left-3.5" />
                <button
                  type="submit"
                  className="absolute right-1.5 bg-[#1d1d1d] hover:bg-[#ea0028] text-white text-xs font-semibold px-4 py-1.5 rounded-none transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-fade-in">
            <div className="pt-2 pb-3">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search AV products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-none py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3" />
              </form>
            </div>

            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-none text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-red-50 text-[#ea0028] font-bold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#ea0028]'
                  }`
                }
              >
                <span>{link.name}</span>
              </NavLink>
            ))}

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 px-2">
              <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                <PhoneCall className="w-3.5 h-3.5 text-[#ea0028]" /> Support: +91 9814903739
              </span>
              <span className="text-[#ea0028] font-semibold">100% Genuine AV</span>
            </div>
          </div>
        )}
      </header>

    </>
  );
};

export default Navbar;
