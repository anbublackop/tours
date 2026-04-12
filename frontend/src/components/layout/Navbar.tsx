import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LayoutDashboard, LogOut, Globe, Search } from "lucide-react";
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
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [searchOpen, setSearchOpen]       = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const searchInputRef                    = useRef<HTMLInputElement>(null);
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => { logout(); navigate("/login"); };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    setSearchQuery("");
    navigate(q ? `/packages?q=${encodeURIComponent(q)}` : "/packages");
  };
  const handleLangChange = (code: LangCode) => {
    i18n.changeLanguage(code);
    localStorage.setItem("yatrasathi_lang", code);
  };
  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-white/5 shadow-lg shadow-black/30">
      <nav className="container flex items-center justify-between py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/30 group-hover:scale-105 transition-all duration-300">
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
              <path d="M4 26 L11 13 L16 21 L21.5 10 L28 26Z" fill="white" fillOpacity="0.95"/>
              <circle cx="25" cy="8" r="3" fill="white" fillOpacity="0.85"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold text-primary tracking-tight">YatraSathi</span>
            <span className="text-[10px] text-muted-foreground font-body tracking-widest uppercase">Travel & Tours</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className="font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200 relative group">
            {t("nav.home")}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200 flex items-center gap-1.5 group outline-none">
              {t("nav.destinations")}
              <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card/95 backdrop-blur-xl border-border shadow-2xl shadow-black/40 min-w-[180px]">
              {[
                { label: t("nav.indiaToursLink"),    to: "/packages/india" },
                { label: t("nav.nepalToursLink"),    to: "/packages/nepal" },
                { label: t("nav.koreaToursLink"),    to: "/packages/south-korea" },
                { label: t("nav.thailandToursLink"), to: "/packages/thailand" },
                { label: t("nav.chinaToursLink"),    to: "/packages/china" },
                { label: t("nav.sriLankaToursLink"), to: "/packages/sri-lanka" },
              ].map(({ label, to }) => (
                <DropdownMenuItem key={to} asChild>
                  <Link to={to} className="font-body cursor-pointer hover:text-primary hover:bg-primary/10">{label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/enquiry" className="font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200 relative group">
            {t("nav.enquiry")}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
          <Link to="/about" className="font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200 relative group">
            {t("nav.aboutUs")}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
        </div>

        {/* Desktop right */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={submitSearch} className="flex items-center gap-1.5">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages…"
                className="w-48 xl:w-64 bg-muted/60 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
              />
              <button type="submit" className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
                <Search className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button onClick={openSearch} className="p-2 rounded-lg hover:bg-muted border border-border/60 transition-colors text-muted-foreground hover:text-primary" title="Search packages">
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 text-sm font-medium outline-none">
                <span className="text-base leading-none">{currentLang.flag}</span>
                <span className="text-xs font-body text-foreground/70 hidden xl:inline">{currentLang.label}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 bg-card/95 backdrop-blur-xl border-border shadow-2xl shadow-black/40">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  className={`flex items-center gap-2.5 font-body cursor-pointer ${i18n.language === lang.code ? "bg-primary/15 text-primary font-semibold" : "hover:text-primary hover:bg-primary/10"}`}
                >
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span className="text-sm">{lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth */}
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-border bg-muted/40 hover:border-primary/50 transition-all duration-200 group outline-none">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background text-xs font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] text-muted-foreground font-body">{t("nav.welcomeBack")}</span>
                    <span className="text-sm font-semibold text-foreground font-body">{user.name.split(" ")[0]}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-border shadow-2xl shadow-black/40">
                <div className="px-3 py-2.5">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 font-body cursor-pointer hover:text-primary hover:bg-primary/10">
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
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary font-body">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-body shadow-lg shadow-primary/20">
                  {t("nav.register")}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground/70 hover:text-primary transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card/98 backdrop-blur-2xl border-t border-border shadow-2xl shadow-black/40">
          <div className="container flex flex-col gap-1 pt-4 pb-6">
            {/* Mobile search */}
            <form
              onSubmit={(e) => { e.preventDefault(); const q = searchQuery.trim(); setMobileOpen(false); setSearchQuery(""); navigate(q ? `/packages?q=${encodeURIComponent(q)}` : "/packages"); }}
              className="px-4 pb-1"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search packages…"
                  className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
                />
              </div>
            </form>

            <Link to="/" className="py-3 px-4 font-body text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" onClick={() => setMobileOpen(false)}>
              {t("nav.home")}
            </Link>
            <div className="py-2 px-4">
              <div className="font-body text-xs font-semibold text-primary/60 uppercase tracking-widest mb-2">{t("nav.destLabel")}</div>
              <div className="flex flex-col gap-1">
                {[
                  { label: t("nav.indiaToursLink"),    to: "/packages/india" },
                  { label: t("nav.nepalToursLink"),    to: "/packages/nepal" },
                  { label: t("nav.koreaToursLink"),    to: "/packages/south-korea" },
                  { label: t("nav.thailandToursLink"), to: "/packages/thailand" },
                  { label: t("nav.chinaToursLink"),    to: "/packages/china" },
                  { label: t("nav.sriLankaToursLink"), to: "/packages/sri-lanka" },
                ].map(({ label, to }) => (
                  <Link key={to} to={to} className="py-2 px-3 font-body text-sm text-foreground/70 hover:text-primary hover:bg-primary/10 rounded-md transition-all" onClick={() => setMobileOpen(false)}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/enquiry" className="py-3 px-4 font-body text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" onClick={() => setMobileOpen(false)}>
              {t("nav.enquiry")}
            </Link>
            <Link to="/about" className="py-3 px-4 font-body text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" onClick={() => setMobileOpen(false)}>
              {t("nav.aboutUs")}
            </Link>

            {/* Mobile language */}
            <div className="py-2 px-4">
              <div className="font-body text-xs font-semibold text-primary/60 uppercase tracking-widest mb-2">
                <Globe className="w-3.5 h-3.5 inline mr-1" />{t("nav.language")}
              </div>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      i18n.language === lang.code
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 text-foreground/70 border-border hover:bg-primary/10 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <span className="text-sm leading-none">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 px-4 border-t border-border mt-2">
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-muted/50 border border-border">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background font-bold shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-xs text-muted-foreground font-body">{t("nav.namaste")}</span>
                      <span className="text-sm font-semibold text-foreground font-body truncate">{user.name}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-primary/40 text-primary hover:bg-primary/10 font-body rounded-full">
                        <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" /> {t("nav.dashboard")}
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" className="flex-1 font-body rounded-full text-destructive hover:bg-destructive/10" onClick={() => { setMobileOpen(false); handleLogout(); }}>
                      <LogOut className="w-3.5 h-3.5 mr-1.5" /> {t("nav.signOut")}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-primary/40 text-primary hover:bg-primary/10 font-body rounded-full">{t("nav.login")}</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body rounded-full">{t("nav.register")}</Button>
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
