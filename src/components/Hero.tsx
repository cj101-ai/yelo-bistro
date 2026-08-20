
import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface HeroProps {
  onOrderNow: () => void;
  onViewMenu: () => void;
}

// Hero banner images
const SLIDES = [
  "/hero/hero no1.png",
  "/hero/hero no 2.png",
  "/hero/hero no 3.png",
];

export default function Hero({ onOrderNow, onViewMenu }: HeroProps) {
  const [current, setCurrent] = React.useState(0);

  // Automatically change slides every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
      {/* 
        Responsive Hero Container

        Mobile:
        16 / 9

        Small tablet:
        approximately 2 / 1

        Desktop:
        approximately 2.5 / 1
      */}
      <div
        className="
          relative
          w-full
          aspect-[16/9]
          sm:aspect-[2/1]
          md:aspect-[2.2/1]
          lg:aspect-[2.5/1]
          xl:aspect-[2.7/1]
        "
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.img
            key={current}
            src={SLIDES[current]}
            alt={`Yelo Bistro banner ${current + 1}`}
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              object-center
              select-none
            "
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
            draggable={false}
          />
        </AnimatePresence>

        {/* 
          Subtle bottom gradient.
          This keeps the image visible while making
          the bottom portion slightly darker.
        */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/35
            via-transparent
            to-transparent
            pointer-events-none
            z-10
          "
        />

        {/* 
          Slide Navigation
        */}
        <div
          className="
            absolute
            bottom-3
            sm:bottom-4
            md:bottom-5
            lg:bottom-6
            left-1/2
            -translate-x-1/2
            flex
            items-center
            justify-center
            gap-2
            sm:gap-2.5
            md:gap-3
            z-20
          "
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
                focus-visible:ring-offset-2
                focus-visible:ring-offset-transparent

                ${
                  current === index
                    ? `
                      w-7
                      sm:w-8
                      md:w-10
                      bg-white
                      shadow-lg
                    `
                    : `
                      w-1.5
                      sm:w-2
                      bg-white/50
                      hover:bg-white/80
                    `
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

