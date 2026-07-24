import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock, ShieldCheck, Flame, Star } from 'lucide-react';
import { HERO_IMAGE_PATH } from '../data';

interface HeroProps {
  onOrderNow: () => void;
  onViewMenu: () => void;
}

export default function Hero({ onOrderNow, onViewMenu }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-stone-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 pt-8 pb-16 md:py-24 transition-colors duration-300">
      
      {/* Decorative Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-300/20 dark:bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-400/10 dark:bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left" id="hero-text-container">
            
            {/* Tagline */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-400 text-xs font-bold uppercase tracking-widest font-mono"
            >
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Yelo Bistro Cafe</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white leading-[1.1] tracking-tight"
            >
              Serving Happy Moments <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-yellow-500 font-extrabold">
                One Commissioner At A Time
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-stone-600 dark:text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              Mouth-watering budget friendly dishes,Fine dining options,Sumptuous slushies, Excellent customer service Fast and accurate delivery.Right in the heart of Benin 

            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              id="hero-cta-buttons"
            >
              <button 
                id="hero-order-now-btn"
                onClick={onOrderNow}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 text-white font-extrabold text-base hover:from-red-600 hover:to-yellow-600 transition-all shadow-lg shadow-red-500/25 dark:shadow-none hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                id="hero-view-menu-btn"
                onClick={onViewMenu}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-neutral-900 text-stone-800 dark:text-neutral-100 border border-stone-200 dark:border-neutral-800 hover:bg-stone-50 dark:hover:bg-neutral-800 hover:text-stone-950 font-bold transition-all shadow-md hover:scale-102 flex items-center justify-center cursor-pointer"
              >
                View Menu
              </button>
            </motion.div>

            {/* Fast Features */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200/60 dark:border-neutral-800 max-w-lg mx-auto lg:mx-0"
              id="hero-quick-stats"
            >
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1 text-red-500 font-extrabold text-xl font-mono">
                  <span>EAT</span>
                  <span className="text-base uppercase">IN</span>
                </div>
                <span className="text-[11px] text-stone-500 dark:text-neutral-400 uppercase tracking-wider font-semibold font-mono">
                  
                </span>
              </div>

              <div className="flex flex-col items-center lg:items-start border-x border-stone-200/60 dark:border-neutral-800 px-4">
                <div className="flex items-center gap-0.5 text-yellow-500 font-extrabold text-xl font-mono">
                  <span>DELIVERY</span>
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                </div>
                <span className="text-[11px] text-stone-500 dark:text-neutral-400 uppercase tracking-wider font-semibold font-mono">
                  
                </span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="text-emerald-500 font-extrabold text-xl font-mono">
                  <span>TAKE-OUT</span>
                </div>
                <span className="text-[11px] text-stone-500 dark:text-neutral-400 uppercase tracking-wider font-semibold font-mono">
                  
                </span>
              </div>
            </motion.div>

          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative" id="hero-image-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative p-3 rounded-3xl bg-amber-100/50 dark:bg-neutral-900 border border-amber-300/20 dark:border-neutral-800 shadow-2xl overflow-hidden"
            >
              {/* Premium Stamp badge */}
              <div className="absolute top-6 right-6 z-20 bg-neutral-950 text-white dark:bg-yellow-400 dark:text-neutral-950 font-mono text-[10px] font-bold py-2 px-3.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-wider animate-pulse">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-400 dark:text-neutral-950" />
                <span>Premium Quality</span>
              </div>

              {/* Gourmet Banner */}
              <div className="aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-stone-100">
                <img
                  src={HERO_IMAGE_PATH}
                  alt="Yelo Bistro Gourmet Food Banquet"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-neutral-950 p-4 rounded-2xl shadow-xl flex items-center gap-3.5 border border-stone-100 dark:border-neutral-800 animate-bounce" style={{ animationDuration: '6s' }}>
                <div className="w-12 h-12 bg-rose-100 dark:bg-red-950 rounded-xl flex items-center justify-center text-red-500">
                  <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div>
                  <p className="text-lg text-red-500 dark:text-yellow-400 font-semibold uppercase tracking-wider">Best Wings In Benin</p>
                  <p className="text-sm font-black text-stone-900 dark:text-white">Orders Now</p>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
