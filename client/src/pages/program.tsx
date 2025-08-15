import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock, GraduationCap, BookOpen, MapPin, Star } from "lucide-react";
import ConsultationForm from "@/components/forms/ConsultationForm";
import { supabase } from "@/integrations/supabase/client";

interface Program {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  degree_level: string;
  field_of_study: string;
  duration_years?: number;
  duration_months?: number;
  tuition_fee?: number;
  description_ar?: string;
  requirements_ar?: string;
  career_prospects_ar?: string;
  language?: string;
  start_date?: string;
  application_deadline?: string;
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
  primary_color_1: string;
  primary_color_2: string;
  primary_color_3: string;
}

const ProgramDetails = () => {
  const { slug } = useParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [university, setUniversity] = useState<University | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
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

  const fetchData = async () => {
    if (!clientId || !slug) return;

    try {
      setLoading(true);

      // جلب إعدادات الموقع الخاصة بالعميل
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('primary_color_1, primary_color_2, primary_color_3')
        .eq('client_id', clientId)
        .single();

      if (settingsError) throw settingsError;
      if (settingsData) setSiteSettings(settingsData);

      // جلب البرنامج الخاص بالعميل
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .select('*')
        .eq('slug', slug)
        .eq('client_id', clientId)
        .single();

      if (programError) throw programError;

      if (!programData) {
        setProgram(null);
        return;
      }

      setProgram(programData);

      // جلب الجامعة إذا كان هناك university_id
      if (programData.university_id) {
        const { data: universityData, error: universityError } = await supabase
          .from('universities')
          .select('*')
          .eq('id', programData.university_id)
          .eq('client_id', clientId)
          .single();

        if (universityError) throw universityError;

        setUniversity(universityData || null);

        // جلب الدولة إذا كان هناك country_id
        if (universityData?.country_id) {
          const { data: countryData, error: countryError } = await supabase
            .from('countries')
            .select('*')
            .eq('id', universityData.country_id)
            .eq('client_id', clientId)
            .single();

          if (countryError) throw countryError;

          setCountry(countryData || null);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId && slug) {
      fetchData();
    }
  }, [clientId, slug]);

  // دمج البيانات
  const mergedProgram = program ? {
    ...program,
    universities: university ? {
      ...university,
      countries: country
    } : undefined
  } : null;

  // الحصول على الألوان أو استخدام القيم الافتراضية
  const primaryColor = siteSettings?.primary_color_1 || 'var(--primary)';
  const secondaryColor = siteSettings?.primary_color_2 || 'var(--secondary)';
  const accentColor = siteSettings?.primary_color_3 || 'var(--accent)';

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div 
            className="animate-spin rounded-full h-32 w-32 border-b-2"
            style={{ borderColor: primaryColor }}
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
              backgroundColor: `${accentColor}20`,
              borderColor: accentColor,
              color: accentColor
            }}
            role="alert"
          >
            <strong className="font-bold">خطأ!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!mergedProgram) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">البرنامج غير موجود</h3>
          <Button 
            asChild 
            className="mt-4"
            style={{ backgroundColor: primaryColor }}
          >
            <Link to="/programs">العودة إلى قائمة البرامج</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Program Hero */}
        <div 
          className="rounded-2xl p-8 text-white mb-8"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
          }}
        >
          <div className="flex items-start gap-6">
            {mergedProgram.universities?.logo_url && (
              <div 
                className="w-16 h-16 rounded-lg bg-white p-2 flex items-center justify-center"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <img 
                  src={mergedProgram.universities.logo_url} 
                  alt={mergedProgram.universities.name_ar}
                  className="max-w-full max-h-full"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex gap-3 mb-3">
                <Badge 
                  variant="secondary" 
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor
                  }}
                >
                  {mergedProgram.degree_level}
                </Badge>
                <Badge 
                  variant="secondary"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor
                  }}
                >
                  {mergedProgram.field_of_study}
                </Badge>
                {mergedProgram.is_featured && (
                  <Badge 
                    variant="secondary" 
                    style={{
                      backgroundColor: `${accentColor}20`,
                      color: accentColor
                    }}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    مميز
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-3">{mergedProgram.name_ar}</h1>
              {mergedProgram.universities && (
                <div className="flex items-center gap-2 text-lg opacity-90">
                  {mergedProgram.universities.countries?.flag_url && (
                    <img 
                      src={mergedProgram.universities.countries.flag_url} 
                      alt={mergedProgram.universities.countries.name_ar}
                      className="w-6 h-4 rounded object-cover"
                    />
                  )}
                  <span>{mergedProgram.universities.name_ar}</span>
                  {mergedProgram.universities.city && (
                    <>
                      <span>•</span>
                      <span>{mergedProgram.universities.city}</span>
                    </>
                  )}
                  {mergedProgram.universities.countries && (
                    <>
                      <span>•</span>
                      <span>{mergedProgram.universities.countries.name_ar}</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setShowConsultationForm(true)}
              style={{
                backgroundColor: 'white',
                color: primaryColor
              }}
              className="hover:bg-gray-100"
            >
              احجز استشارة مجانية
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Program Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Program Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" style={{ color: primaryColor }} />
                  تفاصيل البرنامج
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed">{mergedProgram.description_ar}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            {mergedProgram.requirements_ar && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" style={{ color: primaryColor }} />
                    متطلبات القبول
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-arabic max-w-none">
                    <p className="leading-relaxed">{mergedProgram.requirements_ar}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Career Prospects */}
            {mergedProgram.career_prospects_ar && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" style={{ color: primaryColor }} />
                    الفرص المهنية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-arabic max-w-none">
                    <p className="leading-relaxed">{mergedProgram.career_prospects_ar}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mergedProgram.duration_years && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                    <div>
                      <p className="font-medium">مدة البرنامج</p>
                      <p className="text-sm text-muted-foreground">
                        {mergedProgram.duration_years} سنوات
                        {mergedProgram.duration_months && ` (${mergedProgram.duration_months} شهر)`}
                      </p>
                    </div>
                  </div>
                )}

                {mergedProgram.tuition_fee && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5" style={{ color: primaryColor }} />
                    <div>
                      <p className="font-medium">الرسوم الدراسية</p>
                      <p className="text-sm text-muted-foreground">
                        ${mergedProgram.tuition_fee?.toLocaleString()} سنوياً
                      </p>
                    </div>
                  </div>
                )}

                {mergedProgram.language && (
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5" style={{ color: primaryColor }} />
                    <div>
                      <p className="font-medium">لغة التدريس</p>
                      <p className="text-sm text-muted-foreground">{mergedProgram.language}</p>
                    </div>
                  </div>
                )}

                {mergedProgram.start_date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                    <div>
                      <p className="font-medium">تاريخ البدء</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(mergedProgram.start_date).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                )}

                {mergedProgram.application_deadline && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5" style={{ color: primaryColor }} />
                    <div>
                      <p className="font-medium">آخر موعد للتقديم</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(mergedProgram.application_deadline).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card 
              className="text-white"
              style={{
                background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`
              }}
            >
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-3">ابدأ رحلتك الآن</h3>
                <p className="mb-4 opacity-90">
                  احصل على استشارة مجانية مع خبرائنا لتحديد أفضل مسار دراسي لك
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full hover:bg-gray-100"
                  style={{
                    backgroundColor: 'white',
                    color: primaryColor
                  }}
                  onClick={() => setShowConsultationForm(true)}
                >
                  احجز استشارة مجانية
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Consultation Form Modal */}
        {showConsultationForm && (
          <ConsultationForm 
            onClose={() => setShowConsultationForm(false)}
            programName={mergedProgram.name_ar}
            clientId={clientId}
          />
        )}
      </div>
    </Layout>
  );
};

export default ProgramDetails;