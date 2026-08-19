import React from 'react';
import { ShoppingBag, Menu, X, Sun, Moon, Sparkles, Truck } from 'lucide-react';
import { CartItem } from '../types';
import Logo from './Logo';

interface NavbarProps {
  activeTab: 'home' | 'menu' | 'about' | 'contact' | 'track';
  setActiveTab: (tab: 'home' | 'menu' | 'about' | 'contact' | 'track') => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  activeOrder: boolean;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cart,
  setIsCartOpen,
  darkMode,
  setDarkMode,
  activeOrder
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false); 
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Home link removed, first tab is now "Menu" pointing to 'home' tab content
  const navItems = [
    { id: 'home', label: 'Menu' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ] as const;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-stone-200/60 dark:border-neutral-800 shadow-md'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20" id="navbar-container">
          
          {/* Logo Brand */}
          <div 
            onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo"
          >
            <Logo className="w-13 h-13" animateBounce={true} />
            <div>
              <div className="flex items-center font-extrabold text-2xl tracking-tight">
                <span className="text-yellow-500 dark:text-yellow-400">Yelo</span>
                <span className="text-red-600 dark:text-red-500">Bistro</span>
                <span className={`transition-colors duration-300 ${isScrolled ? 'text-stone-900 dark:text-white' : 'text-white'}`}>.</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" id="desktop-nav-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative py-2 font-medium text-base transition-all duration-200 outline-none cursor-pointer ${
                  activeTab === item.id 
                    ? 'text-red-500 dark:text-yellow-400 font-bold' 
                    : isScrolled
                      ? 'text-stone-600 hover:text-stone-900 dark:text-neutral-300 dark:hover:text-white'
                      : 'text-white/90 hover:text-white drop-shadow-sm'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 dark:bg-yellow-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Buttons: Dark Mode + Cart + Mobile menu toggle */}
          <div className="flex items-center gap-3" id="navbar-actions">
            
            {/* Theme Toggle */}
            <button
              id="theme-toggler"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isScrolled 
                  ? 'border-stone-200/60 dark:border-neutral-800 text-stone-600 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-900 hover:text-stone-900 dark:hover:text-white' 
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="open-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-stone-800 dark:hover:bg-amber-100 transition-all font-semibold flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-950 animate-bounce">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 rounded-xl border md:hidden transition-all cursor-pointer ${
                isScrolled 
                  ? 'border-stone-200/60 dark:border-neutral-800 text-stone-600 dark:text-neutral-300 hover:bg-stone-50' 
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 px-4 py-4 space-y-2 animate-fadeIn" id="mobile-menu-drawer">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mob-nav-${item.id}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-yellow-50 text-red-600 dark:bg-yellow-950/20 dark:text-yellow-400'
                  : 'text-stone-700 hover:bg-stone-50 dark:text-neutral-300 dark:hover:bg-neutral-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          {activeOrder && (
             <button
              id="mob-nav-track"
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
            >
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
            </button> 
          )}
        </div>
      )}
    </header>
  );
}