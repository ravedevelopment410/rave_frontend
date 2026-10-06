import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1d1d1d] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" aria-label="AraveZ" className="flex items-baseline group select-none py-1 font-mont">
              <span className="text-4xl sm:text-5xl font-black text-white group-hover:text-[#ea0028] transition-colors font-mont tracking-wide">
                Λ
              </span>
              <span className="text-base sm:text-lg font-bold text-[#ea0028] group-hover:text-white transition-colors font-mont tracking-[0.08em] mx-1 pl-0.5">
                rave
              </span>
              <span className="text-4xl sm:text-5xl font-black text-white group-hover:text-[#ea0028] transition-colors font-mont tracking-wide">
                Z
              </span>
            </Link>
            <p className="text-white text-sm leading-relaxed max-w-sm">
              Aravez is a premier provider of commercial audio-visual solutions, Toughbook, Interactive Panels, Active LEDs, Home Theater systems, and Video Conferencing equipment.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-none bg-[#2a2a2a] hover:bg-[#ea0028] text-white hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-none bg-[#2a2a2a] hover:bg-[#ea0028] text-white hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-none bg-[#2a2a2a] hover:bg-[#ea0028] text-white hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-xs mb-4 tracking-wider uppercase">Explore</h4>
            <ul className="space-y-2.5 text-sm text-white">
              <li><Link to="/" className="text-white hover:text-[#ea0028] transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-white hover:text-[#ea0028] transition-colors">About Aravez</Link></li>
              <li><Link to="/products" className="text-white hover:text-[#ea0028] transition-colors">All AV Products</Link></li>
              <li><Link to="/contact" className="text-white hover:text-[#ea0028] transition-colors">Contact Support & Quotes</Link></li>
            </ul>
          </div>

          {/* Top AV Categories */}
          <div>
            <h4 className="font-bold text-white text-xs mb-4 tracking-wider uppercase">Top Categories</h4>
            <ul className="space-y-2.5 text-sm text-white">
              <li><Link to="/products?category=Toughbook" className="text-white hover:text-[#ea0028] transition-colors">Toughbook</Link></li>
              <li><Link to="/products?category=Projectors" className="text-white hover:text-[#ea0028] transition-colors">Projectors</Link></li>
              <li><Link to="/products?category=Interactive+Panels" className="text-white hover:text-[#ea0028] transition-colors">Interactive Panels</Link></li>
              <li><Link to="/products?category=Active+LED" className="text-white hover:text-[#ea0028] transition-colors">Active LED</Link></li>
              <li><Link to="/products?category=Video+Conferencing+Equipments" className="text-white hover:text-[#ea0028] transition-colors">VC Equipments</Link></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="font-bold text-white text-xs mb-4 tracking-wider uppercase">Aravez Care</h4>
            <ul className="space-y-3 text-sm text-white">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ea0028] shrink-0 mt-0.5" />
                <span className="leading-snug text-white">SCO-2, 2nd Floor, Sector-17E, Chandigarh - 160017</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#ea0028] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 text-white">
                  <a href="tel:+919814903739" className="text-white hover:text-[#ea0028] transition-colors">+91 9814903739</a>
                  <a href="tel:+911724416646" className="text-white hover:text-[#ea0028] transition-colors">+91 172 4416646</a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#ea0028] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 text-white">
                  <a href="mailto:contact@aravez.store" className="text-white hover:text-[#ea0028] transition-colors">contact@aravez.store</a>
                </div>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-1.5 text-xs text-white font-medium bg-[#2a2a2a] py-1.5 px-3 rounded-none border border-[#3a3a3a]">
                  <ShieldCheck className="w-4 h-4 text-[#ea0028]" />
                  <span className="text-white">100% Secure SSL Checkout</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Aravez (Rave Services). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-[#ea0028] font-bold hover:text-white flex items-center gap-1">
              <span>🔐 Admin Panel</span>
            </Link>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
