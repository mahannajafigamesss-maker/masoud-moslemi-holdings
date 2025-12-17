import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Eye, MapPin, Ruler, BedDouble, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const propertyTypeLabels: Record<string, string> = {
  apartment: "آپارتمان",
  villa: "ویلا",
  land: "زمین",
  commercial: "تجاری",
};

const statusLabels: Record<string, string> = {
  available: "موجود",
  sold: "فروخته شده",
  rented: "اجاره داده شده",
  reserved: "رزرو شده",
};

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  sold: "bg-red-100 text-red-800",
  rented: "bg-blue-100 text-blue-800",
  reserved: "bg-yellow-100 text-yellow-800",
};

const PropertyList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({
        title: "حذف موفق",
        description: "فایل با موفقیت حذف شد",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطا",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: number | null) => {
    if (!price) return "توافقی";
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        در حال بارگذاری...
      </div>
    );
  }

  if (!properties?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">هنوز فایلی ثبت نشده است</p>
        <p className="text-sm text-muted-foreground">
          از تب "افزودن فایل جدید" برای ثبت فایل استفاده کنید
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        {properties.length} فایل ثبت شده
      </div>

      <div className="grid gap-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              {property.featured_image ? (
                <img
                  src={property.featured_image}
                  alt={property.title}
                  className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-32 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-muted-foreground text-xs">بدون تصویر</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-foreground truncate">
                    {property.title}
                  </h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <Badge variant="secondary">
                      {propertyTypeLabels[property.property_type] || property.property_type}
                    </Badge>
                    <Badge className={statusColors[property.status]}>
                      {statusLabels[property.status] || property.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.district}, {property.city}
                  </span>
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

                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">
                    {formatPrice(property.price)}
                  </span>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/properties/${property.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            این عمل قابل بازگشت نیست. فایل "{property.title}" برای همیشه حذف خواهد شد.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>انصراف</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(property.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
