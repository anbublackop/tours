import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PackageCard from "@/components/PackageCard";
import EnquiryModal from "@/components/EnquiryModal";
import { getPackagesByCountry, packageCategories } from "@/data/packages";
import indiaImg from "@/assets/india-destination.jpg";
import nepalImg from "@/assets/nepal-destination.jpg";

const Packages = () => {
  const { country } = useParams<{ country: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const validCountry = country === "india" || country === "nepal" ? country : "india";
  const allPackages = getPackagesByCountry(validCountry);
  const filtered = activeCategory ? allPackages.filter((p) => p.category === activeCategory) : allPackages;

  const countryName = validCountry === "india" ? "India" : "Nepal";
  const bannerImg = validCountry === "india" ? indiaImg : nepalImg;

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
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
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
