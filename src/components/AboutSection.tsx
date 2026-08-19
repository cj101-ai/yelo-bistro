import React from 'react';
import { REVIEWS } from "../data";
import { ChefHat, Clock, Heart, Star, Compass, Award, Instagram, Video } from 'lucide-react';
import { TEAM_MEMBERS } from '../data';

export default function AboutSection() {
  const galleryImages = [
  { 
    url: "/images/PT Image Jul 3, 2026, 04_45_05 PM.png", 
    title: "Share Moments With Friends",
    videoUrl: "https://www.instagram.com/reel/DWMEiSWDCZ6/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
  },
  { 
    url: "/images/picture y2.png", 
    title: "Explore Our Varieties",
    videoUrl: "https://www.instagram.com/reel/DWI-Fu-CGE5/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
  },
  { 
    url: "/images/picture y3.png", 
    title: "Enjoy Our Delicious Wings",
    videoUrl: "https://www.instagram.com/reel/DcBk0XNgh0k/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
  },
  { 
    url: "/images/PT Image Jul 3, 2026, 04_54_34 PM.png", 
    title: "explore fine dining environment",
    videoUrl: "https://www.tiktok.com/@yourhandle/video/987654321" 
  },
];

  return (
    <section className="py-16 bg-white dark:bg-neutral-950 transition-colors duration-300" id="bistro-about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
          {/* Left Column Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-400 font-bold text-xs font-mono uppercase tracking-widest rounded-full">
              <Compass className="w-3.5 h-3.5" />
              <span>Get to know us</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Serving Happiness<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-yellow-500">
                In Every Moment
              </span>
            </h2>

            <p className="text-stone-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
              Welcome to Yelo Bistro, where great food, quality service, and memorable experiences come together. We are passionate about serving freshly prepared meals that are beautifully presented, carefully packaged, and made to satisfy every craving.  
            </p>

            <p className="text-stone-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
              At Yelo Bistro, we believe that every order deserves the same level of care and attention. From the moment your meal is prepared to the moment it reaches you, we are committed to maintaining quality, consistency, and a professional dining experience. Our branded packaging reflects our dedication to delivering food that is fresh, secure, and ready to enjoy.
              Whether you're dining with us, ordering takeout, or celebrating a special occasion, our goal is to make every experience enjoyable and worth coming back for. At Yelo Bistro, we're not just serving meals—we're creating moments that bring people together through delicious food and exceptional service.
            </p>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200 dark:border-neutral-800">
              <div className="space-y-1">
                <p className="text-xl font-bold font-mono text-green-500">Consistent</p>
                <p className="text-[11px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider">Tasty meals</p>
              </div>
              <div className="space-y-1 border-x border-stone-200 dark:border-neutral-800 px-4">
                <p className="text-xl font-bold font-mono text-amber-500">Reliable</p>
                <p className="text-[11px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider">services</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold font-mono text-red-500 dark:text-white">100%</p>
                <p className="text-[11px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider">Customer care</p>
              </div>
            </div>
          </div>

          {/* Right Column Grid Photo */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-lg">
                <img
                  src="/images/PT Image Jul 3, 2026, 04_33_10 PM.png"
                  alt=""
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
               />
              </div>
              <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-lg">
                <img
                  src="/images/PT Image Jul 3, 2026, 04_54_34 PM.png"
                  alt=""
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Customer Testimonials Carousel Section */}
        <section className="py-12" id="testimonial-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Reviews Section Title with Yellow Divider Lines */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] bg-yellow-500 dark:bg-yellow-400 flex-1"></div>
              <h2 className="text-2xl sm:text-3xl font-black text-yellow-500 dark:text-yellow-400 tracking-tight uppercase px-2">
                REVIEWS
              </h2>
              <div className="h-[2px] bg-yellow-500 dark:bg-yellow-400 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="testimonials-grid">
            {REVIEWS.map((rev) => (
  <div 
    key={rev.id}
    className="bg-white dark:bg-neutral-900/40 p-6 rounded-3xl border-2 border-yellow-500 dark:border-yellow-400 flex flex-col justify-between h-full hover:shadow-md transition-shadow"
  >
                
                  <div className="space-y-4">
                    {/* Rating stars */}
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-neutral-300 italic leading-relaxed font-sans">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-stone-100 dark:border-neutral-800">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-10 h-10 rounded-full object-cover shadow-sm bg-stone-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white">{rev.name}</h4>
                      <p className="text-[10px] text-stone-400 font-semibold uppercase">{rev.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media Image Gallery Section */}
        <div className="space-y-8">
          
          {/* Social Gallery Title with Yellow Divider Lines & Icons */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-[2px] bg-yellow-500 dark:bg-yellow-400 flex-1"></div>
            <div className="flex items-center gap-2 px-2">
              <Instagram className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
              <Video className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
              <h3 className="text-xl sm:text-3xl font-black text-yellow-500 dark:text-yellow-400 uppercase tracking-tight">
                FOLLOW US ON OUR SOCIALS
              </h3>
            </div>
            <div className="h-[2px] bg-yellow-500 dark:bg-yellow-400 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="about-food-gallery">
            {galleryImages.map((img, idx) => (
  <a 
    key={idx}
    href={img.videoUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative block rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 bg-stone-100 cursor-pointer"
  >
    <img
      src={img.url}
      alt={img.title}
      className="w-full h-full object-cover transform duration-500 group-hover:scale-110"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex items-end opacity-0 group-hover:opacity-100 transition-all">
      <span className="text-white text-xs font-bold font-mono tracking-wide">{img.title}</span>
    </div>
  </a>
))}
                
          </div>
        </div>

      </div>
    </section>
  );
}