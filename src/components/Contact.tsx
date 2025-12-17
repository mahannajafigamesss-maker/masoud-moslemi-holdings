import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "تلفن تماس",
      value: "۰۲۱-۸۸۸۸۸۸۸۸",
      subValue: "۰۹۱۲-۱۲۳۴۵۶۷",
    },
    {
      icon: Mail,
      title: "ایمیل",
      value: "info@moslemi.ir",
      subValue: "sales@moslemi.ir",
    },
    {
      icon: MapPin,
      title: "آدرس دفتر مرکزی",
      value: "تهران، ونک، خیابان ملاصدرا",
      subValue: "پلاک ۱۲۳، طبقه ۵",
    },
    {
      icon: Clock,
      title: "ساعات کاری",
      value: "شنبه تا چهارشنبه: ۹ تا ۱۸",
      subValue: "پنجشنبه: ۹ تا ۱۳",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "پیام شما ارسال شد",
      description: "کارشناسان ما به زودی با شما تماس خواهند گرفت.",
    });
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <span className="text-primary font-medium text-sm">تماس با ما</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              منتظر تماس شما هستیم
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              برای دریافت مشاوره رایگان، استعلام قیمت یا هرگونه سوال درباره 
              خدمات و پروژه‌های ما، می‌توانید از طریق راه‌های زیر با ما 
              در ارتباط باشید.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div 
                  key={index} 
                  className="bg-background p-6 rounded-xl border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{info.title}</h3>
                  <p className="text-muted-foreground text-sm">{info.value}</p>
                  <p className="text-muted-foreground text-sm">{info.subValue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-background p-8 rounded-2xl border border-border shadow-lg">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              فرم درخواست مشاوره
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    نام و نام خانوادگی
                  </label>
                  <Input
                    placeholder="نام خود را وارد کنید"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    شماره تماس
                  </label>
                  <Input
                    placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="bg-secondary/50 border-border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  ایمیل (اختیاری)
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-secondary/50 border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  پیام شما
                </label>
                <Textarea
                  placeholder="توضیحات درخواست خود را بنویسید..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="bg-secondary/50 border-border resize-none"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-primary hover:bg-olive text-primary-foreground gap-2"
              >
                ارسال پیام
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
