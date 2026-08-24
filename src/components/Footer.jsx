import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, ShieldCheck, Heart } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await api.subscribeNewsletter(email);
      addToast(res.message || 'Subscribed successfully! Check your email for special welcome gifts.', 'success');
      setEmail('');
    } catch (err) {
      addToast(err.message || 'Subscription failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-emerald-950 via-emerald-950 to-[#02180e] text-emerald-100 pt-16 pb-8 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Card */}
        <div className="bg-emerald-900/60 border border-emerald-800 rounded-3xl p-8 sm:p-10 mb-16 backdrop-blur-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-6">
              <span className="inline-block px-3 py-1 bg-emerald-800 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                🖥️ Join Aravez Tech Network
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold leading-snug">
                Stay updated with commercial AV innovations & B2B solutions.
              </h3>
              <p className="text-emerald-200/80 text-sm mt-2">
                Subscribe to receive technical specifications, B2B price lists, and new product launch announcements.
              </p>
            </div>
            <div className="lg:col-span-6">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your corporate email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-emerald-950/80 border border-emerald-700/70 rounded-full px-5 py-3.5 text-sm text-white placeholder-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-7 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 hover:scale-[1.02] disabled:opacity-50"
                >
                  <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <span className="text-[11px] text-emerald-400/70 mt-2 block pl-2">
                We respect your privacy. Unsubscribe anytime with 1-click.
              </span>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold text-xl shadow-md">
                🖥️
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">Aravez</span>
            </Link>
            <p className="text-emerald-200/80 text-sm leading-relaxed max-w-sm">
              Aravez is a premier provider of commercial audio-visual solutions, Touchbooks, Interactive Panels, Active LEDs, Home Theater systems, and Video Conferencing equipment.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-emerald-900/80 hover:bg-emerald-600 text-emerald-200 hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-emerald-900/80 hover:bg-emerald-600 text-emerald-200 hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-emerald-900/80 hover:bg-emerald-600 text-emerald-200 hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-base mb-4 tracking-wider uppercase text-xs">Explore</h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80">
              <li><Link to="/" className="hover:text-white hover:underline transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white hover:underline transition-colors">About Aravez</Link></li>
              <li><Link to="/products" className="hover:text-white hover:underline transition-colors">All AV Products</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:underline transition-colors">Contact Support & Quotes</Link></li>
            </ul>
          </div>

          {/* Top AV Categories */}
          <div>
            <h4 className="font-semibold text-white text-base mb-4 tracking-wider uppercase text-xs">Top Categories</h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80">
              <li><Link to="/products?category=Touchbooks" className="hover:text-white transition-colors">Touchbooks</Link></li>
              <li><Link to="/products?category=Projecters" className="hover:text-white transition-colors">Projectors</Link></li>
              <li><Link to="/products?category=Interactive+Panels" className="hover:text-white transition-colors">Interactive Panels</Link></li>
              <li><Link to="/products?category=Active+LED" className="hover:text-white transition-colors">Active LED</Link></li>
              <li><Link to="/products?category=Video+Conferencing+Equipments" className="hover:text-white transition-colors">VC Equipments</Link></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="font-semibold text-white text-base mb-4 tracking-wider uppercase text-xs">Aravez Care</h4>
            <ul className="space-y-3 text-sm text-emerald-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">SCO-2, 2nd Floor, Sector-17E, Chandigarh - 160017</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:+919814903739" className="hover:text-white transition-colors">+91 9814903739</a>
                  <a href="tel:+911724416646" className="hover:text-white transition-colors">+91 172 4416646</a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href="mailto:vdhiman@yahoo.com" className="hover:text-white transition-colors">vdhiman@yahoo.com</a>
                  <a href="mailto:ravechd@yahoo.com" className="hover:text-white transition-colors">ravechd@yahoo.com</a>
                </div>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium bg-emerald-900/50 py-1.5 px-3 rounded-lg border border-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Secure SSL Checkout</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/80">
          <p>© {new Date().getFullYear()} Aravez (Rave Services). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-emerald-300 font-bold hover:text-white flex items-center gap-1">
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
