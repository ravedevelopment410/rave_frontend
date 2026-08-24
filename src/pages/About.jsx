import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Globe, Award, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import TrustBadges from '../components/TrustBadges';

const About = () => {
  const stats = [
    { number: '100%', label: 'Genuine Brand Warranty' },
    { number: '5,000+', label: 'Successful AV Installations' },
    { number: '100+', label: 'Corporate & Edu Partners' },
    { number: 'Pan-India', label: 'Insured Shipping & Support' },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: 'Genuine Brand Authorization',
      description: 'We source 100% authentic Touchbooks, Projectors, Interactive Panels, and VC equipment directly from authorized brand channels with official warranty.',
    },
    {
      icon: Award,
      title: 'Commercial Grade Durability',
      description: 'Engineered for heavy-duty corporate boardroom meetings, smart classrooms, auditoriums, and high-performance home theaters.',
    },
    {
      icon: Globe,
      title: 'Pan-India Supply & Transit',
      description: 'Insured transit packaging and reliable delivery coverage across corporate locations in all major Indian states.',
    },
    {
      icon: Sparkles,
      title: 'End-to-End Technical Support',
      description: 'Expert technical guidance from product selection and GST B2B billing to post-sales service support.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-950 text-white py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="inline-block px-4 py-1.5 bg-emerald-800/80 border border-emerald-600/50 rounded-full text-xs font-semibold uppercase tracking-widest text-emerald-300">
            RAVE SERVICES • Commercial AV Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Empowering Workspaces <span className="italic font-serif text-emerald-300">&</span> Institutions With Advanced AV Tech.
          </h1>
          <p className="text-emerald-100/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Welcome to Aravez (Rave Services). We specialize in commercial AV integration, Touchbooks, Interactive Flat Panels, 4K Projectors, Active LEDs, and Video Conferencing equipment.
          </p>
        </div>
      </section>

      {/* 2. STATS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 text-center shadow-xl border border-emerald-100/80 backdrop-blur-md hover:-translate-y-1 transition-transform"
            >
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-emerald-800 mb-1">
                {item.number}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. OUR STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
                alt="Commercial AV Solutions"
                className="w-full h-[450px] object-cover"
              />
            </div>
            {/* Overlay badge */}
            <div className="absolute -bottom-6 -right-6 bg-emerald-900 text-white p-5 rounded-2xl shadow-xl hidden sm:block max-w-xs border border-emerald-700">
              <Sparkles className="w-5 h-5 text-emerald-400 mb-2" />
              <p className="text-xs text-emerald-100 font-medium">
                "Connecting corporate boardrooms, smart classrooms, and home theaters with high-performance audio-visual technology."
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
              The Genesis of Aravez (Rave Services)
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-snug">
              Driven by innovation, precision engineering, and seamless digital collaboration.
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Aravez (Rave Services) was established to empower modern corporate offices, educational institutions, auditoriums, and luxury home theaters with premier commercial audio-visual technology.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              We supply high-grade Touchbooks, Interactive Flat Panels, 4K Laser Projectors, Active LED displays, Professional Audio Systems, Teleprompters, and Video Conferencing equipment customized for modern collaborative environments.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-gray-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Authorized distributor of leading commercial AV & display brands</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Official B2B GST tax invoice for corporate input tax credit</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Dedicated technical consultation, installation, & post-sales support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE PILLARS */}
      <section className="bg-emerald-50/50 py-16 sm:py-20 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
              Guiding Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
              The Aravez Commercial Promise
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Our commitments define every technology choice, corporate partnership, and service interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 mb-2 group-hover:text-emerald-800 transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TRUST BADGES */}
      <TrustBadges />

      {/* 6. CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Upgrade Your Commercial Workspace & AV Setup Today
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base">
              Connect with our technical team for B2B corporate pricing, product demonstrations, and custom AV project quotes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/products"
                className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold px-8 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2 text-sm"
              >
                <span>Explore AV Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold px-8 py-3.5 rounded-full border border-emerald-500/50 transition-colors text-sm"
              >
                <span>Contact AV Specialists</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
