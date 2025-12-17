import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin, Ruler, BedDouble, Calendar, Star } from "lucide-react";

interface Property {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  status: string;
  address: string;
  city: string;
  district: string | null;
  area: number;
  bedrooms: number;
  year_built: number | null;
  price: number | null;
  featured_image: string | null;
  is_featured: boolean;
}

interface PropertyCardProps {
  property: Property;
}

const propertyTypeLabels: Record<string, string> = {
  apartment: "آپارتمان",
  villa: "ویلا",
  land: "زمین",
  commercial: "تجاری",
};

const listingTypeLabels: Record<string, string> = {
  sale: "فروش",
  rent: "اجاره",
  partnership: "مشارکت",
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number | null) => {
    if (!price) return "توافقی";
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} میلیارد تومان`;
    }
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)} میلیون تومان`;
    }
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {property.featured_image ? (
          <img
            src={property.featured_image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">بدون تصویر</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-wrap gap-2">
          <Badge className="bg-primary text-primary-foreground">
            {listingTypeLabels[property.listing_type] || property.listing_type}
          </Badge>
          <Badge variant="secondary">
            {propertyTypeLabels[property.property_type] || property.property_type}
          </Badge>
        </div>

        {property.is_featured && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-yellow-500 text-white gap-1">
              <Star className="w-3 h-3 fill-current" />
              ویژه
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            {property.district ? `${property.district}، ` : ""}
            {property.city}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Ruler className="w-4 h-4" />
            {property.area} متر
          </span>
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" />
              {property.bedrooms} خواب
            </span>
          )}
          {property.year_built && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {property.year_built}
            </span>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <span className="text-lg font-bold text-primary">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
