import React from 'react';
import { FaWhatsapp } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Minus, Flame, Fuel, MapPin, Phone, Mail, Award, Truck, ShieldCheck, Star, 
  MessageSquare, Heart, Clock, Sparkles, ChevronRight, Command, MessageCircle, Coffee, 
  User, CheckCircle2, Bell, Check,
  Utensils,
  Cake
} from 'lucide-react';

import { FOOD_ITEMS, REVIEWS, CHOOSE_US_ITEMS } from './data';
import {
  FoodItem,
  CartItem,
  OrderDetails,
  SelectedFoodOption
} from './types';

// Page Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import ProductOptionsModal from './components/ProductOptionsModal';
import FeaturedCarousel from "./components/FeaturedCarousel";
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import CartSidebar from './components/CartSidebar';
import TrackingSection from './components/TrackingSection';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'home' | 'menu' | 'about' | 'contact' | 'track'>('home');
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [activeOrder, setActiveOrder] = React.useState<OrderDetails | null>(null);

  
  // WhatsApp bubble open/close
  const [isWaOpen, setIsWaOpen] = React.useState(false);

  // Sync Dark Mode state changes with DOM classes
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  
  }, [darkMode]);

  // Loading cart from localStorage on init
  React.useEffect(() => {
    try {
      const savedCart = localStorage.getItem('yelo_bistro_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      
      const savedOrder = localStorage.getItem('yelo_bistro_order');
      if (savedOrder) setActiveOrder(JSON.parse(savedOrder));
    } catch (e) {
      console.warn("Storage syncing failed", e);
    }
  }, []);

  // Sync cart shifts
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    try {
      localStorage.setItem('yelo_bistro_cart', JSON.stringify(updatedCart));
    } catch (e) {
      console.warn(e);
    }
  };

  const [customizingItem, setCustomizingItem] =
  React.useState<FoodItem | null>(null);

//
const handleAddToCart = (item: FoodItem) => {
  setCustomizingItem(item);
};

