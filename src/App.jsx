import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Admin from './pages/Admin';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';

// Helper component to automatically scroll up on route transition
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main App Layout that conditionally hides customer Navbar/Footer on /admin
const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen flex flex-col ${isAdmin ? 'bg-[#f7f7f8]' : 'bg-[#fafbf9]'} text-gray-800 font-sans selection:bg-[#ea0028] selection:text-white`}>
      {/* Customer Navbar (Hidden on Admin) */}
      {!isAdmin && <Navbar />}

      {/* Main Application Routes */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Customer Overlays & Modals (Hidden on Admin) */}
      {!isAdmin && <CartDrawer />}
      {!isAdmin && <QuickViewModal />}
      {!isAdmin && <WhatsAppButton />}

      {/* Customer Footer (Hidden on Admin) */}
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <AppContent />
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
