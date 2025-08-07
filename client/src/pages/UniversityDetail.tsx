import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  DollarSign, 
  Globe, 
  Users, 
  Building2, 
  GraduationCap, 
  Star, 
  Calendar,
  ArrowLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Country {
  id: string;
  name_ar: string;
  name_en: string;
  flag_url?: string;
  capital?: string;
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
  application_deadline?: string;
  is_featured?: boolean;
  country_id?: string; // تم تغيير النوع إلى string لتتناسب مع قاعدة البيانات
  country?: Country; // تم تغيير اسم الحقل إلى country بدلاً من countries
}

interface Program {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar?: string;
  degree_level: string;
  field_of_study: string;
  duration_years?: number;
  tuition_fee?: number;
  language?: string;
  start_date?: string;
  application_deadline?: string;
  requirements_ar?: string;
  career_prospects_ar?: string;
  is_featured?: boolean;
  university_id?: string;
}

const UniversityDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [university, setUniversity] = useState<University | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<Country | null>(null); // دولة منفصلة

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!slug) {
          throw new Error('معرف الجامعة غير صالح');
        }

        // جلب بيانات الجامعة فقط
        const { data: universityData, error: universityError } = await supabase
          .from('universities')
          .select('*')
          .eq('slug', slug.trim().toLowerCase())
          .single();

        if (universityError) {
          throw universityError;
        }

        if (!universityData) {
          throw new Error('الجامعة غير موجودة في قاعدة البيانات');
        }

        setUniversity(universityData);

        // جلب بيانات الدولة بشكل منفصل باستخدام country_id
        if (universityData.country_id) {
          const { data: countryData, error: countryError } = await supabase
            .from('countries')
            .select('*')
            .eq('id', universityData.country_id)
            .single();

          if (!countryError && countryData) {
            setCountry(countryData);
          }
        }

        // جلب البرامج الدراسية
        const { data: programsData, error: programsError } = await supabase
          .from('programs')
          .select('*')
          .eq('university_id', universityData.id);

        if (programsError) {
          console.error('Error fetching programs:', programsError);
          setPrograms([]);
        } else {
          setPrograms(programsData || []);
        }

      } catch (err: any) {
        console.error('Full error details:', {
          message: err.message,
          details: err
        });

        setError(
          err.message.includes('JSON') ? 'خطأ في تحويل البيانات' :
          err.message.includes('single') ? 'يوجد أكثر من جامعة بنفس المعرف' :
          err.message || 'حدث خطأ غير متوقع'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [slug]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "غير محدد";
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return new Date(dateString).toLocaleDateString('ar-EG', options);
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen">
          <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-gray-200">
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="flex items-center gap-6">
                  <Skeleton className="w-20 h-20 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>

              <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !university) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">الجامعة غير موجودة</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'لم يتم العثور على المعلومات المطلوبة'}
          </p>
          <div className="space-y-4">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> العودة للخلف
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              إعادة تحميل الصفحة
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          {university.image_url ? (
            <img 
              src={university.image_url} 
              alt={university.name_ar}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-university-banner.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
          )}
          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl text-white">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-lg bg-white p-2 shadow-lg flex items-center justify-center">
                    {university.logo_url ? (
                      <img 
                        src={university.logo_url} 
                        alt={university.name_ar}
                        className="max-w-full max-h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-university-logo.png';
                        }}
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{university.name_ar}</h1>
                    <p className="text-xl text-white/90 mb-2">{university.name_en}</p>
                    {university.city && country && (
                      <div className="flex items-center gap-2">
                        {country.flag_url && (
                          <img 
                            src={country.flag_url} 
                            alt={country.name_ar}
                            className="w-6 h-4 rounded object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-flag.png';
                            }}
                          />
                        )}
                        <span className="text-white/80">
                          {university.city}, {country.name_ar}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {university.is_featured && (
                    <Badge className="bg-accent text-accent-foreground text-base px-4 py-2">
                      <Star className="w-4 h-4 mr-1" /> جامعة مميزة
                    </Badge>
                  )}
                  {university.world_ranking && (
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      الترتيب العالمي: #{university.world_ranking.toLocaleString()}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About University */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    نبذة عن الجامعة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {university.description_ar ? (
                    <div 
                      className="prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: university.description_ar }}
                    />
                  ) : (
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      معلومات تفصيلية عن هذه الجامعة غير متوفرة حالياً.
                    </p>
                  )}

                  {university.website_url && (
                    <Button asChild className="mt-4">
                      <a 
                        href={university.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Globe className="w-4 h-4" />
                        زيارة الموقع الرسمي
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Programs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    البرامج الدراسية المتاحة ({programs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {programs.length > 0 ? (
                    <div className="space-y-4">
                      {programs.map((program) => (
                        <Card 
                          key={program.id} 
                          className="hover:shadow-lg transition-shadow cursor-pointer group"
                          onClick={() => navigate(`/programs/${program.slug}`)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                  {program.name_ar}
                                </h3>
                                <p className="text-muted-foreground">{program.field_of_study}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Badge variant="outline">{program.degree_level}</Badge>
                                {program.is_featured && (
                                  <Badge variant="secondary">
                                    <Star className="w-3 h-3 mr-1" /> مميز
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              {program.duration_years && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  <span>المدة: {program.duration_years} سنة</span>
                                </div>
                              )}
                              {program.tuition_fee && (
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="w-4 h-4 text-primary" />
                                  <span>الرسوم: ${program.tuition_fee.toLocaleString()}</span>
                                </div>
                              )}
                              {program.language && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Globe className="w-4 h-4 text-primary" />
                                  <span>لغة التدريس: {program.language}</span>
                                </div>
                              )}
                              {program.start_date && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  <span>تاريخ البداية: {formatDate(program.start_date)}</span>
                                </div>
                              )}
                            </div>

                            {program.description_ar && (
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {program.description_ar}
                              </p>
                            )}

                            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                              تفاصيل البرنامج
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">لم يتم إضافة برامج دراسية لهذه الجامعة بعد</p>
                      <Button 
                        variant="ghost" 
                        className="mt-4"
                        onClick={() => navigate('/universities')}
                      >
                        استكشاف جامعات أخرى
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* University Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات الجامعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {university.world_ranking && (
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">الترتيب العالمي</p>
                        <p className="text-2xl font-bold text-primary">
                          #{university.world_ranking.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {university.student_count && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">عدد الطلاب</p>
                        <p className="text-lg font-bold">
                          {university.student_count.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {university.acceptance_rate && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">معدل القبول</p>
                        <p className="text-lg font-bold">
                          {university.acceptance_rate}%
                        </p>
                      </div>
                    </div>
                  )}

                  {university.international_students_percentage && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">الطلاب الدوليون</p>
                        <p className="text-lg font-bold">
                          {university.international_students_percentage}%
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tuition Fees */}
              {(university.tuition_fee_min || university.tuition_fee_max) && (
                <Card>
                  <CardHeader>
                    <CardTitle>الرسوم الدراسية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="font-semibold mb-1">الرسوم السنوية</p>
                      <p className="text-2xl font-bold text-primary">
                        {university.tuition_fee_min ? `$${university.tuition_fee_min.toLocaleString()}` : ''}
                        {university.tuition_fee_max && university.tuition_fee_min ? ' - ' : ''}
                        {university.tuition_fee_max ? `$${university.tuition_fee_max.toLocaleString()}` : ''}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        (قد تختلف الرسوم حسب البرنامج والمرحلة الدراسية)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Language Requirements */}
              {university.language_requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>متطلبات اللغة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: university.language_requirements }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Application Deadline */}
              {university.application_deadline && (
                <Card>
                  <CardHeader>
                    <CardTitle>مواعيد التقديم</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">آخر موعد للتقديم:</p>
                        <p className="font-bold">
                          {formatDate(university.application_deadline)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Button */}
              <Button className="w-full" size="lg">
                التواصل مع الجامعة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UniversityDetail;