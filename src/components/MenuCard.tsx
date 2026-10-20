
import { motion } from "framer-motion";
import { Clock, Minus, Plus, Star } from "lucide-react";
import toast from "react-hot-toast";
import { FoodItem } from "../types";

interface MenuCardProps {
  item: FoodItem;
  qty: number;
  onAddToCart: (item: FoodItem) => void;
  onRemoveFromCart: (item: FoodItem) => void;
}

export default function MenuCard({
  item,
  qty,
  onAddToCart,
  onRemoveFromCart,
}: MenuCardProps) {
  // Only false means unavailable.
  // undefined/null will still be treated as available.
  const isAvailable = item.available !== false;

  const handleAddToCart = () => {
    // Extra protection in case the product becomes unavailable
    // while the customer is viewing the page.
    if (!isAvailable) {
      toast.error(`${item.name} is temporarily sold out`);
      return;
    }

    onAddToCart(item);
  };

  const handleRemoveFromCart = () => {
    onRemoveFromCart(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.4 }}
      className="
        group
        bg-white dark:bg-neutral-900
        rounded-2xl sm:rounded-3xl md:rounded-[32px]
        overflow-hidden
        shadow-lg hover:shadow-2xl hover:-translate-y-2
        transition-all duration-300
        border border-neutral-200 dark:border-neutral-800
        flex flex-row lg:flex-col
        h-[240px] lg:h-[500px]
      "
    >
      {/* Image Container */}
      <div
        className="
          w-1/2 lg:w-full
          h-full lg:h-1/2
          overflow-hidden
          relative
          shrink-0
        "
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`
            w-full h-full object-cover
            transition-transform duration-500
            ${isAvailable ? "group-hover:scale-110" : "grayscale"}
          `}
        />

        {/* Normal image gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* TEMPORARILY SOLD OUT OVERLAY */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <div className="bg-red-600 text-white px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl text-center transform -rotate-3">
              <p className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest">
                Temporarily
              </p>

              <p className="text-base sm:text-lg md:text-xl font-black uppercase tracking-wide">
                Sold Out
              </p>
            </div>
          </div>
        )}

        {/* Featured Badge */}
        {isAvailable && item.isFeatured && (
          <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 md:top-4 md:left-4 flex gap-1 sm:gap-2">
            <span className="flex items-center gap-0.5 sm:gap-1 bg-yellow-400 text-black px-1.5 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-bold shadow-lg">
              <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 fill-current" />

              <span className="hidden xs:inline">
                Popular
              </span>
            </span>
          </div>
        )}

        {/* Hover overlay */}
        {isAvailable && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}

        {/* Preparation Time */}
        {isAvailable && (
          <div className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 md:bottom-3 md:right-3">
            <span className="bg-white/90 dark:bg-neutral-900/90 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[8px] sm:text-[9px] md:text-[10px] font-bold flex items-center gap-0.5 sm:gap-1">
              <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-red-500" />

              {item.prepTime}
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div
        className="
          w-1/2 lg:w-full
          h-full lg:h-1/2
          p-2.5 xs:p-3 sm:p-4 md:p-5 lg:p-6
          flex flex-col justify-between
          min-w-0
        "
      >
        {/* Top Details */}
        <div className="min-w-0">
          <h3 className="text-xl xs:text-sm sm:text-base md:text-lg lg:text-xl font-black text-neutral-900 dark:text-white leading-tight line-clamp-2 md:line-clamp-3 lg:line-clamp-4">
            {item.name}
          </h3>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-0.5 sm:mt-1 md:mt-2">
            <div className="flex items-center gap-0.5 sm:gap-1 text-yellow-500 text-[10px] xs:text-xs sm:text-sm font-semibold">
              <Star className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 fill-current" />

              <span>{item.rating}</span>
            </div>

            {isAvailable && (
              <div className="flex items-center gap-0.5 sm:gap-1 text-gray-500 dark:text-gray-400 text-[10px] xs:text-xs sm:text-sm">
                <Clock className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 text-red-500" />

                <span>{item.prepTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex items-center justify-between gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex-shrink-0 min-w-0">
            <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[12px] uppercase tracking-widest text-stone-400 block">
              Price
            </span>

            <span className="text-xl xs:text-sm sm:text-base md:text-lg font-black text-yellow-500 flex items-center truncate">
              ₦{item.price.toLocaleString()}
            </span>
          </div>

          {/* CART BUTTONS */}
          {isAvailable && (
            <div className="flex-shrink-0">
              {qty > 0 ? (
                <div className="flex items-center gap-0.5 sm:gap-1 bg-yellow-400 dark:bg-yellow-500 text-black px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-full">
                  <button
                    onClick={handleRemoveFromCart}
                    className="p-0.5 sm:p-1 hover:bg-yellow-300 rounded-full transition"
                  >
                    <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>

                  <span className="font-bold text-[10px] sm:text-xs min-w-[14px] sm:min-w-[16px] text-center">
                    {qty}
                  </span>

                  <button
                    onClick={handleAddToCart}
                    className="p-0.5 sm:p-1 hover:bg-yellow-300 rounded-full transition"
                  >
                    <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleAddToCart();

                    if (isAvailable) {
                      toast.success(
                        `${item.name} added to cart`
                      );
                    }
                  }}
                  className="
                    px-2 xs:px-2.5 sm:px-3.5
                    py-1.5 sm:py-2
                    text-[10px] xs:text-xs sm:text-sm
                    whitespace-nowrap
                    rounded-lg sm:rounded-xl
                    bg-yellow-400
                    hover:bg-yellow-500
                    text-black
                    font-bold
                    flex
                    items-center
                    justify-center
                    transition-all
                    active:scale-95
                  "
                >
                  <span>Add to Cart</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

