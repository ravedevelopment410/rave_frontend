import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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
    }, 5000);

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
      <div className="w-full h-[40vh] sm:h-[60vh] bg-[#1d1d1d] animate-pulse flex items-center justify-center text-[#ea0028]">
        <Sparkles className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (sliders.length === 0) return null;

  return (
    <div
      className="relative w-full h-[75vh] sm:h-[80vh] overflow-hidden bg-slate-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="w-full h-full relative">
        {sliders.map((slide, idx) => (
          <div
            key={slide._id || idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              currentIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={`Banner ${idx + 1}`}
              className="w-full h-full object-fill"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-none bg-slate-950/60 hover:bg-[#ea0028] text-white flex items-center justify-center backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-none bg-slate-950/60 hover:bg-[#ea0028] text-white flex items-center justify-center backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            aria-label="Next banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Pagination Indicators */}
      {sliders.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {sliders.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-none cursor-pointer ${
                currentIndex === idx
                  ? 'w-8 h-2 bg-[#ea0028] shadow-md'
                  : 'w-3 h-2 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Go to banner slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
