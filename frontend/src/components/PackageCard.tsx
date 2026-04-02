import { Link } from "react-router-dom";
import { Star, Clock, MapPin, ArrowRight } from "lucide-react";
import type { ApiPackage } from "@/types/api";

const FALLBACK =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=85";

const PackageCard = ({ pkg }: { pkg: ApiPackage }) => {
  const discount =
    pkg.original_price && pkg.original_price > pkg.price
      ? Math.round(((pkg.original_price - pkg.price) / pkg.original_price) * 100)
      : null;

  return (
    <Link to={`/package/${pkg.id}`} className="group block h-full">
      <div className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-border/20 h-full flex flex-col">

        {/* ── Image ── */}
        <div className="relative h-56 overflow-hidden shrink-0">
          <img
            src={pkg.image || FALLBACK}
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Permanent bottom gradient so text is always legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Category badge — top left */}
          {pkg.category && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-[11px] font-bold text-foreground rounded-full shadow-md tracking-wide">
                {pkg.category}
              </span>
            </div>
          )}

          {/* Discount badge — top right */}
          {discount && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 bg-red-500 text-[11px] font-bold text-white rounded-full shadow-md">
                {discount}% OFF
              </span>
            </div>
          )}

          {/* Bottom image overlay: rating + duration */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1.5">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs font-bold">{pkg.rating ?? "4.5"}</span>
              {pkg.reviews_count ? (
                <span className="text-white/70 text-[11px]">({pkg.reviews_count})</span>
              ) : null}
            </div>
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1.5">
              <Clock className="w-3 h-3 text-white/80" />
              <span className="text-white text-xs font-semibold">{pkg.duration}</span>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-5 flex flex-col flex-1">

          {/* Location */}
          {(pkg.state || pkg.location) && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-2 font-body">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{pkg.state || pkg.location}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-display text-lg font-bold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug">
            {pkg.title}
          </h3>

          {/* Push price to bottom */}
          <div className="flex-1" />

          {/* Price row + CTA */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary font-display">
                  ₹{pkg.price.toLocaleString()}
                </span>
                {pkg.original_price && (
                  <span className="text-xs text-muted-foreground line-through font-body">
                    ₹{pkg.original_price.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground font-body">per person</span>
            </div>

            <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-300 group-hover:bg-primary group-hover:text-white shadow-sm group-hover:shadow-md">
              Explore
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
