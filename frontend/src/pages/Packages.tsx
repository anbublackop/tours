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
      <section className="relative h-64 flex items-center">
        <img src={bannerImg} alt={countryName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
            {countryName} Tour Packages
          </motion.h1>
          <p className="text-primary-foreground/80 mt-2">Explore our handcrafted tours across {countryName}</p>
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
