import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid, Camera, Sparkles, Tent, Landmark, Waves, Mountain } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PackageCard from "@/components/PackageCard";
import EnquiryModal from "@/components/EnquiryModal";
import { api } from "@/lib/api";
import type { ApiPackage } from "@/types/api";

const indiaImg = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85";
const nepalImg = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85";

const CATEGORIES = [
  { id: "Wildlife Safari",       name: "Wildlife Safari",       icon: Camera,   color: "text-orange-500",  activeBg: "bg-gradient-to-r from-amber-500 to-orange-500"   },
  { id: "Religious & Spiritual", name: "Religious & Spiritual", icon: Sparkles, color: "text-purple-500",  activeBg: "bg-gradient-to-r from-violet-500 to-purple-600"  },
  { id: "Adventure",             name: "Adventure",             icon: Tent,     color: "text-emerald-500", activeBg: "bg-gradient-to-r from-emerald-500 to-teal-600"   },
  { id: "Heritage & Culture",    name: "Heritage & Culture",    icon: Landmark, color: "text-rose-500",    activeBg: "bg-gradient-to-r from-rose-500 to-pink-600"      },
  { id: "Beach & Coastal",       name: "Beach & Coastal",       icon: Waves,    color: "text-cyan-500",    activeBg: "bg-gradient-to-r from-cyan-500 to-blue-600"      },
  { id: "Hill Stations",         name: "Hill Stations",         icon: Mountain, color: "text-green-500",   activeBg: "bg-gradient-to-r from-green-500 to-emerald-600"  },
];

const southKoreaImg = "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=85";
const thailandImg   = "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85";
const chinaImg      = "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&q=85";
const sriLankaImg   = "https://images.unsplash.com/photo-1581888227599-779811939961?w=1200&q=85";

const countryData: Record<string, { name: string; img: string }> = {
  "india":       { name: "India",       img: indiaImg },
  "nepal":       { name: "Nepal",       img: nepalImg },
  "south-korea": { name: "South Korea", img: southKoreaImg },
  "thailand":    { name: "Thailand",    img: thailandImg },
  "china":       { name: "China",       img: chinaImg },
  "sri-lanka":   { name: "Sri Lanka",   img: sriLankaImg },
};

const Packages = () => {
  const { country } = useParams<{ country: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const validCountry = countryData[country ?? ""] ? country! : "india";
  const { name: countryName, img: bannerImg } = countryData[validCountry];

  const [packages, setPackages] = useState<ApiPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ country: validCountry });
    if (activeCategory) params.set("category", activeCategory);
    api.get<ApiPackage[]>(`/packages?${params}`)
      .then(setPackages)
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, [validCountry, activeCategory]);

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
                !activeCategory
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-[1.03]"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              All Packages
            </button>

            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.id })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? `${cat.activeBg} text-white shadow-md scale-[1.03]`
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
                  }`}
                >
                  <cat.icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : cat.color}`} />
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
