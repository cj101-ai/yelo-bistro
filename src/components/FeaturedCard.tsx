import { Plus, Minus } from "lucide-react";
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
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-2.5 border border-yellow-400 dark:border-neutral-800 flex gap-3 h-[120px] w-full items-center relative shadow-sm">
      {/* Image Container */}
      <div className="relative w-[100px] h-[100px] flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full justify-between py-1 min-w-0 pr-1">
        {/* Title */}
        <div>
          <h3 className="text-sm font-bold text-neutral-800 dark:text-white uppercase tracking-wide truncate">
            {item.name}
          </h3>
        </div>

        {/* Bottom Row: Price and Actions */}
        <div className="flex items-center justify-between gap-1 mt-auto">
          {/* Price */}
          <span className="text-base sm:text-lg font-black text-yellow-400 flex items-center">
            ₦{item.price.toLocaleString()}
          </span>

          {/* Quantity Controls / Add to Cart */}
          {qty > 0 ? (
            <div className="flex items-center gap-2 border-2 border-red-600 rounded-full px-2 py-1 text-red-600">
              <button 
                onClick={() => onRemoveFromCart(item)}
                className="hover:scale-110 transition-transform"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <span className="font-bold text-xs min-w-[14px] text-center text-neutral-800 dark:text-white">
                {qty}
              </span>

              <button 
                onClick={() => onAddToCart(item)}
                className="hover:scale-110 transition-transform"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
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
              className="border border-yellow-500 hover:bg-yellow-300 hover:text-black transition-colors rounded-full px-3.5 py-1 font-bold text-base text-yellow-500 whitespace-nowrap"
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}