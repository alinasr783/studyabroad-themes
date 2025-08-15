import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Country {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  flag_url?: string;
  description_ar?: string;
  description_en?: string;
  study_cost_min?: number;
  study_cost_max?: number;
  living_cost_min?: number;
  living_cost_max?: number;
  language?: string;
  climate?: string;
  currency?: string;
  visa_requirements_ar?: string;
  visa_requirements_en?: string;
  popular_cities?: string[];
  image_url?: string;
  is_featured?: boolean;
  is_trending?: boolean;
}

interface SiteSettings {
  primary_color_1?: string;
  primary_color_2?: string;
  primary_color_3?: string;
}

const CountriesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

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

  // جلب الدول من Supabase بناءً على client_id
  const fetchCountries = async () => {
    try {
      setLoading(true);
      if (!clientData?.id) return;

      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('client_id', clientData.id)
        .order('name_ar', { ascending: true });

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [clientData?.id]);

  const getCostLevel = (country: Country) => {
    if (!country.study_cost_min) return "غير محدد";
    if (country.study_cost_min < 5000) return "منخفضة";
    if (country.study_cost_min < 15000) return "متوسطة";
    return "مرتفعة";
  };

  const getContinent = (country: Country) => {
    if (['تركيا', 'قيرغيزستان', 'ماليزيا'].includes(country.name_ar)) return "asia";
    if (['روسيا', 'ألمانيا', 'المملكة المتحدة'].includes(country.name_ar)) return "europe";
    if (['كندا'].includes(country.name_ar)) return "america";
    if (['أستراليا'].includes(country.name_ar)) return "australia";
    return "other";
  };

  // إنشاء ستايل ديناميكي للألوان
  const getGradientStyle = () => {
    if (!siteSettings) return {};

    return {
      background: `linear-gradient(to right, ${siteSettings.primary_color_1 || '#3b82f6'}, ${siteSettings.primary_color_2 || '#6366f1'})`,
      backgroundImage: `linear-gradient(to right, ${siteSettings.primary_color_1 || '#3b82f6'}, ${siteSettings.primary_color_2 || '#6366f1'})`
    };
  };

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

  const filteredDestinations = activeTab === "all" 
    ? countries 
    : countries.filter(country => getContinent(country) === activeTab);

  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p>جاري تحميل البيانات...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Layout>
        <main className="flex-grow">
          {/* Hero Section مع التدرج اللوني الديناميكي */}
          <section className="py-12 md:py-16" style={getGradientStyle()}>
            <div className="container px-4 sm:px-6 lg:px-8 mx-auto text-white">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold font-cairo mb-4">
                  الوجهات الدراسية حول العالم
                </h1>
                <p className="text-white/90 max-w-2xl mx-auto mb-6">
                  اكتشف أفضل الدول للدراسة في الخارج حسب تخصصك وميزانيتك
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  <Button 
                    variant={activeTab === "all" ? "default" : "outline"} 
                    onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
                    className="rounded-full px-4"
                    style={activeTab === "all" ? {
                      backgroundColor: 'white',
                      color: siteSettings?.primary_color_1 || '#3b82f6'
                    } : {
                      backgroundColor: 'transparent',
                      color: 'white',
                      borderColor: 'white'
                    }}
                  >
                    جميع الدول
                  </Button>
                  <Button 
                    variant={activeTab === "asia" ? "default" : "outline"} 
                    onClick={() => { setActiveTab("asia"); setCurrentPage(1); }}
                    className="rounded-full px-4"
                    style={activeTab === "asia" ? {
                      backgroundColor: 'white',
                      color: siteSettings?.primary_color_1 || '#3b82f6'
                    } : {
                      backgroundColor: 'transparent',
                      color: 'white',
                      borderColor: 'white'
                    }}
                  >
                    آسيا
                  </Button>
                  <Button 
                    variant={activeTab === "europe" ? "default" : "outline"} 
                    onClick={() => { setActiveTab("europe"); setCurrentPage(1); }}
                    className="rounded-full px-4"
                    style={activeTab === "europe" ? {
                      backgroundColor: 'white',
                      color: siteSettings?.primary_color_1 || '#3b82f6'
                    } : {
                      backgroundColor: 'transparent',
                      color: 'white',
                      borderColor: 'white'
                    }}
                  >
                    أوروبا
                  </Button>
                  <Button 
                    variant={activeTab === "america" ? "default" : "outline"} 
                    onClick={() => { setActiveTab("america"); setCurrentPage(1); }}
                    className="rounded-full px-4"
                    style={activeTab === "america" ? {
                      backgroundColor: 'white',
                      color: siteSettings?.primary_color_1 || '#3b82f6'
                    } : {
                      backgroundColor: 'transparent',
                      color: 'white',
                      borderColor: 'white'
                    }}
                  >
                    أمريكا
                  </Button>
                  <Button 
                    variant={activeTab === "australia" ? "default" : "outline"} 
                    onClick={() => { setActiveTab("australia"); setCurrentPage(1); }}
                    className="rounded-full px-4"
                    style={activeTab === "australia" ? {
                      backgroundColor: 'white',
                      color: siteSettings?.primary_color_1 || '#3b82f6'
                    } : {
                      backgroundColor: 'transparent',
                      color: 'white',
                      borderColor: 'white'
                    }}
                  >
                    أستراليا
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-b from-gray-50 to-white">
            <div className="container px-4 sm:px-6 lg:px-8 mx-auto py-12">
              {/* بطاقات الدول */}
              {paginatedDestinations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedDestinations.map((country) => (
                    <div key={country.id} className="relative group">
                      <Card className="h-full overflow-hidden shadow-sm hover:shadow-md border-gray-200 transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-0 h-full flex flex-col">
                          {/* صورة العلم مع العلامة المميزة */}
                          <div className="relative h-48 overflow-hidden">
                            {country.image_url ? (
                              <img 
                                src={country.image_url} 
                                alt={`معالم ${country.name_ar}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">لا توجد صورة</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                            {country.is_featured && (
                              <div 
                                className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1"
                                style={{ backgroundColor: siteSettings?.primary_color_1 || '#3b82f6' }}
                              >
                                <Star className="h-3 w-3" />
                                <span>مميزة</span>
                              </div>
                            )}
                          </div>

                          {/* محتوى البطاقة */}
                          <div className="p-5 flex-grow">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {country.flag_url && (
                                  <img 
                                    src={country.flag_url} 
                                    alt={country.name_ar}
                                    className="w-8 h-6 object-cover rounded"
                                  />
                                )}
                                <h3 className="text-xl font-bold font-cairo text-gray-800">
                                  {country.name_ar}
                                </h3>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                getCostLevel(country) === "منخفضة" ? "bg-green-100 text-green-800" :
                                getCostLevel(country) === "متوسطة" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {getCostLevel(country)}
                              </span>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                              {country.description_ar || "لا يوجد وصف متوفر"}
                            </p>

                            {/* التخصصات الشائعة */}
                            <div className="mb-5">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">المدن الشائعة:</h4>
                              <div className="flex flex-wrap gap-2">
                                {country.popular_cities?.slice(0, 3).map((city, index) => (
                                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {city}
                                  </span>
                                )) || (
                                  <span className="text-xs text-gray-500">غير محدد</span>
                                )}
                              </div>
                            </div>

                            {/* زر التفاصيل */}
                            <Button 
                              asChild
                              className="w-full mt-auto text-white"
                              style={getGradientStyle()}
                            >
                              <Link to={`/countries/${country.slug}`} className="flex items-center justify-center gap-2">
                                <span>استكشف الدراسة في {country.name_ar}</span>
                                <ArrowLeft className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">لا توجد دول متاحة في هذا القسم حالياً</p>
                </div>
              )}

              {/* عناصر التنقل والتحكم */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="disabled:opacity-50"
                    style={{ borderColor: siteSettings?.primary_color_1 || '#3b82f6' }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="disabled:opacity-50"
                    style={{ borderColor: siteSettings?.primary_color_1 || '#3b82f6' }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    {totalPages > 0 ? `الصفحة ${currentPage} من ${totalPages}` : 'لا توجد صفحات'}
                  </span>
                </div>

                <Button 
                  asChild 
                  className="text-white font-semibold flex items-center gap-2"
                  style={getGradientStyle()}
                >
                  <Link to="/contact">
                    احصل على استشارة مجانية
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </div>
  );
};

export default CountriesPage;