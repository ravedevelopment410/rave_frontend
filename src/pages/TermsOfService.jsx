import React from 'react';
import { FileCheck, Shield, Truck, CreditCard, RefreshCw, Scale, HelpCircle } from 'lucide-react';

const TermsOfService = () => {
  const terms = [
    {
      title: '1. Commercial AV Offerings & Scope',
      icon: FileCheck,
      desc: 'Aravez (Rave Services) is an authorized distributor and supplier of commercial Audio-Visual solutions including Touchbooks, 4K Laser Projectors, Interactive Flat Panels, Active LEDs, Home Theater systems, Teleprompters, and Video Conferencing equipment across India. All product specifications, availability, and technical details presented on the website are subject to regular updates.',
    },
    {
      title: '2. Pricing, Payments & B2B GST Billing',
      icon: CreditCard,
      desc: 'All product prices displayed on the website are in Indian Rupees (₹). Official GST Tax Invoices are issued for corporate purchases to enable input tax credit. Payments can be completed through secure online banking, credit/debit cards, UPI, or verified corporate bank transfers. We reserve the right to revise prices or cancel orders in cases of obvious typographical errors or manufacturer pricing updates.',
    },
    {
      title: '3. Order Dispatch, Transit & Delivery',
      icon: Truck,
      desc: 'Commercial hardware shipments are packaged securely and dispatched via insured courier and logistics partners across India. Estimated delivery times range from 3 to 7 business days depending on destination location. Transit insurance covers physical loss or damage during transit prior to sign-off receipt by the customer.',
    },
    {
      title: '4. Brand Warranty & Technical Support',
      icon: Shield,
      desc: 'All commercial AV equipment supplied by Aravez carries official manufacturer brand warranty. Warranty terms vary by product category (e.g. Interactive Panels, Projector Lamps, Active LEDs). Technical support, on-site service coordination, and replacement parts are managed in accordance with official OEM warranty guidelines.',
    },
    {
      title: '5. Returns, Replacement & Inspection Policy',
      icon: RefreshCw,
      desc: 'Upon receipt of shipment, customers are advised to inspect outer packaging and verify hardware condition. In the rare event of transit damage or manufacturing defect, issues must be reported within 48 hours of delivery along with unboxing documentation for prompt replacement processing.',
    },
    {
      title: '6. Limitation of Liability & Governing Law',
      icon: Scale,
      desc: 'Aravez (Rave Services) shall not be liable for indirect, incidental, or consequential damages resulting from improper hardware installation, unauthorized modification, or third-party electrical surge issues. All legal disputes and proceedings are subject to the exclusive jurisdiction of the Courts of Chandigarh, India.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbf9] text-slate-800 pb-20">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3.5 py-1.5 bg-emerald-800/80 border border-emerald-600/50 rounded-none text-xs font-semibold uppercase tracking-widest text-emerald-300">
            RAVE SERVICES • COMMERCIAL TERMS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Terms of Service
          </h1>
          <p className="text-emerald-100/85 text-xs sm:text-sm max-w-xl mx-auto">
            Last Updated: August 2026. Official terms governing commercial purchases, warranty, and supply contracts.
          </p>
        </div>
      </section>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-8">
        
        {/* Main Terms Grid */}
        <div className="bg-white rounded-none p-6 sm:p-10 shadow-xl border border-slate-200/80 space-y-8">
          {terms.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="space-y-2 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">{item.title}</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-11">
                  {item.desc}
                </p>
              </div>
            );
          })}

          {/* Help Support Box */}
          <div className="bg-emerald-50 rounded-none p-6 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-emerald-800 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Need Clarification on B2B Quotes or Terms?</h4>
                <p className="text-xs text-slate-600">Our technical sales team is ready to assist with commercial specifications and agreements.</p>
              </div>
            </div>
            <a
              href="mailto:contact@aravez.store"
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-none transition-colors shrink-0"
            >
              Contact Sales Team
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};

export default TermsOfService;
