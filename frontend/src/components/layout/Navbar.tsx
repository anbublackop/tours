import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = location.pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-secondary text-secondary-foreground text-sm py-1.5">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +91 98765 43210</span>
            <span className="hidden sm:flex items-center gap-1"><MapPin className="w-3 h-3" /> New Delhi, India</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="hover:opacity-80">WhatsApp</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:opacity-80">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:opacity-80">Instagram</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🏔️</span>
          <span className="font-display text-xl font-bold text-foreground">YatraSathi</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/" className="font-sans text-sm font-medium text-foreground hover:text-primary transition-colors">Home</Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="font-sans text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
              Destinations <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild><Link to="/packages/india">India Tours</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/packages/nepal">Nepal Tours</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/packages/india" className="font-sans text-sm font-medium text-foreground hover:text-primary transition-colors">India</Link>
          <Link to="/packages/nepal" className="font-sans text-sm font-medium text-foreground hover:text-primary transition-colors">Nepal</Link>
          <Link to="/enquiry" className="font-sans text-sm font-medium text-foreground hover:text-primary transition-colors">Enquiry</Link>
          <Link to="/about" className="font-sans text-sm font-medium text-foreground hover:text-primary transition-colors">About Us</Link>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            <Link to="/dashboard">
              <Button variant="default" size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login"><Button variant="outline" size="sm">Login</Button></Link>
              <Link to="/register"><Button size="sm">Register</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-t border-border pb-4">
          <div className="container flex flex-col gap-3 pt-3">
            <Link to="/" className="py-2 font-sans text-sm font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/packages/india" className="py-2 font-sans text-sm font-medium" onClick={() => setMobileOpen(false)}>India Tours</Link>
            <Link to="/packages/nepal" className="py-2 font-sans text-sm font-medium" onClick={() => setMobileOpen(false)}>Nepal Tours</Link>
            <Link to="/enquiry" className="py-2 font-sans text-sm font-medium" onClick={() => setMobileOpen(false)}>Enquiry</Link>
            <Link to="/about" className="py-2 font-sans text-sm font-medium" onClick={() => setMobileOpen(false)}>About Us</Link>
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm">Login</Button></Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}><Button size="sm">Register</Button></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
