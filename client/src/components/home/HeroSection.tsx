import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Globe, Award, Users, CheckCircle, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import heroImage from "@/assets/harvard-university.jpg";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  site_name_ar: string;
  site_name_en: string;
  primary_color_1: string;
  primary_color_2: string;
  primary_color_3: string;
}

const HeroSection = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .maybeSingle();

      if (data) {
        setSiteSettings(data);
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
    }
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden" dir="rtl">
      {/* الخلفية مع التدرج اللوني */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="خلفية الدراسة بالخارج"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        {/* طبقة التدرج اللوني */}
        <div 
          className="absolute inset-0"
          style={{
            background: siteSettings 
              ? `linear-gradient(135deg, ${siteSettings.primary_color_1}CC 10%, ${siteSettings.primary_color_2}DD 60%, ${siteSettings.primary_color_3}99 100%)`
              : 'linear-gradient(135deg, #1e40afCC 10%, #3b82f6DD 60%, #1e3a8a99 100%)'
          }}
        />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 w-full px-4 py-16 md:py-20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">

            {/* الجزء النصي - الجانب الأيمن */}
            <div className="text-white space-y-6 md:space-y-8 w-full lg:w-1/2 text-right">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    الدراسة بالخارج
                  </span>
                  حقق حلمك في
                </h1>

                <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-xl">
                  نساعدك في الوصول لأفضل الجامعات العالمية مع خدمة استشارية متكاملة
                </p>
              </div>

              {/* أزرار الحث على الإجراء */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 md:pt-4 justify-end">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-base md:text-lg px-6 py-5 md:px-8 md:py-6 font-bold border-0"
                >
                  <ArrowLeft className="ml-2 h-5 w-5 md:h-6 md:w-6" />
                  ابدأ رحلتك الآن
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-200 text-base md:text-lg px-6 py-5 md:px-8 md:py-6 font-bold bg-white/10"
                >
                  <Phone className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                  تواصل معنا
                </Button>
              </div>

              {/* مؤشرات الثقة */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-4 md:pt-6 border-t border-white/20 text-sm md:text-base justify-end">
                <span className="flex items-center gap-1">
                  <span>5000+ طالب</span>
                  <Users className="w-4 h-4" />
                </span>
                <span className="flex items-center gap-1">
                  <span>15 عام خبرة</span>
                  <Award className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* إحصائيات - الجانب الأيسر */}
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {[
                  { icon: Globe, number: "50+", label: "دولة حول العالم", color: "from-blue-400 to-cyan-400" },
                  { icon: Award, number: "500+", label: "جامعة مرموقة", color: "from-purple-400 to-pink-400" },
                  { icon: Users, number: "5000+", label: "طالب سعيد", color: "from-green-400 to-emerald-400" },
                  { icon: CheckCircle, number: "15+", label: "عام من الخبرة", color: "from-orange-400 to-red-400" }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={index} 
                      className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 text-center hover:scale-[1.03] transition-all duration-200 shadow-md"
                    >
                      <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-md`}>
                        <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">{stat.number}</div>
                      <div className="text-white/90 font-medium text-xs md:text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* مؤشر التمرير */}
      {/* <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer">
        <div className="flex flex-col items-center">
          <ArrowUp className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
          <p className="text-white/70 text-xs mt-1 hover:text-white transition-colors">اكتشف المزيد</p>
        </div>
      </div> */}
    </section>
  );
};

export default HeroSection;