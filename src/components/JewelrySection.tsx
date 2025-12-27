import { Gem, MapPin, Clock, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const JewelrySection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-amber-50/50 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-amber-100/50 rounded-full px-4 py-2 text-sm text-amber-800">
              <Gem className="w-4 h-4" />
              مجموعه طلا و جواهر
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              طلا فروشی
              <span className="text-amber-600 block mt-2">الیزه</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              مجموعه طلا و جواهر الیزه، زیرمجموعه هولدینگ مسعود مسلمی، با ارائه 
              جدیدترین و زیباترین طرح‌های طلا و جواهرات، همراه شما در لحظات خاص زندگی است.
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>تهران، بازار بزرگ</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>۱۰ صبح تا ۱۰ شب</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>۰۲۱-۵۵۵۵۵۵۵۵</span>
              </div>
            </div>

            <Link to="/jewelry">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white gap-2 mt-4">
                مشاهده گالری و اطلاعات بیشتر
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-200/40 to-amber-400/20 rounded-3xl rotate-2" />
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=500&fit=crop"
                alt="طلا و جواهر الیزه"
                className="relative rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-background p-4 rounded-xl shadow-lg border border-amber-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Gem className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">ضمانت اصالت</div>
                    <div className="text-xs text-muted-foreground">طلای ۱۸ عیار</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JewelrySection;
