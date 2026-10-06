import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Tv,
  Film,
  Camera,
  Layers,
  Video,
  Phone,
  Mail,
  MessageCircle,
  Building2,
  GraduationCap,
  Clapperboard,
  Home as HomeIcon,
  Quote,
  BadgeCheck,
  MonitorPlay,
  Volume2,
  Radio,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import TrustBadges from '../components/TrustBadges';

const About = () => {
  const [activeSolutionTab, setActiveSolutionTab] = useState(0);

  const stats = [
    { number: '2002', label: 'Established Year', sub: '24+ Years of Industry Trust' },
    { number: '1,500+', label: 'Projects Delivered', sub: 'Auditoriums, Theatres & Data Walls' },
    { number: 'Pan-India', label: 'National Presence', sub: 'Defence, Corporate & Edu Reach' },
    { number: '100%', label: 'OEM Authorized', sub: 'Official Brand Warranties & Billing' },
  ];

  // Detailed visual solutions portfolio
  const solutions = [
    {
      id: 'cinemas',
      title: 'Commercial Cinemas & Home Theatres',
      tag: 'Cinema & Acoustic Luxury',
      image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1000&q=80',
      description: 'End-to-end cinema integration for commercial multiplexes and bespoke luxury private home theatres. We engineer Dolby Atmos spatial audio configurations, acoustically transparent screens, 4K laser projection, and architectural acoustic paneling.',
      features: [
        'Dolby Atmos & DTS:X immersive surround sound systems',
        'Acoustically transparent micro-perforated curved screens',
        'Commercial DCI & home cinema 4K laser projectors',
        'Architectural acoustic wall panelling & luxury motorized recliners',
      ],
    },
    {
      id: 'auditoriums',
      title: 'Auditoriums & Public Hall Integration',
      tag: 'Large-Scale Acoustic Engineering',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
      description: 'Turnkey architectural sound and visual solutions for corporate auditoriums, convention centers, and university amphitheaters. Designed for flawless speech intelligibility, high-impact music performance, and intuitive digital control.',
      features: [
        'Active digital line-array sound reinforcement systems',
        'Acoustic resonance mapping & reverberation control',
        'Motorized stage lighting trusses & broadcast-grade illumination',
        'Digital interactive podiums & centralized touch automation',
      ],
    },
    {
      id: 'data-walls',
      title: 'Data Walls & Command Centers',
      tag: '24/7 Mission-Critical Operations',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
      description: 'Ultra-narrow bezel and fine-pitch video walls engineered for continuous 24/7/365 mission-critical command rooms, security monitoring centers, and NOC/SOC operations across defence and enterprise sectors.',
      features: [
        'Ultra-narrow bezel (0.88mm) LCD & fine-pitch seamless Active LED walls',
        'Multi-window hardware matrix video processors & KVM switching',
        'Redundant power supplies & 24/7 thermal cooling architecture',
        'Certified for military, disaster management, and corporate SOC hubs',
      ],
    },
    {
      id: 'projectors',
      title: '4K Laser & High-Lumen Projectors',
      tag: 'High-Impact Optical Projection',
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80',
      description: 'High-brightness laser projection solutions (4,000 to 30,000+ ANSI lumens) from world-leading optical brands. Ideal for bright boardrooms, university lecture halls, exhibition centers, and commercial cinema venues.',
      features: [
        'Solid-state laser light engines with 20,000+ hour lifespans',
        'Motorized ambient light rejecting (ALR) tensioned screens',
        'Multi-projector edge blending, warping & 3D mapping optics',
        'Ultra-short throw (UST) and interchangeable long-throw lenses',
      ],
    },
    {
      id: 'digital-signage',
      title: 'Digital Signages & Active LED Displays',
      tag: 'Seamless High-Resolution Visuals',
      image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80',
      description: 'High-impact indoor fine-pitch Active LEDs (P1.2, P1.5, P1.8, P2.5) and outdoor high-brightness weather-proof billboards. Complete with centralized cloud digital signage CMS for dynamic scheduling and real-time broadcasting.',
      features: [
        'Seamless modular Active LED panels with true HDR color accuracy',
        'Ultra-bright outdoor billboards visible in direct sunlight (up to 7,500 nits)',
        'Standalone interactive touch kiosks & corporate lobby directories',
        'Cloud-synchronized multi-screen content management software',
      ],
    },
    {
      id: 'cameras-prompters',
      title: 'High-End Studio Cameras & Teleprompters',
      tag: 'Broadcast & Executive Recording',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=80',
      description: 'Broadcast-grade 4K PTZ auto-tracking cameras, studio optical glass teleprompters, wireless speech microphones, and live video switchers designed for executive broadcasting, smart studios, and e-learning lecture capture.',
      features: [
        '4K UHD PTZ tracking cameras with 20x–30x optical zoom & NDI support',
        'Executive speech & studio teleprompters with high-reflectivity glass',
        'Multi-channel live production switchers & hardware streaming encoders',
        'Acoustically isolated studio setups & softbox broadcast illumination',
      ],
    },
    {
      id: 'interactive-panels',
      title: 'Interactive Displays & Smart Panels',
      tag: 'Collaborative Touch Technology',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      description: 'Commercial 4K UHD interactive flat panels (65", 75", 86", 98") with toughened anti-glare glass and dual OS (Android + Windows OPS). Engineered for active collaboration in smart classrooms and corporate meeting rooms.',
      features: [
        'Zero-gap optical bonding with 40-point ultra-precise multi-touch',
        'Dual operating systems (Android 13/14 + Intel Core Windows OPS PC)',
        'Wireless multi-device screen sharing from laptops, tablets & phones',
        'Built-in 4K AI auto-framing camera & 8-array beamforming microphone',
      ],
    },
  ];

  // Industry sectors
  const sectors = [
    {
      icon: Building2,
      title: 'Corporate Enterprises',
      desc: 'High-impact executive boardrooms, hybrid conference suites, town halls, and digital signage lobbies.',
    },
    {
      icon: ShieldCheck,
      title: 'Defence & Government',
      desc: 'Secure command & control rooms, emergency briefing centers, tactical data walls, and secure meeting rooms.',
    },
    {
      icon: GraduationCap,
      title: 'Institutions & Universities',
      desc: 'Interactive smart classrooms, auditorium lecture halls, campus digital signage, and lecture capture studios.',
    },
    {
      icon: Clapperboard,
      title: 'Commercial Cinemas',
      desc: 'Multiplex laser projection, cinema surround sound integration, optical lenses, and acoustic architecture.',
    },
    {
      icon: HomeIcon,
      title: 'Luxury Homes & Theaters',
      desc: 'Bespoke private screening rooms, architectural acoustics, 4K HDR projection, and multi-room audio automation.',
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Site Assessment & Acoustic Mapping',
      desc: 'Our senior AV engineers evaluate room dimensions, ambient lux lighting, reverberation time (RT60), and sight-lines.',
    },
    {
      step: '02',
      title: 'Hardware Architecture & GST BOQ',
      desc: 'We engineer a custom schematic blueprint selecting authorized OEM equipment with comprehensive corporate quotation.',
    },
    {
      step: '03',
      title: 'Installation & Precision Calibration',
      desc: 'Certified technical team handles wall/ceiling mounting, clean cabling, DSP sound tuning, and projection alignment.',
    },
    {
      step: '04',
      title: 'Staff Demonstration & AMC Support',
      desc: 'Complete hands-on staff training, OEM warranty registration, and ongoing annual maintenance contract support.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. EXECUTIVE HERO BANNER */}
      <section className="relative overflow-hidden bg-[#1d1d1d] text-white py-20 sm:py-28 border-b border-gray-800">
        {/* Subtle high-tech geometric background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33333315_1px,transparent_1px),linear-gradient(to_bottom,#33333315_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute -top-32 right-0 w-96 h-96 bg-[#ea0028]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2a2a2a] border border-red-500/40 rounded-none text-xs font-bold uppercase tracking-widest text-[#ea0028]">
            <Clock className="w-3.5 h-3.5 text-[#ea0028]" />
            <span>ESTABLISHED 2002 • 24+ YEARS OF AUDIO-VISUAL EXCELLENCE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Welcome to <span className="text-white">Rave Services</span>
          </h1>

          <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#ea0028] tracking-wide">
            "Your Vision. Our Technology."
          </div>

          <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
            Since 2002, Rave Services has been delivering innovative Audio-Visual, Display, Projection, High End Cameras, Teleprompters and Smart Technology Solutions. We provide reliable, end-to-end solutions for corporates, institutions, defence, education, Commercial Cinemas and homes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#ceo-spotlight"
              className="bg-[#ea0028] hover:bg-[#cc0020] text-white font-bold px-8 py-3.5 rounded-none shadow-lg transition-transform hover:scale-105 text-sm cursor-pointer"
            >
              Meet Our Founder & CEO
            </a>
            <a
              href="#solutions-portfolio"
              className="bg-[#2a2a2a] hover:bg-[#333333] text-white font-bold px-8 py-3.5 rounded-none border border-gray-700 transition-colors text-sm cursor-pointer"
            >
              Explore Our Solutions
            </a>
          </div>
        </div>
      </section>

      {/* 2. STATS & TRACK RECORD STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-none p-6 sm:p-8 text-center shadow-lg border border-gray-200 backdrop-blur-md hover:-translate-y-1 transition-transform"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-[#ea0028] mb-1 font-mono">
                {item.number}
              </div>
              <div className="text-sm font-bold text-gray-900">
                {item.label}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FOUNDER & CEO LEADERSHIP SPOTLIGHT (NATURAL UN-CROPPED PORTRAIT) */}
      <section id="ceo-spotlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-none border border-gray-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
            
            {/* CEO Natural Photo Column (Balanced Executive Portrait) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200 p-6 sm:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-200">
              
              {/* Photo Frame Container with Balanced 4:5 Aspect Ratio */}
              <div className="relative bg-white p-2.5 border-2 border-gray-300 shadow-xl max-w-[280px] sm:max-w-[300px] w-full">
                {/* Red decorative accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#ea0028]" />
                
                <img
                  src="/ceo-virender-dhiman.jpg"
                  alt="Virender K Dhiman - Founder & Managing Director, Rave Services"
                  className="w-full h-auto object-contain block"
                />

                {/* Caption Strip Under Photo */}
                <div className="pt-2.5 pb-0.5 text-center border-t border-gray-200 mt-2 bg-white">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ea0028] uppercase tracking-wider mb-0.5">
                    <BadgeCheck className="w-4 h-4 text-[#ea0028]" />
                    <span>Founder & CEO</span>
                  </div>
                  <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
                    Virender K Dhiman
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Rave Services • Est. 2002
                  </p>
                </div>
              </div>

              {/* Direct CEO Office Connect buttons */}
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 w-full max-w-[280px] sm:max-w-[300px]">
                <a
                  href="https://wa.me/919814903739?text=Hello%20Mr.%20Virender%20Dhiman!%20I%20would%20like%20to%20discuss%20an%20AV%20project%20with%20Rave%20Services."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#1d1d1d] hover:bg-[#ea0028] text-white text-xs font-bold py-2.5 px-3 rounded-none transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Mr. Dhiman</span>
                </a>
                <a
                  href="tel:+919814903739"
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 text-xs font-bold py-2.5 px-3 rounded-none border border-gray-300 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-[#ea0028]" />
                  <span>Call Direct</span>
                </a>
              </div>

            </div>

            {/* CEO Narrative & Leadership Message Column */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#ea0028] uppercase tracking-widest block">
                    Leadership & Philosophy
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500 font-semibold">24+ Years of Industry Trust</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                  "Engineering precision and authenticity define every solution we install."
                </h2>

                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  A personal note from <strong>Virender K Dhiman</strong>, Founder & CEO:
                </p>
              </div>

              {/* Signature Quote Box */}
              <div className="bg-gray-50 border-l-4 border-[#ea0028] p-5 sm:p-6 rounded-none space-y-2">
                <div className="flex items-start gap-3">
                  <Quote className="w-8 h-8 text-[#ea0028] shrink-0 opacity-40 -mt-1" />
                  <p className="text-sm sm:text-base text-gray-800 italic leading-relaxed font-medium">
                    "When I started Rave Services back in 2002, our vision was simple: eliminate the compromise between cutting-edge audio-visual technology and long-term reliability. Whether we are engineering a 1,000-seat auditorium, a military command centre data wall, a multiplex cinema, or an executive boardroom, our clients trust us to deliver perfection."
                  </p>
                </div>
                <div className="text-right text-xs font-bold text-gray-900 pt-1">
                  — Virender K Dhiman, <span className="text-[#ea0028]">Founder & Managing Director</span>
                </div>
              </div>

              {/* Journey Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                Under Mr. Dhiman's dedicated stewardship for over 24 years, Rave Services has grown into one of North India’s most dependable providers of commercial audio-visual integration. Today, Rave Services delivers turnkey projection, sound, data walls, teleprompters, digital signages, and Toughbook computers across corporate headquarters, defence establishments, educational institutes, and luxury residences.
              </p>

              {/* 4 Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-gray-200">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ea0028] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">Direct Brand Distribution</h5>
                    <p className="text-[11px] text-gray-500">100% genuine OEM products with official brand warranty.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ea0028] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">In-House AV Engineers</h5>
                    <p className="text-[11px] text-gray-500">Certified room calibration, acoustic mapping & installation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ea0028] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">Defence & Institutional Trust</h5>
                    <p className="text-[11px] text-gray-500">GEM portal compliance, formal B2B GST billing, and tenders.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ea0028] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">Pan-India Transit & AMC</h5>
                    <p className="text-[11px] text-gray-500">Insured crate packaging, on-site demonstration & post-sales AMC.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. VISUAL SOLUTIONS SHOWCASE WITH REAL PHOTOGRAPHY & TABS */}
      <section id="solutions-portfolio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-[#ea0028] uppercase tracking-widest block">
            What We Supply & Engineer
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Commercial AV & Smart Display Solutions
          </h2>
          <p className="text-sm text-gray-600">
            Click on any solution below to explore our technical capabilities, brand hardware, and integration architecture.
          </p>
        </div>

        {/* Tab Selector Pills */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {solutions.map((sol, idx) => (
            <button
              key={sol.id}
              onClick={() => setActiveSolutionTab(idx)}
              className={`px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer border ${
                activeSolutionTab === idx
                  ? 'bg-[#1d1d1d] text-white border-[#1d1d1d] shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#ea0028] hover:text-[#ea0028]'
              }`}
            >
              {sol.title.split('&')[0].trim()}
            </button>
          ))}
        </div>

        {/* Active Tab Featured Showcase */}
        <div className="bg-white rounded-none border border-gray-200 shadow-xl overflow-hidden mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Visual Photo Column */}
            <div className="lg:col-span-7 relative min-h-[350px] sm:min-h-[420px] bg-slate-950 overflow-hidden">
              <img
                src={solutions[activeSolutionTab].image}
                alt={solutions[activeSolutionTab].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-[#ea0028] text-white text-[10px] font-extrabold px-3 py-1 rounded-none uppercase tracking-wider inline-block mb-2">
                  {solutions[activeSolutionTab].tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold">
                  {solutions[activeSolutionTab].title}
                </h3>
              </div>
            </div>

            {/* Description & Technical Points Column */}
            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-[#ea0028] uppercase tracking-wider block">
                  Turnkey Engineering Specs
                </span>
                <p className="text-gray-700 text-sm leading-relaxed font-normal">
                  {solutions[activeSolutionTab].description}
                </p>

                <div className="space-y-2.5 pt-2 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Key Features & Hardware:
                  </h4>
                  {solutions[activeSolutionTab].features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-[#ea0028] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <Link
                  to="/contact"
                  className="bg-[#1d1d1d] hover:bg-[#ea0028] text-white text-xs font-bold px-6 py-3 rounded-none shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Request Technical Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/products"
                  className="text-xs font-bold text-gray-600 hover:text-[#ea0028] transition-colors"
                >
                  Browse Catalogue →
                </Link>
              </div>

            </div>

          </div>
        </div>

        {/* All 7 Solutions Quick Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {solutions.map((sol, idx) => (
            <div
              key={sol.id}
              onClick={() => setActiveSolutionTab(idx)}
              className={`p-5 rounded-none border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                activeSolutionTab === idx
                  ? 'border-[#ea0028] bg-red-50/20 shadow-md ring-1 ring-red-300'
                  : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold text-[#ea0028] uppercase tracking-wider block mb-1">
                  {sol.tag}
                </span>
                <h4 className="font-bold text-sm text-gray-900 leading-snug">
                  {sol.title}
                </h4>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <span>View Specs</span>
                <ChevronRight className={`w-3.5 h-3.5 ${activeSolutionTab === idx ? 'text-[#ea0028]' : 'text-gray-400'}`} />
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 5. SECTORS WE EMPOWER ACROSS INDIA */}
      <section className="bg-gray-100/90 py-16 sm:py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#ea0028] uppercase tracking-widest block">
              Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Sectors Empowered by Rave Services
            </h2>
            <p className="text-sm text-gray-600">
              Customized technological ecosystems configured for the exact operational requirements of each client.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {sectors.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-none p-6 border border-gray-200 shadow-xs hover:shadow-lg transition-all flex flex-col items-start"
                >
                  <div className="w-10 h-10 rounded-none bg-[#1d1d1d] text-white flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#ea0028]" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mb-2">{s.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. OUR 4-STEP ENGINEERING METHODOLOGY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-[#ea0028] uppercase tracking-widest block">
            Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            How Rave Services Delivers Excellence
          </h2>
          <p className="text-sm text-gray-600">
            Meticulous engineering from initial acoustic assessment to final calibration and ongoing maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-none p-6 border border-gray-200 shadow-xs relative overflow-hidden flex flex-col justify-between"
            >
              <div className="text-4xl font-extrabold text-gray-200 font-mono mb-3">
                {step.step}
              </div>
              <div>
                <h4 className="font-bold text-base text-gray-900 mb-2">{step.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
              <div className="h-1 w-10 bg-[#ea0028] mt-6" />
            </div>
          ))}
        </div>
      </section>

      {/* 7. TRUST BADGES */}
      <TrustBadges />

      {/* 8. EXECUTIVE ACTION CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1d1d1d] border border-gray-800 rounded-none p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-block px-4 py-1.5 bg-[#2a2a2a] border border-red-500/40 rounded-none text-xs font-bold uppercase tracking-widest text-[#ea0028]">
              PARTNER WITH RAVE SERVICES TODAY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Planning an AV Integration, Commercial Cinema, or Auditorium Project?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Connect directly with Mr. Virender K Dhiman and our senior technical sales team for personalized consultation, room design assessment, and formal corporate quotations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto bg-[#ea0028] hover:bg-[#cc0020] text-white font-bold px-8 py-3.5 rounded-none shadow-md transition-transform hover:scale-105 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Browse AV Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+919814903739"
                className="w-full sm:w-auto bg-[#2a2a2a] hover:bg-[#333333] text-white font-bold px-8 py-3.5 rounded-none border border-gray-700 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#ea0028]" />
                <span>Call +91 9814903739</span>
              </a>
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-none border border-gray-600 transition-colors text-sm flex items-center justify-center cursor-pointer"
              >
                <span>Submit Inquiry Form</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
