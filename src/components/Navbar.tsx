
import React from 'react';
import {
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogIn
} from 'lucide-react';

import { CartItem } from '../types';
import Logo from './Logo';

type AppView =
  | 'home'
  | 'login'
  | 'signup'
  | 'profile'
  | 'my-orders'
  | 'customer-orders'
  | 'product-management'
  | 'track';

interface NavbarProps {
  activeTab: AppView;
  setActiveTab: (tab: AppView) => void;

  cart: CartItem[];

  setIsCartOpen: (open: boolean) => void;

  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;

  activeOrder: boolean;

  isLoggedIn: boolean;
  userFirstName: string;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cart,
  setIsCartOpen,
  darkMode,
  setDarkMode,
  activeOrder,
  isLoggedIn,
  userFirstName
}: NavbarProps) {

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    React.useState(false);

  const [isScrolled, setIsScrolled] =
    React.useState(false);

  const totalCartItems =
    cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

  /*
  |--------------------------------------------------------------------------
  | SCROLL DETECTION
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {

    const handleScroll = () => {

      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

    };

    window.addEventListener(
      'scroll',
      handleScroll
    );

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      );

  }, []);

  /*
  |--------------------------------------------------------------------------
  | GO TO HOME SECTION
  |--------------------------------------------------------------------------
  */

  const goToHomeSection = (
    section: 'home' | 'menu' | 'about' | 'contact'
  ) => {

    if (activeTab === 'home') {

      if (section === 'home') {

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

        return;

      }

      const element =
        document.getElementById(
          `home-${section}`
        );

      if (element) {

        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      }

      return;

    }

    setActiveTab('home');

    setTimeout(() => {

      if (section === 'home') {

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

        return;

      }

      const element =
        document.getElementById(
          `home-${section}`
        );

      if (element) {

        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      }

    }, 100);

  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE MOBILE MENU
  |--------------------------------------------------------------------------
  */

  const closeMobileMenu = () => {

    setIsMobileMenuOpen(false);

  };

  /*
  |--------------------------------------------------------------------------
  | HOME
  |--------------------------------------------------------------------------
  */

  const handleHome = () => {

    goToHomeSection('home');

    closeMobileMenu();

  };

  /*
  |--------------------------------------------------------------------------
  | MENU
  |--------------------------------------------------------------------------
  */

  const handleMenu = () => {

    goToHomeSection('menu');

    closeMobileMenu();

  };

  /*
  |--------------------------------------------------------------------------
  | ABOUT
  |--------------------------------------------------------------------------
  */

  const handleAbout = () => {

    goToHomeSection('about');

    closeMobileMenu();

  };

  /*
  |--------------------------------------------------------------------------
  | CONTACT
  |--------------------------------------------------------------------------
  */

  const handleContact = () => {

    goToHomeSection('contact');

    closeMobileMenu();

  };

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const handleLogin = () => {

    setActiveTab('login');

    closeMobileMenu();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  };

  /*
  |--------------------------------------------------------------------------
  | PROFILE
  |--------------------------------------------------------------------------
  */

  const handleProfile = () => {

    setActiveTab('profile');

    closeMobileMenu();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  };

  /*
  |--------------------------------------------------------------------------
  | NAVIGATION ITEMS
  |--------------------------------------------------------------------------
  */

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      action: handleHome
    },
    {
      id: 'menu',
      label: 'Menu',
      action: handleMenu
    },
    {
      id: 'about',
      label: 'About Us',
      action: handleAbout
    },
    {
      id: 'contact',
      label: 'Contact',
      action: handleContact
    }
  ];

  return (

    <header
      className={`
        fixed
        top-0
        left-0
        right-0
        z-50
        w-full
        transition-all
        duration-300
        ${
          isScrolled
            ? `
              bg-white/95
              dark:bg-neutral-950/95
              backdrop-blur-md
              border-b
              border-stone-200/60
              dark:border-neutral-800
              shadow-md
            `
            : `
              bg-transparent
              border-b
              border-transparent
            `
        }
      `}
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            h-20
          "
          id="navbar-container"
        >

          {/* ==========================================================
              LOGO
          =========================================================== */}

          <div
            onClick={handleHome}
            className="
              flex
              items-center
              gap-3
              cursor-pointer
              group
              select-none
            "
            id="brand-logo"
          >

            <Logo
              className="w-13 h-13"
              animateBounce={true}
            />

            <div>

              <div
                className="
                  flex
                  items-center
                  font-extrabold
                  text-2xl
                  tracking-tight
                "
              >

                <span
                  className={`
                    transition-colors
                    duration-300
                    ${
                      isScrolled
                        ? 'text-stone-900 dark:text-white'
                        : 'text-white'
                    }
                  `}
                />

              </div>

            </div>

          </div>

          {/* ==========================================================
              DESKTOP NAVIGATION
          =========================================================== */}

          <nav
            className="
              hidden
              md:flex
              items-center
              gap-8
            "
            id="desktop-nav-links"
          >

            {navItems.map((item) => (

              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={item.action}
                className={`
                  relative
                  py-2
                  font-medium
                  text-base
                  transition-all
                  duration-200
                  outline-none
                  cursor-pointer

                  ${
                    (
                      item.id === 'home'
                        ? activeTab === 'home'
                        : false
                    )
                      ? `
                        text-red-500
                        dark:text-yellow-400
                        font-bold
                      `
                      : `
                        ${
                          isScrolled
                            ? `
                              text-stone-600
                              hover:text-stone-900
                              dark:text-neutral-300
                              dark:hover:text-white
                            `
                            : `
                              text-white/90
                              hover:text-white
                              drop-shadow-sm
                            `
                        }
                      `
                  }
                `}
              >

                {item.label}

                {item.id === 'home' &&
                  activeTab === 'home' && (

                    <span
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        h-0.5
                        bg-red-500
                        dark:bg-yellow-400
                        rounded-full
                      "
                    />

                  )}

              </button>

            ))}

          </nav>

          {/* ==========================================================
              ACTION BUTTONS
          =========================================================== */}

          <div
            className="
              flex
              items-center
              gap-3
            "
            id="navbar-actions"
          >

            {/* ========================================================
                LOGIN / PROFILE
            ========================================================= */}

            <button
              id={
                isLoggedIn
                  ? "profile-btn"
                  : "login-btn"
              }
              onClick={
                isLoggedIn
                  ? handleProfile
                  : handleLogin
              }
              className="
                hidden
                sm:flex
                items-center
                gap-2
                px-3
                py-2.5
                rounded-xl
                border
                border-yellow-400
                bg-yellow-400
                text-neutral-950
                hover:bg-yellow-300
                hover:border-yellow-300
                transition-all
                cursor-pointer
                font-semibold
              "
            >

              {isLoggedIn && (
                <User className="w-5 h-5" />
              )}

              <span>
                {isLoggedIn
                  ? ` ${userFirstName}`
                  : 'Login'}
              </span>

            </button>

            {/* ========================================================
                THEME TOGGLE
            ========================================================= */}

            <button
              id="theme-toggler"
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className="
                p-2.5
                rounded-xl
                border
                border-yellow-400
                bg-yellow-400
                text-neutral-950
                hover:bg-yellow-300
                hover:border-yellow-300
                transition-all
                cursor-pointer
              "
              title="Toggle theme"
            >

              {darkMode ? (

                <Sun
                  className="
                    w-5
                    h-5
                    text-neutral-950
                  "
                />

              ) : (

                <Moon
                  className="
                    w-5
                    h-5
                    text-neutral-950
                  "
                />

              )}

            </button>

            {/* ========================================================
                CART
            ========================================================= */}

            <button
              id="open-cart-btn"
              onClick={() =>
                setIsCartOpen(true)
              }
              className="
                relative
                p-2.5
                rounded-xl
                bg-neutral-900
                dark:bg-white
                text-white
                dark:text-neutral-900
                hover:bg-stone-800
                dark:hover:bg-amber-100
                transition-all
                font-semibold
                flex
                items-center
                gap-1.5
                shadow-sm
                hover:shadow
                cursor-pointer
              "
            >

              <ShoppingBag
                className="w-5 h-5"
              />

              {totalCartItems > 0 && (

                <span
                  className="
                    absolute
                    -top-1.5
                    -right-1.5
                    w-5
                    h-5
                    bg-red-500
                    text-white
                    text-[10px]
                    font-bold
                    rounded-full
                    flex
                    items-center
                    justify-center
                    border-2
                    border-white
                    dark:border-neutral-950
                    animate-bounce
                  "
                >
                  {totalCartItems}
                </span>

              )}

            </button>

            {/* ========================================================
                MOBILE MENU BUTTON
            ========================================================= */}

            <button
              id="mobile-menu-toggle"
              onClick={() =>
                setIsMobileMenuOpen(
                  !isMobileMenuOpen
                )
              }
              className={`
                p-2.5
                rounded-xl
                border
                md:hidden
                transition-all
                cursor-pointer

                ${
                  isScrolled
                    ? `
                      border-stone-200/60
                      dark:border-neutral-800
                      text-stone-600
                      dark:text-neutral-300
                      hover:bg-stone-50
                    `
                    : `
                      border-white/30
                      text-white
                      hover:bg-white/10
                    `
                }
              `}
            >

              {isMobileMenuOpen ? (

                <X className="w-5 h-5" />

              ) : (

                <Menu className="w-5 h-5" />

              )}

            </button>

          </div>

        </div>

      </div>

      {/* ==============================================================
          MOBILE DRAWER
      ============================================================== */}

      {isMobileMenuOpen && (

        
<div
  className="
    md:hidden
    border-t
    border-yellow-500
    bg-yellow-400
    dark:bg-yellow-400
    px-4
    py-4
    space-y-2
    animate-fadeIn
  "
  id="mobile-menu-drawer"
>

          {/* ----------------------------------------------------------
              HOME
          ----------------------------------------------------------- */}

          <button
            onClick={handleHome}
            className="
              block
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              text-base
              font-semibold
              transition-all
              text-stone-700
              hover:bg-stone-50
              dark:text-neutral-300
              dark:hover:bg-neutral-900
            "
          >
            Home
          </button>

          {/* ----------------------------------------------------------
              MENU
          ----------------------------------------------------------- */}

          <button
            onClick={handleMenu}
            className="
              block
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              text-base
              font-semibold
              transition-all
              text-stone-700
              hover:bg-stone-50
              dark:text-neutral-300
              dark:hover:bg-neutral-900
            "
          >
            Menu
          </button>

          {/* ----------------------------------------------------------
              ABOUT
          ----------------------------------------------------------- */}

          <button
            onClick={handleAbout}
            className="
              block
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              text-base
              font-semibold
              transition-all
              text-stone-700
              hover:bg-stone-50
              dark:text-neutral-300
              dark:hover:bg-neutral-900
            "
          >
            About Us
          </button>

          {/* ----------------------------------------------------------
              CONTACT
          ----------------------------------------------------------- */}

          <button
            onClick={handleContact}
            className="
              block
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              text-base
              font-semibold
              transition-all
              text-stone-700
              hover:bg-stone-50
              dark:text-neutral-300
              dark:hover:bg-neutral-900
            "
          >
            Contact
          </button>

          {/* ----------------------------------------------------------
              LOGIN / PROFILE
          ----------------------------------------------------------- */}

          <button
            onClick={
              isLoggedIn
                ? handleProfile
                : handleLogin
            }
            className="
              block
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              text-base
              font-semibold
              transition-all
              text-stone-700
              hover:bg-stone-50
              dark:text-neutral-300
              dark:hover:bg-neutral-900
            "
          >

            
<span
  className="
    flex
    items-center
    gap-2
  "
>
  {isLoggedIn && (
    <User className="w-5 h-5" />
  )}

  {isLoggedIn
    ? ` ${userFirstName}`
    : 'Login'}
</span>


          </button>

        </div>

      )}

    </header>

  );

}
