import React from 'react';
import { FaWhatsapp } from "react-icons/fa";
import { supabase } from './lib/supabase';
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Clock,
  Coffee,
  MessageCircle,
  Utensils,
  Cake
} from 'lucide-react';

import {
  CartItem,
  FoodItem,
  OrderDetails,
  SelectedFoodOption
} from './types';

// Page Components
import Navbar from './components/Navbar';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import UpdatePassword from './components/auth/UpdatePassword';
import CustomerDashboard from './components/dashboard/CustomerDashboard';
import MyOrders from './components/dashboard/MyOrders';
import AdminOrders from './components/admin/AdminOrders';
import AdminProducts from './components/admin/AdminProducts';
import CustomerManagement from './components/admin/CustomerManagement';

import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import ProductOptionsModal from './components/ProductOptionsModal';
import FeaturedCarousel from "./components/FeaturedCarousel";
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import CartSidebar from './components/CartSidebar';
import TrackingSection from './components/TrackingSection';
import Footer from './components/Footer';

/*
|--------------------------------------------------------------------------
| APP VIEWS
|--------------------------------------------------------------------------
*/

type AppView =
  | 'home'
  | 'login'
  | 'signup'
  | 'profile'
  | 'my-orders'
  | 'customer-orders'
  | 'customer-management'
  | 'product-management'
  | 'track';

/*
|--------------------------------------------------------------------------
| NAVBAR TABS
|--------------------------------------------------------------------------
*/

type OldNavigationTab =
  | 'home'
  | 'menu'
  | 'about'
  | 'contact'
  | 'track';

