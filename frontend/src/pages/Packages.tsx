import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PackageCard from "@/components/PackageCard";
import EnquiryModal from "@/components/EnquiryModal";
import { packageCategories } from "@/data/packages";
import { api } from "@/lib/api";
import type { ApiPackage } from "@/types/api";
import indiaImg from "@/assets/india-destination.jpg";
import nepalImg from "@/assets/nepal-destination.jpg";

const southKoreaImg = "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200";
const thailandImg   = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200";
const chinaImg      = "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200";
const sriLankaImg   = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200";

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
      <section className="bg-card border-b border-border sticky top-[105px] z-30">
        <div className="container py-3 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!activeCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            All Packages
          </button>
          {packageCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSearchParams({ category: cat.id })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
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
