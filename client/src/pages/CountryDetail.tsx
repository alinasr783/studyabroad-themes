import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Globe, Clock, Building2, Star, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Country {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar?: string;
  flag_url?: string;
  image_url?: string;
  language?: string;
  currency?: string;
  climate?: string;
  visa_requirements_ar?: string;
  popular_cities?: string[];
  study_cost_min?: number;
  study_cost_max?: number;
  living_cost_min?: number;
  living_cost_max?: number;
  is_trending?: boolean;
}

interface University {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar?: string;
  logo_url?: string;
  image_url?: string;
  city?: string;
  world_ranking?: number;
  tuition_fee_min?: number;
  tuition_fee_max?: number;
  is_featured?: boolean;
  country_id?: string;
}

interface SiteSettings {
  primary_color_1?: string;
  primary_color_2?: string;
  primary_color_3?: string;
}

const CountryDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<Country | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);

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
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!clientData?.id) return;

        // جلب بيانات الدولة
        const { data: countryData, error: countryError } = await supabase
          .from('countries')
          .select('*')
          .eq('slug', slug)
          .eq('client_id', clientData.id)
          .single();

        if (countryError) throw countryError;
        setCountry(countryData);

        // جلب الجامعات المرتبطة بهذه الدولة
        if (countryData?.id) {
          const { data: universitiesData, error: universitiesError } = await supabase
            .from('universities')
            .select('*')
            .eq('country_id', countryData.id)
            .eq('client_id', clientData.id)
            .order('world_ranking', { ascending: true });

          if (universitiesError) throw universitiesError;
          setUniversities(universitiesData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, clientData?.id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen">
          <Skeleton className="h-[60vh] w-full rounded-none" />
          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!country) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">الدولة غير موجودة</h1>
          <p className="text-muted-foreground">لم يتم العثور على المعلومات المطلوبة</p>
          <Button 
            asChild 
            className="mt-6"
            style={{
              backgroundColor: siteSettings?.primary_color_1 || '#3b82f6'
            }}
          >
            <Link to="/countries">
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة إلى قائمة الدول
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen" dir="rtl">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
          {country.image_url ? (
            <img 
              src={country.image_url} 
              alt={country.name_ar}
              className="w-full h-full object-cover"
              loading="eager"
            />
          ) : (
            <div 
              className="w-full h-full"
              style={{
                background: `linear-gradient(to right, ${siteSettings?.primary_color_1 || '#3b82f6'}, ${siteSettings?.primary_color_2 || '#6366f1'})`
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-end pb-16 md:items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl text-white">
                <div className="flex items-center gap-4 mb-4">
                  {country.flag_url && (
                    <img 
                      src={country.flag_url} 
                      alt={`علم ${country.name_ar}`}
                      className="w-16 h-12 rounded object-cover shadow-lg border border-white"
                    />
                  )}
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold">{country.name_ar}</h1>
                    <p className="text-xl text-white/90">{country.name_en}</p>
                  </div>
                </div>

                {country.is_trending && (
                  <Badge 
                    className="text-base px-4 py-2 hover:bg-opacity-90"
                    style={{
                      backgroundColor: siteSettings?.primary_color_1 || '#3b82f6',
                      color: 'white'
                    }}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    وجهة رائجة للدراسة
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 -mt-12 md:-mt-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Country */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Globe 
                      className="w-6 h-6"
                      style={{
                        color: siteSettings?.primary_color_1 || '#3b82f6'
                      }}
                    />
                    نبذة عن {country.name_ar}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-gray-700">
                    {country.description_ar || "لا يوجد وصف متوفر حاليًا لهذه الدولة."}
                  </p>
                </CardContent>
              </Card>

              {/* Universities */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Building2 
                      className="w-6 h-6"
                      style={{
                        color: siteSettings?.primary_color_1 || '#3b82f6'
                      }}
                    />
                    أفضل الجامعات في {country.name_ar}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {universities.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {universities.map((university) => (
                        <Card 
                          key={university.id} 
                          className="hover:shadow-xl transition-shadow"
                          style={{
                            borderColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}20` : 'rgba(59, 130, 246, 0.1)'
                          }}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                {university.logo_url ? (
                                  <img 
                                    src={university.logo_url} 
                                    alt={university.name_ar}
                                    className="w-12 h-12 rounded object-cover border"
                                  />
                                ) : (
                                  <div 
                                    className="w-12 h-12 rounded flex items-center justify-center"
                                    style={{
                                      backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}10` : 'rgba(59, 130, 246, 0.1)'
                                    }}
                                  >
                                    <Building2 
                                      className="w-6 h-6"
                                      style={{
                                        color: siteSettings?.primary_color_1 || '#3b82f6'
                                      }}
                                    />
                                  </div>
                                )}
                                <div>
                                  <h3 className="font-bold text-lg">{university.name_ar}</h3>
                                  <p className="text-sm text-muted-foreground">{university.city || "غير محدد"}</p>
                                </div>
                              </div>
                              {university.is_featured && (
                                <Badge 
                                  className="flex items-center"
                                  style={{
                                    backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}10` : 'rgba(59, 130, 246, 0.1)',
                                    color: siteSettings?.primary_color_1 || '#3b82f6'
                                  }}
                                >
                                  مميزة
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {university.world_ranking && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Star 
                                    className="w-4 h-4"
                                    style={{
                                      color: siteSettings?.primary_color_1 || '#3b82f6'
                                    }}
                                  />
                                  <span>الترتيب العالمي: <strong>#{university.world_ranking}</strong></span>
                                </div>
                              )}
                              {(university.tuition_fee_min || university.tuition_fee_max) && (
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign 
                                    className="w-4 h-4"
                                    style={{
                                      color: siteSettings?.primary_color_1 || '#3b82f6'
                                    }}
                                  />
                                  <span>الرسوم السنوية: 
                                    {university.tuition_fee_min && (
                                      <strong> ${university.tuition_fee_min.toLocaleString()}</strong>
                                    )}
                                    {university.tuition_fee_max && (
                                      ` - $${university.tuition_fee_max.toLocaleString()}`
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                            <Button 
                              className="w-full mt-4"
                              style={{
                                backgroundColor: siteSettings?.primary_color_1 || '#3b82f6',
                                '&:hover': {
                                  backgroundColor: siteSettings?.primary_color_2 || '#6366f1'
                                }
                              }}
                              onClick={() => navigate(`/universities/${university.slug}`)}
                            >
                              تفاصيل الجامعة
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">لم يتم إضافة جامعات لهذه الدولة بعد</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        style={{
                          borderColor: siteSettings?.primary_color_1 || '#3b82f6',
                          color: siteSettings?.primary_color_1 || '#3b82f6'
                        }}
                      >
                        اقترح جامعة
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Facts */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">معلومات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {country.language && (
                    <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}05` : 'rgba(59, 130, 246, 0.05)' }}>
                      <div 
                        className="p-2 rounded-full"
                        style={{
                          backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}10` : 'rgba(59, 130, 246, 0.1)'
                        }}
                      >
                        <Globe 
                          className="w-5 h-5"
                          style={{
                            color: siteSettings?.primary_color_1 || '#3b82f6'
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">اللغة الرسمية</p>
                        <p className="text-sm text-gray-600">{country.language}</p>
                      </div>
                    </div>
                  )}

                  {country.currency && (
                    <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}05` : 'rgba(59, 130, 246, 0.05)' }}>
                      <div 
                        className="p-2 rounded-full"
                        style={{
                          backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}10` : 'rgba(59, 130, 246, 0.1)'
                        }}
                      >
                        <DollarSign 
                          className="w-5 h-5"
                          style={{
                            color: siteSettings?.primary_color_1 || '#3b82f6'
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">العملة</p>
                        <p className="text-sm text-gray-600">{country.currency}</p>
                      </div>
                    </div>
                  )}

                  {country.climate && (
                    <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}05` : 'rgba(59, 130, 246, 0.05)' }}>
                      <div 
                        className="p-2 rounded-full"
                        style={{
                          backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}10` : 'rgba(59, 130, 246, 0.1)'
                        }}
                      >
                        <Clock 
                          className="w-5 h-5"
                          style={{
                            color: siteSettings?.primary_color_1 || '#3b82f6'
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">المناخ</p>
                        <p className="text-sm text-gray-600">{country.climate}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Study Costs */}
              {(country.study_cost_min || country.living_cost_min) && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">التكاليف الدراسية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {country.study_cost_min && (
                      <div 
                        className="p-4 rounded-lg"
                        style={{
                          backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}05` : 'rgba(59, 130, 246, 0.05)'
                        }}
                      >
                        <p className="font-semibold mb-1 text-gray-700">تكلفة الدراسة السنوية</p>
                        <p 
                          className="text-2xl font-bold"
                          style={{
                            color: siteSettings?.primary_color_1 || '#3b82f6'
                          }}
                        >
                          ${country.study_cost_min.toLocaleString()}
                          {country.study_cost_max && ` - $${country.study_cost_max.toLocaleString()}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">لبرامج البكالوريوس</p>
                      </div>
                    )}

                    {country.living_cost_min && (
                      <div 
                        className="p-4 rounded-lg"
                        style={{
                          backgroundColor: siteSettings?.primary_color_2 ? `${siteSettings.primary_color_2}05` : 'rgba(99, 102, 241, 0.05)'
                        }}
                      >
                        <p className="font-semibold mb-1 text-gray-700">تكلفة المعيشة السنوية</p>
                        <p 
                          className="text-2xl font-bold"
                          style={{
                            color: siteSettings?.primary_color_2 || '#6366f1'
                          }}
                        >
                          ${country.living_cost_min.toLocaleString()}
                          {country.living_cost_max && ` - $${country.living_cost_max.toLocaleString()}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">تشمل السكن والمعيشة</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Popular Cities */}
              {country.popular_cities && country.popular_cities.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">المدن الطلابية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {country.popular_cities.map((city, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-sm px-3 py-1"
                          style={{
                            borderColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}30` : 'rgba(59, 130, 246, 0.2)',
                            backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}05` : 'rgba(59, 130, 246, 0.05)'
                          }}
                        >
                          <MapPin 
                            className="w-3 h-3 mr-1"
                            style={{
                              color: siteSettings?.primary_color_1 || '#3b82f6'
                            }}
                          />
                          {city}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Visa Requirements */}
              {country.visa_requirements_ar && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">متطلبات التأشيرة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}05` : 'rgba(59, 130, 246, 0.05)'
                      }}
                    >
                      <p className="text-sm text-gray-700">{country.visa_requirements_ar}</p>
                    </div>
                    <Button 
                      className="w-full mt-4"
                      style={{
                        backgroundColor: siteSettings?.primary_color_1 || '#3b82f6',
                        '&:hover': {
                          backgroundColor: siteSettings?.primary_color_2 || '#6366f1'
                        }
                      }}
                      onClick={()=>navigate("/contact")}
                    >
                      استشارة تأشيرة مجانية
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Back Button */}
              <Button 
                variant="outline" 
                className="w-full" 
                asChild
                style={{
                  borderColor: siteSettings?.primary_color_1 || '#3b82f6',
                  color: siteSettings?.primary_color_1 || '#3b82f6'
                }}
              >
                <Link to="/countries">
                  <ArrowLeft 
                    className="w-4 h-4 mr-2"
                    style={{
                      color: siteSettings?.primary_color_1 || '#3b82f6'
                    }}
                  />
                  العودة إلى قائمة الدول
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CountryDetail;