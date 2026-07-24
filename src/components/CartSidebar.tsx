import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, MapPin, Phone, User, Notebook, CreditCard, ChevronRight } from 'lucide-react';
import { CartItem, OrderDetails, OrderStatus } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
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
  const [paymentMethod, setPaymentMethod] = React.useState<'Delivery' | 'Pick-up'>('Delivery');
  const [errorMsg, setErrorMsg] = React.useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const deliveryFee = subtotal > 50 || subtotal === 0 ? 0 : 2.99;
  const total = subtotal + deliveryFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg("Your cart is currently empty.");
      return;
    }
    if (!customerName || !phone || !address) {
      setErrorMsg("Please complete Name, Mobile, and Delivery Address.");
      return;
    }

    setErrorMsg('');
    const newOrder: OrderDetails = {
      id: `YLO-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      phone,
      address,
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      status: 'received',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes,
      paymentMethod
    };

    onPlaceOrder(newOrder);
    onClose(); // Close the sidebar drawer
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 transition-opacity"
            id="cart-overlay-backdrop"
          />

          {/* Slider Drawer Component */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-neutral-950 z-50 shadow-2xl flex flex-col justify-between border-l border-stone-200/60 dark:border-neutral-900"
            id="cart-drawer-container"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-200/60 dark:border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-red-500" />
                <h2 className="font-extrabold text-lg text-stone-900 dark:text-white">Your Basket</h2>
                <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-neutral-800 dark:text-yellow-400 font-bold px-2 py-0.5 rounded-full font-mono">
                  {cart.length} items
                </span>
              </div>
              <button
                id="close-cart-btn"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-neutral-900 text-stone-500 hover:text-stone-950 dark:hover:text-white cursor-pointer"
                title="Close Basket"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable contents: Basket list + Checkout form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              
              {cart.length > 0 ? (
                /* Item list */
                <div className="space-y-4" id="cart-items-wrapper">
                  {cart.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 rounded-2xl bg-stone-50 dark:bg-neutral-900/40 border border-stone-200/40 dark:border-neutral-800/80 items-center justify-between"
                    >
                      <div className="flex gap-3 items-center flex-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-xs text-stone-900 dark:text-white line-clamp-1">{item.name}</h4>
                          <p className="text-[11px] text-stone-500 dark:text-neutral-400 font-sans">
                            ${item.price.toFixed(2)} &times; {quantity}
                          </p>
                        </div>
                      </div>

                      {/* Quantity & Delete tools */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white dark:bg-neutral-950 border border-stone-200/60 dark:border-neutral-800/80 rounded-xl px-1.5 py-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                            className="p-1 text-stone-500 hover:text-stone-950 dark:hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono px-2 text-center text-stone-900 dark:text-white">{quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                            className="p-1 text-stone-500 hover:text-stone-950 dark:hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                  
                  {/* Free delivery bar indicator */}
                  <div className="p-3 bg-yellow-50 dark:bg-neutral-900 text-stone-800 dark:text-yellow-400 rounded-2xl border border-yellow-200/50 dark:border-yellow-400/10 text-xs text-center font-semibold font-sans">
                    {subtotal >= 50 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">Please Recheck Your Order Before Proceeding</span>
                    ) : (
                      <span>Add <strong className="font-mono text-red-500">${(50 - subtotal).toFixed(2)}</strong> more to secure **Free Fast Delivery**!</span>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty Cart phase */
                <div className="text-center py-12 space-y-4" id="empty-cart-view">
                  <div className="w-16 h-16 bg-stone-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-stone-900 dark:text-white">Your basket is empty</h3>
                    <p className="text-xs text-stone-500 dark:text-neutral-400 max-w-[240px] mx-auto">
                      Explore our delicious  shawarma,  smash burgers, and shakes to begin!
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-yellow-400 dark:bg-yellow-500 text-neutral-900 font-bold text-xs"
                  >
                    Browse the Menu
                  </button>
                </div>
              )}

              {/* Delivery Details Form */}
              {cart.length > 0 && (
                <div className="pt-6 border-t border-stone-200/60 dark:border-neutral-900 space-y-4" id="checkout-form-section">
                  <h3 className="font-black text-sm text-stone-900 dark:text-white uppercase tracking-wider font-mono">Delivery Logistics</h3>
                  
                  <div className="space-y-3.5">
                    
                    {/* Name input */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        <User className="w-3 h-3 text-red-500" /> Recipient Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jack Anderson"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-900 border border-stone-200/60 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 font-medium font-sans"
                        required
                      />
                    </div>

                    {/* Mobile phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-red-500" /> Active Mobile Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +234 (555) 019-2834"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-900 border border-stone-200/60 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 font-semibold font-mono"
                        required
                      />
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" /> Shipping/Delivery Address
                      </label>
                      <input
                        type="text"
                        placeholder="Apt 4B, 128 bistro Street, Midtown East"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-900 border border-stone-200/60 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 font-medium font-sans"
                        required
                      />
                    </div>

                    {/* Driver Notes */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        <Notebook className="w-3 h-3" /> Please tell us how you want your order (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. please i would like the pasta very spicy"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-900 border border-stone-200/60 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 font-medium font-sans"
                      />
                    </div>

                    {/* recieval choice */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                         Recieval Preference (how would you like to get your order)
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

                  </div>
                </div>
              )}

            </div>

            {/* Bill Summary Footer & Place Order Button */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-200/60 dark:border-neutral-900 space-y-4 bg-stone-50 dark:bg-neutral-900/60">
                
                {/* Cost lines */}
                <div className="space-y-1.5 text-xs sm:text-sm font-sans" id="checkout-pricing">
                  <div className="flex justify-between text-stone-500 dark:text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-stone-800 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-500 dark:text-green-400">
                    <span>PLEASE DELIVERY FEE NOT INCLUDED IT WILL BE COMMUNICATED ONCE YOU PROCEED</span>
                    <span className="font-mono font-bold text-stone-850 dark:text-white">
                      {deliveryFee === 0 ? <strong className="text-green-500"></strong> : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-stone-900 dark:text-white border-t border-stone-200 dark:border-neutral-800 pt-2.5">
                    <span>Total Bill</span>
                    <span className="font-mono">${total.toFixed(2)}</span>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-red-500 font-bold text-xs text-center border-t border-red-200 pt-2 animate-bounce">
                    {errorMsg}
                  </p>
                )}

                {/* Place Order Active */}
                <button
                  id="checkout-trigger-btn"
                  onClick={handleCheckoutSubmit}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white font-black text-sm tracking-wide transition-all shadow-lg shadow-red-500/10 hover:scale-101 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Place Delivery Order</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-stone-400 text-center uppercase tracking-widest font-mono select-none">
                  🔒 Encrypted Checkout Process
                </p>

              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
