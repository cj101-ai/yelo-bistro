import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

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
        playOnInit: true,
      }),
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

  const getQty = (id: string) => {
    return cart.find((c) => c.item.id === id)?.quantity ?? 0;
  };

  return (
    <section className="relative w-full max-w-[95vw] sm:max-w-[92vw] lg:max-w-[80vw] mx-auto py-9">
      {/* Title */}
      <div className="flex items-center justify-center gap-2 sm:gap-6 md:gap-8 mb-8 md:mb-14 w-full">
        <div className="flex-1 min-w-[10px] sm:min-w-[50px] h-[2px] md:h-[3px] bg-yellow-600" />

        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-yellow-500 whitespace-nowrap">
          Customer Favorites
        </h2>

        <div className="flex-1 min-w-[10px] sm:min-w-[50px] h-[2px] md:h-[3px] bg-yellow-600" />
      </div>

      {/* Carousel */}
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex -ml-4">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="
                flex-[0_0_66.666%]
                md:flex-[0_0_40%]
                lg:flex-[0_0_28.571%]
                pl-4
              "
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
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}