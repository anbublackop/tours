import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Shield, MapPin, ChevronLeft, ChevronRight, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PackageCard from "@/components/PackageCard";
import EnquiryModal from "@/components/EnquiryModal";
import { api } from "@/lib/api";
import { getCategoryUi } from "@/lib/categoryConfig";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiCategory, ApiDestination, ApiPackage } from "@/types/api";
import heroBanner from "@/assets/hero-banner.jpg";
import { useTranslation } from "react-i18next";

const DEST_COLORS: Record<string, string> = {
  "india":       "from-orange-500 to-red-600",
  "nepal":       "from-emerald-500 to-teal-600",
  "south-korea": "from-blue-500 to-indigo-600",
  "thailand":    "from-amber-400 to-orange-500",
  "china":       "from-red-500 to-rose-600",
  "sri-lanka":   "from-purple-500 to-fuchsia-600",
};
const DEFAULT_COLOR = "from-primary to-accent";

const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, dir: "left" | "right") => {
  if (ref.current) ref.current.scrollBy({ left: dir === "left" ? -420 : 420, behavior: "smooth" });
};

// ── Arrow button ──
const ArrowBtn = ({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 shrink-0"
  >
    {dir === "left" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
  </button>
);

// ── Section header ──
const SectionHeader = ({
  num, badge, badgeColor, title, highlight, highlightColor, subtitle, scrollRef,
}: {
  num: string; badge: string; badgeColor: string; title: string; highlight: string;
  highlightColor: string; subtitle: string; scrollRef: React.RefObject<HTMLDivElement>;
}) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-4xl font-black text-primary/20 font-display leading-none select-none">{num}</span>
      <div className="h-px flex-1 bg-border" />
      <span className={`text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full ${badgeColor}`}>{badge}</span>
    </div>
    <div className="flex items-end justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
          {title} <span className={highlightColor}>{highlight}</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-2 max-w-xl font-body">{subtitle}</p>
      </div>
      <div className="hidden sm:flex gap-2 shrink-0 pb-1">
        <ArrowBtn dir="left" onClick={() => scrollCarousel(scrollRef, "left")} />
        <ArrowBtn dir="right" onClick={() => scrollCarousel(scrollRef, "right")} />
      </div>
    </div>
  </div>
);

// ── Carousel ──
// px-14 (56px) gives scaled cards room to expand at the edges without clipping.
// The fade sits inside that padding so it never overlaps actual card content.
const Carousel = ({ scrollRef, children }: { scrollRef: React.RefObject<HTMLDivElement>; children: React.ReactNode }) => (
  <div className="relative">
    <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
    <div
      ref={scrollRef}
      className="flex gap-3 md:gap-5 overflow-x-auto py-4 px-4 md:py-20 md:px-14 scrollbar-none"
      style={{ overflowY: "clip" }}
    >
      {children}
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
const Index = () => {
  const { t } = useTranslation();
  const [featured, setFeatured]         = useState<ApiPackage[]>([]);
  const [destinations, setDestinations] = useState<ApiDestination[]>([]);
  const [categories, setCategories]     = useState<ApiCategory[]>([]);
  const [loading, setLoading]           = useState(true);

  const pkgRef  = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const catRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      api.get<ApiPackage[]>("/packages?limit=10").then(setFeatured).catch(() => {}),
      api.get<ApiDestination[]>("/destinations").then(setDestinations).catch(() => {}),
      api.get<ApiCategory[]>("/categories").then(setCategories).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: Users,   label: t("home.statsTravellers"), value: "15,000+" },
    { icon: Star,    label: t("home.statsRating"),      value: "4.8/5"   },
    { icon: Shield,  label: t("home.statsExperience"),  value: "10+"     },
    { icon: Compass, label: t("home.statsPackages"),    value: "50+"     },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <img src={heroBanner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-accent/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 container text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm text-primary text-sm font-medium mb-6 md:mb-8"
            >
              <Sparkles className="w-4 h-4" />
              {t("home.premiumBadge")}
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-black text-white mb-5 md:mb-6 leading-tight tracking-tight">
              {t("home.heroTitle")}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {t("home.heroTitleHighlight")}
              </span>
            </h1>

            <p className="text-white/60 text-sm md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto font-body leading-relaxed">
              {t("home.heroSubtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 md:mb-16">
              <Link to="/packages">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold px-8 h-14 rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 text-base"
                >
                  {t("home.explorePackages")} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <EnquiryModal
                trigger={
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 hover:border-white/60 font-body font-semibold px-8 h-14 rounded-full backdrop-blur-sm transition-all duration-300 text-base"
                  >
                    {t("home.ctaEnquiry")}
                  </Button>
                }
              />
            </div>
          </motion.div>
        </div>

        {/* Stats glass bar at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10">
          <div className="container py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 divide-y md:divide-y-0">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex flex-col items-center py-2 px-2 md:px-4"
                >
                  <stat.icon className="w-4 h-4 text-primary mb-1" />
                  <div className="text-lg md:text-2xl font-black text-primary font-display">{stat.value}</div>
                  <div className="text-xs text-white/50 font-body text-center">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 1. Popular Tour Packages ───────────────────────────────────── */}
      <section className="py-10 md:py-16 bg-background border-b border-border/40">
        <div className="container">
          <SectionHeader
            num="01"
            badge={t("home.featuredBadge")}
            badgeColor="bg-accent/15 text-accent border border-accent/20"
            title={t("home.featuredTitle")}
            highlight={t("home.featuredTitleHighlight")}
            highlightColor="text-primary"
            subtitle={t("home.featuredSubtitle")}
            scrollRef={pkgRef}
          />
          {loading ? (
            <Carousel scrollRef={pkgRef}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="min-w-[280px] w-[280px] md:min-w-[340px] md:w-[340px] h-[400px] rounded-2xl shrink-0" />
              ))}
            </Carousel>
          ) : (
            <Carousel scrollRef={pkgRef}>
              {featured.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  className="min-w-[280px] w-[280px] md:min-w-[340px] md:w-[340px] h-[400px] relative z-[1] md:hover:z-10 group/card"
                >
                  <div className="transition-transform duration-300 ease-out origin-center md:group-hover/card:scale-[1.25] h-[400px]">
                    <PackageCard pkg={pkg} />
                  </div>
                </motion.div>
              ))}
            </Carousel>
          )}
        </div>
      </section>

      {/* ── 2. Choose Your Destination ────────────────────────────────── */}
      <section className="py-10 md:py-16 bg-background border-b border-border/40">
        <div className="container">
          <SectionHeader
            num="02"
            badge={t("home.destinationsBadge")}
            badgeColor="bg-primary/15 text-primary border border-primary/20"
            title={t("home.destinationsTitle")}
            highlight={t("home.destinationsTitleHighlight")}
            highlightColor="text-primary"
            subtitle={t("home.destinationsSubtitle")}
            scrollRef={destRef}
          />
          <Carousel scrollRef={destRef}>
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="min-w-[240px] w-[240px] md:min-w-[300px] md:w-[300px] h-[300px] md:h-[380px] rounded-2xl shrink-0" />
            )) : destinations.map((dest, index) => {
              const color = DEST_COLORS[dest.slug] ?? DEFAULT_COLOR;
              const img = dest.image_url ?? "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=85";
              return (
                <Link to={`/packages/${dest.slug}`} key={dest.slug} className="group min-w-[240px] w-[240px] md:min-w-[300px] md:w-[300px]">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    className="relative h-[300px] md:h-[380px] rounded-2xl overflow-hidden border border-border/40 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2"
                  >
                    <img src={img} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white text-xs font-bold`}>
                      {dest.name}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="font-display text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300">
                        {dest.name}
                      </h3>
                      {dest.description && (
                        <p className="text-white/60 text-xs mb-3 font-body leading-relaxed line-clamp-2">{dest.description}</p>
                      )}
                      <div className="flex items-center text-primary text-sm font-semibold group-hover:gap-2 transition-all duration-300">
                        {t("home.explorePackages")}
                        <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </Carousel>
        </div>
      </section>

      {/* ── 3. Browse by Category ─────────────────────────────────────── */}
      <section className="py-10 md:py-16 bg-background border-b border-border/40">
        <div className="container">
          <SectionHeader
            num="03"
            badge={t("home.categoriesBadge")}
            badgeColor="bg-primary/15 text-primary border border-primary/20"
            title={t("home.categoriesTitle")}
            highlight={t("home.categoriesTitleHighlight")}
            highlightColor="text-primary"
            subtitle={t("home.categoriesSubtitle")}
            scrollRef={catRef}
          />
          <Carousel scrollRef={catRef}>
            {loading ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="min-w-[210px] w-[210px] md:min-w-[260px] md:w-[260px] h-[160px] md:h-[190px] rounded-2xl shrink-0" />
            )) : categories.map((cat, index) => {
              const ui   = getCategoryUi(cat.slug);
              const Icon = ui.icon;
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="min-w-[210px] w-[210px] md:min-w-[260px] md:w-[260px] relative z-[1] md:hover:z-10 group/cat"
                >
                  <div className="transition-transform duration-300 ease-out origin-center md:group-hover/cat:scale-[1.25]">
                    <Link to={`/packages/india?category=${cat.slug}`} className="group block">
                      <div className={`relative h-[160px] md:h-[190px] rounded-2xl overflow-hidden bg-gradient-to-br ${ui.gradient} border border-white/5`}>
                        <div className="absolute -top-6 -right-6 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />
                        <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-black/15 rounded-full pointer-events-none" />
                        <div className="absolute inset-0 flex flex-col justify-between p-5">
                          <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                            <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-white/60 text-[11px] font-body mb-1 line-clamp-2">{cat.description ?? ui.description}</p>
                            <div className="flex items-center justify-between">
                              <h3 className="font-display text-base font-bold text-white">{cat.name}</h3>
                              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/40 group-hover:translate-x-0.5 transition-all duration-300">
                                <ArrowRight className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </Carousel>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative py-14 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(43_96%_56%/0.08)_0%,transparent_70%)]" />
        <div className="absolute top-8 left-1/4 w-64 h-64 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-8 right-1/4 w-48 h-48 rounded-full bg-accent/8 blur-3xl" />

        <div className="relative container text-center z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              {t("home.ctaBadge")}
            </div>
            <h2 className="font-display text-3xl md:text-6xl font-black text-foreground mb-5 md:mb-6 leading-tight">
              {t("home.ctaTitle")}
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto font-body leading-relaxed">
              {t("home.ctaSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <EnquiryModal
                trigger={
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold px-10 h-14 rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 text-base"
                  >
                    {t("home.ctaEnquiry")}
                  </Button>
                }
              />
              <span className="text-muted-foreground text-sm">{t("home.ctaCallUs")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
