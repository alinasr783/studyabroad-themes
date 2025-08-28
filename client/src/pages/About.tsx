import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ContactInfo {
  phone_numbers: string[];
}

interface SiteSettings {
  primary_color_1: string;
  primary_color_2: string;
  primary_color_3: string;
}

// البيانات الافتراضية في حالة عدم توفر بيانات من قاعدة البيانات
const defaultAboutData = {
  hero: {
    title: "لماذا تختارنا؟",
    description: "نقدم خدمات استشارية متكاملة لتوجيه الطلاب نحو أفضل الجامعات العالمية. بشراكاتنا الواسعة مع أكثر من 250 جامعة حول العالم، نضمن لك تحقيق أحلامك الأكاديمية."
  },
  companyInfo: {
    title: "من نحن؟",
    description1: " NST Travel هي وكالة رائدة في الاستشارات التعليمية. نختصر لك الطريق نحو أفضل الجامعات العالمية بشراكاتنا المعتمدة وخبراتنا المتراكمة.",
    description2: "منذ تأسيسنا، ساعدنا آلاف الطلاب في تحقيق طموحاتهم الأكاديمية عبر متابعة شخصية تبدأ من التقديم حتى التخرج.",
    stats: [
      { value: "10,000+", label: "طلاب نجحوا" },
      { value: "250+", label: "جامعة شريكة" }
    ],
    imageUrl: "https://d2pi0n2fm836iz.cloudfront.net/488796/05102023153512645bb9b085666.png"
  },
  services: {
    title: "خدماتنا المميزة",
    subtitle: "حلول متكاملة لرحلة أكاديمية ناجحة",
    items: [
      {
        title: "استشارة أكاديمية مجانية",
        description: "تقييم شامل لمؤهلاتك واختيار أفضل التخصصات والجامعات المناسبة",
        icon: "🎓"
      },
      {
        title: "تقديم طلبات القبول",
        description: "إعداد كامل للمستندات المطلوبة وتقديمها للجامعات المعتمدة",
        icon: "📄"
      },
      {
        title: "مساعدة في تأشيرة الدراسة",
        description: "توجيهك خطوة بخطوة في إجراءات الحصول على الفيزا الدراسية",
        icon: "✈️"
      },
      {
        title: "حجز السكن الطلابي",
        description: "ترتيب خيارات سكن مناسبة قريبة من جامعتك",
        icon: "🏠"
      },
      {
        title: "متابعة أكاديمية شخصية",
        description: "دعم مستمر طوال فترة دراستك حتى التخرج",
        icon: "👥"
      },
      {
        title: "خدمات ما بعد الوصول",
        description: "مساعدتك في التأقلم بعد وصولك إلى بلد الدراسة",
        icon: "🌟"
      }
    ]
  },
  team: {
    title: "فريق خبرائنا",
    subtitle: "مستشارون تعليميون بخبرات دولية واسعة",
    members: [
      {
        name: "م. باسل محمد",
        position: "المدير التنفيذي",
        bio: "خبرة 15 عامًا في التعليم الدولي، ساعد آلاف الطلاب في الالتحاق بأفضل الجامعات العالمية.",
        emoji: "👨‍💼"
      },
      {
        name: "د.روان احمد",
        position: "مستشار أكاديمي",
        bio: "متخصص في المنح الدراسية والتمويل الأكاديمي، حاصل على شهادات دولية في الإرشاد التعليمي.",
        emoji: "👨‍🎓"
      },
      {
        name: "د. ملك احمد",
        position: "خبيرة فيزا",
        bio: "خبيرة في إجراءات التأشيرات الدراسية للدول الأوروبية والأمريكية.",
        emoji: "👩‍⚖️"
      }
    ]
  },
  contactCTA: {
    title: "هل أنت مستعد للبدء؟",
    subtitle: "تواصل معنا اليوم واحصل على استشارة مجانية",
    buttonText: "اتصل بنا الآن"
  }
};

