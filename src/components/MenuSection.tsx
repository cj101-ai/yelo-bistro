import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import toast from "react-hot-toast";
import { Search, Star, Clock, SlidersHorizontal, Plus, Minus, SearchX, Check } from 'lucide-react';
import { FoodItem, CartItem } from '../types';
import { FOOD_ITEMS } from '../data';
import MenuCard from "./MenuCard";

interface MenuSectionProps {
  onAddToCart: (item: FoodItem) => void;
  onRemoveFromCart: (item: FoodItem) => void;
  cart: CartItem[];
  compact?: boolean; // Useful to show only 4 items in a "Featured Featured Section" on Home!
}

type CategoryType = 'All' | 'Shawarma' | 'Rice Meals' | 'Wings' | 'Cocktail Wings' | 'Pasta' | 'Combo Deals' | 'Specials';
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

  // Streamlined category array with Burgers removed
  const categories: CategoryType[] = [ 'All', 'Wings', 'Cocktail Wings', 'Pasta', 'Combo Deals', ];

  // Filter & Sort Logic
  const filteredAndSortedItems = React.useMemo(() => {
    let items = [...FOOD_ITEMS];

    // Category filter
    if (compact) {
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

  // Group items by category for permanent header rendering
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, typeof filteredAndSortedItems> = {};
    filteredAndSortedItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredAndSortedItems]);

  const getItemQuantity = (itemId: string) => {
  return cart
    .filter((cartItem) => cartItem.item.id === itemId)
    .reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );
    
  };

  return (
    <section className="py-16 bg-white dark:bg-neutral-950 transition-colors duration-300" id="bistro-menu-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Content Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <p className="text-red-500 font-extrabold text-sm uppercase tracking-widest font-mono">
            {compact ? "" : "Explore Culinary Creations"}
          </p>
          <h2 className="text-6xl sm:text-8xl font-black text-yellow-300 dark:text-white tracking-tight">
            {compact ? "MAIN MENU" : "MAIN MENU"}
          </h2>
        </div>

        {/* Dynamic Filters Form - Omitted if compact */}
        {!compact && (
          <div className="space-y-6 mb-10" id="filter-sorting-panel">
            
            {/* Search Input and Sort Select */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search Bar 
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
              </div> */}

              {/* Sort selector 
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
              </div>*/}

            </div>
            {/* Static Container with Compact Height & Horizontal Scroll */}
<div className="w-full bg-yellow-300 dark:bg-red-700 rounded-xl sm:rounded-2xl p-1 shadow-md mx-auto">
  <div className="flex items-center justify-start sm:justify-center gap-8 sm:gap-9 overflow-x-auto no-scrollbar scroll-smooth px-1">
    {categories.map((cat) => {
      const isActive = selectedCategory === cat;
      return (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`shrink-0 whitespace-nowrap px-3 py-1 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase tracking-wider transition-all duration-300 transform active:scale-95 cursor-pointer ${
            isActive
              ? 'bg-white text-red-600 shadow-sm'
              : 'bg-transparent text-white hover:bg-white/10'
          }`}
        >
          {cat}
        </button>
      );
    })}
  </div>
</div>


          </div>
        )}

        {/* Unified Cards Grid Container */}
        {filteredAndSortedItems.length > 0 ? (
          Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-20">
              
              {/* Category Header */}
              <div className="flex items-center w-full my-16">
                <div className="flex-1 h-[4px] bg-yellow-500" />
                <h2 className="mx-8 text-3xl md:text-4xl font-black uppercase tracking-[0.08em] text-yellow-500 whitespace-nowrap flex items-center gap-2">
                  {category}
                </h2>
                <div className="flex-1 h-[4px] bg-yellow-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const qty = getItemQuantity(item.id);
                    return (
                      <MenuCard
                        key={item.id}
                        item={item}
                        qty={qty}
                        onAddToCart={onAddToCart}
                        onRemoveFromCart={onRemoveFromCart}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))
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