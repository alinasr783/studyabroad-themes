import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { articlesApi, countriesApi, universitiesApi, programsApi, consultationsApi, contactMessagesApi, testimonialsApi } from "@/lib/api";
import { MapPin, DollarSign, Globe, Clock, Users, Building2, GraduationCap, Star } from "lucide-react";

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
}

const CountryDetail = () => {
  const { slug } = useParams();
  const [country, setCountry] = useState<Country | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchCountryData();
    }
  }, [slug]);

  const fetchCountryData = async () => {
    try {
      setLoading(true);
      
      // Fetch country details
      const { data: countryData } = await supabase
        .from('countries')
        .select('*')
        .eq('slug', slug)
        .single();

      if (countryData) {
        setCountry(countryData);
        
        // Fetch universities in this country
        const { data: universitiesData } = await supabase
          .from('universities')
          .select('*')
          .eq('country_id', countryData.id)
          .order('world_ranking', { ascending: true });
        
        setUniversities(universitiesData || []);
      }
    } catch (error) {
      console.error("Error fetching country data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          {country.image_url ? (
            <img 
              src={country.image_url} 
              alt={country.name_ar}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
          )}
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl text-white">
                <div className="flex items-center gap-4 mb-4">
                  {country.flag_url && (
                    <img 
                      src={country.flag_url} 
                      alt={`علم ${country.name_ar}`}
                      className="w-16 h-12 rounded object-cover shadow-lg"
                    />
                  )}
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold">{country.name_ar}</h1>
                    <p className="text-xl text-white/90">{country.name_en}</p>
                  </div>
                </div>
                
                {country.is_trending && (
                  <Badge className="bg-accent text-accent-foreground text-base px-4 py-2">
                    وجهة رائجة للدراسة
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Country */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    نبذة عن {country.name_ar}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {country.description_ar || "معلومات تفصيلية عن هذه الدولة غير متوفرة حالياً."}
                  </p>
                </CardContent>
              </Card>

              {/* Universities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    أفضل الجامعات في {country.name_ar}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {universities.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {universities.map((university) => (
                        <Card key={university.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                {university.logo_url && (
                                  <img 
                                    src={university.logo_url} 
                                    alt={university.name_ar}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <h3 className="font-bold">{university.name_ar}</h3>
                                  <p className="text-sm text-muted-foreground">{university.city}</p>
                                </div>
                              </div>
                              {university.is_featured && (
                                <Badge variant="secondary">مميزة</Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {university.world_ranking && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Star className="w-4 h-4 text-primary" />
                                  <span>الترتيب العالمي: #{university.world_ranking}</span>
                                </div>
                              )}
                              {university.tuition_fee_min && (
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="w-4 h-4 text-primary" />
                                  <span>الرسوم: ${university.tuition_fee_min?.toLocaleString()}+</span>
                                </div>
                              )}
                            </div>
                            <Button className="w-full mt-4" asChild>
                              <a href={`/universities/${university.slug}`}>
                                تفاصيل الجامعة
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">لم يتم إضافة جامعات لهذه الدولة بعد</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Facts */}
              <Card>
                <CardHeader>
                  <CardTitle>معلومات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {country.language && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">اللغة</p>
                        <p className="text-sm text-muted-foreground">{country.language}</p>
                      </div>
                    </div>
                  )}
                  
                  {country.currency && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">العملة</p>
                        <p className="text-sm text-muted-foreground">{country.currency}</p>
                      </div>
                    </div>
                  )}
                  
                  {country.climate && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">المناخ</p>
                        <p className="text-sm text-muted-foreground">{country.climate}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Study Costs */}
              {(country.study_cost_min || country.living_cost_min) && (
                <Card>
                  <CardHeader>
                    <CardTitle>التكاليف المتوقعة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {country.study_cost_min && (
                      <div>
                        <p className="font-semibold mb-1">تكلفة الدراسة السنوية</p>
                        <p className="text-2xl font-bold text-primary">
                          ${country.study_cost_min?.toLocaleString()}
                          {country.study_cost_max && ` - $${country.study_cost_max?.toLocaleString()}`}
                        </p>
                      </div>
                    )}
                    
                    {country.living_cost_min && (
                      <div>
                        <p className="font-semibold mb-1">تكلفة المعيشة السنوية</p>
                        <p className="text-2xl font-bold text-secondary">
                          ${country.living_cost_min?.toLocaleString()}
                          {country.living_cost_max && ` - $${country.living_cost_max?.toLocaleString()}`}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Popular Cities */}
              {country.popular_cities && country.popular_cities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>المدن الشعبية للدراسة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {country.popular_cities.map((city, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          <MapPin className="w-3 h-3 mr-1" />
                          {city}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Visa Requirements */}
              {country.visa_requirements_ar && (
                <Card>
                  <CardHeader>
                    <CardTitle>متطلبات التأشيرة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{country.visa_requirements_ar}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CountryDetail;