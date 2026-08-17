import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  onOrderNow: () => void;
  onViewMenu: () => void;
}

// Banner slide image sources
const SLIDES = [
  "/hero/hero no1.png", // combo banner
  "/hero/hero no 2.png", // milkshake banner
  "/hero/hero no 3.png", // wings banner
];

export default function Hero({ onOrderNow, onViewMenu }: HeroProps) {
  const [current, setCurrent] = React.useState(0);

  // Auto-play slides every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white rounded-b-[60px]">
      
      {/* 1. Dynamic Auto-Sizing Image Container */}
      <AnimatePresence initial={false}>
        <motion.img
          key={current}
          src={SLIDES[current]}
          alt={`Banner slide ${current + 1}`}
          className="w-full h-full block object-cover [&:not(:first-child)]:absolute [&:not(:first-child)]:top-0 [&:not(:first-child)]:left-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        />
      </AnimatePresence>

      {/* 2. Soft Bottom Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />

      {/* 3. Slide Navigation Dots */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full h-1.5 sm:h-2 cursor-pointer ${
              current === index
                ? "w-8 sm:w-10 bg-white shadow-lg"
                : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}