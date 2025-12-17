import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import { Loader2 } from "lucide-react";

export type PropertyFiltersType = {
  property_type: string;
  listing_type: string;
  city: string;
  min_area: string;
  max_area: string;
  min_price: string;
  max_price: string;
  bedrooms: string;
};

const Properties = () => {
  const [filters, setFilters] = useState<PropertyFiltersType>({
    property_type: "all",
    listing_type: "all",
    city: "",
    min_area: "",
    max_area: "",
    min_price: "",
    max_price: "",
    bedrooms: "all",
  });

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "available")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters.property_type !== "all") {
        query = query.eq("property_type", filters.property_type);
      }
      if (filters.listing_type !== "all") {
        query = query.eq("listing_type", filters.listing_type);
      }
      if (filters.city) {
        query = query.ilike("city", `%${filters.city}%`);
      }
      if (filters.min_area) {
        query = query.gte("area", parseFloat(filters.min_area));
      }
      if (filters.max_area) {
        query = query.lte("area", parseFloat(filters.max_area));
      }
      if (filters.min_price) {
        query = query.gte("price", parseFloat(filters.min_price));
      }
      if (filters.max_price) {
        query = query.lte("price", parseFloat(filters.max_price));
      }
      if (filters.bedrooms !== "all") {
        query = query.eq("bedrooms", parseInt(filters.bedrooms));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-24">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              فایل‌های ملکی
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              مجموعه‌ای از بهترین فایل‌های ملکی برای خرید، فروش و مشارکت در ساخت
            </p>
          </div>

          {/* Filters */}
          <PropertyFilters filters={filters} setFilters={setFilters} />

          {/* Properties Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : properties?.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                فایلی با این مشخصات یافت نشد
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                فیلترها را تغییر دهید یا بعداً مراجعه کنید
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties?.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;
