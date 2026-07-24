import React from 'react';
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok
} from "react-icons/fa";
import { Mail, Phone, Clock, MapPin, Sparkles, Send, Check } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'menu' | 'about' | 'contact' | 'track') => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const [newsEmail, setNewsEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail.trim()) return;
    setSubscribed(true);
    setNewsEmail('');
    setTimeout(() => {
      setSubscribed(false);
    }, 4500);
  };

  const footerLinks = [
    { label: " Menu", id: "menu" },
    { label: "About us", id: "about" },
    { label: "Contact Hotline", id: "contact" }
  ] as const;

  return (
    <footer className="bg-neutral-950 text-stone-200 border-t border-neutral-900 pt-16 pb-12 transition-colors duration-300" id="bistro-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-neutral-900 pb-12 mb-12">
          
          {/* Col 1: About Yelo Bistro */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="relative flex items-center justify-center w-8 h-8 bg-yellow-400 text-neutral-950 rounded-xl font-bold font-mono">
              Y
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">Yelo.</span>
              <span className="text-[10px] bg-neutral-800 text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Bistro</span>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Yelo Bistro is your go-to destination for fresh, flavorful meals and refreshing drinks. We're passionate about bringing people together through great food, warm service, and a welcoming atmosphere.

            </p>

            <div className="flex items-center gap-2 pt-2">

  <a
    href="https://instagram.com/yelobistro?igsh=aTdwYTV0cTUybWI0"
    target="_blank"
    rel="noopener noreferrer"
    className="p-2.5 bg-neutral-900 hover:bg-yellow-500 hover:text-neutral-950 rounded-xl text-stone-400 transition-colors"
    title="Instagram"
  >
    <FaInstagram className="text-lg" />
  </a>

  <a
    href="https://facebook.com/profile.php?id=61563418913452"
    target="_blank"
    rel="noopener noreferrer"
    className="p-2.5 bg-neutral-900 hover:bg-yellow-500 hover:text-neutral-950 rounded-xl text-stone-400 transition-colors"
    title="Facebook"
  >
    <FaFacebookF className="text-lg" />
  </a>

  <a
    href="https://tiktok.com/@yelobistro?_r=1&_t=ZS97mfH4DCPSu"
    target="_blank"
    rel="noopener noreferrer"
    className="p-2.5 bg-neutral-900 hover:bg-yellow-500 hover:text-neutral-950 rounded-xl text-stone-400 transition-colors"
    title="TikTok"
  >
    <FaTiktok className="text-lg" />
  </a>

</div>

            
          </div>

          {/* Col 2: Navigation Shortcuts */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider font-mono">Navigation Links</h4>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className="text-left text-xs sm:text-sm text-stone-400 hover:text-yellow-400 transition-colors py-0.5"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Col 3: Direct Contacts info */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider font-mono">The Yelo Hub</h4>
            <div className="space-y-3.5 text-xs sm:text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>42 Country Home,Sisa Memorial Mall,Close to Falanu Junction,Benin City,Edo State.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="font-mono">+234 906 912 5598</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="font-mono">support@yelobistro@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter signups */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider font-mono">Yelo Feedback</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              For Enquires, priority taste access, customized order and All round yelo experience send us a message.
            </p>

            <form onSubmit={handleNewsSubmit} className="space-y-2" id="footer-newsletter">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@guest.com"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-stone-100 text-xs sm:text-sm placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 hover:text-yellow-500 transition-colors"
                  title="Subscribe newsletter"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {subscribed && (
                <div className="p-2.5 bg-emerald-900/30 border border-emerald-800 rounded-lg text-[10px] text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Subscribed! Voucher mailed.</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Lower Credits banner */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 font-mono gap-4 pt-1">
          <p>&copy; 2026 Yelo Bistro Corporation. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Designed by FCC Creative Technologies</span>
            <span>&bull;</span>
            <span className="text-red-500 font-bold"></span>
          </div>
        </div>

      </div>
    </footer>
  );
}
