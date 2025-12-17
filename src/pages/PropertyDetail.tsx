import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Ruler,
  BedDouble,
  Bath,
  Calendar,
  Building,
  Car,
  Loader2,
  ArrowRight,
  Phone,
  Star,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";

const propertyTypeLabels: Record<string, string> = {
  apartment: "آپارتمان",
  villa: "ویلا",
  land: "زمین",
  commercial: "تجاری",
};

const listingTypeLabels: Record<string, string> = {
  sale: "فروش",
  rent: "اجاره",
  partnership: "مشارکت در ساخت",
};

const statusLabels: Record<string, string> = {
  available: "موجود",
  sold: "فروخته شده",
  rented: "اجاره داده شده",
  reserved: "رزرو شده",
};

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: property, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const formatPrice = (price: number | null) => {
    if (!price) return "توافقی";
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              فایل مورد نظر یافت نشد
            </h1>
            <Button asChild>
              <Link to="/properties">بازگشت به لیست فایل‌ها</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [property.featured_image].filter(Boolean);

  const features = [
    { key: "has_elevator", label: "آسانسور", value: property.has_elevator },
    { key: "has_storage", label: "انباری", value: property.has_storage },
    { key: "has_balcony", label: "بالکن", value: property.has_balcony },
    { key: "has_pool", label: "استخر", value: property.has_pool },
    { key: "has_gym", label: "سالن ورزش", value: property.has_gym },
    { key: "has_security", label: "نگهبانی", value: property.has_security },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت به لیست فایل‌ها
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Images Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Main Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    بدون تصویر
                  </div>
                )}

                {property.is_featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-white gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      فایل ویژه
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`تصویر ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    توضیحات
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Features */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  امکانات
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {features.map((feature) => (
                    <div
                      key={feature.key}
                      className={`flex items-center gap-2 ${
                        feature.value ? "text-foreground" : "text-muted-foreground/50"
                      }`}
                    >
                      {feature.value ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                      <span>{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="space-y-6">
              {/* Title & Badges */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {listingTypeLabels[property.listing_type]}
                  </Badge>
                  <Badge variant="secondary">
                    {propertyTypeLabels[property.property_type]}
                  </Badge>
                  <Badge
                    variant={property.status === "available" ? "default" : "secondary"}
                  >
                    {statusLabels[property.status]}
                  </Badge>
                </div>

                <h1 className="text-2xl font-bold text-foreground mb-4">
                  {property.title}
                </h1>

                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <MapPin className="w-5 h-5" />
                  <span>
                    {property.address}
                    {property.district && ` - ${property.district}`}
                    {property.city && `، ${property.city}`}
                  </span>
                </div>

                <div className="text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                </div>
                {property.price_per_meter && (
                  <div className="text-sm text-muted-foreground mt-1">
                    هر متر: {formatPrice(property.price_per_meter)}
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  مشخصات
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Ruler className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">متراژ</div>
                      <div className="font-semibold">{property.area} متر</div>
                    </div>
                  </div>

                  {property.land_area && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Ruler className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          متراژ زمین
                        </div>
                        <div className="font-semibold">
                          {property.land_area} متر
                        </div>
                      </div>
                    </div>
                  )}

                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <BedDouble className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">اتاق خواب</div>
                        <div className="font-semibold">{property.bedrooms}</div>
                      </div>
                    </div>
                  )}

                  {property.bathrooms > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Bath className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">سرویس</div>
                        <div className="font-semibold">{property.bathrooms}</div>
                      </div>
                    </div>
                  )}

                  {property.year_built && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">سال ساخت</div>
                        <div className="font-semibold">{property.year_built}</div>
                      </div>
                    </div>
                  )}

                  {(property.floor_number || property.total_floors) && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Building className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">طبقه</div>
                        <div className="font-semibold">
                          {property.floor_number || "-"}
                          {property.total_floors && ` از ${property.total_floors}`}
                        </div>
                      </div>
                    </div>
                  )}

                  {property.parking_spaces > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Car className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">پارکینگ</div>
                        <div className="font-semibold">{property.parking_spaces}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                <h3 className="font-bold text-foreground mb-2">
                  علاقه‌مند به این ملک هستید؟
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  برای کسب اطلاعات بیشتر و هماهنگی بازدید با ما تماس بگیرید
                </p>
                <Button className="w-full gap-2" size="lg">
                  <Phone className="w-5 h-5" />
                  تماس با مشاور
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
