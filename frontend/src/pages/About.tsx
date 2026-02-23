import { motion } from "framer-motion";
import { Users, Award, Globe, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EnquiryModal from "@/components/EnquiryModal";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative h-64 flex items-center">
        <img src={heroBanner} alt="About" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
            About YatraSathi
          </motion.h1>
        </div>
      </section>

      <section className="py-16 bg-background flex-1">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Your Trusted Travel Companion</h2>
            <p className="text-muted-foreground leading-relaxed">
              Founded in 2015, YatraSathi has been crafting unforgettable travel experiences across India and Nepal.
              With over 10 years of expertise, we bring you carefully curated tour packages that blend adventure, culture, and comfort.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Users, label: "15,000+ Happy Travellers" },
              { icon: Award, label: "10+ Years Experience" },
              { icon: Globe, label: "50+ Destinations" },
              { icon: Heart, label: "4.8/5 Customer Rating" },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="p-6 text-center">
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="font-medium text-foreground text-sm">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Ready to Start Your Journey?</h3>
            <EnquiryModal trigger={<Button size="lg" className="font-semibold">Contact Us Today</Button>} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