export default function App() {

  /*
  |--------------------------------------------------------------------------
  | MAIN NAVIGATION
  |--------------------------------------------------------------------------
  */

  const [activeTab, setActiveTab] =
    React.useState<AppView>('home');

  /*
  |--------------------------------------------------------------------------
  | EXISTING APP STATE
  |--------------------------------------------------------------------------
  */

  const [selectedCategory, setSelectedCategory] =
    React.useState("All");

  const [cart, setCart] =
    React.useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] =
    React.useState(false);

  const [darkMode, setDarkMode] =
    React.useState(false);

  const [activeOrder, setActiveOrder] =
    React.useState<OrderDetails | null>(null);

  const [isAdmin, setIsAdmin] =
    React.useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    React.useState(false);

  const [userFirstName, setUserFirstName] =
    React.useState('');

  /*
  |--------------------------------------------------------------------------
  | PASSWORD RESET
  |--------------------------------------------------------------------------
  */

  const [isPasswordReset, setIsPasswordReset] =
    React.useState(
      () => window.location.hash.includes('type=recovery')
    );

  /*
  |--------------------------------------------------------------------------
  | WHATSAPP FLOATING CHAT
  |--------------------------------------------------------------------------
  */

  const [isWaOpen, setIsWaOpen] =
    React.useState(false);

  /*
  |--------------------------------------------------------------------------
  | PRODUCT CUSTOMIZATION
  |--------------------------------------------------------------------------
  */

  const [customizingItem, setCustomizingItem] =
    React.useState<FoodItem | null>(null);

  /*
  |--------------------------------------------------------------------------
  | DARK MODE
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  /*
  |--------------------------------------------------------------------------
  | LOAD CART AND ACTIVE ORDER
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem('yelo_bistro_cart');

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const savedOrder =
        localStorage.getItem('yelo_bistro_order');

      if (savedOrder) {
        setActiveOrder(JSON.parse(savedOrder));
      }
    } catch (e) {
      console.warn("Storage syncing failed", e);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SUPABASE AUTH + ADMIN DETECTION
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    let mounted = true;

    const updateUserProfile =
      async (userId: string | null) => {

        if (!userId) {
          if (mounted) {
            setIsAdmin(false);
          }
          return;
        }

        const { data, error } =
          await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (error) {
          console.error('PROFILE CHECK ERROR:', error);

          if (mounted) {
            setIsAdmin(false);
          }
          return;
        }

        if (mounted) {
          setIsAdmin(data?.role === 'admin');
        }
      };

    /*
    |--------------------------------------------------------------------------
    | CHECK CURRENT USER
    |--------------------------------------------------------------------------
    */

    const checkCurrentUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setIsLoggedIn(!!user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (!mounted) return;

        if (profile?.full_name) {
          const firstName =
            profile.full_name.trim().split(' ')[0];

          setUserFirstName(firstName);
        } else {
          setUserFirstName('');
        }
      } else {
        setUserFirstName('');
      }

      await updateUserProfile(user?.id ?? null);
    };

    void checkCurrentUser();

    /*
    |--------------------------------------------------------------------------
    | AUTH STATE LISTENER
    |--------------------------------------------------------------------------
    */

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {

        console.log('AUTH STATE CHANGED:', event);

        if (event === 'SIGNED_IN') {
          setIsLoggedIn(true);

          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', session.user.id)
              .single();

            if (!mounted) return;

            if (profile?.full_name) {
              const firstName =
                profile.full_name.trim().split(' ')[0];

              setUserFirstName(firstName);
            }

            await updateUserProfile(
              session.user.id
            );
          }
        }

        if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setUserFirstName('');
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | PASSWORD RECOVERY AUTH EVENT
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordReset(true);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CHECK PASSWORD RESET URL
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    const checkPasswordReset = async () => {
      const hash = window.location.hash;

      if (!hash.includes('type=recovery')) {
        return;
      }

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (session) {
        setIsPasswordReset(true);
      }
    };

    void checkPasswordReset();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | PASSWORD UPDATE PAGE
  |--------------------------------------------------------------------------
  */

  if (isPasswordReset) {
    return <UpdatePassword />;
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE CART
  |--------------------------------------------------------------------------
  */

  const saveCartToStorage =
    (updatedCart: CartItem[]) => {

      setCart(updatedCart);

      try {
        localStorage.setItem(
          'yelo_bistro_cart',
          JSON.stringify(updatedCart)
        );
      } catch (e) {
        console.warn('Cart storage failed:', e);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | OPEN PRODUCT OPTIONS
  |--------------------------------------------------------------------------
  */

  const handleAddToCart =
    (item: FoodItem) => {
      setCustomizingItem(item);
    };

  /*
  |--------------------------------------------------------------------------
  | ADD CUSTOMIZED ITEM TO CART
  |--------------------------------------------------------------------------
  */

  const addItemToCart =
    (
      item: FoodItem,
      selectedOptions: SelectedFoodOption[],
      unitPrice: number,
      quantity: number
    ) => {

      const optionsKey =
        selectedOptions
          .map(
            (option) =>
              `${option.groupId}:${option.choiceId}`
          )
          .sort()
          .join('|');

      const cartItemId =
        optionsKey
          ? `${item.id}__${optionsKey}`
          : item.id;

      const existing =
        cart.find(
          (cartItem) =>
            cartItem.cartItemId === cartItemId
        );

      let updated: CartItem[];

      if (existing) {
        updated =
          cart.map(
            (cartItem) =>
              cartItem.cartItemId === cartItemId
                ? {
                    ...cartItem,
                    quantity:
                      cartItem.quantity + quantity
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

  /*
  |--------------------------------------------------------------------------
  | REMOVE ONE ITEM FROM CART
  |--------------------------------------------------------------------------
  */

  const handleRemoveFromCart =
    (item: FoodItem) => {

      const matchingItems =
        cart.filter(
          (cartItem) =>
            cartItem.item.id === item.id
        );

      if (matchingItems.length === 0) {
        return;
      }

      const existing =
        matchingItems[matchingItems.length - 1];

      let updated: CartItem[];

      if (existing.quantity === 1) {
        updated =
          cart.filter(
            (cartItem) =>
              cartItem.cartItemId !== existing.cartItemId
          );
      } else {
        updated =
          cart.map(
            (cartItem) =>
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

  /*
  |--------------------------------------------------------------------------
  | UPDATE CART QUANTITY
  |--------------------------------------------------------------------------
  */

  const handleUpdateQuantity =
    (
      cartItemId: string,
      qty: number
    ) => {

      let updated: CartItem[];

      if (qty <= 0) {
        updated =
          cart.filter(
            (item) =>
              item.cartItemId !== cartItemId
          );
      } else {
        updated =
          cart.map(
            (item) =>
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

  /*
  |--------------------------------------------------------------------------
  | REMOVE CART ITEM COMPLETELY
  |--------------------------------------------------------------------------
  */

  const handleRemoveItem =
    (cartItemId: string) => {

      const updated =
        cart.filter(
          (cartItem) =>
            cartItem.cartItemId !== cartItemId
        );

      saveCartToStorage(updated);
    };

  /*
  |--------------------------------------------------------------------------
  | PLACE ORDER — MOBILE-FRIENDLY CHECKOUT
  |--------------------------------------------------------------------------
  */

  const handlePlaceOrder =
    async (order: OrderDetails) => {

      /*
       * Open the WhatsApp tab immediately, while the checkout
       * button's user interaction is still active. Some mobile
       * browsers block tabs opened after an awaited network request.
       */
      let whatsappWindow: Window | null = null;

      try {
        whatsappWindow = window.open('about:blank', '_blank');

        if (whatsappWindow) {
          whatsappWindow.opener = null;
        }
      } catch (popupError) {
        console.warn(
          'Could not open WhatsApp tab in advance:',
          popupError
        );
      }

      try {

        /*
        |--------------------------------------------------------------------------
        | PREPARE ORDER ITEMS
        |--------------------------------------------------------------------------
        */

        const orderItems =
          order.items.map((cartItem) => ({
            product_name: cartItem.item.name,
            quantity: cartItem.quantity,
            price: cartItem.unitPrice,
            subtotal:
              cartItem.unitPrice * cartItem.quantity,
            selected_options:
              cartItem.selectedOptions || []
          }));

        /*
        |--------------------------------------------------------------------------
        | SAVE ORDER TO SUPABASE
        |--------------------------------------------------------------------------
        */

        const {
          data: savedOrderId,
          error: orderError
        } = await supabase.rpc(
          'create_yelo_order',
          {
            p_customer_name: order.customerName,
            p_customer_phone: order.phone,
            p_delivery_address: order.address,
            p_total_amount: order.total,
            p_items: orderItems
          }
        );

        if (orderError) {
          console.error('ORDER SAVE ERROR:', {
            message: orderError.message,
            code: orderError.code,
            details: orderError.details,
            hint: orderError.hint,
            error: orderError
          });

          if (whatsappWindow && !whatsappWindow.closed) {
            whatsappWindow.close();
          }

          const errorDetails = [
            orderError.message,
            orderError.code
              ? `Error code: ${orderError.code}`
              : '',
            orderError.details
              ? `Details: ${orderError.details}`
              : '',
            orderError.hint
              ? `Hint: ${orderError.hint}`
              : ''
          ].filter(Boolean).join('\n');

          alert(
            `Your order could not be saved to the database.\n\n${errorDetails || 'Please try again.'}`
          );

          return;
        }

        /*
         * The RPC is expected to return the saved order ID.
         * Do not continue to WhatsApp if it did not return one,
         * because the tracking ID could otherwise be incorrect.
         */
        if (
          savedOrderId === null ||
          savedOrderId === undefined ||
          savedOrderId === ''
        ) {
          console.error(
            'ORDER SAVE ERROR: Supabase did not return an order ID.',
            savedOrderId
          );

          if (whatsappWindow && !whatsappWindow.closed) {
            whatsappWindow.close();
          }

          alert(
            'Supabase did not return an order ID. Please check your orders table before trying again, so you do not accidentally create a duplicate order.'
          );

          return;
        }

        console.log(
          'ORDER SAVED SUCCESSFULLY:',
          savedOrderId
        );

        /*
        |--------------------------------------------------------------------------
        | CREATE FINAL ORDER
        |--------------------------------------------------------------------------
        */

        const finalOrder: OrderDetails = {
          ...order,
          id: savedOrderId
        };

        setActiveOrder(finalOrder);

        try {
          localStorage.setItem(
            'yelo_bistro_order',
            JSON.stringify(finalOrder)
          );
        } catch (storageError) {
          console.warn(
            'Could not save active order locally:',
            storageError
          );
        }

        /*
        |--------------------------------------------------------------------------
        | BUILD WHATSAPP MESSAGE
        |--------------------------------------------------------------------------
        */

        let message =
          `🍽️ *NEW YELO BISTRO WEBSITE ORDER*\n\n`;

        message +=
          `🆔 Order ID: ${finalOrder.id}\n\n`;

        message +=
          `👤 Name: ${order.customerName}\n`;

        message +=
          `📞 Phone: ${order.phone}\n`;

        message +=
          `📍 Address: ${order.address}\n\n`;

        message +=
          `🛒 *Items Ordered*\n`;

        order.items.forEach(
          ({
            item,
            quantity,
            selectedOptions,
            unitPrice
          }) => {

            message +=
              `• ${item.name} x${quantity} - ₦${(
                unitPrice * quantity
              ).toLocaleString()}\n`;

            if (
              selectedOptions &&
              selectedOptions.length > 0
            ) {
              selectedOptions.forEach((option) => {
                message +=
                  `   - ${option.groupName}: ${option.choiceName}\n`;
              });
            }
          }
        );

        message +=
          `\n💰 Total: ₦${order.total.toLocaleString()}\n`;

        message +=
          `Mode of Receipt: ${order.paymentMethod}\n`;

        if (order.notes) {
          message +=
            `📝 Notes: ${order.notes}\n`;
        }

        const whatsappNumber = '2349069125598';

        const whatsappUrl =
          `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        /*
        |--------------------------------------------------------------------------
        | CLEAR CART AFTER SUCCESSFUL SAVE
        |--------------------------------------------------------------------------
        */

        saveCartToStorage([]);

        setIsCartOpen(false);
        setActiveTab('home');

        /*
        |--------------------------------------------------------------------------
        | REDIRECT TO WHATSAPP
        |--------------------------------------------------------------------------
        */

        if (
          whatsappWindow &&
          !whatsappWindow.closed
        ) {
          /*
           * Navigate the tab opened during the original click.
           */
          try {
            whatsappWindow.location.href = whatsappUrl;
          } catch (navigationError) {
            console.error(
              'Could not navigate the WhatsApp tab:',
              navigationError
            );

            window.location.assign(whatsappUrl);
          }
        } else {
          /*
           * If the browser blocked the new tab, use the current
           * page as a fallback. This helps on restrictive mobile
           * browsers, though it takes the customer away from the site.
           */
          window.location.assign(whatsappUrl);
        }

      } catch (error) {

        console.error(
          'UNEXPECTED CHECKOUT ERROR:',
          error
        );

        if (whatsappWindow && !whatsappWindow.closed) {
          whatsappWindow.close();
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : String(error);

        alert(
          `Something went wrong while processing your order.\n\n${errorMessage}\n\nYour cart has not been cleared. Check your orders table before trying again, in case the order was already saved.`
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | RESET ACTIVE ORDER
  |--------------------------------------------------------------------------
  */

  const handleResetOrder = () => {

    setActiveOrder(null);

    try {
      localStorage.removeItem('yelo_bistro_order');
    } catch (e) {
      console.warn(e);
    }

    setActiveTab('home');
  };

  /*
  |--------------------------------------------------------------------------
  | NAVIGATION HELPERS
  |--------------------------------------------------------------------------
  */

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  /*
  |--------------------------------------------------------------------------
  | LOGIN → SIGNUP
  |--------------------------------------------------------------------------
  */

  const handleCreateAccount = () => {
    setActiveTab('signup');
    goToTop();
  };

  /*
  |--------------------------------------------------------------------------
  | SIGNUP → LOGIN
  |--------------------------------------------------------------------------
  */

  const handleBackToLogin = () => {
    setActiveTab('login');
    goToTop();
  };

  /*
  |--------------------------------------------------------------------------
  | LOGIN → PROFILE
  |--------------------------------------------------------------------------
  */

  const handleLoginSuccess = () => {
    setActiveTab('profile');
    goToTop();
  };

  /*
  |--------------------------------------------------------------------------
  | SIGNUP → PROFILE
  |--------------------------------------------------------------------------
  */

  const handleAccountCreated = () => {
    setActiveTab('profile');
    goToTop();
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT → HOME
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    setActiveTab('home');
    goToTop();
  };

  /*
  |--------------------------------------------------------------------------
  | PROFILE → MY ORDERS
  |--------------------------------------------------------------------------
  */

  const handleMyOrders = () => {
    setActiveTab('my-orders');
    goToTop();
  };

  /*
  |--------------------------------------------------------------------------
  | PROFILE → CUSTOMER ORDERS
  |--------------------------------------------------------------------------
  */

  const handleCustomerOrders = () => {
    setActiveTab('customer-orders');
    goToTop();
  };

  /*
  |--------------------------------------------------------------------------
  | PROFILE → CUSTOMER MANAGEMENT
  |--------------------------------------------------------------------------
  */

  const handleCustomerManagement = () => {
    setActiveTab('customer-management');
    goToTop();
  };

  /*
  |--------------------------------------------------------------------------
  | PROFILE → PRODUCT MANAGEMENT
  |--------------------------------------------------------------------------
  */

  const handleProductManagement = () => {
    setActiveTab('product-management');
    goToTop();
  };

  /*
  |--------------------------------------------------------------------------
  | HOME SECTION NAVIGATION
  |--------------------------------------------------------------------------
  */

  const goToHomeSection =
    (section: 'home' | 'menu' | 'about' | 'contact') => {

      setActiveTab('home');

      window.setTimeout(() => {

        if (section === 'home') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          return;
        }

        const element =
          document.getElementById(`home-${section}`);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 50);
    };

  /*
  |--------------------------------------------------------------------------
  | NAVBAR COMPATIBILITY HANDLER
  |--------------------------------------------------------------------------
  */

  const handleNavbarTab = (tab: any) => {

    if (
      tab === 'menu' ||
      tab === 'about' ||
      tab === 'contact'
    ) {
      goToHomeSection(tab);
      return;
    }

    setActiveTab(tab);
    goToTop();
  };

  /*
  |--------------------------------------------------------------------------
  | ICON HELPER
  |--------------------------------------------------------------------------
  */

  const getIconComponent = (iconName: string) => {

    switch (iconName) {

      case 'Utensils':
        return (
          <Utensils className="w-6 h-6 text-red-500" />
        );

      case 'Clock':
        return (
          <Clock className="w-6 h-6 text-yellow-500" />
        );

      case 'Cake':
        return (
          <Cake className="w-6 h-6 text-emerald-500" />
        );

      case 'MessageSquare':
        return (
          <MessageSquare className="w-6 h-6 text-amber-500" />
        );

      default:
        return <Coffee className="w-6 h-6" />;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="
        min-h-screen
        bg-stone-50
        dark:bg-neutral-950
        text-stone-800
        dark:text-neutral-100
        font-sans
        transition-colors
        duration-300
        flex
        flex-col
      "
    >

      {/* NAVBAR */}

      <Navbar
        activeTab={activeTab as any}
        setActiveTab={handleNavbarTab as any}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeOrder={!!activeOrder}
        isLoggedIn={isLoggedIn}
        userFirstName={userFirstName}
      />

      {/* PRODUCT OPTIONS MODAL */}

      <ProductOptionsModal
        isOpen={!!customizingItem}
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={(
          item,
          selectedOptions,
          unitPrice,
          quantity
        ) => {

          addItemToCart(
            item,
            selectedOptions,
            unitPrice,
            quantity
          );

          setCustomizingItem(null);
        }}
      />

      {/* CART SIDEBAR */}

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* MAIN CONTENT */}

      <main className="flex-grow">

        <AnimatePresence mode="wait">

          {/* HOME */}

          {activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              id="home-tab-wrapper"
            >

              <div id="home">
                <Hero
                  onOrderNow={() => goToHomeSection('menu')}
                  onViewMenu={() => goToHomeSection('menu')}
                />
              </div>

              <FeaturedCarousel
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
              />

              <div id="home-menu">
                <MenuSection
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  cart={cart}
                  compact={false}
                />
              </div>

              <div id="home-about">
                <AboutSection />
              </div>

              <div id="home-contact">
                <ContactSection />
              </div>

            </motion.div>
          )}

          {/* LOGIN */}

          {activeTab === 'login' && (
            <motion.div
              key="tab-login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Login
                onCreateAccount={handleCreateAccount}
                onLoginSuccess={handleLoginSuccess}
              />
            </motion.div>
          )}

          {/* SIGNUP */}

          {activeTab === 'signup' && (
            <motion.div
              key="tab-signup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Signup
                onAccountCreated={handleAccountCreated}
                onBackToLogin={handleBackToLogin}
              />
            </motion.div>
          )}

          {/* PROFILE */}

          {activeTab === 'profile' && (
            <motion.div
              key="tab-profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <CustomerDashboard
                onMyOrders={handleMyOrders}
                onCustomerOrders={handleCustomerOrders}
                onCustomerManagement={handleCustomerManagement}
                onProductManagement={handleProductManagement}
                onLogout={handleLogout}
              />
            </motion.div>
          )}

          {/* MY ORDERS */}

          {activeTab === 'my-orders' && (
            <motion.div
              key="tab-my-orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <MyOrders />
            </motion.div>
          )}

          {/* CUSTOMER ORDERS — ADMIN ONLY */}

          {activeTab === 'customer-orders' && isAdmin && (
            <motion.div
              key="tab-customer-orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <AdminOrders />
            </motion.div>
          )}

          {/* CUSTOMER MANAGEMENT — ADMIN ONLY */}

          {activeTab === 'customer-management' && isAdmin && (
            <motion.div
              key="tab-customer-management"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <CustomerManagement />
            </motion.div>
          )}

          {/* PRODUCT MANAGEMENT — ADMIN ONLY */}

          {activeTab === 'product-management' && isAdmin && (
            <motion.div
              key="tab-product-management"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <AdminProducts />
            </motion.div>
          )}

          {/* ORDER TRACKING */}

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
          )}

        </AnimatePresence>
      </main>

      {/* FLOATING WHATSAPP */}

      <div
        className="
          fixed
          bottom-6
          right-6
          z-40
          flex
          flex-col
          items-end
          gap-3
          pointer-events-none
        "
        id="floating-widgets"
      >
        <div className="relative pointer-events-auto">

          <AnimatePresence>
            {isWaOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.95
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  scale: 0.95
                }}
                className="
                  absolute
                  bottom-16
                  right-0
                  w-72
                  bg-white
                  dark:bg-neutral-900
                  rounded-3xl
                  p-4
                  shadow-2xl
                  border
                  border-stone-200/60
                  dark:border-neutral-800
                  space-y-4
                  mb-2
                  text-neutral-800
                  dark:text-stone-100
                  z-50
                  text-xs
                  text-left
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    pb-2.5
                    border-b
                    border-stone-100
                    dark:border-neutral-800
                  "
                >
                  <div className="relative">
                    <span
                      className="
                        absolute
                        bottom-0
                        right-0
                        w-2.5
                        h-2.5
                        bg-green-500
                        border-2
                        border-white
                        dark:border-neutral-900
                        rounded-full
                      "
                    />

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-emerald-100
                        dark:bg-emerald-905
                        flex
                        items-center
                        justify-center
                        font-bold
                        text-emerald-600
                      "
                    >
                      YB
                    </div>
                  </div>

                  <div>
                    <h4
                      className="
                        font-extrabold
                        text-sm
                        text-stone-900
                        dark:text-white
                      "
                    >
                      Yelo Bistro
                    </h4>

                    <p
                      className="
                        text-[10px]
                        text-stone-400
                        font-semibold
                        uppercase
                      "
                    >
                      Yelo Bistro
                    </p>
                  </div>
                </div>

                <p
                  className="
                    text-stone-600
                    dark:text-neutral-300
                    leading-relaxed
                    font-sans
                  "
                >
                  "Hey there welcome to yelobistro Whatsapp platform chat with victoria to place your order or make enquires"
                </p>

                <button
                  onClick={() => {
                    const text =
                      "Hi Yelo Bistro! i would like to place an order";

                    window.open(
                      `https://wa.me/2349069125598?text=${encodeURIComponent(text)}`,
                      '_blank'
                    );
                  }}
                  className="
                    w-full
                    py-2.5
                    bg-emerald-500
                    hover:bg-emerald-600
                    text-white
                    font-black
                    rounded-xl
                    text-center
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    cursor-pointer
                    text-xs
                  "
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
            className="
              p-4
              bg-emerald-500
              hover:bg-emerald-600
              text-white
              rounded-full
              shadow-2xl
              flex
              items-center
              justify-center
              pointer-events-auto
              cursor-pointer
            "
            title="Open Kitchen Live Chat"
          >
            <FaWhatsapp
              size={28}
              color="white"
              className="w-6 h-6"
            />
          </button>

        </div>
      </div>

      {/* FOOTER */}

      <Footer
        setActiveTab={(tab: OldNavigationTab) => {
          handleNavbarTab(tab);
        }}
      />

      {/* TOASTER */}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000
        }}
      />

    </div>
  );
}