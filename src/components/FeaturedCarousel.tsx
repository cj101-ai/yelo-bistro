import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

import FeaturedCard from "./FeaturedCard";
import { FOOD_ITEMS } from "../data";
import { CartItem, FoodItem } from "../types";

interface FeaturedCarouselProps {
  cart: CartItem[];
  onAddToCart: (item: FoodItem) => void;
  onRemoveFromCart: (item: FoodItem) => void;
}

export default function FeaturedCarousel({
  cart,
  onAddToCart,
  onRemoveFromCart,
}: FeaturedCarouselProps) {
  const featuredItems = FOOD_ITEMS.filter((item) => item.isFeatured);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
    },
    [
      Autoplay({ 
        delay: 4000, 
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        playOnInit: true 
      })
    ]
  );

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const getQty = (id: string) => {
    return cart.find((c) => c.item.id === id)?.quantity ?? 0;
  };

  return (
    <section className="relative py-9 w-full max-w-[80vw] mx-auto">
      
      {/* Title Header */}
<div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 mb-10 md:mb-14 w-full px-2 sm:px-4">
  
  {/* Left Line: visible on all screens, but scales gracefully */}
  <div className="flex-1 min-w-[20px] sm:min-w-[50px] h-[2px] md:h-[3px] bg-yellow-600"></div>
  
  {/* Text: Changes font size dynamically depending on the screen size */}
  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-yellow-500 whitespace-nowrap">
    Customer Favorites
  </h2>
  
  {/* Right Line */}
  <div className="flex-1 min-w-[20px] sm:min-w-[50px] h-[2px] md:h-[3px] bg-yellow-600"></div>
  
</div>

      {/* Carousel Container - Stretches precisely to match the line endpoints above */}
      <div className="relative w-full px-4"></div>
        
        {/* Left Arrow - Positioned beautifully over the edge boundary 
        <button
          onClick={scrollPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex
          w-10 h-10 rounded-full bg-yellow-500 shadow-xl items-center justify-center text-white hover:bg-yellow-600 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>*/}

        {/* Embla Viewport - The masks are perfectly aligned with the accent lines */}
        <div className="overflow-hidden w-full rounded-lg" ref={emblaRef}>
          <div className="flex -ml-4">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="flex-[0_0_92%] sm:flex-[0_0_75%] md:flex-[0_0_48%] lg:flex-[0_0_45%] xl:flex-[0_0_32%] pl-4"
              >
                <div className="h-full p-1">
                  <FeaturedCard
                    item={item}
                    qty={getQty(item.id)}
                    onAddToCart={onAddToCart}
                    onRemoveFromCart={onRemoveFromCart}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow - Positioned beautifully over the edge boundary 
        <button
          onClick={scrollNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex
          w-10 h-10 rounded-full bg--500 shadow-xl items-center justify-center text- hover:bg-y-600 transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div> */}

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 gap-2">
        {featuredItems.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex
                ? "bg-red-500 w-8"
                : "bg-gray-300 dark:bg-gray-700 w-2"
            }`}
          />
        ))}
      </div>
    </section>
  );
}


