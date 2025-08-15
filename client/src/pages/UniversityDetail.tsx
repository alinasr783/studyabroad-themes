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
  ArrowLeft,
  Image as ImageIcon,
  Video,
  Award,
  Home,
  BookOpen,
  ShieldCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

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
  country_id?: string;
  country?: Country;
  accreditation?: string;
  founded_year?: number;
  campus_type?: string;
  housing_available?: boolean;
  scholarship_available?: boolean;
  video_url?: string;
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
  program_type?: string;
  study_mode?: string;
  credit_hours?: number;
  scholarship_info_ar?: string;
  video_url?: string;
}

interface UniversityMedia {
  id: string;
  university_id: string;
  media_type: 'image' | 'video';
  url: string;
  caption_ar?: string;
  caption_en?: string;
  is_featured?: boolean;
}

interface UniversityReview {
  id: string;
  university_id: string;
  student_name: string;
  student_nationality?: string;
  program_name?: string;
  graduation_year?: number;
  rating: number;
  review_text_ar?: string;
  review_text_en?: string;
  created_at: string;
}

interface UniversityFaculty {
  id: string;
  university_id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  logo_url?: string;
}

interface SiteSettings {
  primary_color_1: string;
  primary_color_2: string;
  primary_color_3: string;
}

const UniversityDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [university, setUniversity] = useState<University | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [media, setMedia] = useState<UniversityMedia[]>([]);
  const [reviews, setReviews] = useState<UniversityReview[]>([]);
  const [faculties, setFaculties] = useState<UniversityFaculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

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

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!clientData?.id) return;

        if (!slug) {
          throw new Error('معرف الجامعة غير صالح');
        }

        // Fetch university data
        const { data: universityData, error: universityError } = await supabase
          .from('universities')
          .select('*')
          .eq('slug', slug.trim().toLowerCase())
          .eq('client_id', clientData.id)
          .single();

        if (universityError) {
          throw universityError;
        }

        if (!universityData) {
          throw new Error('الجامعة غير موجودة في قاعدة البيانات');
        }

        setUniversity(universityData);

        // Fetch country data
        if (universityData.country_id) {
          const { data: countryData, error: countryError } = await supabase
            .from('countries')
            .select('*')
            .eq('id', universityData.country_id)
            .eq('client_id', clientData.id)
            .single();

          if (!countryError && countryData) {
            setCountry(countryData);
          }
        }

        // Fetch programs
        const { data: programsData, error: programsError } = await supabase
          .from('programs')
          .select('*')
          .eq('university_id', universityData.id)
          .eq('client_id', clientData.id);

        if (programsError) {
          console.error('Error fetching programs:', programsError);
          setPrograms([]);
        } else {
          setPrograms(programsData || []);
        }

        // Fetch university media
        const { data: mediaData, error: mediaError } = await supabase
          .from('university_media')
          .select('*')
          .eq('university_id', universityData.id)
          .eq('client_id', clientData.id)
          .order('display_order', { ascending: true });

        if (mediaError) {
          console.error('Error fetching media:', mediaError);
          setMedia([]);
        } else {
          setMedia(mediaData || []);
        }

        // Fetch university reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('university_reviews')
          .select('*')
          .eq('university_id', universityData.id)
          .eq('client_id', clientData.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          setReviews([]);
        } else {
          setReviews(reviewsData || []);
        }

        // Fetch university faculties
        const { data: facultiesData, error: facultiesError } = await supabase
          .from('university_faculties')
          .select('*')
          .eq('university_id', universityData.id)
          .eq('client_id', clientData.id);

        if (facultiesError) {
          console.error('Error fetching faculties:', facultiesError);
          setFaculties([]);
        } else {
          setFaculties(facultiesData || []);
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
  }, [slug, clientData?.id]);

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

  const formatNumber = (num?: number) => {
    if (!num) return "غير محدد";
    return num.toLocaleString();
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('embed')) return url;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }

    return url;
  };

  // Get colors or use defaults
  const primaryColor = siteSettings?.primary_color_1 || 'var(--primary)';
  const secondaryColor = siteSettings?.primary_color_2 || 'var(--secondary)';
  const accentColor = siteSettings?.primary_color_3 || 'var(--accent)';

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
              <ArrowLeft className="w-4 h-4 ml-2" /> العودة للخلف
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
      <div className="min-h-screen text-right" dir="rtl">
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
            <div 
              className="w-full h-full"
              style={{
                background: `linear-gradient(to bottom left, ${primaryColor}, ${secondaryColor})`
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl text-white">
                <div className="flex items-center gap-6 mb-6">
                  <div 
                    className="w-20 h-20 rounded-lg bg-white p-2 shadow-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${primaryColor}20`,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
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
                      <Building2 className="w-12 h-12" style={{ color: primaryColor }} />
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
                    <Badge 
                      className="text-base px-4 py-2"
                      style={{
                        backgroundColor: accentColor,
                        color: 'white'
                      }}
                    >
                      <Star className="w-4 h-4 ml-1" /> جامعة مميزة
                    </Badge>
                  )}
                  {university.world_ranking && (
                    <Badge 
                      variant="secondary" 
                      className="text-base px-4 py-2"
                      style={{
                        backgroundColor: `${primaryColor}20`,
                        color: primaryColor
                      }}
                    >
                      الترتيب العالمي: #{university.world_ranking.toLocaleString()}
                    </Badge>
                  )}
                  {university.accreditation && (
                    <Badge 
                      variant="secondary" 
                      className="text-base px-4 py-2"
                      style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentColor
                      }}
                    >
                      <ShieldCheck className="w-4 h-4 ml-1" /> {university.accreditation}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 text-right" dir="rtl">
          <div className="grid lg:grid-cols-3 gap-8 text-right " dir="rtl">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8 text-right" dir="rtl">
              {/* Navigation Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start text-right">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="programs">البرامج ({programs.length})</TabsTrigger>
                  <TabsTrigger value="media">المعرض ({media.length})</TabsTrigger>
                  {reviews.length > 0 && (
                    <TabsTrigger value="reviews">التقييمات ({reviews.length})</TabsTrigger>
                  )}
                  {faculties.length > 0 && (
                    <TabsTrigger value="faculties">الكليات ({faculties.length})</TabsTrigger>
                  )}
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-8 text-right text-right">
                  {/* University Video */}
                  {university.video_url && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-right ">
                          <Video className="w-5 h-5" style={{ color: primaryColor }} />
                          فيديو تعريفي
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video w-full rounded-lg overflow-hidden text-right">
                          <iframe
                            src={getYoutubeEmbedUrl(university.video_url)}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture text-right"
                            allowFullScreen
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* About University */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-right text-right" dir="rtl">
                        <Building2 className="w-5 h-5 text-right" style={{ color: primaryColor }} />
                        نبذة عن الجامعة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {university.description_ar ? (
                        <div 
                          className="prose prose-sm max-w-none text-muted-foreground text-right"
                          dangerouslySetInnerHTML={{ __html: university.description_ar }}
                        />
                      ) : (
                        <p className="text-lg leading-relaxed text-muted-foreground text-right">
                          معلومات تفصيلية عن هذه الجامعة غير متوفرة حالياً.
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-right" dir="rtl">
                        {university.founded_year && (
                          <div className="flex items-center gap-3 text-right">
                            <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                            <div>
                              <p className="font-semibold text-right">سنة التأسيس</p>
                              <p className="text-lg text-right">{university.founded_year}</p>
                            </div>
                          </div>
                        )}

                        {university.campus_type && (
                          <div className="flex items-center gap-3 text-right">
                            <Home className="w-5 h-5 text-right" style={{ color: primaryColor }} />
                            <div>
                              <p className="font-semibold text-right">نوع الحرم الجامعي</p>
                              <p className="text-lg text-right">{university.campus_type}</p>
                            </div>
                          </div>
                        )}

                        {university.housing_available !== undefined && (
                          <div className="flex items-center gap-3 text-right">
                            <Building2 className="w-5 h-5" style={{ color: primaryColor }} />
                            <div>
                              <p className="font-semibold text-right">السكن الجامعي</p>
                              <p className="text-lg">
                                {university.housing_available ? 'متاح' : 'غير متاح'}
                              </p>
                            </div>
                          </div>
                        )}

                        {university.scholarship_available !== undefined && (
                          <div className="flex items-center gap-3 text-right">
                            <Award className="w-5 h-5" style={{ color: primaryColor }} />
                            <div>
                              <p className="font-semibold">المنح الدراسية</p>
                              <p className="text-lg">
                                {university.scholarship_available ? 'متاحة' : 'غير متاحة'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {university.website_url && (
                        <Button 
                          asChild 
                          className="mt-6"
                          style={{
                            backgroundColor: primaryColor,
                            color: 'white'
                          }}
                        >
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

                  {/* Featured Media */}
                  {media.filter(m => m.is_featured).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-right">
                          <ImageIcon className="w-5 h-5" style={{ color: primaryColor }} />
                          معرض الوسائط المميزة
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {media.filter(m => m.is_featured).map((item) => (
                            item.media_type === 'image' ? (
                              <img
                                key={item.id}
                                src={item.url}
                                alt={item.caption_ar || university.name_ar}
                                className="rounded-lg object-cover h-48 w-full"
                              />
                            ) : (
                              <div key={item.id} className="relative aspect-video">
                                <iframe
                                  src={getYoutubeEmbedUrl(item.url)}
                                  className="w-full h-full rounded-lg"
                                  allowFullScreen
                                />
                              </div>
                            )
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Programs Tab */}
                <TabsContent value="programs" className="space-y-4" dir="rtl">
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
                                <h3 
                                  className="font-bold text-lg transition-colors"
                                  style={{
                                    color: program.is_featured ? accentColor : 'inherit'
                                  }}
                                >
                                  {program.name_ar}
                                </h3>
                                <p className="text-muted-foreground">{program.field_of_study}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Badge 
                                  variant="outline"
                                  style={{
                                    borderColor: primaryColor,
                                    color: primaryColor
                                  }}
                                >
                                  {program.degree_level}
                                </Badge>
                                {program.is_featured && (
                                  <Badge 
                                    variant="secondary"
                                    style={{
                                      backgroundColor: `${accentColor}20`,
                                      color: accentColor
                                    }}
                                  >
                                    <Star className="w-3 h-3 ml-1" /> مميز
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              {program.duration_years && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
                                  <span>المدة: {program.duration_years} سنة</span>
                                </div>
                              )}
                              {program.tuition_fee && (
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="w-4 h-4" style={{ color: primaryColor }} />
                                  <span>الرسوم: ${program.tuition_fee.toLocaleString()}</span>
                                </div>
                              )}
                              {program.language && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Globe className="w-4 h-4" style={{ color: primaryColor }} />
                                  <span>لغة التدريس: {program.language}</span>
                                </div>
                              )}
                              {program.start_date && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
                                  <span>تاريخ البداية: {formatDate(program.start_date)}</span>
                                </div>
                              )}
                              {program.study_mode && (
                                <div className="flex items-center gap-2 text-sm">
                                  <BookOpen className="w-4 h-4" style={{ color: primaryColor }} />
                                  <span>نظام الدراسة: {program.study_mode}</span>
                                </div>
                              )}
                              {program.credit_hours && (
                                <div className="flex items-center gap-2 text-sm">
                                  <GraduationCap className="w-4 h-4" style={{ color: primaryColor }} />
                                  <span>الساعات المعتمدة: {program.credit_hours}</span>
                                </div>
                              )}
                            </div>

                            {program.description_ar && (
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {program.description_ar}
                              </p>
                            )}

                            {program.video_url && (
                              <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
                                <iframe
                                  src={getYoutubeEmbedUrl(program.video_url)}
                                  className="w-full h-full"
                                  allowFullScreen
                                />
                              </div>
                            )}

                            <Button 
                              variant="outline" 
                              className="w-full group-hover:text-primary-foreground"
                              style={{
                                borderColor: primaryColor,
                                backgroundColor: 'transparent',
                                color: primaryColor
                              }}
                            >
                              تفاصيل البرنامج
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8" dir="rtl">
                      <GraduationCap 
                        className="w-16 h-16 mx-auto mb-4" 
                        style={{ color: primaryColor }} 
                      />
                      <p className="text-muted-foreground">لم يتم إضافة برامج دراسية لهذه الجامعة بعد</p>
                      <Button 
                        variant="ghost" 
                        className="mt-4"
                        onClick={() => navigate('/universities')}
                        style={{ color: primaryColor }}
                      >
                        استكشاف جامعات أخرى
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-4" dir="rtl">
                  {media.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {media.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          {item.media_type === 'image' ? (
                            <img
                              src={item.url}
                              alt={item.caption_ar || university.name_ar}
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="relative aspect-video">
                              <iframe
                                src={getYoutubeEmbedUrl(item.url)}
                                className="w-full h-full"
                                allowFullScreen
                              />
                            </div>
                          )}
                          {item.caption_ar && (
                            <CardContent className="p-4">
                              <p className="text-sm text-muted-foreground">{item.caption_ar}</p>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8" dir="rtl">
                      <ImageIcon 
                        className="w-16 h-16 mx-auto mb-4" 
                        style={{ color: primaryColor }} 
                      />
                      <p className="text-muted-foreground">لا توجد وسائط متاحة لهذه الجامعة</p>
                    </div>
                  )}
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-4">
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <Card key={review.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{review.student_name}</h4>
                                {review.program_name && (
                                  <p className="text-sm text-muted-foreground">
                                    {review.program_name}
                                    {review.graduation_year && `, ${review.graduation_year}`}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`}
                                    style={{
                                      color: i < review.rating ? accentColor : 'var(--muted-foreground)'
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {review.review_text_ar && (
                              <p className="text-muted-foreground">{review.review_text_ar}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star 
                        className="w-16 h-16 mx-auto mb-4" 
                        style={{ color: primaryColor }} 
                      />
                      <p className="text-muted-foreground">لا توجد تقييمات متاحة لهذه الجامعة</p>
                    </div>
                  )}
                </TabsContent>

                {/* Faculties Tab */}
                <TabsContent value="faculties" className="space-y-4">
                  {faculties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {faculties.map((faculty) => (
                        <Card key={faculty.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-center gap-4">
                              {faculty.logo_url && (
                                <img
                                  src={faculty.logo_url}
                                  alt={faculty.name_ar}
                                  className="w-12 h-12 object-contain"
                                />
                              )}
                              <div>
                                <h4 className="font-semibold">{faculty.name_ar}</h4>
                                <p className="text-sm text-muted-foreground">{faculty.name_en}</p>
                              </div>
                            </div>
                          </CardHeader>
                          {faculty.description_ar && (
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {faculty.description_ar}
                              </p>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building2 
                        className="w-16 h-16 mx-auto mb-4" 
                        style={{ color: primaryColor }} 
                      />
                      <p className="text-muted-foreground">لا توجد كليات متاحة لهذه الجامعة</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
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
                      <Star className="w-5 h-5" style={{ color: primaryColor }} />
                      <div>
                        <p className="font-semibold">الترتيب العالمي</p>
                        <p 
                          className="text-2xl font-bold"
                          style={{ color: primaryColor }}
                        >
                          #{university.world_ranking.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {university.student_count && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5" style={{ color: primaryColor }} />
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
                      <GraduationCap className="w-5 h-5" style={{ color: primaryColor }} />
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
                      <Globe className="w-5 h-5" style={{ color: primaryColor }} />
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
                      <p 
                        className="text-2xl font-bold"
                        style={{ color: primaryColor }}
                      >
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
                      <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
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
              <Button 
                className="w-full" 
                size="lg"
                style={{
                  backgroundColor: primaryColor,
                  color: 'white'
                }}
              >
                التواصل مع الجامعة
              </Button>

              {/* Country Info */}
              {country && (
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الدولة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      {country.flag_url && (
                        <img 
                          src={country.flag_url} 
                          alt={country.name_ar}
                          className="w-10 h-6 rounded object-cover"
                        />
                      )}
                      <h3 className="font-bold text-lg">{country.name_ar}</h3>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      style={{
                        borderColor: primaryColor,
                        color: primaryColor
                      }}
                      onClick={() => navigate(`/countries/${country.slug}`)}
                    >
                      المزيد عن الدراسة في {country.name_ar}
                    </Button>
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

export default UniversityDetail;