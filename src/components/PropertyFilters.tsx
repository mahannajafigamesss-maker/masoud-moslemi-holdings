import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { PropertyFiltersType } from "@/pages/Properties";

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFiltersType>>;
}

const PropertyFilters = ({ filters, setFilters }: PropertyFiltersProps) => {
  const resetFilters = () => {
    setFilters({
      property_type: "all",
      listing_type: "all",
      city: "",
      min_area: "",
      max_area: "",
      min_price: "",
      max_price: "",
      bedrooms: "all",
    });
  };

  const hasActiveFilters = 
    filters.property_type !== "all" ||
    filters.listing_type !== "all" ||
    filters.city !== "" ||
    filters.min_area !== "" ||
    filters.max_area !== "" ||
    filters.min_price !== "" ||
    filters.max_price !== "" ||
    filters.bedrooms !== "all";

  return (
    <div className="bg-card rounded-2xl p-6 border border-border mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">فیلتر جستجو</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-2">
            <X className="w-4 h-4" />
            پاک کردن فیلترها
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label>نوع ملک</Label>
          <Select
            value={filters.property_type}
            onValueChange={(value) =>
              setFilters({ ...filters, property_type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="همه" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="apartment">آپارتمان</SelectItem>
              <SelectItem value="villa">ویلا</SelectItem>
              <SelectItem value="land">زمین</SelectItem>
              <SelectItem value="commercial">تجاری</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>نوع معامله</Label>
          <Select
            value={filters.listing_type}
            onValueChange={(value) =>
              setFilters({ ...filters, listing_type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="همه" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="sale">فروش</SelectItem>
              <SelectItem value="rent">اجاره</SelectItem>
              <SelectItem value="partnership">مشارکت در ساخت</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>شهر</Label>
          <Input
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            placeholder="مثال: تهران"
          />
        </div>

        <div>
          <Label>تعداد اتاق</Label>
          <Select
            value={filters.bedrooms}
            onValueChange={(value) =>
              setFilters({ ...filters, bedrooms: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="همه" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="1">۱ خواب</SelectItem>
              <SelectItem value="2">۲ خواب</SelectItem>
              <SelectItem value="3">۳ خواب</SelectItem>
              <SelectItem value="4">۴ خواب</SelectItem>
              <SelectItem value="5">۵+ خواب</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>حداقل متراژ</Label>
          <Input
            type="number"
            value={filters.min_area}
            onChange={(e) =>
              setFilters({ ...filters, min_area: e.target.value })
            }
            placeholder="متر مربع"
          />
        </div>

        <div>
          <Label>حداکثر متراژ</Label>
          <Input
            type="number"
            value={filters.max_area}
            onChange={(e) =>
              setFilters({ ...filters, max_area: e.target.value })
            }
            placeholder="متر مربع"
          />
        </div>

        <div>
          <Label>حداقل قیمت</Label>
          <Input
            type="number"
            value={filters.min_price}
            onChange={(e) =>
              setFilters({ ...filters, min_price: e.target.value })
            }
            placeholder="تومان"
          />
        </div>

        <div>
          <Label>حداکثر قیمت</Label>
          <Input
            type="number"
            value={filters.max_price}
            onChange={(e) =>
              setFilters({ ...filters, max_price: e.target.value })
            }
            placeholder="تومان"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