const About = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const aboutData = defaultAboutData;

  // جلب معرف العميل أولاً
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const domain = window.location.hostname;
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("id")
          .eq("domain", domain)
          .maybeSingle();

        if (clientError) throw clientError;
        if (!clientData) throw new Error("لم يتم العثور على عميل لهذا الدومين");

        setClientId(clientData.id);
      } catch (err) {
        console.error("Error fetching client ID:", err);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء تحميل البيانات الأساسية. يرجى المحاولة لاحقاً.",
          variant: "destructive"
        });
      }
    };

    fetchClientId();
  }, [toast]);

  // جلب إعدادات الموقع من Supabase بناءً على clientId
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['siteSettings', clientId],
    queryFn: async () => {
      if (!clientId) return null;

      const { data, error } = await supabase
        .from('site_settings')
        .select('primary_color_1, primary_color_2, primary_color_3')
        .eq('client_id', clientId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!clientId
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      if (!clientId) return;

      try {
        const { data, error } = await supabase
          .from('contact_info')
          .select('phone_numbers')
          .eq('client_id', clientId)
          .single();

        if (error) throw error;
        if (data) setContactInfo(data);
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchContactInfo();
  }, [clientId]);

  const handleContactClick = () => {
    if (contactInfo?.phone_numbers?.length) {
      const phoneNumber = contactInfo.phone_numbers[0].replace(/[^0-9+]/g, '');
      window.open(`tel:${phoneNumber}`, '_blank');
    } else {
      toast({
        title: "لا يوجد رقم هاتف متاح",
        description: "الرجاء المحاولة لاحقاً أو زيارة صفحة الاتصال",
        variant: "destructive"
      });
      navigate('/contact');
    }
  };

  // الحصول على الألوان أو استخدام القيم الافتراضية
  const primaryColor = siteSettings?.primary_color_1 || 'var(--primary)';
  const secondaryColor = siteSettings?.primary_color_2 || 'var(--secondary)';
  const accentColor = siteSettings?.primary_color_3 || 'var(--accent)';

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="py-12 md:py-20 text-white relative overflow-hidden text-right px-4"
        style={{
          background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <div className="container mx-auto relative">
          <div className="text-right max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-cairo mb-4 md:mb-6 leading-tight">
              {aboutData.hero.title}
            </h1>
            <p className="text-base md:text-lg leading-relaxed opacity-90" style={{ color: `${primaryColor}90` }}>
              {aboutData.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-12 md:py-16 text-right px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2 space-y-6 animate-fade-in-left">
              <h2 className="text-2xl md:text-3xl font-bold font-cairo text-gray-800">
                {aboutData.companyInfo.title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {aboutData.companyInfo.description1}
              </p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {aboutData.companyInfo.description2}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aboutData.companyInfo.stats.map((stat, index) => (
                  <Card 
                    key={index} 
                    className="hover:scale-[1.02] transition-transform duration-300 text-center"
                  >
                    <CardContent className="p-4 md:p-6">
                      <div 
                        className="text-2xl md:text-3xl font-bold mb-2"
                        style={{ color: primaryColor }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative animate-fade-in-right">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img 
                  src={aboutData.companyInfo.imageUrl} 
                  alt="من نحن"
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  width={600}
                  height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-12 md:py-16 bg-gray-50 text-right px-4">
        <div className="container mx-auto">
          <div className="text-right mb-8 md:mb-12 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-bold font-cairo mb-2 md:mb-4 text-gray-800">
              {aboutData.services.title}
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mr-auto">
              {aboutData.services.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {aboutData.services.items.map((service, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 text-right"
              >
                <CardContent className="p-4 md:p-6">
                  <div 
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 mr-auto"
                    style={{
                      backgroundColor: `${primaryColor}10`
                    }}
                  >
                    <span className="text-2xl md:text-3xl">{service.icon}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold font-cairo mb-2 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 md:py-16 bg-white text-right px-4">
        <div className="container mx-auto">
          <div className="text-right mb-8 md:mb-12 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-bold font-cairo mb-2 md:mb-4 text-gray-800">
              {aboutData.team.title}
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mr-auto">
              {aboutData.team.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData.team.members.map((member, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 animate-fade-in-up text-right"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 mr-auto"
                      style={{
                        backgroundColor: `${primaryColor}10`
                      }}
                    >
                      <span className="text-2xl md:text-3xl">{member.emoji}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold font-cairo mb-1 text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-gray-500 text-sm md:text-base mb-2">
                      {member.position}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
                      {member.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section 
        className="py-12 md:py-16 text-white relative overflow-hidden text-right px-4"
        style={{
          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <div className="container mx-auto relative">
          <div className="text-right max-w-3xl mx-auto animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-bold font-cairo mb-2 md:mb-4">
              {aboutData.contactCTA.title}
            </h2>
            <p className="text-sm md:text-base mb-4 md:mb-8 opacity-90" style={{ color: `${primaryColor}90` }}>
              {aboutData.contactCTA.subtitle}
            </p>
            <Button 
              size="lg"
              className="hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm md:text-base"
              style={{
                backgroundColor: accentColor,
                color: 'white'
              }}
              onClick={handleContactClick}
            >
              <div className="flex items-center justify-end">
                {aboutData.contactCTA.buttonText}
                <ArrowLeft className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </div>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;