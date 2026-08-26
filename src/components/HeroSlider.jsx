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
      <div className="w-full h-[40vh] sm:h-[60vh] bg-emerald-950 animate-pulse flex items-center justify-center text-emerald-300">
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
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white flex items-center justify-center backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white flex items-center justify-center backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
            aria-label="Next banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {sliders.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {sliders.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === idx
                  ? 'w-8 h-2.5 bg-white shadow-md'
                  : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
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
