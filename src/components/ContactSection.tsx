import React from 'react';
import emailjs from "@emailjs/browser";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Clock, MapPin, Send, MessageSquare, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
    newsletter: false
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.message) return;

  setIsSubmitting(true);

  try {
    await emailjs.send(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      },
      "YOUR_PUBLIC_KEY"
    );

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      message: "",
      newsletter: false,
    });

  } catch (error) {
    alert("Failed to send message.");
    console.error(error);
  }

  setIsSubmitting(false);
};

  // Quick WhatsApp text generator
  const triggerWhatsApp = () => {
    const text = "Hello Yelo Bistro! .";
    const url = `https://wa.me/2349069125598?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 bg-white dark:bg-neutral-950 transition-colors duration-300" id="bistro-contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-red-500 font-extrabold text-xs uppercase tracking-widest font-mono">Get in Touch</span>
          <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">We Are Here For You</h2>
          <p className="text-stone-500 dark:text-neutral-400 text-sm leading-relaxed">
            Have questions about group orders, delivery zones, or corporate catering packages? Let us know!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Info cards & WhatsApp quick channel */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Quick Contact Points */}
            <div className="space-y-4" id="contact-info-cards">
              
              {/* Point 1: Map Location */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-stone-50 dark:bg-neutral-900/40 border border-stone-200/50 dark:border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-extrabold text-stone-950 dark:text-white">Our Central Kitchen</p>
                  <p className="text-stone-500 dark:text-neutral-400">42 Country Home,Sisa Memorial Mall,Close to Falanu Junction,Benin City,Edo State.</p>
                  <p className="text-[11px] text-red-500 font-bold font-mono"></p>
                </div>
              </div>

              {/* Point 2: Email & Phone */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-stone-50 dark:bg-neutral-900/40 border border-stone-200/50 dark:border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-500 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-extrabold text-stone-950 dark:text-white">Direct Hotlines</p>
                  <p className="text-stone-600 dark:text-neutral-300">
                    Order Assistance: <span className="font-mono font-bold text-neutral-800 dark:text-white">+234 906 912 5598</span>
                  </p>
                  <p className="text-stone-500 dark:text-neutral-400">
                    Email: <span className="font-mono text-neutral-800 dark:text-white">@yelobistro@gmail.com</span>
                  </p>
                </div>
              </div>

              {/* Point 3: Delivery Hours */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-stone-50 dark:bg-neutral-900/40 border border-stone-200/50 dark:border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-extrabold text-stone-950 dark:text-white">Operation & Delivery Hours</p>
                  <p className="text-stone-600 dark:text-neutral-300">Mon - Sat: <span className="font-semibold text-neutral-800 dark:text-white">8:00 AM - 10:00 PM</span></p>
                  <p className="text-stone-600 dark:text-neutral-300"> Sun: <span className="font-semibold text-neutral-800 dark:text-white">12:00 PM - 10:00 PM</span></p>
                  <p className="text-[11px] text-red-500 font-bold font-mono uppercase tracking-wide">● Please be kindly informed  online orders stops at 9:30 PM</p>
                </div>
              </div>

            </div>

            {/* Direct WhatsApp Ordering Banner */}
            <div className="p-6 bg-emerald-500 dark:bg-emerald-600/90 text-white rounded-3xl space-y-4 shadow-lg shadow-emerald-500/15 relative overflow-hidden" id="whatsapp-callout">
              <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaWhatsapp size={28} color="white" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg">Instant WhatsApp Order</h4>
                  <p className="text-small text-white/80">Skip the lines, lets have a chat </p>
                </div>
              </div>
              

              <button
                id="whatsapp-chat-button"
                onClick={triggerWhatsApp}
                className="w-full py-3.5 rounded-2xl bg-white text-emerald-600 hover:bg-neutral-150 font-black text-xs sm:text-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-101"
              >
                <span>Launch WhatsApp Chat</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              </button>
            </div>

          </div>

          {/* Right Column: Contact form & Delivery zone radius map simulation */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Feedback / Inquiry Form */}
            <div className="bg-stone-50 dark:bg-neutral-900/40 border border-stone-200/60 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div>
                <h3 className="font-black text-lg text-stone-900 dark:text-white">Drop Us a message</h3>
                <p className="text-xs text-stone-400 dark:text-neutral-500"></p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" id="bistro-inquiry-form">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Liam Smith"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border border-stone-200/80 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. liam@gmail.com"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border border-stone-200/80 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-stone-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-mono">Message Comments</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="We'd love to hear feedback! Tell us about your delivery experience, request recipes, or query catering options..."
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border border-stone-200/80 dark:border-neutral-800 text-stone-800 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium whitespace-pre-wrap"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="news-check"
                    checked={formData.newsletter}
                    onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                    className="w-4 h-4 text-yellow-500 bg-white dark:bg-neutral-950 rounded border-stone-300 focus:ring-yellow-400"
                  />
                  {/*< label htmlFor="news-check" className="text-xs text-stone-600 dark:text-neutral-400 cursor-pointer select-none">
                    Subscribe to Yelo News to receive a <strong className="text-red-500">15% discount voucher</strong> automatically!
                  </label>*/}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="w-full py-4 rounded-xl bg-neutral-950 dark:bg-yellow-400 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-yellow-500 transition-all font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
                  ) : submitted ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 dark:text-emerald-800">
                      <ShieldCheck className="w-4 h-4" /> Message Placed Successfully
                    </span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-4 h-4 text-yellow-400 dark:text-neutral-950" />
                    </>
                  )}
                </button>

              </form>

              {/* Message Placement Success Indicator */}
              <AnimatePresence>
                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex items-center gap-3"
                  >
                    <Heart className="w-5 h-5 text-emerald-500 shrink-0 fill-emerald-500 animate-pulse" />
                    <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed font-sans">
                      Thank you! Your message has been routed to our  team. Check your Inbox for Response. 
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Illustrated Map section with Delivery Zones 
            <div className="p-6 bg-stone-50 dark:bg-neutral-900/40 border border-stone-200/50 dark:border-neutral-800 rounded-3xl space-y-4" id="delivery-map-container">
              <div>
                <h4 className="font-extrabold text-sm text-stone-900 dark:text-white uppercase tracking-wider font-mono">Our Active  Zone Map</h4>
                <p className="text-xs text-stone-500 dark:text-neutral-400"></p>
              </div>

              * Vector Grid Map Mock *
              <div className="relative border border-stone-200/60 dark:border-neutral-800/80 rounded-2xl aspect-[16/9] overflow-hidden bg-stone-100 dark:bg-neutral-950 flex flex-col items-center justify-center p-4 text-center">
                
                * Simulated Grid Lines 
                <div className="absolute inset-0 bg-linear-to-b from-stone-200/30 dark:from-neutral-900/20 to-transparent bg-[size:20px_20px] pointer-events-none" />
                
                {/* Radial rings 
                <div className="absolute w-44 h-44 rounded-full border border-dashed border-yellow-400/35 dark:border-yellow-400/20 animate-pulse" />
                <div className="absolute w-72 h-72 rounded-full border border-dashed border-red-400/25 dark:border-red-400/10" style={{ animationDuration: '8s' }} />

                * Legend details 
                <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-neutral-950/95 p-3 rounded-xl border border-stone-200/60 dark:border-neutral-800 shadow-sm text-left max-w-[140px] space-y-1 pointer-events-none z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                    <span className="text-[10px] text-stone-600 dark:text-neutral-400 font-bold font-mono">Zone A: 1-4 mi</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-red-400 rounded-full"></span>
                    <span className="text-[10px] text-stone-600 dark:text-neutral-400 font-bold font-mono">Zone B: 4-8 mi</span>
                  </div>
                  <p className="text-[8px] text-stone-400 select-none">Outside? Contact us! </p>
                </div>

                {/* Map center Pin representing Yelo Bistro 
                <div className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className="relative flex items-center justify-center w-12 h-12 bg-yellow-400 text-neutral-950 rounded-2xl shadow-xl animate-bounce">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-stone-900 dark:text-white">Yelo Central Kitchen</h5>
                    <p className="text-[9px] text-stone-500 dark:text-neutral-400">42 country home road</p>
                  </div>
                </div>*
              </div>
            </div>*/}

          </div>

        </div>

      </div>
    </section>
  );
}