const addItemToCart = (
  item: FoodItem,
  selectedOptions: SelectedFoodOption[],
  unitPrice: number,
  quantity: number
) => {
  const optionsKey = selectedOptions
    .map(
      (option) =>
        `${option.groupId}:${option.choiceId}`
    )
    .sort()
    .join('|');

  const cartItemId = optionsKey
    ? `${item.id}__${optionsKey}`
    : item.id;

  const existing = cart.find(
    (cartItem) => cartItem.cartItemId === cartItemId
  );

  let updated: CartItem[];

  if (existing) {
    updated = cart.map((cartItem) =>
      cartItem.cartItemId === cartItemId
        ? {
            ...cartItem,
            quantity: cartItem.quantity + quantity
          }
        : cartItem
    );
  } else {
    updated = [
      ...cart,
      {
        item,
        quantity,
        selectedOptions,
        unitPrice,
        cartItemId
      }
    ];
  }

  saveCartToStorage(updated);
};


  const handleRemoveFromCart = (item: FoodItem) => {
  const matchingItems = cart.filter(
    (cartItem) => cartItem.item.id === item.id
  );

  if (matchingItems.length === 0) return;

  // Remove one from the most recently added matching configuration.
  const existing = matchingItems[matchingItems.length - 1];

  let updated: CartItem[];

  if (existing.quantity === 1) {
    updated = cart.filter(
      (cartItem) =>
        cartItem.cartItemId !== existing.cartItemId
    );
  } else {
    updated = cart.map((cartItem) =>
      cartItem.cartItemId === existing.cartItemId
        ? {
            ...cartItem,
            quantity: cartItem.quantity - 1
          }
        : cartItem
    );
  }

  saveCartToStorage(updated);
};

  const handleUpdateQuantity = (
  cartItemId: string,
  qty: number
) => {
  let updated: CartItem[];

  if (qty <= 0) {
    updated = cart.filter(
      (item) => item.cartItemId !== cartItemId
    );
  } else {
    updated = cart.map((item) =>
      item.cartItemId === cartItemId
        ? {
            ...item,
            quantity: qty
          }
        : item
    );
  }

  saveCartToStorage(updated);
};

  const handleRemoveItem = (cartItemId: string) => {
  const updated = cart.filter(
    (cartItem) => cartItem.cartItemId !== cartItemId
  );

  saveCartToStorage(updated);
};

  const handlePlaceOrder = (order: OrderDetails) => {

  // Save the order so the tracking page still works
  setActiveOrder(order);

  localStorage.setItem(
    "yelo_bistro_order",
    JSON.stringify(order)
  );

  // Build the WhatsApp message
  let message = `🍽️ *NEW YELO BISTRO ORDER*\n\n`;

  message += `🆔 Order ID: ${order.id}\n\n`;

  message += `👤 Name: ${order.customerName}\n`;
  message += `📞 Phone: ${order.phone}\n`;
  message += `📍 Address: ${order.address}\n\n`;

  message += `🛒 *Items Ordered*\n`;

  order.items.forEach(
  ({ item, quantity, selectedOptions, unitPrice }) => {
    message += `• ${item.name} x${quantity} - ₦${(
      unitPrice * quantity
    ).toLocaleString()}\n`;

    if (
      selectedOptions &&
      selectedOptions.length > 0
    ) {
      selectedOptions.forEach((option) => {
        message += `   - ${option.groupName}: ${option.choiceName}\n`;
      });
    }
  }
);

  message += `\n💰 Total: ₦${order.total.toFixed(2)}\n`;
  message += ` Mode of Recieval: ${order. paymentMethod}\n`;

  if (order.notes) {
    message += `📝 Notes: ${order.notes}\n`;
  }

  const whatsappNumber = "2349069125598";

  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  // Empty the cart
  saveCartToStorage([]);

  // Keep your tracking page working
  setActiveTab("home");
};

  const handleResetOrder = () => {
    setActiveOrder(null);
    try {
      localStorage.removeItem('yelo_bistro_order');
    } catch (e) {
      console.warn(e);
    }
    // Redirect to main menu to start fresh
    setActiveTab('home');
  };

  // Quick helper to map icon name string to Lucide component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Utensils': return <Utensils className="w-6 h-6 text-red-500" />;
      case 'Clock': return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'Cake': return < Cake className="w-6 h-6 text-emerald-500" />;
      case 'MessageSquare': return <MessageSquare className="w-6 h-6 text-amber-500" />;
      default: return <Coffee className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 text-stone-800 dark:text-neutral-100 font-sans transition-colors duration-300 flex flex-col">
      
      {/* Top sticky responsive Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeOrder={!!activeOrder}
      />
      <ProductOptionsModal
  isOpen={!!customizingItem}
  item={customizingItem}
  onClose={() => setCustomizingItem(null)}
  onAddToCart={(item, selectedOptions, unitPrice, quantity) => {
    addItemToCart(
      item,
      selectedOptions,
      unitPrice,
      quantity
    );
  }}
/>

      {/* Slide-out Cart Drawer Panel */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Main Content Render */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* Main Menu Tab View (Contains all Hero, Featured, and Full Menu content) */}
          {activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              id="home-tab-wrapper"
            >
              {/* Hero Banner */}
              <Hero 
                onOrderNow={() => setActiveTab('home')} 
                onViewMenu={() => setActiveTab('home')} 
              />
              
              {/* Featured Carousel */}
              <FeaturedCarousel
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
              />
              
              {/* Full Food Menu Showcase */}
              <MenuSection 
                onAddToCart={handleAddToCart} 
                onRemoveFromCart={handleRemoveFromCart} 
                cart={cart}
                compact={false}
              />
            </motion.div>
          )}

          {/* About Us Tab View */}
          {activeTab === 'about' && (
            <motion.div
              key="tab-about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <AboutSection />
            </motion.div>
          )}

          {/* Contact Tab View */}
          {activeTab === 'contact' && (
            <motion.div
              key="tab-contact"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ContactSection />
            </motion.div>
          )}

          {/* Active Live order tracking Tab View */}
          {activeTab === 'track' && (
            <motion.div
              key="tab-track"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TrackingSection 
                order={activeOrder} 
                onResetOrder={handleResetOrder} 
              />
            </motion.div>
          ) }
        
        </AnimatePresence>
      </main>

      {/* Persistent floating chat WhatsApp on bottom right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none" id="floating-widgets">
        
        {/* WhatsApp chat popup */}
        <div className="relative pointer-events-auto">
          <AnimatePresence>
            {isWaOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-16 right-0 w-72 bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-2xl border border-stone-200/60 dark:border-neutral-800 space-y-4 mb-2 text-neutral-800 dark:text-stone-100 z-50 text-xs text-left"
              >
                <div className="flex items-center gap-2 pb-2.5 border-b border-stone-100 dark:border-neutral-800">
                  <div className="relative">
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full"></span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-905 flex items-center justify-center font-bold text-emerald-600">
                      YB
                    </div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900 dark:text-white"></h4>
                    <p className="text-[10px] text-stone-400 font-semibold uppercase">Yelo Bistro Kitchen</p>
                  </div>
                </div>

                <p className="text-stone-600 dark:text-neutral-300 leading-relaxed font-sans">
                  "Hey there welcome to yelobistro live chat proceed to place your order or make enquires"
                </p>

                <button
                  onClick={() => {
                    const text = "Hi Yelo Bistro! i would like to place an order";
                    window.open(`https://wa.me/2349069125598?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-center flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Connect WhatsApp
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            id="floating-whatsapp-widget"
            onClick={() => setIsWaOpen(!isWaOpen)}
            className="p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center pointer-events-auto cursor-pointer"
            title="Open Kitchen Live Chat"
          >
            <FaWhatsapp size={28} color="white" className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* Global persistent Footer Component */}
      <Footer setActiveTab={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

    </div>
  );
  
}