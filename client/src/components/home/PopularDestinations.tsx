import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface Country {
  id: string;
  name_ar: string;
  flag_url: string;
  description_ar: string;
  image_url: string;
  is_featured: boolean;
  is_trending: boolean;
  slug: string;
}

interface SiteSettings {
  primary_color_1?: string;
  primary_color_2?: string;
  primary_color_3?: string;
}

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // الحصول على client_id بناءً على النطاق
  const { data: clientData } = useQuery({
    queryKey: ['clientInfo'],
    queryFn: async () => {
      const domain = window.location.hostname;
      const { data, error } = await supabase
        .from('clients')
        .select('id')
        .eq('domain', domain)
        .single();

      if (error) throw error;
      return data;
    }
  });

  // جلب إعدادات الموقع من Supabase بناءً على client_id
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['siteSettings', clientData?.id],
    queryFn: async () => {
      if (!clientData?.id) return null;

      const { data, error } = await supabase
        .from('site_settings')
        .select('primary_color_1, primary_color_2, primary_color_3')
        .eq('client_id', clientData.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!clientData?.id
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
    const fetchPopularDestinations = async () => {
      try {
        // التحقق من وجود client_id قبل جلب البيانات
        if (!clientData?.id) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('countries')
          .select(`
            id,
            name_ar,
            flag_url,
            description_ar,
            image_url,
            is_featured,
            is_trending,
            slug
          `)
          .eq('is_featured', true)
          .eq('client_id', clientData.id) // إضافة شرط client_id
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        if (data) {
          setDestinations(data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء جلب بيانات الدول",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPopularDestinations();
  }, [toast, clientData?.id]); // إضافة clientData.id إلى dependencies

  // إنشاء ستايل ديناميكي للألوان
  const getButtonStyle = () => {
    if (!siteSettings) return {};

    return {
      background: `linear-gradient(to right, ${siteSettings.primary_color_1 || '#3b82f6'}, ${siteSettings.primary_color_2 || '#6366f1'})`,
      color: 'white',
      borderColor: siteSettings.primary_color_1 || '#3b82f6'
    };
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-cairo mb-4 text-gray-800">
              أشهر الوجهات الدراسية
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              جاري تحميل البيانات...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (destinations.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-cairo mb-4 text-gray-800">
              أشهر الوجهات الدراسية
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              لا توجد وجهات متاحة حالياً
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-cairo mb-4 text-gray-800">
            أشهر الوجهات الدراسية
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف أفضل الوجهات للدراسة في الخارج والتي يختارها الطلاب العرب
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div 
              key={destination.id}
              className="relative group transition-all duration-300 hover:-translate-y-2"
            >
              <Card className="h-full overflow-hidden shadow-sm hover:shadow-md border-gray-200">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Image with overlay */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={destination.image_url || "https://via.placeholder.com/400x300"} 
                      alt={destination.name_ar}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {destination.is_featured && (
                      <div 
                        className="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1"
                        style={{
                          backgroundColor: siteSettings?.primary_color_1 || '#3b82f6'
                        }}
                      >
                        مميزة
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      {destination.flag_url && (
                        <img 
                          src={destination.flag_url} 
                          alt={`علم ${destination.name_ar}`}
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <h3 className="text-xl font-bold font-cairo text-gray-800">
                        {destination.name_ar}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
                      {destination.description_ar || "لا يوجد وصف متوفر"}
                    </p>

                    <Button 
                      asChild
                      variant="link"
                      className="w-full mt-auto px-0 font-semibold"
                      style={{
                        color: siteSettings?.primary_color_1 || '#3b82f6',
                        '&:hover': {
                          color: siteSettings?.primary_color_2 || '#6366f1'
                        }
                      }}
                    >
                      <Link to={`/countries/${destination.slug}`} className="flex items-center justify-end">
                        اعرف المزيد
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            asChild 
            variant="outline" 
            className="font-semibold"
            style={{
              borderColor: siteSettings?.primary_color_1 || '#3b82f6',
              color: siteSettings?.primary_color_1 || '#3b82f6',
              '&:hover': {
                backgroundColor: `${siteSettings?.primary_color_1 || '#3b82f6'}20`
              }
            }}
          >
            <Link to="/countries">
              استعرض جميع الوجهات
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;