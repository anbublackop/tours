import { Link } from "react-router-dom";
import { Star, Clock, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ApiPackage } from "@/types/api";

const PackageCard = ({ pkg }: { pkg: ApiPackage }) => {
  return (
    <Link to={`/package/${pkg.id}`} className="group block">
      <div className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-border/50 hover:border-primary/20">
        <div className="relative h-56 overflow-hidden">
          <img
            src={pkg.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600"}
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-foreground backdrop-blur-sm border-0 font-body font-medium shadow-lg">
              {pkg.category}
            </Badge>
          </div>

          {pkg.original_price && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-red-500 text-white border-0 font-body font-semibold shadow-lg">
                {Math.round(((pkg.original_price - pkg.price) / pkg.original_price) * 100)}% OFF
              </Badge>
            </div>
          )}

          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-foreground font-body">{pkg.rating ?? "4.5"}</span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {pkg.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 font-body">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <span>{pkg.duration}</span>
            </div>
            {pkg.state && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{pkg.state}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary font-display">₹{pkg.price.toLocaleString()}</span>
                {pkg.original_price && (
                  <span className="text-sm text-muted-foreground line-through font-body">₹{pkg.original_price.toLocaleString()}</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-body">per person</span>
            </div>

            <div className="flex items-center text-primary font-semibold text-sm group-hover:text-accent transition-colors duration-300 font-body">
              View Details
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
