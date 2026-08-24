import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ChevronDown, ChevronUp, CheckCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.submitContact(formData);
      setSubmitted(true);
      addToast(res.message || 'Message sent! Our care team will reply within 24 hours.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
      });
    } catch (err) {
      addToast(err.message || 'Failed to submit form. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'Are all Aravez products 100% natural and certified organic?',
      a: 'Yes, absolutely. All Aravez formulations use wildcrafted and certified organic botanical extracts, cold-pressed plant oils, and clean adaptogens. We never use parabens, sulfates, phthalates, synthetic colorants, or petroleum derivatives.',
    },
    {
      q: 'How long does shipping take and is delivery free?',
      a: 'We offer free carbon-neutral shipping on all orders above $50 (or with promo code FREESHIP). Standard domestic shipping takes 2-4 business days. International orders typically arrive in 5-8 business days.',
    },
    {
      q: 'What is your return & satisfaction policy?',
      a: 'We stand by the transformative potency of our botanical care. If you are not completely in love with your Aravez remedies within 30 days, we offer a 100% hassle-free refund or exchange.',
    },
    {
      q: 'Can I order directly on WhatsApp?',
      a: 'Yes! You can click the "Order on WhatsApp" button in your shopping cart or quick view modal, and our botanical concierge will help process your custom order right away.',
    },
    {
      q: 'How should I store my botanical serums and herbal teas?',
      a: 'To preserve the peak bio-potency of the natural cold-pressed antioxidants, store your amber glass bottles in a cool, dry place away from direct sunlight. Teas should be kept tightly sealed in their aroma-protecting pouches.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-800/80 border border-emerald-600/50 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            We Are Here To Assist You
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Connect with the Aravez Team
          </h1>
          <p className="text-emerald-100/85 text-sm sm:text-base max-w-xl mx-auto">
            Have questions about our botanical formulations, wholesale partnerships, or your order? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* 2. CONTACT INFO CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-emerald-100/80 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Call Us Directly</h4>
              <div className="flex flex-col text-xs text-gray-600 mt-1 space-y-0.5">
                <a href="tel:+919814903739" className="font-medium hover:text-emerald-700">+91 9814903739</a>
                <a href="tel:+911724416646" className="font-medium hover:text-emerald-700">+91 172 4416646</a>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">Mon-Sat, 9:30am-7pm</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-emerald-100/80 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Email Support</h4>
              <div className="flex flex-col text-xs text-gray-600 mt-1 space-y-0.5">
                <a href="mailto:vdhiman@yahoo.com" className="font-medium hover:text-teal-700">vdhiman@yahoo.com</a>
                <a href="mailto:ravechd@yahoo.com" className="font-medium hover:text-teal-700">ravechd@yahoo.com</a>
              </div>
              <p className="text-[11px] text-teal-700 font-semibold mt-1">Quick 24h Response</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-emerald-100/80 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">WhatsApp Concierge</h4>
              <p className="text-xs text-gray-500 mt-0.5">+91 9814903739</p>
              <a
                href="https://wa.me/919814903739?text=Hello%20Aravez%20Team!%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#128C7E] font-bold mt-1.5 inline-block hover:underline"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-emerald-100/80 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Aravez Office</h4>
              <p className="text-xs text-gray-600 mt-1 leading-snug">
                SCO-2, 2nd Floor, Sector-17E, Chandigarh - 160017
              </p>
              <p className="text-[11px] text-amber-800 font-semibold mt-1">Headquarters</p>
            </div>
          </div>
        </div>
      </section>


      {/* 3. CONTACT FORM & INFO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-xl">
            <div className="mb-8">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                Send a Note
              </span>
              <h2 className="font-serif text-3xl font-bold text-gray-900">
                How Can We Help You?
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Fill out the form below and a botanical specialist from Aravez will get back to you promptly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-emerald-950">
                  Message Received!
                </h3>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                  Thank you for reaching out to Aravez. We have received your inquiry and will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Woods"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-emerald-50/30 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-emerald-50/30 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-emerald-50/30 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Topic / Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-emerald-50/30 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-700"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Product Recommendation">Product Recommendation</option>
                      <option value="Order & Shipping Status">Order & Shipping Status</option>
                      <option value="Wholesale & Partnerships">Wholesale & Partnerships</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us how we can assist your wellness journey..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-emerald-50/30 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-800/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending to Aravez Care...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: FAQs Accordion */}
          <div className="lg:col-span-5 space-y-4">
            <div className="mb-4">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                Frequently Asked
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900">
                Quick Answers
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-gray-800 hover:text-emerald-800 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-50 animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="mt-6 bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-5 text-white flex items-center justify-between gap-4 shadow-lg">
              <div>
                <h4 className="font-serif font-bold text-sm">Need Instant Assistance?</h4>
                <p className="text-[11px] text-emerald-200 mt-0.5">Chat directly with a live herbal concierge.</p>
              </div>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Contact;
