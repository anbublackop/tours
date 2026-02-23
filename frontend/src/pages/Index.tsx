import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Star, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PackageCard from "@/components/PackageCard";
import EnquiryModal from "@/components/EnquiryModal";
import { packages, packageCategories } from "@/data/packages";
import heroBanner from "@/assets/hero-banner.jpg";
import indiaImg from "@/assets/india-destination.jpg";
import nepalImg from "@/assets/nepal-destination.jpg";

const Index = () => {
  const featured = packages.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center">
        <img src={heroBanner} alt="Himalayan mountains" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
              Discover the Magic of India & Nepal
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 font-sans">
              Handcrafted tour packages for unforgettable journeys. From royal palaces to Himalayan peaks, we make your travel dreams come true.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/packages/india">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans font-semibold gap-2">
                  Explore India <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/packages/nepal">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-sans font-semibold">
                  Explore Nepal
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card py-8 border-b border-border">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Users, label: "Happy Travellers", value: "15,000+" },
            { icon: Star, label: "Customer Rating", value: "4.8/5" },
            { icon: Shield, label: "Years Experience", value: "10+" },
            { icon: Search, label: "Tour Packages", value: "50+" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <stat.icon className="w-6 h-6 text-primary mb-1" />
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Choose Your Destination</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From the vibrant culture of India to the serene Himalayas of Nepal, your next adventure awaits.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: "India", slug: "india", img: indiaImg, desc: "Royal palaces, sacred temples, wildlife safaris & coastal paradises" },
              { name: "Nepal", slug: "nepal", img: nepalImg, desc: "Himalayan treks, ancient temples, jungle safaris & adventure sports" },
            ].map((dest) => (
              <Link to={`/packages/${dest.slug}`} key={dest.slug} className="group">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative h-80 rounded-xl overflow-hidden card-elevated"
                >
                  <img src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-3xl font-bold text-background mb-1">{dest.name}</h3>
                    <p className="text-background/80 text-sm mb-3">{dest.desc}</p>
                    <span className="text-accent font-semibold text-sm group-hover:underline">Explore Packages →</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-muted">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {packageCategories.map((cat) => (
              <Link to={`/packages/india?category=${cat.id}`} key={cat.id} className="bg-card rounded-lg p-4 text-center card-elevated hover:-translate-y-1 transition-all duration-300">
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Featured Tour Packages</h2>
            <p className="text-muted-foreground">Our most popular and loved tour experiences</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-secondary-foreground mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-secondary-foreground/80 mb-6 max-w-lg mx-auto">We customize tours based on your preferences. Tell us your dream trip and we'll make it happen!</p>
          <EnquiryModal trigger={<Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">Send an Enquiry</Button>} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
