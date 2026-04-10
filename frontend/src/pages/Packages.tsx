import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PackageCard from "@/components/PackageCard";
import EnquiryModal from "@/components/EnquiryModal";
import { api } from "@/lib/api";
import { getCategoryUi } from "@/lib/categoryConfig";
import type { ApiCategory, ApiDestination, ApiPackage } from "@/types/api";

const FALLBACK_BANNERS: Record<string, string> = {
  "india":       "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85",
  "nepal":       "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85",
  "south-korea": "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=85",
  "thailand":    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85",
  "china":       "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&q=85",
  "sri-lanka":   "https://images.unsplash.com/photo-1581888227599-779811939961?w=1200&q=85",
};

const Packages = () => {
  const { country } = useParams<{ country: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  // URL param "category" stores the category slug (e.g. "wildlife-safari")
  const activeSlug = searchParams.get("category") || "";

  const slug = country ?? "india";

  const [packages, setPackages]       = useState<ApiPackage[]>([]);
  const [destination, setDestination] = useState<ApiDestination | null>(null);
  const [categories, setCategories]   = useState<ApiCategory[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    api.get<ApiDestination>(`/destinations/${slug}`).then(setDestination).catch(() => setDestination(null));
    api.get<ApiCategory[]>("/categories").then(setCategories).catch(() => setCategories([]));
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ destination_slug: slug });
    if (activeSlug) params.set("category_slug", activeSlug);
    api.get<ApiPackage[]>(`/packages?${params}`)
      .then(setPackages)
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, [slug, activeSlug]);

  const countryName = destination?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const bannerImg   = destination?.banner_url ?? destination?.image_url ?? FALLBACK_BANNERS[slug] ?? FALLBACK_BANNERS["india"];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Banner */}
      <section className="relative h-80 flex items-end overflow-hidden">
        <img src={bannerImg} alt={countryName} className="absolute inset-0 w-full h-full object-cover" />
        {/* Dark gradient — heaviest at bottom so text is always legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/15" />
        {/* Subtle amber brand wash from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-transparent" />

        <div className="relative container z-10 pb-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/45 text-xs font-body mb-4 tracking-wide">
            <span>Home</span>
            <span>/</span>
            <span>Packages</span>
            <span>/</span>
            <span className="text-primary font-medium">{countryName}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-6xl font-black text-white leading-tight mb-2"
          >
            {countryName} <span className="text-primary">Tours</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-white/60 text-sm font-body"
          >
            Explore our handcrafted tours across {countryName}
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-background/95 backdrop-blur-md border-b border-border/60 sticky top-[65px] z-30 shadow-sm">
        <div className="container py-4">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-0.5">

            {/* All Packages chip */}
            <button
              onClick={() => setSearchParams({})}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                !activeSlug
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-[1.03]"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              All Packages
            </button>

            {categories.map((cat) => {
              const ui      = getCategoryUi(cat.slug);
              const isActive = activeSlug === cat.slug;
              const Icon    = ui.icon;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSearchParams({ category: cat.slug })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? `${ui.activeBg} text-white shadow-md scale-[1.03]`
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : ui.color}`} />
                  {cat.name}
                </button>
              );
            })}

          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-12 bg-background flex-1">
        <div className="container">
          {loading ? (
            <p className="text-center text-muted-foreground py-16">Loading packages…</p>
          ) : packages.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No packages found in this category yet.</p>
              <EnquiryModal trigger={<button className="text-primary font-medium hover:underline">Enquire about custom packages →</button>} />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Packages;
