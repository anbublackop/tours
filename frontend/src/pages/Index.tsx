import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Star, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PackageCard from "@/components/PackageCard";
import EnquiryModal from "@/components/EnquiryModal";
import { packageCategories } from "@/data/packages";
import { api } from "@/lib/api";
import type { ApiPackage } from "@/types/api";
import heroBanner from "@/assets/hero-banner.jpg";
import indiaImg from "@/assets/india-destination.jpg";
import nepalImg from "@/assets/nepal-destination.jpg";

const Index = () => {
  const [featured, setFeatured] = useState<ApiPackage[]>([]);

  useEffect(() => {
    api.get<ApiPackage[]>("/packages?limit=4").then(setFeatured).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <img src={heroBanner} alt="Himalayan mountains" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/70" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full animate-pulse" />
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-accent/20 backdrop-blur-sm rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/30 backdrop-blur-sm rounded-full animate-pulse delay-500" />
        <div className="relative container z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-3xl">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium mb-4 border border-white/20">
                🌟 Premium Travel Experiences
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Discover the Magic of <span className="text-accent">Asia</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 font-lexend leading-relaxed max-w-2xl">
              Handcrafted tour packages for unforgettable journeys across Asia. From royal palaces to Himalayan peaks, modern cities to ancient temples.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats — static marketing copy */}
      <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 py-16 border-y border-border/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users,  label: "Happy Travellers", value: "15,000+", color: "text-primary" },
              { icon: Star,   label: "Customer Rating",  value: "4.8/5",   color: "text-accent" },
              { icon: Shield, label: "Years Experience", value: "10+",     color: "text-primary" },
              { icon: Search, label: "Tour Packages",    value: "50+",     color: "text-accent" },
            ].map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center group">
                <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border/50">
                  <div className={`w-16 h-16 ${stat.color} bg-current/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1 font-display">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-body">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations — static navigation cards */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">🌍 Explore Destinations</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Choose Your <span className="text-primary">Destination</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">Explore the rich cultures and breathtaking landscapes of Asia's most captivating destinations.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { name: "India",       slug: "india",      img: indiaImg, desc: "Royal palaces, sacred temples, wildlife safaris & coastal paradises", color: "from-orange-500 to-red-500" },
              { name: "Nepal",       slug: "nepal",      img: nepalImg, desc: "Himalayan treks, ancient temples, jungle safaris & adventure sports", color: "from-green-500 to-teal-500" },
              { name: "South Korea", slug: "south-korea", img: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600", desc: "Modern cities, ancient palaces, K-pop culture & DMZ tours", color: "from-blue-500 to-indigo-500" },
              { name: "Thailand",    slug: "thailand",   img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600", desc: "Tropical beaches, golden temples, street food & island hopping", color: "from-yellow-500 to-orange-500" },
              { name: "China",       slug: "china",      img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600", desc: "Great Wall, Terracotta Army, modern cities & ancient dynasties", color: "from-red-500 to-pink-500" },
              { name: "Sri Lanka",   slug: "sri-lanka",  img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600", desc: "Tea plantations, ancient kingdoms, beaches & wildlife", color: "from-purple-500 to-pink-500" },
            ].map((dest, index) => (
              <Link to={`/packages/${dest.slug}`} key={dest.slug} className="group">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                  className="relative h-96 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white dark:bg-card border border-border/50">
                  <img src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${dest.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>{dest.name.charAt(0)}</div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="font-display text-3xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300">{dest.name}</h3>
                    <p className="text-white/90 text-sm mb-4 font-body leading-relaxed">{dest.desc}</p>
                    <div className="flex items-center text-accent font-semibold text-sm group-hover:text-white transition-colors duration-300">
                      Explore Packages <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — static filter labels */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Browse by <span className="text-primary">Category</span></h2>
            <p className="text-muted-foreground font-body">Find the perfect tour based on your interests and preferences</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {packageCategories.map((cat, index) => (
              <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                <Link to={`/packages/india?category=${encodeURIComponent(cat.id)}`} className="group">
                  <div className="bg-white dark:bg-card rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border/50 hover:border-primary/20">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                    <div className="text-sm font-semibold text-foreground font-body group-hover:text-primary transition-colors duration-300">{cat.name}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages — dynamic from API */}
      <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">⭐ Featured Packages</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Popular <span className="text-accent">Tour Packages</span></h2>
            <p className="text-muted-foreground text-lg font-body max-w-2xl mx-auto">Our most loved and highly-rated tour experiences, crafted for unforgettable adventures</p>
          </motion.div>
          {featured.length === 0 ? (
            <p className="text-center text-muted-foreground">Loading packages…</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map((pkg, index) => (
                <motion.div key={pkg.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <PackageCard pkg={pkg} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-block px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6 border border-white/20">🚀 Ready for Adventure?</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">Can't Find Your Perfect Trip?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto font-body leading-relaxed">We customize tours based on your unique preferences. Tell us your dream destination and we'll craft the perfect itinerary just for you!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <EnquiryModal trigger={<Button size="lg" className="bg-white text-primary hover:bg-white/90 font-body font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105">Send an Enquiry</Button>} />
              <span className="text-white/70 text-sm">or call us at +91 98765 43210</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
