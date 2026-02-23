import { Link } from "react-router-dom";
import { Star, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TourPackage } from "@/data/packages";

const PackageCard = ({ pkg }: { pkg: TourPackage }) => {
  return (
    <Link to={`/package/${pkg.id}`} className="group block">
      <div className="bg-card rounded-lg overflow-hidden card-elevated transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-52 overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-primary-foreground">{pkg.category}</Badge>
          </div>
          {pkg.originalPrice && (
            <div className="absolute top-3 right-3">
              <Badge variant="destructive">{Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">{pkg.title}</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{pkg.duration}</span>
            {pkg.state && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{pkg.state}</span>}
          </div>
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{pkg.rating}</span>
            <span className="text-xs text-muted-foreground">({pkg.reviews} reviews)</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-primary">₹{pkg.price.toLocaleString()}</span>
              {pkg.originalPrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">₹{pkg.originalPrice.toLocaleString()}</span>
              )}
              <span className="text-xs text-muted-foreground block">per person</span>
            </div>
            <span className="text-sm font-medium text-primary group-hover:underline">View Details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
