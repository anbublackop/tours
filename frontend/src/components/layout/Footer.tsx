import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const destinations = [
    { key: "footer.indiaTours",    to: "/packages/india" },
    { key: "footer.nepalTours",    to: "/packages/nepal" },
    { key: "footer.koreaTours",    to: "/packages/south-korea" },
    { key: "footer.thailandTours", to: "/packages/thailand" },
    { key: "footer.chinaTours",    to: "/packages/china" },
    { key: "footer.sriLankaTours", to: "/packages/sri-lanka" },
  ];

  return (
    <footer className="bg-card border-t border-border/60">
      {/* Main footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                  <path d="M4 26 L11 13 L16 21 L21.5 10 L28 26Z" fill="white" fillOpacity="0.95"/>
                  <circle cx="25" cy="8" r="3" fill="white" fillOpacity="0.85"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold text-primary">YatraSathi</span>
                <span className="text-[10px] text-muted-foreground font-body tracking-widest uppercase">Travel & Tours</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{t("footer.tagline")}</p>
            <div className="flex gap-3">
              {[
                { href: "https://wa.me/919876543210", label: "WA" },
                { href: "https://facebook.com", label: "FB" },
                { href: "https://instagram.com", label: "IG" },
                { href: "https://twitter.com", label: "𝕏" },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-border bg-muted/50 flex items-center justify-center hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 text-xs font-bold text-muted-foreground"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-base font-semibold text-foreground mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-primary rounded-full inline-block" />
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-3">
              {[
                { label: t("footer.home"),    to: "/" },
                { label: t("footer.enquiry"), to: "/enquiry" },
                { label: t("footer.aboutUs"), to: "/about" },
                { label: t("nav.dashboard"),  to: "/dashboard" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1.5 group">
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-display text-base font-semibold text-foreground mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full inline-block" />
              {t("footer.destinations")}
            </h3>
            <ul className="space-y-3">
              {destinations.map(({ key, to }) => (
                <li key={key}>
                  <Link to={to} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1.5 group">
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-base font-semibold text-foreground mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-primary rounded-full inline-block" />
              {t("footer.contactUs")}
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+919876543210" className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a href="mailto:info@yatrasathi.com" className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  info@yatrasathi.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>42, Travel Hub, Connaught Place,<br />New Delhi – 110001, India</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/40">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 py-5">
          <span className="text-sm text-muted-foreground">{t("footer.copyright")}</span>
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("footer.aboutUs")}</Link>
            <Link to="/enquiry" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("footer.enquiry")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
