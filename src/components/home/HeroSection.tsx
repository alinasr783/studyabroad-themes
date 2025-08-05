import { Button } from "@/components/ui/button";
import { Search, Globe, GraduationCap, Users, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary">رحلتك</span> التعليمية تبدأ{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  من هنا
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                اكتشف أفضل الجامعات والبرامج الدراسية حول العالم. نحن نساعدك في العثور على 
                فرصتك المثالية للدراسة في الخارج وتحقيق أحلامك الأكاديمية.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">جامعة معتمدة</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-secondary">50+</div>
                <div className="text-sm text-muted-foreground">دولة متاحة</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">طالب نجح</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300"
              >
                ابدأ رحلتك الآن
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                استشارة مجانية
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 rtl:space-x-reverse text-sm text-muted-foreground">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span>معتمد رسمياً</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Users className="h-4 w-4 text-primary" />
                <span>فريق خبراء</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Globe className="h-4 w-4 text-primary" />
                <span>تغطية عالمية</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Students studying abroad"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 border">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">جامعات مرموقة</div>
                  <div className="text-xs text-muted-foreground">تصنيف عالمي</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 border">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Search className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">بحث ذكي</div>
                  <div className="text-xs text-muted-foreground">نتائج مخصصة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;