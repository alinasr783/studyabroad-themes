import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, DollarSign, Globe, Users, Building2, GraduationCap, Star, Calendar } from "lucide-react";

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
  local_ranking?: number;
  tuition_fee_min?: number;
  tuition_fee_max?: number;
  student_count?: number;
  acceptance_rate?: number;
  international_students_percentage?: number;
  language_requirements?: string;
  application_deadline?: string;
  is_featured?: boolean;
  countries?: {
    name_ar: string;
    flag_url?: string;
  };
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
  duration_months?: number;
  tuition_fee?: number;
  language?: string;
  start_date?: string;
  application_deadline?: string;
  requirements_ar?: string;
  career_prospects_ar?: string;
  is_featured?: boolean;
}

const UniversityDetail = () => {
  const { slug } = useParams();
  const [university, setUniversity] = useState<University | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchUniversityData();
    }
  }, [slug]);

  const fetchUniversityData = async () => {
    try {
      setLoading(true);
      
      // Fetch university details
      const { data: universityData } = await supabase
        .from('universities')
        .select('*, countries(name_ar, flag_url)')
        .eq('slug', slug)
        .single();

      if (universityData) {
        setUniversity(universityData);
        
        // Fetch programs offered by this university
        const { data: programsData } = await supabase
          .from('programs')
          .select('*')
          .eq('university_id', universityData.id)
          .order('is_featured', { ascending: false });
        
        setPrograms(programsData || []);
      }
    } catch (error) {
      console.error("Error fetching university data:", error);
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

  if (!university) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">الجامعة غير موجودة</h1>
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
          {university.image_url ? (
            <img 
              src={university.image_url} 
              alt={university.name_ar}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
          )}
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl text-white">
                <div className="flex items-center gap-6 mb-6">
                  {university.logo_url && (
                    <img 
                      src={university.logo_url} 
                      alt={university.name_ar}
                      className="w-20 h-20 rounded-lg bg-white p-2 shadow-lg"
                    />
                  )}
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{university.name_ar}</h1>
                    <p className="text-xl text-white/90 mb-2">{university.name_en}</p>
                    {university.city && university.countries && (
                      <div className="flex items-center gap-2">
                        {university.countries.flag_url && (
                          <img 
                            src={university.countries.flag_url} 
                            alt={university.countries.name_ar}
                            className="w-6 h-4 rounded object-cover"
                          />
                        )}
                        <span className="text-white/80">{university.city}, {university.countries.name_ar}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {university.is_featured && (
                    <Badge className="bg-accent text-accent-foreground text-base px-4 py-2">
                      جامعة مميزة
                    </Badge>
                  )}
                  {university.world_ranking && (
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      الترتيب العالمي: #{university.world_ranking}
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
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {university.description_ar || "معلومات تفصيلية عن هذه الجامعة غير متوفرة حالياً."}
                  </p>
                  {university.website_url && (
                    <Button asChild className="mt-4">
                      <a href={university.website_url} target="_blank" rel="noopener noreferrer">
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
                    البرامج الدراسية المتاحة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {programs.length > 0 ? (
                    <div className="space-y-4">
                      {programs.map((program) => (
                        <Card key={program.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-lg">{program.name_ar}</h3>
                                <p className="text-muted-foreground">{program.field_of_study}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Badge variant="outline">{program.degree_level}</Badge>
                                {program.is_featured && (
                                  <Badge variant="secondary">مميز</Badge>
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
                                  <span>الرسوم: ${program.tuition_fee?.toLocaleString()}</span>
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
                                  <span>تاريخ البداية: {new Date(program.start_date).toLocaleDateString('ar')}</span>
                                </div>
                              )}
                            </div>
                            
                            {program.description_ar && (
                              <p className="text-sm text-muted-foreground mb-4">{program.description_ar}</p>
                            )}
                            
                            <Button className="w-full" asChild>
                              <a href={`/programs/${program.slug}`}>
                                تفاصيل البرنامج
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">لم يتم إضافة برامج دراسية لهذه الجامعة بعد</p>
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
                        <p className="text-2xl font-bold text-primary">#{university.world_ranking}</p>
                      </div>
                    </div>
                  )}
                  
                  {university.student_count && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">عدد الطلاب</p>
                        <p className="text-lg font-bold">{university.student_count.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  
                  {university.acceptance_rate && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">معدل القبول</p>
                        <p className="text-lg font-bold">{university.acceptance_rate}%</p>
                      </div>
                    </div>
                  )}
                  
                  {university.international_students_percentage && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">الطلاب الدوليون</p>
                        <p className="text-lg font-bold">{university.international_students_percentage}%</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tuition Fees */}
              {(university.tuition_fee_min) && (
                <Card>
                  <CardHeader>
                    <CardTitle>الرسوم الدراسية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="font-semibold mb-1">الرسوم السنوية</p>
                      <p className="text-2xl font-bold text-primary">
                        ${university.tuition_fee_min?.toLocaleString()}
                        {university.tuition_fee_max && ` - $${university.tuition_fee_max?.toLocaleString()}`}
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
                    <p className="text-sm text-muted-foreground">{university.language_requirements}</p>
                  </CardContent>
                </Card>
              )}

              {/* Application Deadline */}
              {university.application_deadline && (
                <Card>
                  <CardHeader>
                    <CardTitle>موعد التقديم</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>آخر موعد: {new Date(university.application_deadline).toLocaleDateString('ar')}</span>
                    </div>
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