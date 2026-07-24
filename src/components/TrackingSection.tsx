import React from 'react';
import { motion } from 'motion/react';
import { Truck, Check, Clock, User, MessageSquare, MapPin, Navigation, Heart, ChevronRight, RefreshCw, Send, ShieldCheck } from 'lucide-react';
import { OrderDetails, OrderStatus } from '../types';

interface TrackingSectionProps {
  order: OrderDetails | null;
  onResetOrder: () => void;
}    
export default function TrackingSection({ order, onResetOrder }: TrackingSectionProps) {
  // If there is no active order, show a helpful placeholder page
  if (!order) {
    return (
      <div className="py-20 bg-stone-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-center p-6 min-h-[60vh] transition-colors" id="tracking-empty-state">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-950 text-yellow-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Truck className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-2xl text-stone-900 dark:text-white tracking-tight">No Active Delivery Orders</h3>
        <p className="text-stone-500 dark:text-neutral-400 text-sm max-w-md mt-2 mb-8 leading-relaxed">
          You don't have any meals on the way right now. Browse our tasty burgers, hot sha-warmas, and rich desserts to place an order!
        </p>
      </div>
    );
  }

  // Live Simulation state management for fun demo interactions
  const [currentStatus, setCurrentStatus] = React.useState<OrderStatus>('received');
  const [simulatedMinutes, setSimulatedMinutes] = React.useState(25);
  const [messages, setMessages] = React.useState<string[]>([
    "Your order is verified! Handing over the fresh ticket to Chef Liam."
  ]);
  const [userChatInput, setUserChatInput] = React.useState('');

  const statusWorkflow: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'received', label: 'Order Confirmed', desc: 'Sourcing ingredients, tickets printed' },
    { status: 'preparing', label: 'Preparing Food', desc: 'Grilling smash patties, packing steam-paks' },
    { status: 'on_the_way', label: 'Out for Delivery', desc: 'Rider speed-scootering to your door' },
    { status: 'delivered', label: 'Delivered', desc: 'Enjoy your hot Yelo delicacies!' }
  ];

  const getStatusIndex = (status: OrderStatus) => {
    return statusWorkflow.findIndex(s => s.status === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  // Auto trigger some funny rider speech bubbles during simulators
  const setSimulatedStatus = (status: OrderStatus) => {
    setCurrentStatus(status);
    if (status === 'received') {
      setSimulatedMinutes(28);
      setMessages(["Order verified! Handing tickets over to Chef Liam."]);
    } else if (status === 'preparing') {
      setSimulatedMinutes(22);
      setMessages([
        "Order verified! Handing tickets over to Chef Liam.",
        "Smash burger is sizzling on the griddle right now! Making our special sauce."
      ]);
    } else if (status === 'on_the_way') {
      setSimulatedMinutes(12);
      setMessages([
        "Order verified! Handing tickets over to Chef Liam.",
        "Smash burger is sizzling on the griddle right now! Making special sauce.",
        "Fresh steam-sealed inside the thermal bio-pak! Carlos is on the scooter on Gourmet Blvd."
      ]);
    } else if (status === 'delivered') {
      setSimulatedMinutes(0);
      setMessages([
        "Order verified! Handing tickets over to Chef Liam.",
        "Smash burger is sizzling on the griddle right now! Making special sauce.",
        "Fresh steam-sealed inside the thermal bio-pak! Carlos is on the scooter on Gourmet Blvd.",
        "Carlos arrives at your compound! Handing over paper luxury box. Enjoy your freshly grilled comfort food!"
      ]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;
    const chat = userChatInput;
    setMessages(prev => [...prev, `You: ${chat}`]);
    setUserChatInput('');
    
    // Auto respond in 1s
    setTimeout(() => {
      let riderResponse = "I am on it! Speeding past traffic.";
      if (currentStatus === 'preparing') {
        riderResponse = "Chefs are wrapping your fresh rolls right now. Saffron rice is looking fragrant!";
      } else if (currentStatus === 'delivered') {
        riderResponse = "Thank you so much! Please leave a 5-star rating in the reviews if you loved the heat.";
      }
      setMessages(prev => [...prev, `Rider Carlos: ${riderResponse}`]);
    }, 1000);
  };

  return (
    <section className="py-12 bg-stone-50 dark:bg-neutral-950 transition-colors duration-300" id="live-order-tracker">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner header alerts */}
        <div className="bg-yellow-400 text-neutral-950 p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
              <p className="text-[10px] uppercase font-black tracking-widest font-mono">Live Ordering Stream</p>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              Order {order.id} is heading out!
            </h2>
            <p className="text-xs text-neutral-950/80 font-medium">
              Recipient: <strong>{order.customerName}</strong> &bull; Address: <strong>{order.address}</strong>
            </p>
          </div>
          
          <button
            onClick={onResetOrder}
            className="px-5 py-2.5 bg-white text-neutral-950 font-black text-xs rounded-xl shadow-sm hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            Place New Order
          </button>
        </div>

        {/* Outer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Interactive Map & Stepper */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Live Progress map card */}
            <div className="bg-white dark:bg-neutral-900/45 p-6 rounded-3xl border border-stone-200/50 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-stone-900 dark:text-white">Active Router GPS</h3>
                  <p className="text-xs text-stone-500 dark:text-neutral-400">Insulated rider trajectory</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-mono">Eta Countdown</span>
                  <span className="text-lg font-black font-mono text-red-500 tracking-tight">
                    {simulatedMinutes > 0 ? `~${simulatedMinutes} Minutes` : "Arrived!"}
                  </span>
                </div>
              </div>

              {/* Vector SVG Roadmap */}
              <div className="bg-stone-100 dark:bg-neutral-950 rounded-2xl border border-stone-200 dark:border-neutral-800/60 p-4 aspect-[16/10] relative flex items-center justify-center overflow-hidden">
                {/* Simulated grid */}
                <div className="absolute inset-0 bg-linear-to-b from-stone-200/20 dark:from-neutral-900/10 to-transparent bg-[size:15px_15px]" />
                
                {/* Interactive Map Path line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Dotted path */}
                  <path
                    d="M 60,180 Q 150,60 220,120 T 360,90 T 500,160"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="dark:stroke-neutral-800"
                  />
                  
                  {/* Colored progress map path */}
                  <motion.path
                    d="M 60,180 Q 150,60 220,120 T 360,90 T 500,160"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="400"
                    strokeDashoffset={400 - (currentIndex / 3) * 400}
                    transition={{ duration: 1.2 }}
                  />
                </svg>

                {/* Pin A: Yelo Bistro kitchen */}
                <div className="absolute left-[40px] bottom-[25%] flex flex-col items-center">
                  <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">
                    Y
                  </div>
                  <span className="text-[9px] text-stone-500 font-bold font-sans mt-1">Yelo Kitchen</span>
                </div>

                {/* Animated Rider Scooter Icon */}
                <motion.div
                  className="absolute p-2 bg-yellow-400 dark:bg-yellow-500 text-neutral-950 rounded-xl shadow-xl z-20 flex items-center justify-center cursor-help"
                  style={{
                    left: `${15 + (currentIndex / 3) * 70}%`,
                    bottom: `${currentIndex === 0 ? 30 : currentIndex === 1 ? 55 : currentIndex === 2 ? 45 : 20}%`
                  }}
                  layout
                  transition={{ type: 'spring', damping: 20 }}
                >
                  <Truck className="w-4 h-4 text-neutral-950 animate-bounce" />
                </motion.div>

                {/* Pin B: Client address */}
                <div className="absolute right-[40px] bottom-[35%] flex flex-col items-center">
                  <div className="w-5 h-5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-955 rounded-full flex items-center justify-center shadow-md">
                    <MapPin className="w-3 h-3 text-red-500" />
                  </div>
                  <span className="text-[9px] text-stone-500 font-bold font-sans mt-0.5 truncate max-w-[80px]">Your Door</span>
                </div>

                {/* Dynamic weather overlay details */}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-950/90 py-1.5 px-3 rounded-lg text-[9px] text-stone-600 dark:text-neutral-400 font-bold font-mono shadow-sm flex items-center gap-1.5 border border-stone-200 dark:border-neutral-800">
                  <span>💨 Fast Transit</span>
                  <span>&bull;</span>
                  <span>🌡️ Thermal Lock Activated</span>
                </div>

              </div>
            </div>

            {/* Simulated Live status Stepper */}
            <div className="bg-white dark:bg-neutral-900/45 p-6 rounded-3xl border border-stone-200/50 dark:border-neutral-800 space-y-6">
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white">Fulfillment Timeline</h3>
              
              <div className="relative pl-6 space-y-6 border-l-2 border-stone-150 dark:border-neutral-800">
                
                {statusWorkflow.map((item, idx) => {
                  const isCompleted = idx < currentIndex;
                  const isActive = idx === currentIndex;
                  const isFuture = idx > currentIndex;

                  return (
                    <div key={item.status} className="relative group">
                      
                      {/* Stepper Bullet Indicator */}
                      <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isActive
                            ? 'bg-yellow-400 border-yellow-400 scale-125 animate-pulse'
                            : 'bg-white dark:bg-neutral-950 border-stone-300 dark:border-neutral-800'
                      }`}>
                        {isCompleted && (
                          <Check className="w-2.5 h-2.5 stroke-[4]" />
                        )}
                      </span>

                      {/* Content block */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`text-xs sm:text-sm font-black transition-colors ${
                            isActive
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : isFuture
                                ? 'text-stone-400'
                                : 'text-stone-900 dark:text-white'
                          }`}>
                            {item.label}
                          </h4>
                          {isActive && (
                            <span className="text-[8px] bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-500 px-1.5 py-0.5 rounded-full font-mono uppercase font-black animate-pulse">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-neutral-400 leading-relaxed font-sans">{item.desc}</p>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Block: Carlos Diaz Rider details & active chat log */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Rider profile card */}
            <div className="bg-white dark:bg-neutral-900/45 p-6 rounded-3xl border border-stone-200/50 dark:border-neutral-800 space-y-4">
              <div className="flex gap-4 items-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                  alt="Carlos Diaz - Yelo Rider"
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-stone-900 dark:text-white">Carlos Diaz</h4>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
                      Fastest
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-neutral-400 font-medium">Yelo Thermal Courier &bull; 4.9 ★</p>
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Vehicles: Electric Scooter S8</p>
                </div>
              </div>

              {/* Chat Dialog Frame */}
              <div className="border border-stone-200/60 dark:border-neutral-800 rounded-2xl p-4 bg-stone-50 dark:bg-neutral-950 space-y-3.5 h-64 overflow-y-auto no-scrollbar flex flex-col justify-end">
                <p className="text-[9px] text-stone-400 text-center uppercase tracking-widest font-semibold mb-2 pointer-events-none">
                  🔐 Safe thermal messenger active
                </p>

                <div className="space-y-3">
                  {messages.map((m, index) => {
                    const isUser = m.startsWith("You:");
                    return (
                      <div
                        key={index}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                          isUser
                            ? 'bg-neutral-900 dark:bg-amber-100 text-white dark:text-neutral-900 font-medium rounded-tr-sm'
                            : 'bg-white dark:bg-neutral-900 text-stone-800 dark:text-neutral-200 border border-stone-200/60 dark:border-neutral-800 rounded-tl-sm font-sans'
                        }`}>
                          {m}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask Carlos about spicy paste levels or instructions..."
                  value={userChatInput}
                  onChange={(e) => setUserChatInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-stone-50 dark:bg-neutral-950 border border-stone-200/80 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400 font-medium"
                />
                <button
                  type="submit"
                  className="p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-yellow-400 dark:text-neutral-950 text-white font-bold flex items-center justify-center cursor-pointer shadow-sm"
                  title="Send chat suggestion"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

            {/* Simulation cockpit controls for demo */}
            <div className="bg-amber-50/20 dark:bg-amber-950/10 p-5 rounded-3xl border border-dashed border-amber-300/60 dark:border-yellow-500/20 space-y-4">
              <div>
                <h4 className="font-black text-xs text-stone-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1">
                  <span>🛠️ Delivery Stage Simulator</span>
                </h4>
                <p className="text-[10px] text-stone-500 dark:text-neutral-400">Step through order statuses interactively to demo the system state changes</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <button
                  onClick={() => setSimulatedStatus('received')}
                  className={`p-2 rounded-xl text-[10px] font-bold transition-all border ${
                    currentStatus === 'received'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-950'
                      : 'bg-white text-stone-600 dark:bg-neutral-900 dark:text-neutral-300 border-stone-200/80 dark:border-neutral-800'
                  }`}
                >
                  1. Confirmed
                </button>
                <button
                  onClick={() => setSimulatedStatus('preparing')}
                  className={`p-2 rounded-xl text-[10px] font-bold transition-all border ${
                    currentStatus === 'preparing'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-950'
                      : 'bg-white text-stone-600 dark:bg-neutral-900 dark:text-neutral-300 border-stone-200/80 dark:border-neutral-800'
                  }`}
                >
                  2. Sizzling Griddle
                </button>
                <button
                  onClick={() => setSimulatedStatus('on_the_way')}
                  className={`p-2 rounded-xl text-[10px] font-bold transition-all border ${
                    currentStatus === 'on_the_way'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-950'
                      : 'bg-white text-stone-600 dark:bg-neutral-900 dark:text-neutral-300 border-stone-200/80 dark:border-neutral-800'
                  }`}
                >
                  3. Out for Transit
                </button>
                <button
                  onClick={() => setSimulatedStatus('delivered')}
                  className={`p-2 rounded-xl text-[10px] font-bold transition-all border ${
                    currentStatus === 'delivered'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-950'
                      : 'bg-white text-stone-600 dark:bg-neutral-900 dark:text-neutral-300 border-stone-200/80 dark:border-neutral-800'
                  }`}
                >
                  4. Handover Done!
                </button>
              </div>

              {currentStatus === 'delivered' && (
                <div className="p-3.5 bg-emerald-500 text-white text-xs font-semibold rounded-2xl flex items-center gap-2.5 animate-bounce">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>Delicious! Simulating complete. Handover satisfied. Enjoy!</span>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
