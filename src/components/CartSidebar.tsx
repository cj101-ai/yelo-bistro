import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Notebook,
  CreditCard,
  ChevronRight,
  Truck
} from 'lucide-react';
import { CartItem, OrderDetails } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, qty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onPlaceOrder: (details: OrderDetails) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder
}: CartSidebarProps) {
  const [customerName, setCustomerName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [paymentMethod, setPaymentMethod] =
    React.useState<'Delivery' | 'Pick-up'>('Delivery');
  const [errorMsg, setErrorMsg] = React.useState('');

  /*
   * Calculate the subtotal using the customized unit price.
   */
  const subtotal = cart.reduce(
    (sum, cartItem) => sum + cartItem.unitPrice * cartItem.quantity,
    0
  );

  /*
   * Delivery fee is communicated separately after checkout.
   */
  const deliveryFee = 0;

  const total = subtotal + deliveryFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      setErrorMsg('Your cart is currently empty.');
      return;
    }

    if (!customerName.trim() || !phone.trim()) {
      setErrorMsg('Please complete Recipient Name and Active Mobile Phone.');
      return;
    }

    if (paymentMethod === 'Delivery' && !address.trim()) {
      setErrorMsg('Please enter a valid delivery address.');
      return;
    }

    setErrorMsg('');

    const newOrder: OrderDetails = {
      id: `YLO-${Math.floor(100000 + Math.random() * 900000)}`,

      customerName: customerName.trim(),
      phone: phone.trim(),
      address: paymentMethod === 'Delivery' ? address.trim() : 'Pick-up at YELO BISTRO',

      items: [...cart],

      subtotal,
      deliveryFee,
      total,

      status: 'received',

      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),

      notes: notes.trim(),
      paymentMethod
    };

    onPlaceOrder(newOrder);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
            id="cart-overlay-backdrop"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 220
            }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-neutral-950 z-50 shadow-2xl flex flex-col border-l border-stone-200/60 dark:border-neutral-900"
            id="cart-drawer-container"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-200/60 dark:border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-red-500" />

                <h2 className="font-extrabold text-lg text-stone-900 dark:text-white">
                  Your Basket
                </h2>

                <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-neutral-800 dark:text-yellow-400 font-bold px-2 py-0.5 rounded-full font-mono">
                  {cart.reduce(
                    (total, cartItem) => total + cartItem.quantity,
                    0
                  )}{' '}
                  items
                </span>
              </div>

              <button
                id="close-cart-btn"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-neutral-900 text-stone-500 hover:text-stone-950 dark:hover:text-white cursor-pointer"
                title="Close Basket"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {cart.length > 0 ? (
                <div className="space-y-4" id="cart-items-wrapper">
                  {/* Cart Items */}
                  {cart.map((cartItem) => {
                    const {
                      item,
                      quantity,
                      cartItemId,
                      unitPrice,
                      selectedOptions
                    } = cartItem;

                    return (
                      <div
                        key={cartItemId}
                        className="flex gap-4 p-3 rounded-2xl bg-stone-50 dark:bg-neutral-900/40 border border-stone-200/40 dark:border-neutral-800/80 items-center justify-between"
                      >
                        {/* Product Information */}
                        <div className="flex gap-3 items-center flex-1 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />

                          <div className="space-y-0.5 min-w-0">
                            <h4 className="font-bold text-xs text-stone-900 dark:text-white line-clamp-1">
                              {item.name}
                            </h4>

                            <p className="text-[11px] text-stone-500 dark:text-neutral-400 font-sans">
                              ₦{unitPrice.toLocaleString()} × {quantity}
                            </p>

                            {/* Selected Custom Options */}
                            {selectedOptions.length > 0 && (
                              <div className="mt-1 space-y-0.5">
                                {selectedOptions.map((option) => (
                                  <p
                                    key={`${option.groupId}-${option.choiceId}`}
                                    className="text-[10px] text-stone-400 dark:text-neutral-500"
                                  >
                                    {option.groupName}: {option.choiceName}
                                    {option.price > 0 &&
                                      ` (+₦${option.price.toLocaleString()})`}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quantity + Delete */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center bg-white dark:bg-neutral-950 border border-stone-200/60 dark:border-neutral-800/80 rounded-xl px-1.5 py-1">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(cartItemId, quantity - 1)
                              }
                              className="p-1 text-stone-500 hover:text-stone-950 dark:hover:text-white cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <span className="text-xs font-bold font-mono px-2 text-center text-stone-900 dark:text-white">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(cartItemId, quantity + 1)
                              }
                              className="p-1 text-stone-500 hover:text-stone-950 dark:hover:text-white cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(cartItemId)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Delivery Notice */}
                  <div className="p-3 bg-yellow-50 dark:bg-neutral-900 text-stone-800 dark:text-yellow-400 rounded-2xl border border-yellow-200/50 dark:border-yellow-400/10 text-xs text-center font-semibold font-sans">
                    <span className="text-stone-600 dark:text-neutral-300">
                      Please recheck your order before proceeding.{' '}
                      {paymentMethod === 'Delivery'
                        ? 'Delivery fee will be communicated after you proceed.'
                        : 'Pick-up order from Yelo Bistro.'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Empty Cart */
                <div className="text-center py-12 space-y-4" id="empty-cart-view">
                  <div className="w-16 h-16 bg-stone-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-stone-900 dark:text-white">
                      Your basket is empty
                    </h3>

                    <p className="text-xs text-stone-500 dark:text-neutral-400 max-w-[240px] mx-auto">
                      Explore our delicious shawarma, smash burgers, and shakes
                      to begin!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-yellow-400 dark:bg-yellow-500 text-neutral-900 font-bold text-xs"
                  >
                    Browse the Menu
                  </button>
                </div>
              )}

              {/* Delivery / Pickup Details */}
              {cart.length > 0 && (
                <div
                  className="pt-6 border-t border-stone-200/60 dark:border-neutral-900 space-y-4"
                  id="checkout-form-section"
                >
                  <h3 className="font-black text-sm text-stone-900 dark:text-white uppercase tracking-wider font-mono">
                    Order Logistics
                  </h3>

                  <div className="space-y-3.5">
                    {/* Order Method Selector at Top */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        How would you like to receive your order?
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('Delivery')}
                          className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                            paymentMethod === 'Delivery'
                              ? 'bg-neutral-900 text-white dark:bg-yellow-400 dark:text-neutral-900 border-neutral-950 dark:border-yellow-400'
                              : 'bg-stone-50 text-stone-600 dark:bg-neutral-900 dark:text-neutral-300 border-stone-200/60 dark:border-neutral-800'
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5" />
                          Delivery
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('Pick-up')}
                          className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                            paymentMethod === 'Pick-up'
                              ? 'bg-neutral-900 text-white dark:bg-yellow-400 dark:text-neutral-900 border-neutral-950 dark:border-yellow-400'
                              : 'bg-stone-50 text-stone-600 dark:bg-neutral-900 dark:text-neutral-300 border-stone-200/60 dark:border-neutral-800'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Pick-up
                        </button>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        <User className="w-3 h-3 text-red-500" />
                        Recipient Name
                      </label>

                      <input
                        type="text"
                        placeholder="e.g. Jack Anderson"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-900 border border-stone-200/60 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 font-medium font-sans"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-red-500" />
                        Active Mobile Phone
                      </label>

                      <input
                        type="tel"
                        placeholder="e.g. +234 801 234 5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-900 border border-stone-200/60 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 font-semibold font-mono"
                      />
                    </div>

                    {/* Address (Only for Delivery) */}
                    {paymentMethod === 'Delivery' && (
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500" />
                          Shipping / Delivery Address
                        </label>

                        <input
                          type="text"
                          placeholder="Enter your delivery address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-900 border border-stone-200/60 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 font-medium font-sans"
                        />
                      </div>
                    )}

                    {/* Notes */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        <Notebook className="w-3 h-3" />
                        Special Instructions (Optional)
                      </label>

                      <input
                        type="text"
                        placeholder="e.g. Please make the pasta very spicy"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-900 border border-stone-200/60 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 font-medium font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bill Summary */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-200/60 dark:border-neutral-900 space-y-4 bg-stone-50 dark:bg-neutral-900/60">
                <div
                  className="space-y-1.5 text-xs sm:text-sm font-sans"
                  id="checkout-pricing"
                >
                  {/* Subtotal */}
                  <div className="flex justify-between text-stone-500 dark:text-neutral-400">
                    <span>Subtotal</span>

                    <span className="font-mono font-bold text-stone-800 dark:text-white">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Delivery */}
                  <div className="flex justify-between text-green-500 dark:text-green-400">
                    <span>Delivery Fee</span>

                    <span className="font-mono font-bold text-stone-800 dark:text-white">
                      {paymentMethod === 'Pick-up'
                        ? 'Free (Pick-up)'
                        : 'To be communicated'}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-base font-black text-stone-900 dark:text-white border-t border-stone-200 dark:border-neutral-800 pt-2.5">
                    <span>Total Bill</span>

                    <span className="font-mono">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Error */}
                {errorMsg && (
                  <p className="text-red-500 font-bold text-xs text-center border-t border-red-200 pt-2">
                    {errorMsg}
                  </p>
                )}

                {/* Place Order */}
                <button
                  id="checkout-trigger-btn"
                  type="button"
                  onClick={handleCheckoutSubmit}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white font-black text-sm tracking-wide transition-all shadow-lg shadow-red-500/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Place Order</span>

                  <ChevronRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-stone-400 text-center uppercase tracking-widest font-mono select-none">
                  🔒 Secure Checkout Process
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}