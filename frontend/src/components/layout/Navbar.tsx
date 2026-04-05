import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Phone, MapPin, ChevronDown, User, LayoutDashboard, LogOut, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import i18n, { LANGUAGES, type LangCode } from "@/i18n";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLangChange = (code: LangCode) => {
    i18n.changeLanguage(code);
    localStorage.setItem("yatrasathi_lang", code);
  };

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-border/20">
        <div className="container flex justify-between items-center py-2">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span className="font-body">+91 98765 43210</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-body">New Delhi, India</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-body text-sm">
              WhatsApp
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-body text-sm">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-body text-sm">
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
              <path d="M4 26 L11 13 L16 21 L21.5 10 L28 26Z" fill="white" fillOpacity="0.95"/>
              <circle cx="25" cy="8" r="3" fill="white" fillOpacity="0.85"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
              YatraSathi
            </span>
            <span className="text-[10px] text-muted-foreground font-body tracking-widest uppercase">Travel & Tours</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className="font-body text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 relative group">
            {t("nav.home")}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="font-body text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group">
              {t("nav.destinations")}
              <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border-border/50 shadow-xl">
              <DropdownMenuItem asChild>
                <Link to="/packages/india" className="font-body hover:bg-primary/10 cursor-pointer">{t("nav.indiaToursLink")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/packages/nepal" className="font-body hover:bg-primary/10 cursor-pointer">{t("nav.nepalToursLink")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/packages/south-korea" className="font-body hover:bg-primary/10 cursor-pointer">{t("nav.koreaToursLink")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/packages/thailand" className="font-body hover:bg-primary/10 cursor-pointer">{t("nav.thailandToursLink")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/packages/china" className="font-body hover:bg-primary/10 cursor-pointer">{t("nav.chinaToursLink")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/packages/sri-lanka" className="font-body hover:bg-primary/10 cursor-pointer">{t("nav.sriLankaToursLink")}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/enquiry" className="font-sans text-sm font-medium text-foreground hover:text-primary transition-colors">{t("nav.enquiry")}</Link>
          <Link to="/about" className="font-sans text-sm font-medium text-foreground hover:text-primary transition-colors">{t("nav.aboutUs")}</Link>
        </div>

        {/* Desktop right section: language picker + auth */}
        <div className="hidden lg:flex items-center gap-3">

          {/* Language picker */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/60 transition-all duration-200 text-sm font-medium focus:outline-none">
                <span className="text-base leading-none">{currentLang.flag}</span>
                <span className="text-xs font-body text-foreground hidden xl:inline">{currentLang.label}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 bg-white/95 dark:bg-card/95 backdrop-blur-xl border-border/50 shadow-xl">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  className={`flex items-center gap-2.5 font-body cursor-pointer ${i18n.language === lang.code ? "bg-primary/10 text-primary font-semibold" : ""}`}
                >
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span className="text-sm">{lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-border/60 bg-muted/40 hover:bg-muted/80 transition-all duration-200 group focus:outline-none">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] text-muted-foreground font-body">{t("nav.welcomeBack")}</span>
                    <span className="text-sm font-semibold text-foreground font-body">{user.name.split(" ")[0]}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-card/95 backdrop-blur-xl border-border/50 shadow-xl">
                <div className="px-3 py-2.5">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 font-body cursor-pointer">
                    <LayoutDashboard className="w-4 h-4" /> {t("nav.dashboard")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 font-body text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4" /> {t("nav.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login"><Button variant="outline" size="sm">{t("nav.login")}</Button></Link>
              <Link to="/register"><Button size="sm">{t("nav.register")}</Button></Link>
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
        <div className="lg:hidden bg-white/95 dark:bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-lg">
          <div className="container flex flex-col gap-1 pt-4 pb-6">
            <Link to="/" className="py-3 px-4 font-body text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200" onClick={() => setMobileOpen(false)}>
              {t("nav.home")}
            </Link>
            <div className="py-2 px-4">
              <div className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("nav.destLabel")}</div>
              <div className="flex flex-col gap-1">
                <Link to="/packages/india" className="py-2 px-3 font-body text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-all duration-200" onClick={() => setMobileOpen(false)}>
                  {t("nav.indiaToursLink")}
                </Link>
                <Link to="/packages/nepal" className="py-2 px-3 font-body text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-all duration-200" onClick={() => setMobileOpen(false)}>
                  {t("nav.nepalToursLink")}
                </Link>
                <Link to="/packages/south-korea" className="py-2 px-3 font-body text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-all duration-200" onClick={() => setMobileOpen(false)}>
                  {t("nav.koreaToursLink")}
                </Link>
                <Link to="/packages/thailand" className="py-2 px-3 font-body text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-all duration-200" onClick={() => setMobileOpen(false)}>
                  {t("nav.thailandToursLink")}
                </Link>
                <Link to="/packages/china" className="py-2 px-3 font-body text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-all duration-200" onClick={() => setMobileOpen(false)}>
                  {t("nav.chinaToursLink")}
                </Link>
                <Link to="/packages/sri-lanka" className="py-2 px-3 font-body text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-all duration-200" onClick={() => setMobileOpen(false)}>
                  {t("nav.sriLankaToursLink")}
                </Link>
              </div>
            </div>
            <Link to="/enquiry" className="py-3 px-4 font-body text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200" onClick={() => setMobileOpen(false)}>
              {t("nav.enquiry")}
            </Link>
            <Link to="/about" className="py-3 px-4 font-body text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200" onClick={() => setMobileOpen(false)}>
              {t("nav.aboutUs")}
            </Link>

            {/* Mobile language selector */}
            <div className="py-2 px-4">
              <div className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                <Globe className="w-3.5 h-3.5 inline mr-1" />{t("nav.language")}
              </div>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      i18n.language === lang.code
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 text-foreground border-border/60 hover:bg-primary/10 hover:border-primary/40"
                    }`}
                  >
                    <span className="text-sm leading-none">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 px-4 border-t border-border/50 mt-2">
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-xs text-muted-foreground font-body">{t("nav.namaste")}</span>
                      <span className="text-sm font-semibold text-foreground font-body truncate">{user.name}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-primary/20 text-primary hover:bg-primary/10 font-body font-medium rounded-full">
                        <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" /> {t("nav.dashboard")}
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" className="flex-1 font-body font-medium rounded-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { setMobileOpen(false); handleLogout(); }}>
                      <LogOut className="w-3.5 h-3.5 mr-1.5" /> {t("nav.signOut")}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-primary/20 text-primary hover:bg-primary/10 font-body font-medium rounded-full">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 font-body font-medium rounded-full">
                      {t("nav.register")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
