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
  compact?: boolean;
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

  // Streamlined category array with Wings positioned right after 'All'
  const categories: CategoryType[] = [ 'All', 'Wings', 'Cocktail Wings', 'Pasta', 'Combo Deals' ];

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

  // Group items by category and force 'Wings' to render first while preserving default data order for everything else
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, typeof filteredAndSortedItems> = {};
    
    // Group all items into their natural category buckets as found in FOOD_ITEMS
    filteredAndSortedItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });

    const sortedGroups: Record<string, typeof filteredAndSortedItems> = {};

    // 1. Force 'Wings' to be inserted first if present
    if (groups['Wings']) {
      sortedGroups['Wings'] = groups['Wings'];
    }

    // 2. Append all remaining categories in their exact natural sequence
    Object.keys(groups).forEach((cat) => {
      if (cat !== 'Wings') {
        sortedGroups[cat] = groups[cat];
      }
    });

    return sortedGroups;
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
          <h2 className="text-6xl sm:text-8xl font-black text-yellow-400 dark:text-white tracking-tight">
            {compact ? "MAIN MENU" : "MAIN MENU"}
          </h2>
        </div>

        {/* Dynamic Filters Form */}
        {!compact && (
          <div className="space-y-6 mb-10" id="filter-sorting-panel">
            <div className="w-full bg-yellow-400 dark:bg-red-700 rounded-xl sm:rounded-2xl p-1 shadow-md mx-auto">
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
        {Object.keys(groupedItems).length > 0 ? (
          Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-20">
              
              {/* Category Header */}
              <div className="flex items-center w-full my-16">
                <div className="flex-1 h-[4px] bg-yellow-400" />
                <h2 className="mx-8 text-3xl md:text-4xl font-black uppercase tracking-[0.08em] text-yellow-400 whitespace-nowrap flex items-center gap-2">
                  {category}
                </h2>
                <div className="flex-1 h-[4px] bg-yellow-400" />
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
                We couldn't locate any dishes. Try selecting another category.
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