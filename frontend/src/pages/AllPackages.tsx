import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid, Globe, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PackageCard from "@/components/PackageCard";
import EnquiryModal from "@/components/EnquiryModal";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { getCategoryUi } from "@/lib/categoryConfig";
import type { ApiCategory, ApiDestination, ApiPackage } from "@/types/api";

const DEST_FLAGS: Record<string, string> = {
  "india":       "🇮🇳",
  "nepal":       "🇳🇵",
  "south-korea": "🇰🇷",
  "thailand":    "🇹🇭",
  "china":       "🇨🇳",
  "sri-lanka":   "🇱🇰",
};

// ── Shared button style helpers ───────────────────────────────────────────────
const countryChipCls = (active: boolean) =>
  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
    active
      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
  }`;

const sidebarBtnCls = (active: boolean) =>
  `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group ${
    active
      ? "bg-primary/15 text-primary border-l-[3px] border-primary"
      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground border-l-[3px] border-transparent"
  }`;

const catChipCls = (active: boolean, activeBg: string) =>
  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
    active
      ? `${activeBg} text-white shadow-md`
      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
  }`;

// ─────────────────────────────────────────────────────────────────────────────
const AllPackages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCountry  = searchParams.get("country")  || "";
  const activeCategory = searchParams.get("category") || "";

  const [packages,     setPackages]     = useState<ApiPackage[]>([]);
  const [destinations, setDestinations] = useState<ApiDestination[]>([]);
  const [categories,   setCategories]   = useState<ApiCategory[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [filtersReady, setFiltersReady] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<ApiDestination[]>("/destinations").then(setDestinations).catch(() => {}),
      api.get<ApiCategory[]>("/categories").then(setCategories).catch(() => {}),
    ]).finally(() => setFiltersReady(true));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCountry)  params.set("destination_slug", activeCountry);
    if (activeCategory) params.set("category_slug",    activeCategory);
    api.get<ApiPackage[]>(`/packages?${params}`)
      .then(setPackages)
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, [activeCountry, activeCategory]);

  const setCountry = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set("country", slug); else next.delete("country");
    setSearchParams(next);
  };

  const setCategory = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set("category", slug); else next.delete("category");
    setSearchParams(next);
  };

  const activeDestName = destinations.find(d => d.slug === activeCountry)?.name;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Banner ────────────────────────────────────────────────────────── */}
      <section className="relative h-52 md:h-64 flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=85"
          alt="Explore Packages"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />

        <div className="relative container z-10 pb-7 md:pb-9">
          <div className="flex items-center gap-2 text-white/45 text-xs font-body mb-2.5 tracking-wide">
            <span>Home</span><span>/</span>
            <span className="text-primary font-medium">All Packages</span>
            {activeDestName && <><span>/</span><span className="text-primary font-medium">{activeDestName}</span></>}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-5xl font-black text-white leading-tight mb-1"
          >
            Explore <span className="text-primary">All Packages</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-white/55 text-sm font-body"
          >
            {loading ? "Loading…" : `${packages.length} tour${packages.length !== 1 ? "s" : ""} across every destination`}
          </motion.p>
        </div>
      </section>

      {/* ── Mobile-only country strip ──────────────────────────────────────── */}
      <div className="lg:hidden bg-background/95 backdrop-blur-md border-b border-border/60 sticky top-[57px] z-30">
        <div className="px-4 py-2.5 flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            <button onClick={() => setCountry("")} className={countryChipCls(!activeCountry)}>
              🌍 All
            </button>
            {filtersReady ? destinations.map((dest) => (
              <button key={dest.slug} onClick={() => setCountry(dest.slug)} className={countryChipCls(activeCountry === dest.slug)}>
                {DEST_FLAGS[dest.slug] ?? "🌐"} {dest.name}
              </button>
            )) : Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-lg shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + content ────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left sidebar (desktop only) ──────────────────────────────────── */}
        <aside className="hidden lg:block w-56 xl:w-64 shrink-0 border-r border-border/50 bg-background">
          <div className="sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto scrollbar-none p-4 flex flex-col gap-1">
            {/* Header */}
            <div className="flex items-center gap-2 px-1 mb-3 pt-1">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Destinations</span>
            </div>

            {/* All countries */}
            <button onClick={() => setCountry("")} className={sidebarBtnCls(!activeCountry)}>
              <span className="text-base leading-none">🌍</span>
              <span>All Countries</span>
            </button>

            {/* Country list */}
            {filtersReady ? destinations.map((dest) => (
              <button key={dest.slug} onClick={() => setCountry(dest.slug)} className={sidebarBtnCls(activeCountry === dest.slug)}>
                <span className="text-base leading-none shrink-0">{DEST_FLAGS[dest.slug] ?? "🌐"}</span>
                <span className="truncate">{dest.name}</span>
              </button>
            )) : Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 flex flex-col">

          {/* Category filter bar — sticky within main */}
          <div className="sticky top-[57px] lg:top-[65px] z-20 bg-background/95 backdrop-blur-md border-b border-border/60 shadow-sm">
            <div className="px-4 md:px-6 py-2.5 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                <button onClick={() => setCategory("")} className={catChipCls(!activeCategory, "bg-primary")}>
                  <LayoutGrid className="w-3 h-3" /> All Categories
                </button>
                {filtersReady ? categories.map((cat) => {
                  const ui     = getCategoryUi(cat.slug);
                  const active = activeCategory === cat.slug;
                  const Icon   = ui.icon;
                  return (
                    <button key={cat.slug} onClick={() => setCategory(cat.slug)} className={catChipCls(active, ui.activeBg)}>
                      <Icon className={`w-3 h-3 ${active ? "text-white" : ui.color}`} />
                      {cat.name}
                    </button>
                  );
                }) : Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-24 rounded-lg shrink-0" />
                ))}
              </div>
            </div>
          </div>

          {/* Package grid */}
          <div className="flex-1 px-4 md:px-6 py-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[360px] sm:h-[400px] rounded-2xl" />
                ))}
              </div>
            ) : packages.length > 0 ? (
              <motion.div
                key={`${activeCountry}-${activeCategory}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {packages.map((pkg, i) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <PackageCard pkg={pkg} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-muted-foreground text-lg mb-2">No packages found.</p>
                <p className="text-muted-foreground text-sm mb-6">Try selecting a different country or category.</p>
                <EnquiryModal
                  trigger={
                    <button className="text-primary font-medium hover:underline text-sm">
                      Enquire about custom packages →
                    </button>
                  }
                />
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AllPackages;
