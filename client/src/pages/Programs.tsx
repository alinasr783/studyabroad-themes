import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, BookOpen, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Program {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  degree_level: string;
  field_of_study: string;
  duration_years?: number;
  tuition_fee?: number;
  description_ar?: string;
  language?: string;
  is_featured?: boolean;
  university_id?: string;
}

interface University {
  id: string;
  name_ar: string;
  logo_url?: string;
  city?: string;
  country_id?: string;
}

interface Country {
  id: string;
  name_ar: string;
  flag_url?: string;
}

interface SiteSettings {
  primary_color_1?: string;
  primary_color_2?: string;
  primary_color_3?: string;
}

const ProgramsList = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

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
        setError("حدث خطأ أثناء تحميل البيانات. يرجى المحاولة لاحقاً.");
        setLoading(false);
      }
    };

    fetchClientId();
  }, []);

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

  const fetchData = async () => {
    if (!clientId) return;

    try {
      setLoading(true);

      // جلب البرامج الخاصة بالعميل
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (programsError) throw programsError;

      // جلب الجامعات الخاصة بالعميل
      const { data: universitiesData, error: universitiesError } = await supabase
        .from('universities')
        .select('*')
        .eq('client_id', clientId);

      if (universitiesError) throw universitiesError;

      // جلب الدول الخاصة بالعميل
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select('*')
        .eq('client_id', clientId);

      if (countriesError) throw countriesError;

      setPrograms(programsData || []);
      setUniversities(universitiesData || []);
      setCountries(countriesData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchData();
    }
  }, [clientId]);

  // دمج البيانات يدوياً
  const getMergedData = () => {
    return programs.map(program => {
      const university = universities.find(u => u.id === program.university_id);
      const country = university ? countries.find(c => c.id === university.country_id) : null;

      return {
        ...program,
        universities: university ? {
          ...university,
          countries: country
        } : undefined
      };
    });
  };

  const mergedPrograms = getMergedData();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div 
            className="animate-spin rounded-full h-32 w-32 border-b-2"
            style={{
              borderColor: siteSettings?.primary_color_1 || '#3b82f6'
            }}
          ></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div 
            className="border px-4 py-3 rounded relative" 
            style={{
              backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}10` : 'rgba(59, 130, 246, 0.1)',
              borderColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}30` : 'rgba(59, 130, 246, 0.2)',
              color: siteSettings?.primary_color_1 || '#3b82f6'
            }}
          >
            <strong className="font-bold">خطأ!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">البرامج الأكاديمية</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اكتشف البرامج الأكاديمية المتاحة في أفضل الجامعات العالمية واختر التخصص المناسب لك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mergedPrograms.map((program) => (
            <Card 
              key={program.id} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}20` : 'rgba(59, 130, 246, 0.1)',
                '&:hover': {
                  borderColor: siteSettings?.primary_color_1 || '#3b82f6'
                }
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  {program.universities?.logo_url && (
                    <img 
                      src={program.universities.logo_url} 
                      alt={program.universities.name_ar}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{
                          borderColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}30` : 'rgba(59, 130, 246, 0.2)',
                          color: siteSettings?.primary_color_1 || '#3b82f6'
                        }}
                      >
                        {program.degree_level}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{
                          borderColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}30` : 'rgba(59, 130, 246, 0.2)',
                          color: siteSettings?.primary_color_1 || '#3b82f6'
                        }}
                      >
                        {program.field_of_study}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{program.name_ar}</CardTitle>
                  </div>
                  {program.is_featured && (
                    <Badge 
                      className="flex items-center"
                      style={{
                        backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}10` : 'rgba(59, 130, 246, 0.1)',
                        color: siteSettings?.primary_color_1 || '#3b82f6'
                      }}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      مميز
                    </Badge>
                  )}
                </div>

                {program.universities && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {program.universities.countries?.flag_url && (
                      <img 
                        src={program.universities.countries.flag_url} 
                        alt={program.universities.countries.name_ar}
                        className="w-4 h-3 rounded object-cover"
                      />
                    )}
                    <span>{program.universities.name_ar}</span>
                    {program.universities.city && (
                      <>
                        <span>•</span>
                        <span>{program.universities.city}</span>
                      </>
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {program.description_ar}
                </p>

                <div className="space-y-2 mb-4">
                  {program.duration_years && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar 
                        className="w-4 h-4" 
                        style={{
                          color: siteSettings?.primary_color_1 || '#3b82f6'
                        }} 
                      />
                      <span>المدة: {program.duration_years} سنوات</span>
                    </div>
                  )}
                  {program.tuition_fee && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign 
                        className="w-4 h-4" 
                        style={{
                          color: siteSettings?.primary_color_1 || '#3b82f6'
                        }} 
                      />
                      <span>الرسوم: ${program.tuition_fee?.toLocaleString()}</span>
                    </div>
                  )}
                  {program.language && (
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen 
                        className="w-4 h-4" 
                        style={{
                          color: siteSettings?.primary_color_1 || '#3b82f6'
                        }} 
                      />
                      <span>لغة التدريس: {program.language}</span>
                    </div>
                  )}
                </div>

                <Button 
                  asChild 
                  className="w-full"
                  style={{
                    backgroundColor: siteSettings?.primary_color_1 || '#3b82f6',
                    '&:hover': {
                      backgroundColor: siteSettings?.primary_color_2 || '#6366f1'
                    }
                  }}
                >
                  <Link to={`/programs/${program.slug}`}>
                    تفاصيل البرنامج
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {mergedPrograms.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-4">لا توجد برامج متاحة حالياً</h3>
            <p className="text-muted-foreground">سيتم إضافة المزيد من البرامج قريباً</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProgramsList;