import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Star, Users, Globe, Award } from "lucide-react";
import { useState, useEffect } from "react";
import globeStudents from "@/assets/globe-students.jpg";
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Dynamic Enhanced Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: siteSettings 
            ? `linear-gradient(135deg, ${siteSettings.primary_color_1} 0%, ${siteSettings.primary_color_2} 50%, ${siteSettings.primary_color_3} 100%)`
            : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%)'
        }}
      />
      
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.05)_50%,transparent_60%)] bg-[size:100px_100px]" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Enhanced Content */}
          <div className="space-y-8 text-white order-2 lg:order-1 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium">
              <Star className="w-4 h-4 ml-2 text-yellow-300" />
              الخيار الأول للدراسة بالخارج
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight font-cairo">
                حقق حلمك وانضم إلى الكلية التي{" "}
                <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                  لطالما رغبت بها
                </span>{" "}
                من خلال خدمتنا المتميزة
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/95 leading-relaxed font-medium">
                🎯 نحن هنا لنساعدك في كل خطوة على طريق تحقيق هدفك الأكاديمي
                <span className="block mt-2 text-lg text-white/80">
                  مع أفضل الخبراء والاستشاريين المتخصصين في التعليم الدولي
                </span>
              </p>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/20">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mx-auto mb-2">
                  <Globe className="w-6 h-6 text-yellow-300" />
                </div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-white/80 text-sm">دولة حول العالم</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mx-auto mb-2">
                  <Award className="w-6 h-6 text-yellow-300" />
                </div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-white/80 text-sm">جامعة مرموقة</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mx-auto mb-2">
                  <Users className="w-6 h-6 text-yellow-300" />
                </div>
                <div className="text-2xl font-bold">5000+</div>
                <div className="text-white/80 text-sm">طالب سعيد</div>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-2 border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg px-8 py-6 font-semibold"
              >
                🚀 اعرف أكثر
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-lg px-8 py-6 font-semibold"
              >
                <Phone className="ml-2 h-5 w-5" />
                📞 اتصل بنا الآن
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-300 fill-current" />
                <span>4.9/5 تقييم العملاء</span>
              </div>
              <div className="w-1 h-4 bg-white/30 rounded-full" />
              <div>⚡ استجابة خلال 24 ساعة</div>
              <div className="w-1 h-4 bg-white/30 rounded-full" />
              <div>🔒 آمن ومضمون 100%</div>
            </div>
          </div>

          {/* Enhanced Hero Image */}
          <div className="relative order-1 lg:order-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative flex items-center justify-center">
              {/* Floating background elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 -right-5 w-20 h-20 bg-red-400/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
              
              {/* Main globe container */}
              <div className="relative w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] group">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400/30 via-orange-400/20 to-red-400/30 animate-spin" style={{ animationDuration: '20s' }} />
                
                {/* Inner image container */}
                <div className="absolute inset-2 rounded-full overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={globeStudents} 
                    alt="Globe with international students"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Dynamic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 via-transparent to-blue-300/20" />
                  
                  {/* Floating badges */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-bold text-primary transform rotate-12">
                    ✅ موثق ومعتمد
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-bold text-primary transform -rotate-12">
                    🌟 خدمة متميزة
                  </div>
                  <div className="absolute top-1/2 right-0 bg-orange-500/90 text-white rounded-l-lg px-3 py-2 text-xs font-bold">
                    🏆 الأفضل في المنطقة
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer group">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center group-hover:border-white transition-colors">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse group-hover:bg-white" />
        </div>
        <p className="text-white/60 text-xs mt-2 font-medium text-center group-hover:text-white transition-colors">اكتشف المزيد</p>
      </div>
    </section>
  );
};

export default HeroSection;