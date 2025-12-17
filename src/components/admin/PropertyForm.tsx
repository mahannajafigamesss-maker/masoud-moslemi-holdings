import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const PropertyForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "apartment",
    status: "available",
    listing_type: "sale",
    address: "",
    city: "تهران",
    district: "",
    area: "",
    land_area: "",
    bedrooms: "0",
    bathrooms: "0",
    year_built: "",
    floor_number: "",
    total_floors: "",
    parking_spaces: "0",
    price: "",
    price_per_meter: "",
    has_elevator: false,
    has_storage: false,
    has_balcony: false,
    has_pool: false,
    has_gym: false,
    has_security: false,
    is_featured: false,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from("property-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      setImages([...images, ...uploadedUrls]);
      toast({
        title: "آپلود موفق",
        description: `${uploadedUrls.length} تصویر آپلود شد`,
      });
    } catch (error: any) {
      toast({
        title: "خطا در آپلود",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("properties").insert({
        title: formData.title,
        description: formData.description || null,
        property_type: formData.property_type,
        status: formData.status,
        listing_type: formData.listing_type,
        address: formData.address,
        city: formData.city,
        district: formData.district || null,
        area: parseFloat(formData.area),
        land_area: formData.land_area ? parseFloat(formData.land_area) : null,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
        total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
        parking_spaces: parseInt(formData.parking_spaces),
        price: formData.price ? parseFloat(formData.price) : null,
        price_per_meter: formData.price_per_meter ? parseFloat(formData.price_per_meter) : null,
        has_elevator: formData.has_elevator,
        has_storage: formData.has_storage,
        has_balcony: formData.has_balcony,
        has_pool: formData.has_pool,
        has_gym: formData.has_gym,
        has_security: formData.has_security,
        is_featured: formData.is_featured,
        images: images,
        featured_image: images[0] || null,
      });

      if (error) throw error;

      toast({
        title: "فایل اضافه شد",
        description: "فایل ملکی با موفقیت ثبت شد",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        property_type: "apartment",
        status: "available",
        listing_type: "sale",
        address: "",
        city: "تهران",
        district: "",
        area: "",
        land_area: "",
        bedrooms: "0",
        bathrooms: "0",
        year_built: "",
        floor_number: "",
        total_floors: "",
        parking_spaces: "0",
        price: "",
        price_per_meter: "",
        has_elevator: false,
        has_storage: false,
        has_balcony: false,
        has_pool: false,
        has_gym: false,
        has_security: false,
        is_featured: false,
      });
      setImages([]);
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">اطلاعات اصلی</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title">عنوان فایل *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: آپارتمان ۱۵۰ متری در فرمانیه"
              required
            />
          </div>

          <div>
            <Label htmlFor="property_type">نوع ملک</Label>
            <Select
              value={formData.property_type}
              onValueChange={(value) => setFormData({ ...formData, property_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">آپارتمان</SelectItem>
                <SelectItem value="villa">ویلا</SelectItem>
                <SelectItem value="land">زمین</SelectItem>
                <SelectItem value="commercial">تجاری</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="listing_type">نوع معامله</Label>
            <Select
              value={formData.listing_type}
              onValueChange={(value) => setFormData({ ...formData, listing_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">فروش</SelectItem>
                <SelectItem value="rent">اجاره</SelectItem>
                <SelectItem value="partnership">مشارکت در ساخت</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">وضعیت</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">موجود</SelectItem>
                <SelectItem value="sold">فروخته شده</SelectItem>
                <SelectItem value="rented">اجاره داده شده</SelectItem>
                <SelectItem value="reserved">رزرو شده</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="توضیحات کامل ملک..."
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">موقعیت</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="address">آدرس *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="آدرس کامل ملک"
              required
            />
          </div>

          <div>
            <Label htmlFor="city">شهر</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="تهران"
            />
          </div>

          <div>
            <Label htmlFor="district">محله/منطقه</Label>
            <Input
              id="district"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              placeholder="فرمانیه"
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">مشخصات فنی</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="area">متراژ (متر مربع) *</Label>
            <Input
              id="area"
              type="number"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="150"
              required
            />
          </div>

          <div>
            <Label htmlFor="land_area">متراژ زمین</Label>
            <Input
              id="land_area"
              type="number"
              value={formData.land_area}
              onChange={(e) => setFormData({ ...formData, land_area: e.target.value })}
              placeholder="500"
            />
          </div>

          <div>
            <Label htmlFor="bedrooms">تعداد اتاق</Label>
            <Input
              id="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              placeholder="3"
            />
          </div>

          <div>
            <Label htmlFor="bathrooms">تعداد سرویس</Label>
            <Input
              id="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              placeholder="2"
            />
          </div>

          <div>
            <Label htmlFor="year_built">سال ساخت</Label>
            <Input
              id="year_built"
              type="number"
              value={formData.year_built}
              onChange={(e) => setFormData({ ...formData, year_built: e.target.value })}
              placeholder="1402"
            />
          </div>

          <div>
            <Label htmlFor="floor_number">طبقه</Label>
            <Input
              id="floor_number"
              type="number"
              value={formData.floor_number}
              onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
              placeholder="5"
            />
          </div>

          <div>
            <Label htmlFor="total_floors">تعداد طبقات</Label>
            <Input
              id="total_floors"
              type="number"
              value={formData.total_floors}
              onChange={(e) => setFormData({ ...formData, total_floors: e.target.value })}
              placeholder="10"
            />
          </div>

          <div>
            <Label htmlFor="parking_spaces">پارکینگ</Label>
            <Input
              id="parking_spaces"
              type="number"
              value={formData.parking_spaces}
              onChange={(e) => setFormData({ ...formData, parking_spaces: e.target.value })}
              placeholder="1"
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">امکانات</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: "has_elevator", label: "آسانسور" },
            { key: "has_storage", label: "انباری" },
            { key: "has_balcony", label: "بالکن" },
            { key: "has_pool", label: "استخر" },
            { key: "has_gym", label: "سالن ورزش" },
            { key: "has_security", label: "نگهبانی" },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <Checkbox
                id={item.key}
                checked={formData[item.key as keyof typeof formData] as boolean}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, [item.key]: checked })
                }
              />
              <Label htmlFor={item.key} className="cursor-pointer">
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">قیمت</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">قیمت کل (تومان)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="15000000000"
            />
          </div>

          <div>
            <Label htmlFor="price_per_meter">قیمت هر متر (تومان)</Label>
            <Input
              id="price_per_meter"
              type="number"
              value={formData.price_per_meter}
              onChange={(e) => setFormData({ ...formData, price_per_meter: e.target.value })}
              placeholder="100000000"
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">تصاویر</h3>
        
        <div className="mb-4">
          <Label 
            htmlFor="images" 
            className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors"
          >
            {uploadingImages ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
            <span>{uploadingImages ? "در حال آپلود..." : "انتخاب تصاویر"}</span>
          </Label>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploadingImages}
          />
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`تصویر ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 left-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    تصویر اصلی
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="is_featured"
            checked={formData.is_featured}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, is_featured: checked as boolean })
            }
          />
          <Label htmlFor="is_featured" className="cursor-pointer">
            نمایش در صفحه اصلی (ویژه)
          </Label>
        </div>
      </div>

      <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin ml-2" />
            در حال ثبت...
          </>
        ) : (
          "ثبت فایل"
        )}
      </Button>
    </form>
  );
};

export default PropertyForm;
