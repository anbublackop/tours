import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏔️</span>
              <span className="font-display text-xl font-bold">YatraSathi</span>
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
