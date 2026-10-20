import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import FeaturedCard from "./FeaturedCard";
import { CartItem, FoodItem } from "../types";
import { supabase } from "../lib/supabase";

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
  const [featuredItems, setFeaturedItems] = React.useState<FoodItem[]>([]);
  const [loading, setLoading] = React.useState(true);

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

  // Convert Supabase product into FoodItem
  const formatProduct = (product: any): FoodItem => ({
    id: String(product.id),
    name: product.name,
    description: product.description || "",
    price: Number(product.price),
    image: product.image_url || "",
    category: product.category as FoodItem["category"],
    available: product.available ?? true,
    rating: Number(product.rating ?? 0),
    prepTime: product.prep_time || "20 min",
    isFeatured: product.is_featured ?? false,
    options: Array.isArray(product.options)
      ? product.options
      : [],
  });

  // Fetch featured products
  const fetchFeaturedProducts = React.useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .eq("available", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching featured products:", error);
      setLoading(false);
      return;
    }

    setFeaturedItems((data || []).map(formatProduct));
    setLoading(false);
  }, []);

  // Initial fetch
  React.useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  // REALTIME PRODUCT CHANGES
  React.useEffect(() => {
    const channel = supabase
      .channel("featured-products-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload) => {
          console.log("Realtime product change:", payload);

          // PRODUCT UPDATED
          if (payload.eventType === "UPDATE") {
            const product = payload.new as any;

            const productId = String(product.id);

            const shouldBeFeatured =
              product.is_featured === true &&
              product.available === true;

            setFeaturedItems((currentItems) => {
              const exists = currentItems.some(
                (item) => item.id === productId
              );

              // Product should NOT be in carousel
              // Remove it immediately.
              if (!shouldBeFeatured) {
                return currentItems.filter(
                  (item) => item.id !== productId
                );
              }

              // Product should be in carousel
              // Update it if it already exists.
              if (exists) {
                return currentItems.map((item) =>
                  item.id === productId
                    ? formatProduct(product)
                    : item
                );
              }

              // Product became featured + available
              // Add it immediately.
              return [...currentItems, formatProduct(product)];
            });
          }

          // PRODUCT INSERTED
          if (payload.eventType === "INSERT") {
            const product = payload.new as any;

            const shouldBeFeatured =
              product.is_featured === true &&
              product.available === true;

            if (shouldBeFeatured) {
              setFeaturedItems((currentItems) => {
                const alreadyExists = currentItems.some(
                  (item) => item.id === String(product.id)
                );

                if (alreadyExists) {
                  return currentItems;
                }

                return [...currentItems, formatProduct(product)];
              });
            }
          }

          // PRODUCT DELETED
          if (payload.eventType === "DELETE") {
            const product = payload.old as any;

            const productId = String(product.id);

            setFeaturedItems((currentItems) =>
              currentItems.filter(
                (item) => item.id !== productId
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log(
          "Featured products realtime status:",
          status
        );
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Reinitialize Embla whenever products change
  React.useEffect(() => {
    if (!emblaApi) return;

    const timer = setTimeout(() => {
      emblaApi.reInit();

      if (featuredItems.length > 0) {
        emblaApi.scrollTo(0, true);
      }

      setSelectedIndex(0);
    }, 50);

    return () => clearTimeout(timer);
  }, [featuredItems, emblaApi]);

  // Track current slide
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

  // Don't show the section if there are no featured products
  if (!loading && featuredItems.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full max-w-7xl mx-auto py-8 px-4">
      {/* Title */}
      <div className="flex items-center justify-center gap-2 sm:gap-6 md:gap-8 mb-8 w-full">
        <div className="flex-1 min-w-[10px] sm:min-w-[50px] h-[2px] md:h-[3px] bg-yellow-400" />

        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-yellow-400 whitespace-nowrap">
          Customer Favorites
        </h2>

        <div className="flex-1 min-w-[10px] sm:min-w-[50px] h-[2px] md:h-[3px] bg-yellow-400" />
      </div>

      {/* Carousel Container */}
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex -ml-4">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="
                flex-[0_0_66.666%]
                md:flex-[0_0_50%]
                lg:flex-[0_0_40%]
                pl-4
              "
            >
              <FeaturedCard
                item={item}
                qty={getQty(item.id)}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 gap-2">
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