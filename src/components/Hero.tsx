
import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface HeroProps {
  onOrderNow: () => void;
  onViewMenu: () => void;
}

const SLIDES = [
  {
    desktop: "/hero/hero no1.png",
    mobile: "/hero/hero no1-mobile.jpg",
  },
  {
    desktop: "/hero/hero no 2.png",
    mobile: "/hero/hero no 2-mobile.jpg",
  },
  {
    desktop: "/hero/hero no 3.png",
    mobile: "/hero/hero no 3-mobile.jpg",
  },
];

export default function Hero({ onOrderNow, onViewMenu }: HeroProps) {
  const [current, setCurrent] = React.useState(0);

  // Automatically move to the next slide every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slide = SLIDES[current];

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white
        rounded-b-[32px]
        sm:rounded-b-[40px]
        md:rounded-b-[50px]
        lg:rounded-b-[60px]
      "
    >
      {/* =========================
          MOBILE HERO
          ========================= */}
      <div className="relative block md:hidden w-full aspect-[9/16]">
        <AnimatePresence initial={false}>
          <motion.picture
            key={`mobile-${current}`}
            className="absolute inset-0 block w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          >
            <img
              src={slide.mobile}
              alt={`Yelo Bistro banner ${current + 1}`}
              className="
                block
                w-full
                h-full
                object-cover
                object-center
                select-none
              "
              draggable={false}
            />
          </motion.picture>
        </AnimatePresence>

        {/* Mobile bottom gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/30
            via-transparent
            to-transparent
            pointer-events-none
            z-10
          "
        />

        {/* Mobile dots */}
        <SlideDots
          current={current}
          setCurrent={setCurrent}
          mobile
        />
      </div>

      {/* =========================
          TABLET + DESKTOP HERO
          ========================= */}
      <div
        className="
          relative
          hidden
          md:block
          w-full
          aspect-[2.2/1]
          lg:aspect-[2.5/1]
          xl:aspect-[2.7/1]
        "
      >
        <AnimatePresence initial={false}>
          <motion.picture
            key={`desktop-${current}`}
            className="absolute inset-0 block w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          >
            <img
              src={slide.desktop}
              alt={`Yelo Bistro banner ${current + 1}`}
              className="
                block
                w-full
                h-full
                object-cover
                object-center
                select-none
              "
              draggable={false}
            />
          </motion.picture>
        </AnimatePresence>

        {/* Desktop bottom gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/30
            via-transparent
            to-transparent
            pointer-events-none
            z-10
          "
        />

        {/* Desktop dots */}
        <SlideDots
          current={current}
          setCurrent={setCurrent}
        />
      </div>
    </section>
  );
}

/* =========================
   SLIDE DOTS
   ========================= */

interface SlideDotsProps {
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  mobile?: boolean;
}

function SlideDots({
  current,
  setCurrent,
  mobile = false,
}: SlideDotsProps) {
  return (
    <div
      className={`
        absolute
        left-1/2
        -translate-x-1/2
        flex
        items-center
        justify-center
        gap-2
        ${mobile ? "bottom-3" : "bottom-4 lg:bottom-5"}
        z-20
      `}
    >
      {SLIDES.map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => setCurrent(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={current === index ? "true" : "false"}
          className={`
            h-1.5
            sm:h-2
            rounded-full
            cursor-pointer
            transition-all
            duration-300
            ease-in-out
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-white
            ${
              current === index
                ? "w-7 sm:w-8 md:w-10 bg-white shadow-lg"
                : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/80"
            }
          `}
        />
      ))}
    </div>
  );
}


