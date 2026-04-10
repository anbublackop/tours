import { Link } from "react-router-dom";
import { Star, Clock, MapPin, ArrowRight } from "lucide-react";
import type { ApiPackage } from "@/types/api";
import { useTranslation } from "react-i18next";

const FALLBACK = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=85";

const PackageCard = ({ pkg }: { pkg: ApiPackage }) => {
  const { t } = useTranslation();
  const discount =
    pkg.original_price && pkg.original_price > pkg.price
      ? Math.round(((pkg.original_price - pkg.price) / pkg.original_price) * 100)
      : null;

  return (
    <Link to={`/package/${pkg.id}`} className="group block h-full">
      {/* Full-bleed cinema poster card */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/8 transition-all duration-500">

        {/* Background image */}
        <img
          src={pkg.image || FALLBACK}
          alt={pkg.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient overlay — heavier at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

        {/* Hover tint */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/8 transition-colors duration-500" />

        {/* ── Top badges ── */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          {pkg.category ? (
            <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md text-[11px] font-semibold text-white/90 rounded-full border border-white/15 tracking-wide">
              {pkg.category}
            </span>
          ) : <span />}

          {discount && (
            <span className="px-2.5 py-1 bg-accent text-[11px] font-bold text-white rounded-full">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* ── Bottom content ── */}
        <div className="absolute bottom-0 left-0 right-0 p-5">

          {/* Rating + duration pills */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
              <Star className="w-3 h-3 fill-primary text-primary" />
              <span className="text-white text-xs font-bold">{pkg.rating ?? "4.5"}</span>
              {pkg.reviews_count ? (
                <span className="text-white/50 text-[11px]">({pkg.reviews_count})</span>
              ) : null}
            </div>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
              <Clock className="w-3 h-3 text-white/60" />
              <span className="text-white text-xs font-semibold">{pkg.duration}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-bold text-white mb-1.5 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300">
            {pkg.title}
          </h3>

          {/* Location */}
          {(pkg.state || pkg.location) && (
            <div className="flex items-center gap-1.5 text-[11px] text-white/55 mb-4 font-body">
              <MapPin className="w-3 h-3 text-primary/80 shrink-0" />
              <span className="truncate">{pkg.state || pkg.location}</span>
            </div>
          )}

          {/* Price + CTA row */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-primary font-display leading-none">
                  ₹{pkg.price.toLocaleString()}
                </span>
                {pkg.original_price && (
                  <span className="text-xs text-white/40 line-through font-body">
                    ₹{pkg.original_price.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-white/45 font-body">{t("common.perPerson")}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full group-hover:scale-105 transition-all duration-300">
              {t("common.explore")}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
