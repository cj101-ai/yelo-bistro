import { Clock, Plus, Minus, Star } from "lucide-react";
import { FoodItem } from "../types";
import toast from "react-hot-toast";

interface FeaturedCardProps {
  item: FoodItem;
  qty: number;
  onAddToCart: (item: FoodItem) => void;
  onRemoveFromCart: (item: FoodItem) => void;
}

export default function FeaturedCard({
  item,
  qty,
  onAddToCart,
  onRemoveFromCart,
}: FeaturedCardProps) {
  return (
    <div className="bg-white  dark:bg-neutral-900 rounded-3xl p-3 border border-red-500 dark:border-neutral-800 flex gap-4 h-[145px] w-full items-center relative">
      
      {/* Image Container */}
      <div className="relative w-[115px] h-[115px] flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-2xl"
        />

        {/* Popular Tag - Positioned neatly over the image corner */}
        {item.isFeatured && (
          <span className="absolute top-1.5 left-1.5 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm uppercase tracking-wider">
            <Star className="w-2.5 h-2.5 fill-current" />
            Popular
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full justify-between py-1">
        
        {/* Top Section: Title & Meta Info */}
        <div>
          <h3 className="text-sm md:text-base font-bold text-neutral-800 dark:text-white uppercase tracking-wide line-clamp-1">
            {item.name}
          </h3>
          
          {/* Rating & Prep Time Row */}
          <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-0.5 text-yellow-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{item.rating}</span>
            </div>
            <div className="w-[1px] h-3 bg-neutral-200 dark:bg-neutral-700" />
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>{item.prepTime}</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Price and Actions */}
        <div className="flex items-center justify-between mt-auto">
          
          {/* Price */}
          <span className="text-xl md:text-2xl font-black text-red-600 flex items-center">
            ₦{item.price.toLocaleString()}
          </span>

          {/* Quantity Controls / Add to Cart */}
          {qty > 0 ? (
            <div className="flex items-center gap-3 border-2 border-red-600 rounded-full px-3 py-1.5 text-red-600">
              <button 
                onClick={() => onRemoveFromCart(item)}
                className="hover:scale-110 transition-transform"
              >
                <Minus className="w-4 h-4 stroke-[3]" />
              </button>

              <span className="font-bold text-sm min-w-[16px] text-center text-neutral-800 dark:text-white">
                {qty}
              </span>

              <button 
                onClick={() => onAddToCart(item)}
                className="hover:scale-110 transition-transform"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onAddToCart(item);
                toast.success((t) => (
                  <div className="bg-white rounded-xl shadow-2xl border p-4 flex items-center gap-4 max-w-sm">
                    <div className="flex-1">
                      <h4 className="font-bold text-green-600">✅ Added to Cart</h4>
                      <p className="text-sm text-gray-600">{item.name} has been added.</p>
                    </div>
                    <button onClick={() => toast.dismiss(t.id)} className="text-red-500 font-bold">
                      ✕
                    </button>
                  </div>
                ));
              }}
              className="border-2 border-red-600 hover:bg-yellow-400 dark:hover:bg-neutral-800 transition-colors rounded-full px-5 py-1.5 font-bold text-sm text-red-600 whitespace-nowrap"
            >
              Add to cart
            </button>
          )}

        </div>
      </div>
    </div>
  );
}