
import React from 'react';
import { AnimatePresence } from 'motion/react';
import { SearchX } from 'lucide-react';
import { FoodItem, CartItem } from '../types';
import { supabase } from '../lib/supabase';
import MenuCard from './MenuCard';

interface MenuSectionProps {
  onAddToCart: (item: FoodItem) => void;
  onRemoveFromCart: (item: FoodItem) => void;
  cart: CartItem[];
  compact?: boolean;
}

type CategoryType =
  | 'All'
  | 'Shawarma'
  | 'Rice Meals'
  | 'Wings'
  | 'Cocktail Wings'
  | 'Pasta'
  | 'Combo Deals'
  | 'Specials';

type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating';

export default function MenuSection({
  onAddToCart,
  onRemoveFromCart,
  cart,
  compact = false
}: MenuSectionProps) {
  const [menuItems, setMenuItems] = React.useState<FoodItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] =
    React.useState<CategoryType>('All');

  const [currentSort, setCurrentSort] =
    React.useState<SortOption>('relevance');

  /*
   * Convert Supabase product into FoodItem
   */
  const formatProduct = React.useCallback(
    (product: any): FoodItem => ({
      id: String(product.id),
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      image: product.image_url || '',
      category: product.category as FoodItem['category'],

      // IMPORTANT:
      // false remains false.
      // Only null/undefined becomes true.
      available:
        product.available === false
          ? false
          : true,

      rating: Number(product.rating ?? 0),
      prepTime: product.prep_time || '20 min',
      isFeatured: product.is_featured ?? false,

      options: Array.isArray(product.options)
        ? product.options
        : []
    }),
    []
  );

  /*
   * Get previously selected category
   */
  React.useEffect(() => {
    const savedCategory =
      localStorage.getItem('selectedCategory');

    if (savedCategory) {
      setSelectedCategory(
        savedCategory as CategoryType
      );

      localStorage.removeItem('selectedCategory');
    }
  }, []);

  /*
   * Fetch ALL products from Supabase.
   *
   * IMPORTANT:
   * We DO NOT filter by available.
   *
   * Unavailable products must remain visible so
   * MenuCard can display:
   *
   * TEMPORARILY
   * SOLD OUT
   */
  const fetchMenuItems = React.useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setLoading(true);
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', {
          ascending: true
        });

      if (error) {
        console.error(
          'Error fetching menu items:',
          error
        );

        setError(
          'Unable to load the menu right now.'
        );

        if (showLoading) {
          setLoading(false);
        }

        return;
      }

      const formattedItems: FoodItem[] =
        (data || []).map(formatProduct);

      setMenuItems(formattedItems);
      setError(null);

      if (showLoading) {
        setLoading(false);
      }
    },
    [formatProduct]
  );

  /*
   * Initial menu fetch
   */
  React.useEffect(() => {
    fetchMenuItems(true);
  }, [fetchMenuItems]);

  /*
   * REALTIME PRODUCT UPDATES
   *
   * When the admin changes:
   *
   * - Available
   * - Name
   * - Price
   * - Description
   * - Image
   * - Rating
   * - Prep time
   * - Featured
   * - Options
   *
   * we re-fetch the complete products table.
   *
   * This is more reliable than depending only on
   * payload.new because we always get the complete
   * current row from Supabase.
   */
  React.useEffect(() => {
    let refreshTimer: ReturnType<
      typeof setTimeout
    > | null = null;

    const refreshMenu = () => {
      /*
       * Small delay prevents multiple rapid Supabase
       * events from causing unnecessary requests.
       */
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      refreshTimer = setTimeout(() => {
        fetchMenuItems(false);
      }, 100);
    };

    const channel = supabase
      .channel(
        `menu-products-realtime-${Math.random()
          .toString(36)
          .substring(2)}`
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products'
        },
        payload => {
          console.log(
            'YELO REALTIME INSERT:',
            payload.new
          );

          refreshMenu();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products'
        },
        payload => {
          console.log(
            'YELO REALTIME UPDATE:',
            payload.new
          );

          /*
           * This is especially important for
           * available/unavailable changes.
           */
          refreshMenu();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'products'
        },
        payload => {
          console.log(
            'YELO REALTIME DELETE:',
            payload.old
          );

          refreshMenu();
        }
      )
      .subscribe(status => {
        console.log(
          'YELO MENU REALTIME STATUS:',
          status
        );
      });

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      supabase.removeChannel(channel);
    };
  }, [fetchMenuItems]);

  /*
   * Categories shown in filter
   */
  const categories: CategoryType[] = [
    'All',
    'Wings',
    'Cocktail Wings',
    'Pasta',
    'Combo Deals'
  ];

  /*
   * Filter & Sort
   */
  const filteredAndSortedItems =
    React.useMemo(() => {
      let items = [...menuItems];

      /*
       * COMPACT MODE
       *
       * Only featured products are filtered here.
       *
       * We intentionally DO NOT check available.
       *
       * Therefore:
       *
       * Featured + Available
       * = normal card
       *
       * Featured + Unavailable
       * = Sold Out card
       */
      if (compact) {
        items = items.filter(
          item => item.isFeatured === true
        );
      } else {
        /*
         * Normal category filtering
         */
        if (selectedCategory !== 'All') {
          items = items.filter(
            item =>
              item.category === selectedCategory
          );
        }
      }

      /*
       * Search
       */
      if (searchTerm.trim() !== '') {
        const query =
          searchTerm.toLowerCase();

        items = items.filter(
          item =>
            item.name
              .toLowerCase()
              .includes(query) ||
            item.description
              .toLowerCase()
              .includes(query) ||
            item.category
              .toLowerCase()
              .includes(query)
        );
      }

      /*
       * Sort
       */
      if (currentSort === 'price-asc') {
        items.sort(
          (a, b) => a.price - b.price
        );
      } else if (
        currentSort === 'price-desc'
      ) {
        items.sort(
          (a, b) => b.price - a.price
        );
      } else if (
        currentSort === 'rating'
      ) {
        items.sort(
          (a, b) => b.rating - a.rating
        );
      }

      return items;
    }, [
      menuItems,
      selectedCategory,
      searchTerm,
      currentSort,
      compact
    ]);

  /*
   * Group products by category
   */
  const groupedItems = React.useMemo(() => {
    const groups: Record<
      string,
      typeof filteredAndSortedItems
    > = {};

    filteredAndSortedItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }

      groups[item.category].push(item);
    });

    const sortedGroups: Record<
      string,
      typeof filteredAndSortedItems
    > = {};

    /*
     * Force Wings to appear first
     */
    if (groups['Wings']) {
      sortedGroups['Wings'] =
        groups['Wings'];
    }

    Object.keys(groups).forEach(
      category => {
        if (category !== 'Wings') {
          sortedGroups[category] =
            groups[category];
        }
      }
    );

    return sortedGroups;
  }, [filteredAndSortedItems]);

  /*
   * Get quantity of an item already in cart
   */
  const getItemQuantity = (
    itemId: string
  ) => {
    return cart
      .filter(
        cartItem =>
          cartItem.item.id === itemId
      )
      .reduce(
        (total, cartItem) =>
          total + cartItem.quantity,
        0
      );
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <section
        className="py-16 bg-white dark:bg-neutral-950 transition-colors duration-300"
        id="bistro-menu-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

            <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">
              Loading our menu...
            </p>
          </div>
        </div>
      </section>
    );
  }

  /*
   * Error state
   */
  if (error) {
    return (
      <section
        className="py-16 bg-white dark:bg-neutral-950 transition-colors duration-300"
        id="bistro-menu-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <SearchX className="w-10 h-10 text-red-500 mx-auto mb-4" />

            <h3 className="font-black text-xl text-neutral-800 dark:text-white mb-2">
              Menu unavailable
            </h3>

            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 bg-white dark:bg-neutral-950 transition-colors duration-300"
      id="bistro-menu-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Content Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <p className="text-red-500 font-extrabold text-sm uppercase tracking-widest font-mono">
            {compact
              ? ''
              : 'Explore Culinary Creations'}
          </p>

          <h2 className="text-6xl sm:text-8xl font-black text-yellow-400 dark:text-white tracking-tight">
            MAIN MENU
          </h2>
        </div>

        {/* Dynamic Filters */}
        {!compact && (
          <div
            className="space-y-6 mb-10"
            id="filter-sorting-panel"
          >
            <div className="w-full bg-yellow-400 dark:bg-red-700 rounded-xl sm:rounded-2xl p-1 shadow-md mx-auto">
              <div className="flex items-center justify-start sm:justify-center gap-8 sm:gap-9 overflow-x-auto no-scrollbar scroll-smooth px-1">

                {categories.map(cat => {
                  const isActive =
                    selectedCategory === cat;

                  return (
                    <button
                      key={cat}
                      onClick={() =>
                        setSelectedCategory(
                          cat
                        )
                      }
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

        {/* Menu */}
        {Object.keys(groupedItems)
          .length > 0 ? (
          Object.entries(
            groupedItems
          ).map(([category, items]) => (
            <div
              key={category}
              className="mb-20"
            >

              {/* Category Header */}
              <div className="flex items-center w-full my-16">
                <div className="flex-1 h-[4px] bg-yellow-400" />

                <h2 className="mx-8 text-3xl md:text-4xl font-black uppercase tracking-[0.08em] text-yellow-400 whitespace-nowrap flex items-center gap-2">
                  {category}
                </h2>

                <div className="flex-1 h-[4px] bg-yellow-400" />
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                <AnimatePresence mode="popLayout">

                  {items.map(item => {
                    const qty =
                      getItemQuantity(
                        item.id
                      );

                    return (
                      <MenuCard
                        key={item.id}
                        item={item}
                        qty={qty}
                        onAddToCart={
                          onAddToCart
                        }
                        onRemoveFromCart={
                          onRemoveFromCart
                        }
                      />
                    );
                  })}

                </AnimatePresence>

              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-stone-50 dark:bg-neutral-900/40 rounded-3xl border border-dashed border-stone-200 dark:border-neutral-800 max-w-lg mx-auto space-y-4">

            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center text-red-500 mx-auto">
              <SearchX className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-lg text-neutral-800 dark:text-white">
                No food matches found
              </h4>

              <p className="text-stone-500 dark:text-neutral-400 text-xs sm:text-sm px-6">
                We couldn't locate any dishes. Try selecting another category.
              </p>
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(
                  'All'
                );
              }}
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

