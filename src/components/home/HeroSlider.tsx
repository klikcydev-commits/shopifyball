import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "GAME DAY READY",
    subtitle: "Premium Football Gear",
    description: "Dominate the field with professional-grade equipment trusted by champions.",
    cta: "Shop Collection",
    ctaLink: "/shop",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1920&q=80",
  },
  {
    id: 2,
    title: "ELITE PERFORMANCE",
    subtitle: "New Season Collection",
    description: "Engineered for speed, built for power. Gear up with the latest innovations.",
    cta: "Explore Now",
    ctaLink: "/shop",
    image: "https://images.unsplash.com/photo-1508098682722-e99c643e7f76?w=1920&q=80",
  },
  {
    id: 3,
    title: "CHAMPIONSHIP",
    subtitle: "Training Essentials",
    description: "From practice to playoffs, equip yourself with gear that performs.",
    cta: "Get Started",
    ctaLink: "/shop",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1920&q=80",
  },
];

export const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-navy">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-navy/40" />
          
          {/* Animated Lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full container-custom flex items-center">
        <div className="max-w-3xl pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-6"
              >
                {slides[currentSlide].subtitle}
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground leading-none mb-6"
              >
                {slides[currentSlide].title.split(" ").map((word, i) => (
                  <span key={i} className={i === 1 ? "text-gold" : ""}>
                    {word}{" "}
                  </span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mb-10"
              >
                {slides[currentSlide].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Button asChild variant="hero" size="xl">
                  <Link to={slides[currentSlide].ctaLink}>
                    {slides[currentSlide].cta}
                  </Link>
                </Button>
                <Button asChild variant="heroOutline" size="xl">
                  <Link to="/about">Learn More</Link>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-navy-light/50 hover:bg-gold text-primary-foreground hover:text-navy rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-navy-light/50 hover:bg-gold text-primary-foreground hover:text-navy rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "w-12 bg-gold"
                : "w-6 bg-primary-foreground/30 hover:bg-primary-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 right-10 hidden md:flex flex-col items-center gap-2 text-primary-foreground/50"
      >
        <span className="text-xs uppercase tracking-widest rotate-90 origin-center translate-y-8">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-12 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
};