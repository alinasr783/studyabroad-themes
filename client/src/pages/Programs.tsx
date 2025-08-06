import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { articlesApi, countriesApi, universitiesApi, programsApi, consultationsApi, contactMessagesApi, testimonialsApi } from "@/lib/api";
import { Calendar, DollarSign, Clock, GraduationCap, BookOpen, MapPin, Star } from "lucide-react";
import ConsultationForm from "@/components/forms/ConsultationForm";

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
  universities?: {
    name_ar: string;
    logo_url?: string;
    city?: string;
    countries?: {
      name_ar: string;
      flag_url?: string;
    };
  };
}

const Programs = () => {
  const { slug } = useParams();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (slug) {
        // Fetch specific program
        const { data: programData } = await supabase
          .from('programs')
          .select(`
            *,
            universities (
              name_ar,
              logo_url,
              city,
              countries (
                name_ar,
                flag_url
              )
            )
          `)
          .eq('slug', slug)
          .single();
        
        if (programData) {
          setSelectedProgram(programData);
        }
      } else {
        // Fetch all programs
        const { data: programsData } = await supabase
          .from('programs')
          .select(`
            *,
            universities (
              name_ar,
              logo_url,
              city,
              countries (
                name_ar,
                flag_url
              )
            )
          `)
          .order('name_ar');
        
        setPrograms(programsData || []);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (selectedProgram) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* Program Hero */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white mb-8">
            <div className="flex items-start gap-6">
              {selectedProgram.universities?.logo_url && (
                <img 
                  src={selectedProgram.universities.logo_url} 
                  alt={selectedProgram.universities.name_ar}
                  className="w-16 h-16 rounded-lg object-cover bg-white p-2"
                />
              )}
              <div className="flex-1">
                <div className="flex gap-3 mb-3">
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {selectedProgram.degree_level}
                  </Badge>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {selectedProgram.field_of_study}
                  </Badge>
                  {selectedProgram.is_featured && (
                    <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">
                      <Star className="w-4 h-4 mr-1" />
                      مميز
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-3">{selectedProgram.name_ar}</h1>
                {selectedProgram.universities && (
                  <div className="flex items-center gap-2 text-lg opacity-90">
                    {selectedProgram.universities.countries?.flag_url && (
                      <img 
                        src={selectedProgram.universities.countries.flag_url} 
                        alt={selectedProgram.universities.countries.name_ar}
                        className="w-6 h-4 rounded object-cover"
                      />
                    )}
                    <span>{selectedProgram.universities.name_ar}</span>
                    {selectedProgram.universities.city && (
                      <>
                        <span>•</span>
                        <span>{selectedProgram.universities.city}</span>
                      </>
                    )}
                    {selectedProgram.universities.countries && (
                      <>
                        <span>•</span>
                        <span>{selectedProgram.universities.countries.name_ar}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setShowConsultationForm(true)}
                className="bg-white text-primary hover:bg-gray-100"
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
                    <BookOpen className="w-5 h-5" />
                    تفاصيل البرنامج
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg leading-relaxed">{selectedProgram.description_ar}</p>
                </CardContent>
              </Card>

              {/* Requirements */}
              {selectedProgram.requirements_ar && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      متطلبات القبول
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-arabic max-w-none">
                      <p className="leading-relaxed">{selectedProgram.requirements_ar}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Career Prospects */}
              {selectedProgram.career_prospects_ar && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      الفرص المهنية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-arabic max-w-none">
                      <p className="leading-relaxed">{selectedProgram.career_prospects_ar}</p>
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
                  {selectedProgram.duration_years && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">مدة البرنامج</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedProgram.duration_years} سنوات
                          {selectedProgram.duration_months && ` (${selectedProgram.duration_months} شهر)`}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedProgram.tuition_fee && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">الرسوم الدراسية</p>
                        <p className="text-sm text-muted-foreground">
                          ${selectedProgram.tuition_fee.toLocaleString()} سنوياً
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedProgram.language && (
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">لغة التدريس</p>
                        <p className="text-sm text-muted-foreground">{selectedProgram.language}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedProgram.start_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">تاريخ البدء</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedProgram.start_date).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedProgram.application_deadline && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">آخر موعد للتقديم</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedProgram.application_deadline).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="bg-gradient-to-br from-primary to-secondary text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-3">ابدأ رحلتك الآن</h3>
                  <p className="mb-4 opacity-90">
                    احصل على استشارة مجانية مع خبرائنا لتحديد أفضل مسار دراسي لك
                  </p>
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-primary hover:bg-gray-100"
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
              programName={selectedProgram.name_ar}
            />
          )}
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
          {programs.map((program) => (
            <Card key={program.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                      <Badge variant="outline" className="text-xs">{program.degree_level}</Badge>
                      <Badge variant="outline" className="text-xs">{program.field_of_study}</Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{program.name_ar}</CardTitle>
                  </div>
                  {program.is_featured && (
                    <Badge className="bg-yellow-500 text-yellow-900">
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
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>المدة: {program.duration_years} سنوات</span>
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
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span>لغة التدريس: {program.language}</span>
                    </div>
                  )}
                </div>
                
                <Button asChild className="w-full">
                  <Link to={`/programs/${program.slug}`}>
                    تفاصيل البرنامج
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-4">لا توجد برامج متاحة حالياً</h3>
            <p className="text-muted-foreground">سيتم إضافة المزيد من البرامج قريباً</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Programs;