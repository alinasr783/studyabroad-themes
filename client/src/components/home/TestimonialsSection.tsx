import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface Testimonial {
  id: number;
  name: string;
  university: string;
  country: string;
  flag_emoji: string;
  program: string;
  rating: number;
  content: string;
  year: string;
  is_active: boolean;
  is_featured: boolean;
}

interface SiteSettings {
  primary_color_1?: string;
  primary_color_2?: string;
  primary_color_3?: string;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // جلب إعدادات الموقع من Supabase
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('primary_color_1, primary_color_2, primary_color_3')
        .single();

      if (error) throw error;
      return data;
    }
  });

  // تطبيق ألوان الموقع الديناميكية
  useEffect(() => {
    if (siteSettings) {
      const root = document.documentElement;
      if (siteSettings.primary_color_1) {
        root.style.setProperty('--primary', siteSettings.primary_color_1);
      }
      if (siteSettings.primary_color_2) {
        root.style.setProperty('--primary-2', siteSettings.primary_color_2);
      }
      if (siteSettings.primary_color_3) {
        root.style.setProperty('--primary-3', siteSettings.primary_color_3);
      }
    }
  }, [siteSettings]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select(`
            id,
            name,
            university,
            country,
            flag_emoji,
            program,
            rating,
            content,
            year,
            is_active,
            is_featured
          `)
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;

        if (data) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء جلب آراء العملاء",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [toast]);

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              جاري تحميل آراء العملاء...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Quote 
              className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0" 
              style={{
                color: siteSettings?.primary_color_1 || '#3b82f6'
              }} 
            />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text">
              قصص <span 
                className="text-primary"
                style={{
                  color: siteSettings?.primary_color_1 || '#3b82f6'
                }}
              >
                النجاح
              </span>
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            اكتشف كيف ساعدنا آلاف الطلاب في تحقيق أحلامهم والدراسة في أفضل الجامعات حول العالم
          </p>
        </div>

        {/* بطاقات آراء العملاء */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-background rounded-xl overflow-hidden"
              style={{
                borderColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}30` : 'rgba(59, 130, 246, 0.2)',
                '&:hover': {
                  borderColor: siteSettings?.primary_color_1 || '#3b82f6'
                }
              }}
            >
              <CardContent className="p-5 sm:p-6">
                {/* أيقونة الاقتباس الخلفية */}
                <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Quote 
                    className="h-20 w-20" 
                    style={{
                      color: siteSettings?.primary_color_1 || '#3b82f6'
                    }} 
                  />
                </div>

                {/* التقييم */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`} 
                    />
                  ))}
                </div>

                {/* محتوى الرأي */}
                <blockquote className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5 relative z-10">
                  "{testimonial.content}"
                </blockquote>

                {/* معلومات الطالب */}
                <div className="border-t pt-4" style={{ borderColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}20` : 'rgba(59, 130, 246, 0.1)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-base">{testimonial.name}</h4>
                        <Badge 
                          variant="secondary" 
                          className="text-xs py-0.5"
                          style={{
                            backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}10` : 'rgba(59, 130, 246, 0.1)',
                            color: siteSettings?.primary_color_1 || '#3b82f6'
                          }}
                        >
                          {testimonial.year}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{testimonial.program}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <span className="text-base">{testimonial.flag_emoji}</span>
                        <span>{testimonial.university}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-12 md:mt-16 pt-12 border-t" style={{ borderColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}20` : 'rgba(59, 130, 246, 0.1)' }}>
          {[
            { value: "10,000+", label: "طالب نجح", color: "primary" },
            { value: "500+", label: "جامعة شريكة", color: "secondary" },
            { value: "50+", label: "دولة متاحة", color: "primary" },
            { value: "98%", label: "نسبة النجاح", color: "secondary" },
          ].map((stat, index) => (
            <div key={index} className="text-center space-y-1">
              <div 
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{
                  color: stat.color === 'primary' 
                    ? siteSettings?.primary_color_1 || '#3b82f6'
                    : siteSettings?.primary_color_2 || '#6366f1'
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;