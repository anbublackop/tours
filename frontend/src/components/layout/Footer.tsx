import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const destinations = [
    { key: "footer.indiaTours",     to: "/packages/india"       },
    { key: "footer.nepalTours",     to: "/packages/nepal"       },
    { key: "footer.koreaTours",     to: "/packages/south-korea" },
    { key: "footer.thailandTours",  to: "/packages/thailand"    },
    { key: "footer.chinaTours",     to: "/packages/china"       },
    { key: "footer.sriLankaTours",  to: "/packages/sri-lanka"   },
  ];

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
            <p className="text-sm opacity-70 mb-5 leading-relaxed">{t("footer.tagline")}</p>
            <div className="flex gap-3">
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-sm font-semibold"
                aria-label="WhatsApp">WA</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-sm font-semibold"
                aria-label="Facebook">FB</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-sm font-semibold"
                aria-label="Instagram">IG</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-sm font-semibold"
                aria-label="X / Twitter">𝕏</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2.5 text-sm opacity-70">
              <li>
                <Link to="/" className="hover:opacity-100 hover:text-primary transition-colors">
                  {t("footer.home")}
                </Link>
              </li>
              <li>
                <Link to="/enquiry" className="hover:opacity-100 hover:text-primary transition-colors">
                  {t("footer.enquiry")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:opacity-100 hover:text-primary transition-colors">
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:opacity-100 hover:text-primary transition-colors">
                  {t("nav.dashboard")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">{t("footer.destinations")}</h3>
            <ul className="space-y-2.5 text-sm opacity-70">
              {destinations.map(({ key, to }) => (
                <li key={key}>
                  <Link to={to} className="hover:opacity-100 hover:text-primary transition-colors">
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">{t("footer.contactUs")}</h3>
            <ul className="space-y-3 text-sm opacity-70">
              <li>
                <a href="tel:+919876543210" className="flex items-start gap-2 hover:opacity-100 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a href="mailto:info@yatrasathi.com" className="flex items-start gap-2 hover:opacity-100 hover:text-primary transition-colors">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  info@yatrasathi.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>42, Travel Hub, Connaught Place,<br />New Delhi – 110001, India</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-background/10 py-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-sm opacity-50">
          <span>{t("footer.copyright")}</span>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:opacity-80 transition-opacity">{t("footer.aboutUs")}</Link>
            <Link to="/enquiry" className="hover:opacity-80 transition-opacity">{t("footer.enquiry")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
