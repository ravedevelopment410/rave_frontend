import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 'collection',
      title: '1. Information We Collect',
      icon: Eye,
      content: (
        <div className="space-y-3">
          <p>
            At <strong>Aravez (Rave Services)</strong>, we collect personal and corporate information necessary to provide commercial audio-visual hardware, process B2B purchase orders, and deliver technical support.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Contact Details:</strong> Full name, corporate email address, phone number, and designation.</li>
            <li><strong>Business & GST Information:</strong> Company name, registered GSTIN for tax invoices, and billing/shipping addresses.</li>
            <li><strong>Transaction & Logistics Data:</strong> Order history, hardware serial numbers, warranty registration, and transit tracking.</li>
            <li><strong>Digital Usage Data:</strong> IP address, browser type, and interaction metrics to improve web navigation.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'usage',
      title: '2. How We Use Your Data',
      icon: FileText,
      content: (
        <div className="space-y-3">
          <p>We utilize collected information solely for professional business operations, including:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Processing quotes, sales orders, and issuing official GST tax invoices for B2B input tax credit.</li>
            <li>Coordinating insured freight shipping, delivery tracking, and on-site AV equipment setup.</li>
            <li>Managing official brand warranty registrations for Interactive Panels, Projectors, and VC Systems.</li>
            <li>Providing dedicated technical assistance, firmware updates, and customer support.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'sharing',
      title: '3. Data Protection & Third-Party Sharing',
      icon: Lock,
      content: (
        <div className="space-y-3">
          <p>
            We strictly enforce a <strong>Zero Third-Party Data Monetization Policy</strong>. Your corporate or personal data is never sold, rented, or traded to marketing agencies.
          </p>
          <p className="text-slate-600">Information is shared strictly with trusted operational partners under non-disclosure agreements:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Logistics & Freight Partners:</strong> For safe, insured physical delivery of commercial AV hardware.</li>
            <li><strong>Banking & Payment Gateways:</strong> 256-bit encrypted banking portals for secure digital transactions.</li>
            <li><strong>Authorized Manufacturers:</strong> For official OEM warranty registration and technical service coverage.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'security',
      title: '4. Security & SSL Encryption',
      icon: ShieldCheck,
      content: (
        <p className="leading-relaxed text-slate-600">
          Our website and database employ enterprise-grade SSL (Secure Sockets Layer) encryption. All payment channels, corporate inquiries, and user credentials are protected against unauthorized access, data breach, or interception.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbf9] text-slate-800 pb-20">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3.5 py-1.5 bg-emerald-800/80 border border-emerald-600/50 rounded-none text-xs font-semibold uppercase tracking-widest text-emerald-300">
            RAVE SERVICES • LEGAL & TRANSPARENCY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Privacy Policy
          </h1>
          <p className="text-emerald-100/85 text-xs sm:text-sm max-w-xl mx-auto">
            Last Updated: August 2026. Learn how Aravez protects your business data, transactions, and privacy.
          </p>
        </div>
      </section>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-8">
        
        {/* Highlight Card */}
        <div className="bg-white rounded-none p-6 sm:p-8 shadow-xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-none bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Enterprise Data Protection</h3>
              <p className="text-xs text-slate-500">Your privacy is fundamental to our commercial AV operations.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-none border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Detailed Policy Sections */}
        <div className="bg-white rounded-none p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-10">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div key={sec.id} className="space-y-3 pb-8 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-slate-900">{sec.title}</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-11">
                  {sec.content}
                </div>
              </div>
            );
          })}

          {/* Contact Officer Block */}
          <div className="bg-slate-50 rounded-none p-6 border border-slate-200 space-y-3 pt-6">
            <h3 className="font-serif font-bold text-base text-slate-900">Privacy & Data Inquiries</h3>
            <p className="text-xs text-slate-600">
              If you have any questions regarding your corporate data, GST invoice information, or privacy preferences, please contact our Compliance Officer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-700 pt-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-700" />
                <a href="mailto:contact@aravez.store" className="hover:underline">contact@aravez.store</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-700" />
                <a href="tel:+919814903739" className="hover:underline">+91 9814903739</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Sector-17E, Chandigarh</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PrivacyPolicy;
