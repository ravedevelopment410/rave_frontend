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
      q: 'Are all Aravez AV products 100% genuine with official manufacturer warranty?',
      a: 'Yes, absolutely. Aravez (Rave Services) is an authorized distributor. All Interactive Flat Panels, 4K Projectors, Toughbook laptops, Active LEDs, and Video Conferencing equipment are 100% genuine, brand-new, and covered under official manufacturer warranties with on-site service support across India.',
    },
    {
      q: 'Can we get an official GST invoice and B2B corporate quotation?',
      a: 'Yes. We cater extensively to educational institutions, corporate enterprises, government agencies, and defense sectors. We provide formal GST invoices, GEM portal support, and custom bulk discount pricing proposals within 24 hours.',
    },
    {
      q: 'Do you offer on-site delivery, installation, and technical demonstration?',
      a: 'Yes, our certified technical engineering team handles end-to-end delivery, professional wall mounting, motorized stand setup, cabling, audio calibration, and complete on-site hands-on staff training for classrooms, boardrooms, and conference halls.',
    },
    {
      q: 'How do I select the right Interactive Panel or Projector for my room size?',
      a: 'Screen size and projector brightness depend on room dimensions, ambient lighting, and seating capacity (e.g., 65", 75", 86", 98" panels or 4,000–10,000+ ANSI lumens projectors). Our AV specialists provide free room assessment and customized product recommendations.',
    },
    {
      q: 'What is your shipping timeline and transit insurance across India?',
      a: 'We provide specialized secure wooden-crate transit and full insurance coverage for fragile commercial electronic displays and optical lenses. Standard delivery takes 2 to 5 business days across all pin codes in India with real-time tracking.',
    },
    {
      q: 'Can I discuss customized requirements or place bulk orders via WhatsApp?',
      a: 'Yes! You can connect with our senior AV sales consultants directly on WhatsApp (+91 9814903739) for immediate price quotes, product spec sheets, video demonstrations, and expedited order processing.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-[#1d1d1d] text-white py-16 sm:py-24 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2a2a2a] border border-red-500/40 rounded-none text-xs font-bold uppercase tracking-wider text-[#ea0028]">
            <Sparkles className="w-3.5 h-3.5 text-[#ea0028]" />
            We Are Here To Assist You
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
            Connect with the Aravez Team
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
            Have questions about our commercial AV solutions, corporate quotations, technical specifications, or bulk orders? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* 2. CONTACT INFO CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-none p-6 shadow-md border border-gray-200 flex items-start gap-4">
            <div className="w-12 h-12 rounded-none bg-red-50 text-[#ea0028] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Call Us Directly</h4>
              <div className="flex flex-col text-xs text-gray-600 mt-1 space-y-0.5">
                <a href="tel:+919814903739" className="font-medium hover:text-[#ea0028]">+91 9814903739</a>
                <a href="tel:+911724416646" className="font-medium hover:text-[#ea0028]">+91 172 4416646</a>
              </div>
              <p className="text-[11px] text-[#ea0028] font-semibold mt-1">Mon-Sat, 9:30am-7pm</p>
            </div>
          </div>

          <div className="bg-white rounded-none p-6 shadow-md border border-gray-200 flex items-start gap-4">
            <div className="w-12 h-12 rounded-none bg-gray-100 text-[#1d1d1d] flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Email Support</h4>
              <div className="flex flex-col text-xs text-gray-600 mt-1 space-y-0.5">
                <a href="mailto:contact@aravez.store" className="font-medium hover:text-[#ea0028]">contact@aravez.store</a>
              </div>
              <p className="text-[11px] text-gray-500 font-semibold mt-1">Quick 24h Response</p>
            </div>
          </div>

          <div className="bg-white rounded-none p-6 shadow-md border border-gray-200 flex items-start gap-4">
            <div className="w-12 h-12 rounded-none bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center shrink-0">
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

          <div className="bg-white rounded-none p-6 shadow-md border border-gray-200 flex items-start gap-4">
            <div className="w-12 h-12 rounded-none bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Aravez Office</h4>
              <p className="text-xs text-gray-600 mt-1 leading-snug">
                SCO-2, 2nd Floor, Sector-17E, Chandigarh - 160017
              </p>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">Headquarters</p>
            </div>
          </div>
        </div>
      </section>


      {/* 3. CONTACT FORM & INFO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white rounded-none p-8 sm:p-10 border border-gray-200 shadow-md">
            <div className="mb-8">
              <span className="text-xs font-bold text-[#ea0028] uppercase tracking-widest block mb-1">
                Send a Note
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900">
                How Can We Help You?
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Fill out the form below and our technical AV solutions team will get back to you promptly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-red-50 border border-red-200 rounded-none p-6 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-none bg-white text-[#ea0028] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Message Received!
                </h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Thank you for reaching out to Aravez. We have received your inquiry and will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-[#1d1d1d] hover:bg-[#ea0028] text-white text-xs font-bold px-5 py-2.5 rounded-none transition-colors cursor-pointer"
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ea0028] focus:bg-white"
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ea0028] focus:bg-white"
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ea0028] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Topic / Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ea0028] focus:bg-white text-gray-700"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="B2B Commercial Quotation">B2B Commercial Quotation</option>
                      <option value="Interactive Panels & Projectors">Interactive Panels & Projectors</option>
                      <option value="Toughbook & Rugged Laptops">Toughbook & Rugged Laptops</option>
                      <option value="Video Conferencing & Active LED">Video Conferencing & Active LED</option>
                      <option value="On-Site Demo & Installation">On-Site Demo & Installation</option>
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
                    placeholder="Describe your equipment requirements, room dimensions, tender/RFP details, or technical questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ea0028] focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1d1d1d] hover:bg-[#ea0028] text-white font-bold py-3.5 px-6 rounded-none shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50 text-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending to Aravez AV Team...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: FAQs Accordion */}
          <div className="lg:col-span-5 space-y-4">
            <div className="mb-4">
              <span className="text-xs font-bold text-[#ea0028] uppercase tracking-widest block mb-1">
                Frequently Asked
              </span>
              <h3 className="text-2xl font-bold text-gray-900">
                Quick Answers
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-none border border-gray-200 overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-gray-800 hover:text-[#ea0028] transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#ea0028] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="mt-6 bg-[#1d1d1d] rounded-none p-5 text-white flex items-center justify-between gap-4 shadow-lg border border-gray-800">
              <div>
                <h4 className="font-bold text-sm">Need Instant Assistance?</h4>
                <p className="text-[11px] text-gray-300 mt-0.5">Chat directly with our commercial AV technical specialists.</p>
              </div>
              <a
                href="https://wa.me/919814903739"
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-4 py-2 rounded-none text-xs flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105 shadow-md"
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
