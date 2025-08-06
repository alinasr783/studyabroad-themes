import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Star, Users, Globe, Award, CheckCircle, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import heroImage from "@/assets/harvard-university.jpg";
import { articlesApi, countriesApi, universitiesApi, programsApi, consultationsApi, contactMessagesApi, testimonialsApi } from "@/lib/api";

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
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Study abroad background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay with dynamic gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: siteSettings 
              ? `linear-gradient(135deg, ${siteSettings.primary_color_1}CC 0%, ${siteSettings.primary_color_2}DD 50%, ${siteSettings.primary_color_3}CC 100%)`
              : 'linear-gradient(135deg, #1e40afCC 0%, #3b82f6DD 50%, #1e3a8aCC 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Text Content */}
            <div className="text-white space-y-8 animate-fade-in">
              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  حقق حلمك في
                  <span className="block mt-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    الدراسة بالخارج
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">
                  نساعدك في الوصول لأفضل الجامعات العالمية مع خدمة استشارية متكاملة
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg px-8 py-6 font-bold border-0"
                >
                  ابدأ رحلتك الآن
                  <ArrowRight className="mr-2 h-6 w-6" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm transform hover:scale-105 transition-all duration-300 text-lg px-8 py-6 font-bold bg-white/10"
                >
                  <Phone className="ml-2 h-6 w-6" />
                  تواصل معنا مجاناً
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/20">
                <div className="text-white/90">5000+ طالب</div>
                <div className="text-white/70">|</div>
                <div className="text-white/90">15 عام خبرة</div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="grid grid-cols-2 gap-6">
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
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300 shadow-xl"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                      <div className="text-white/90 font-medium text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer group">
        <div className="flex flex-col items-center">
          <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center group-hover:border-white transition-colors">
            <div className="w-1 h-4 bg-white/60 rounded-full mt-2 animate-pulse group-hover:bg-white" />
          </div>
          <ArrowDown className="w-5 h-5 text-white/60 mt-2 group-hover:text-white transition-colors" />
          <p className="text-white/60 text-xs mt-1 font-medium group-hover:text-white transition-colors">اكتشف المزيد</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;