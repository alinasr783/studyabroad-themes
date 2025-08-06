import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Globe, Users, Building2, GraduationCap, Star, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// أنواع البيانات
interface Country {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  flag_url?: string;
  description_ar?: string;
  capital?: string;
  is_featured?: boolean;
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
  website_url?: string;
  world_ranking?: number;
  tuition_fee_min?: number;
  tuition_fee_max?: number;
  student_count?: number;
  acceptance_rate?: number;
  international_students_percentage?: number;
  language_requirements?: string;
  is_featured?: boolean;
  country_id?: string;
  countries?: Country;
}

const UniversitiesPage = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    fetchCountries();
    fetchUniversities();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name_ar', { ascending: true });

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('universities')
        .select('*, countries(*)')
        .order('name_ar', { ascending: true });

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = selectedCountry
    ? universities.filter(u => u.country_id === selectedCountry)
    : universities;

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
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[40vh] min-h-[300px] overflow-hidden bg-gradient-to-br from-primary to-secondary">
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">أفضل الجامعات حول العالم</h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                اكتشف الجامعات الرائدة في مختلف التخصصات والمجالات الدراسية
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Featured Countries */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-right">تصفح حسب الدولة</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {countries.map((country) => (
                <Button
                  key={country.id}
                  variant={selectedCountry === country.id ? "default" : "outline"}
                  className="h-24 flex flex-col gap-2"
                  onClick={() => setSelectedCountry(selectedCountry === country.id ? null : country.id)}
                >
                  {country.flag_url && (
                    <img 
                      src={country.flag_url} 
                      alt={country.name_ar}
                      className="w-10 h-8 object-cover rounded"
                    />
                  )}
                  <span>{country.name_ar}</span>
                </Button>
              ))}
            </div>
          </section>

          {/* Universities List */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-right">
                {selectedCountry 
                  ? `جامعات ${countries.find(c => c.id === selectedCountry)?.name_ar || ''}` 
                  : "أهم الجامعات العالمية"}
              </h2>
              {selectedCountry && (
                <Button variant="ghost" onClick={() => setSelectedCountry(null)}>
                  عرض كل الجامعات
                </Button>
              )}
            </div>

            {filteredUniversities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUniversities.map((university) => (
                  <Card key={university.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        {university.logo_url && (
                          <img 
                            src={university.logo_url} 
                            alt={university.name_ar}
                            className="w-16 h-16 rounded-lg bg-white p-2 shadow-sm border"
                          />
                        )}
                        <div>
                          <CardTitle className="text-lg">{university.name_ar}</CardTitle>
                          <p className="text-sm text-muted-foreground">{university.name_en}</p>
                          {university.city && university.countries && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {university.city}, {university.countries.name_ar}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {university.is_featured && (
                          <Badge className="bg-accent text-accent-foreground">
                            مميزة
                          </Badge>
                        )}
                        {university.world_ranking && (
                          <Badge variant="secondary">
                            الترتيب العالمي: #{university.world_ranking}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {university.tuition_fee_min && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span>الرسوم: ${university.tuition_fee_min?.toLocaleString()}</span>
                          </div>
                        )}
                        {university.student_count && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-primary" />
                            <span>الطلاب: {university.student_count?.toLocaleString()}</span>
                          </div>
                        )}
                        {university.acceptance_rate && (
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            <span>القبول: {university.acceptance_rate}%</span>
                          </div>
                        )}
                        {university.international_students_percentage && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="w-4 h-4 text-primary" />
                            <span>الدوليون: {university.international_students_percentage}%</span>
                          </div>
                        )}
                      </div>

                      <Button className="w-full" asChild>
                        <a href={`/universities/${university.slug}`}>
                          عرض التفاصيل
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">لا توجد جامعات متاحة</h3>
                <p className="text-muted-foreground">
                  {selectedCountry 
                    ? "لم يتم إضافة جامعات لهذه الدولة بعد"
                    : "لا توجد جامعات مسجلة في قاعدة البيانات"}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default UniversitiesPage;