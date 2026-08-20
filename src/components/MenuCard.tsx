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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.4 }}
      className="group bg-white dark:bg-neutral-900 rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-neutral-200 dark:border-neutral-800 flex flex-row lg:flex-col h-[240px] lg:h-[500px]"
    >
      {/* Image Container: 50% width on mobile, 50% height on desktop */}
      <div className="w-1/2 lg:w-full h-full lg:h-1/2 overflow-hidden relative">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          {item.isFeatured && (
            <span className="flex items-center gap-1 bg-yellow-400 text-black px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              Popular
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="absolute bottom-3 right-3">
          <span className="bg-white/90 dark:bg-neutral-900/90 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-red-500" />
            {item.prepTime}
          </span>
        </div>
      </div>

      {/* Content Container: 50% width on mobile, 50% height on desktop */}
      <div className="w-1/2 lg:w-full h-full lg:h-1/2 p-4 lg:p-6 flex flex-col justify-between">
        {/* Top Details */}
        <div>
          <h3 className="text-base lg:text-2xl font-black text-neutral-900 dark:text-white leading-tight line-clamp-1 lg:line-clamp-2">
            {item.name}
          </h3>

          <div className="flex items-center gap-4 mt-1 lg:mt-2">
            <div className="flex items-center gap-1 text-yellow-500 text-xs lg:text-sm font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{item.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs lg:text-sm">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>{item.prepTime}</span>
            </div>
          </div>

      
        </div>

        {/* Bottom Actions */}
<div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
  <div className="flex-shrink-0">
    <span className="text-[10px] lg:text-[12px] uppercase tracking-widest text-stone-400 block">
      Price
    </span>
    <span className="text-sm lg:text-xl font-black font-mono text-amber-500 dark:text-white">
      ₦{item.price.toLocaleString()}
    </span>
  </div>

  <div>
    {qty > 0 ? (
      <div className="flex items-center gap-1 bg-yellow-400 dark:bg-yellow-500 text-black px-2 py-1.5 rounded-full">
        <button
          onClick={() => onRemoveFromCart(item)}
          className="p-1 hover:bg-yellow-300 rounded-full transition"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="font-bold text-xs min-w-[16px] text-center">
          {qty}
        </span>
        <button
          onClick={() => onAddToCart(item)}
          className="p-1 hover:bg-yellow-300 rounded-full transition"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    ) : (
      <button
        onClick={() => {
          onAddToCart(item);
          toast.success(`${item.name} added to cart`);
        }}
        className="
          px-3.5
          py-2
          text-xs
          lg:text-sm
          whitespace-nowrap
          rounded-xl
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
</div>
      </div>
    </motion.div>
  );
}