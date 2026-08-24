import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Leaf, ShoppingBag, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

const HeroSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const data = await api.getSliders();
        setSliders(data.filter(s => s.isActive !== false));
      } catch (err) {
        console.error('Error fetching sliders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (sliders.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliders.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sliders, isPaused, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sliders.length);
  };

  if (loading) {
    return (
      <div className="w-full h-[520px] sm:h-[600px] bg-emerald-950 animate-pulse flex items-center justify-center text-emerald-300">
        <Sparkles className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (sliders.length === 0) return null;

  const currentSlide = sliders[currentIndex] || sliders[0];

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white min-h-[560px] sm:min-h-[640px] flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Slide Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fade-in key={currentIndex}">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/50 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-emerald-200 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentSlide.badge || '📺 RAVE SERVICES - AV & Display Solutions'}</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-white tracking-tight">
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-emerald-100/90 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {currentSlide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to={currentSlide.btnLink || '/products'}
                className="w-full sm:w-auto bg-white hover:bg-emerald-50 text-emerald-950 font-bold px-8 py-4 rounded-full shadow-xl shadow-emerald-950/30 hover:scale-105 transition-all flex items-center justify-center gap-3 text-sm sm:text-base"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                <span>{currentSlide.btnText || 'Explore Products'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {currentSlide.secondaryBtnText && (
                <Link
                  to={currentSlide.secondaryBtnLink || '/products'}
                  className="w-full sm:w-auto bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-500/50 text-white font-semibold px-7 py-4 rounded-full transition-all flex items-center justify-center gap-2 text-sm sm:text-base backdrop-blur-md"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>{currentSlide.secondaryBtnText}</span>
                </Link>
              )}
            </div>

            {/* Quality Badges Strip */}
            <div className="pt-4 border-t border-emerald-700/50 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>100% Genuine Warranty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>GST Billing Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Pan-India Safe Transit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Image with Floating Highlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/30 bg-emerald-950/40 backdrop-blur-md aspect-square sm:aspect-[4/3] lg:aspect-square">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    {currentSlide.badge}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white line-clamp-1">
                    {currentSlide.title}
                  </h3>
                </div>
              </div>

              {/* Floating Pill */}
              {currentSlide.floatingText && (
                <div className="absolute -bottom-5 -left-5 bg-white text-emerald-950 p-4 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-3 animate-float hidden sm:flex z-20">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Special Highlight</div>
                    <div className="text-xs sm:text-sm font-extrabold text-gray-900">{currentSlide.floatingText}</div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-emerald-950/60 hover:bg-emerald-800 text-white flex items-center justify-center backdrop-blur-md border border-emerald-600/40 shadow-lg transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-emerald-950/60 hover:bg-emerald-800 text-white flex items-center justify-center backdrop-blur-md border border-emerald-600/40 shadow-lg transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {sliders.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
          {sliders.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === idx
                  ? 'w-8 h-2.5 bg-emerald-400 shadow-md'
                  : 'w-2.5 h-2.5 bg-emerald-700/60 hover:bg-emerald-500'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
