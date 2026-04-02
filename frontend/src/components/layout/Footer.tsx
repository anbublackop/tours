import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md shrink-0">
                <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                  <path d="M4 26 L11 13 L16 21 L21.5 10 L28 26Z" fill="white" fillOpacity="0.95"/>
                  <circle cx="25" cy="8" r="3" fill="white" fillOpacity="0.85"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold">YatraSathi</span>
                <span className="text-[10px] opacity-60 font-body tracking-widest uppercase">Travel & Tours</span>
              </div>
            </div>
            <p className="text-sm opacity-70 mb-4">
              Your trusted travel companion for unforgettable journeys across India and Nepal. Crafting memories since 2015.
            </p>
            <div className="flex gap-3">
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-sm">WA</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-sm">FB</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-sm">IG</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-sm">X</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/" className="hover:opacity-100 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/packages/india" className="hover:opacity-100 hover:text-primary transition-colors">India Tours</Link></li>
              <li><Link to="/packages/nepal" className="hover:opacity-100 hover:text-primary transition-colors">Nepal Tours</Link></li>
              <li><Link to="/enquiry" className="hover:opacity-100 hover:text-primary transition-colors">Enquiry</Link></li>
              <li><Link to="/about" className="hover:opacity-100 hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Popular Tours</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/package/rajasthan-heritage" className="hover:opacity-100 hover:text-primary transition-colors">Rajasthan Heritage</Link></li>
              <li><Link to="/package/kerala-backwaters" className="hover:opacity-100 hover:text-primary transition-colors">Kerala Backwaters</Link></li>
              <li><Link to="/package/everest-base-camp" className="hover:opacity-100 hover:text-primary transition-colors">Everest Base Camp</Link></li>
              <li><Link to="/package/kathmandu-valley" className="hover:opacity-100 hover:text-primary transition-colors">Kathmandu Valley</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0" /> +91 98765 43210</li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0" /> info@yatrasathi.com</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> 42, Travel Hub, Connaught Place, New Delhi - 110001</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10 py-4">
        <div className="container text-center text-sm opacity-50">
          © 2026 YatraSathi. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
