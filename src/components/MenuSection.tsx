import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import toast from "react-hot-toast";
import { Search, Star, Clock, SlidersHorizontal, Plus, Minus, SearchX, Check } from 'lucide-react';
import { FoodItem, CartItem } from '../types';
import { FOOD_ITEMS } from '../data';

interface MenuSectionProps {
  onAddToCart: (item: FoodItem) => void;
  onRemoveFromCart: (item: FoodItem) => void;
  cart: CartItem[];
  compact?: boolean; // Useful to show only 4 items in a "Featured Featured Section" on Home!
}

type CategoryType = 'All' | 'Noodles' | 'Burgers' | 'Shawarma' | 'Rice Meals' | 'Pasta' | 'Wings'| 'Cocktail Wings' |'Combo Deals' |'Proteins' |'Specials' |'BreakFast'|'Juice & Drinks' ;
type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating';

export default function MenuSection({
  onAddToCart,
  onRemoveFromCart,
  cart,
  compact = false
}: MenuSectionProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryType>('All');
  React.useEffect(() => {
  const savedCategory = localStorage.getItem("selectedCategory");

  if (savedCategory) {
    setSelectedCategory(savedCategory as CategoryType);

    localStorage.removeItem("selectedCategory");
  }
}, []);
  const [currentSort, setCurrentSort] = React.useState<SortOption>('relevance');

  const categories: CategoryType[] = ['All', 'Noodles', 'Burgers', 'Shawarma', 'Rice Meals', 'Wings','Cocktail Wings', 'Pasta', 'Combo Deals', 'Proteins', 'Specials','BreakFast', 'Juice & Drinks'];

  // Filter & Sort Logic
  const filteredAndSortedItems = React.useMemo(() => {
    let items = [...FOOD_ITEMS];

    // Category filter
    if (compact) {
      // For compact, show featured items
      items = items.filter(item => item.isFeatured);
    } else {
      if (selectedCategory !== 'All') {
        items = items.filter(item => item.category === selectedCategory);
      }
    }

    // Search query filter
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    // Sort options
    if (currentSort === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    }

    return items;
  }, [selectedCategory, searchTerm, currentSort, compact]);

  // Helper to retrieve accurate quantity of a foodItem currently in checkout cart
  const getItemQuantity = (itemId: string) => {
    const found = cart.find(c => c.item.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <section className="py-16 bg-white dark:bg-neutral-950 transition-colors duration-300" id="bistro-menu-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Content Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <p className="text-red-500 font-extrabold text-sm uppercase tracking-widest font-mono">
            {compact ? "" : "Explore Culinary Creations"}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-pink-900 dark:text-white tracking-tight">
            {compact ? "Our Featured Delicacies" : "The Yelo Menu"}
          </h2>
          <p className="text-stone-500 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
            Freshly prepared, carefully cooked, and temperature-sealed. Simply choose, order, and track!
          </p>
        </div>

        {/* Dynamic Filters Form - Omitted if compact */}
        {!compact && (
          <div className="space-y-6 mb-10" id="filter-sorting-panel">
            
            {/* Search Input and Sort Select */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="burgers, spicy chicken, shawarma, rice, extra..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-50 dark:bg-neutral-900 border border-stone-200/60 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 placeholder-stone-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-medium"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-red-500 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Sort By
                </span>
                <select
                  value={currentSort}
                  onChange={(e) => setCurrentSort(e.target.value as SortOption)}
                  className="px-4 py-3 rounded-2xl bg-stone-50 dark:bg-neutral-900 border border-stone-200/60 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
                >
                  <option value="relevance">Default Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating: Highest First</option>
                </select>
              </div>

            </div>

            {/* Category selection pills scroll containers */}
            <div className="overflow-x-auto no-scrollbar py-2 -mx-4 px-4 flex items-center gap-2.5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-300 transform hover:scale-102 cursor-pointer ${
                      isActive
                        ? 'bg-neutral-900 dark:bg-yellow-400 text-white dark:text-neutral-900 shadow-md'
                        : 'bg-stone-50 dark:bg-neutral-900 text-stone-600 dark:text-neutral-300 border border-stone-200/60 dark:border-neutral-800 hover:bg-stone-100/80 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

          </div>
        )}

        {/* Menu Cards Grid */}
        {filteredAndSortedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="food-menu-grid">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedItems.map((item, idx) => {
                const qty = getItemQuantity(item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                    className="group bg-stone-50 dark:bg-neutral-900/60 rounded-3xl border border-stone-200/50 dark:border-neutral-800 p-4 flex flex-col justify-between hover:shadow-xl hover:border-amber-300/40 dark:hover:border-yellow-400/20 transition-all duration-300 h-full relative"
                  >
                    {item.isFeatured && (
                      <span className="absolute top-6 left-6 z-10 bg-red-500 text-white text-[9px] font-bold py-1 px-3 rounded-full uppercase tracking-widest shadow-sm">
                        Popular
                      </span>
                    )}

                    {/* Food Photo Container */}
                    <div className="space-y-4">
                      <div className="aspect-[4/3] rounded-2.5xl overflow-hidden relative bg-stone-200 shadow-inner">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Preparation Time & Calories */}
                        <div className="absolute bottom-3 right-3 flex gap-1.5">
                          <span className="bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm text-stone-800 dark:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono shadow-sm flex items-center gap-1">
                            <Clock className="w-3 h-3 text-red-500" />
                            {item.prepTime}
                          </span>
                        </div>
                      </div>

                      {/* Header Info */}
                      <div className="space-y-1.5 px-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-red-500 dark:text-yellow-400 font-bold uppercase tracking-widest font-mono">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-0.5 font-mono text-xs text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{item.rating}</span>
                          </div>
                        </div>

                        <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-white leading-snug tracking-tight group-hover:text-red-500 transition-colors">
                          {item.name}
                        </h3>

                        <p className="text-stone-500 dark:text-neutral-400 text-xs line-clamp-4 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Primary actions & price tag line */}
                    <div className="pt-4 mt-4 border-t border-stone-200/50 dark:border-neutral-800 flex items-center justify-between px-1.5">
                      <div>
                        <span className="text-[10px] text-stone-400 dark:text-neutral-500 uppercase tracking-widest font-semibold block">Price</span>
                        <span className="text-xl font-mono font-black text-stone-900 dark:text-white">
                          ₦{item.price.toFixed(2)}
                        </span>
                      </div>

                      {qty > 0 ? (
                        /* Smart animated quantity slider if item is in the cart */
                        <div className="flex items-center gap-2.5 bg-yellow-400 dark:bg-yellow-500 text-neutral-950 px-2 py-1.5 rounded-2xl shadow-sm border border-yellow-500/15">
                          <button
                            id={`card-dec-${item.id}`}
                            onClick={() => onRemoveFromCart(item)}
                            className="p-1 hover:bg-yellow-300 rounded-lg transition-colors cursor-pointer"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-xs font-mono min-w-[12px] text-center">{qty}</span>
                          <button
                            id={`card-inc-${item.id}`}
                            onClick={() => onAddToCart(item)}
                            className="p-1 hover:bg-yellow-300 rounded-lg transition-colors cursor-pointer"
                            title="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        /* Standard Add to Cart button */
                        <button
                          id={`add-to-cart-btn-${item.id}`}
                          onClick={() => {
  onAddToCart(item);

  toast.success((t) => (
    <div className="bg-white rounded-xl shadow-2xl border p-4 flex items-center gap-4 max-w-sm">
      <div className="flex-1">
        <h4 className="font-bold text-green-600">
          ✅ Added to Cart
        </h4>

        <p className="text-sm text-gray-600">
          {item.name} has been added to your cart.
        </p>
      </div>

      <button
        onClick={() => toast.dismiss(t.id)}
        className="text-red-500 font-bold hover:text-red-700"
      >
        ✕
      </button>
    </div>
  ));
}}
                          
                          className="px-4 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-amber-100 text-white font-extrabold text-xs tracking-tight transition-all shadow-sm hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-yellow-400 dark:text-red-600" />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty / No Items Found Phase */
          <div className="text-center py-16 bg-stone-50 dark:bg-neutral-900/40 rounded-3xl border border-dashed border-stone-200 dark:border-neutral-800 max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center text-red-500 mx-auto">
              <SearchX className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-lg text-neutral-800 dark:text-white">No food matches found</h4>
              <p className="text-stone-500 dark:text-neutral-400 text-xs sm:text-sm px-6">
                We couldn't locate any dishes with "{searchTerm}". Try refining spelling or exploring alternative categories.
              </p>
            </div>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="px-4 py-2 rounded-xl bg-yellow-400 dark:bg-yellow-500 text-neutral-900 font-bold text-xs hover:bg-yellow-500"
            >
              Reset Search Filter
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
