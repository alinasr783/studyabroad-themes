import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { articlesApi, countriesApi, universitiesApi, programsApi, consultationsApi, contactMessagesApi, testimonialsApi } from "@/lib/api";
import { MapPin, DollarSign, Star, Users, Globe, Calendar, GraduationCap } from "lucide-react";

interface University {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  city?: string;
  logo_url?: string;
  description_ar?: string;
  world_ranking?: number;
  local_ranking?: number;
  tuition_fee_min?: number;
  tuition_fee_max?: number;
  acceptance_rate?: number;
  student_count?: number;
  international_students_percentage?: number;
  website_url?: string;
  application_deadline?: string;
  language_requirements?: string;
  image_url?: string;
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
  degree_level: string;
  field_of_study: string;
  duration_years?: number;
  duration_months?: number;
  tuition_fee?: number;
  description_ar?: string;
  is_featured?: boolean;
}

const Universities = () => {
  const { slug } = useParams();
  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (slug) {
        // Fetch specific university
        const { data: universityData } = await supabase
          .from('universities')
          .select(`
            *,
            countries (
              name_ar,
              flag_url
            )
          `)
          .eq('slug', slug)
          .single();
        
        if (universityData) {
          setSelectedUniversity(universityData);
          
          // Fetch programs for this university
          const { data: programsData } = await supabase
            .from('programs')
            .select('*')
            .eq('university_id', universityData.id);
          
          setPrograms(programsData || []);
        }
      } else {
        // Fetch all universities
        const { data: universitiesData } = await supabase
          .from('universities')
          .select(`
            *,
            countries (
              name_ar,
              flag_url
            )
          `)
          .order('name_ar');
        
        setUniversities(universitiesData || []);
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

  if (selectedUniversity) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* University Hero */}
          <div className="relative bg-gradient-to-r from-primary to-secondary rounded-2xl overflow-hidden mb-8">
            {selectedUniversity.image_url && (
              <div className="absolute inset-0">
                <img 
                  src={selectedUniversity.image_url} 
                  alt={selectedUniversity.name_ar}
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
            )}
            <div className="relative p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                {selectedUniversity.logo_url && (
                  <img 
                    src={selectedUniversity.logo_url} 
                    alt={selectedUniversity.name_ar}
                    className="w-16 h-16 rounded-lg object-cover bg-white p-2"
                  />
                )}
                <div>
                  <h1 className="text-4xl font-bold">{selectedUniversity.name_ar}</h1>
                  {selectedUniversity.city && selectedUniversity.countries && (
                    <div className="flex items-center gap-2 mt-2">
                      {selectedUniversity.countries.flag_url && (
                        <img 
                          src={selectedUniversity.countries.flag_url} 
                          alt={selectedUniversity.countries.name_ar}
                          className="w-6 h-4 rounded object-cover"
                        />
                      )}
                      <p className="text-lg opacity-90">
                        {selectedUniversity.city}, {selectedUniversity.countries.name_ar}
                      </p>
                    </div>
                  )}
                </div>
                {selectedUniversity.is_featured && (
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    <Star className="w-4 h-4 mr-1" />
                    مميزة
                  </Badge>
                )}
              </div>
              <p className="text-xl opacity-90">{selectedUniversity.description_ar}</p>
            </div>
          </div>

          {/* University Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {selectedUniversity.world_ranking && (
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">الترتيب العالمي</p>
                    <p className="font-semibold">#{selectedUniversity.world_ranking}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedUniversity.tuition_fee_min && (
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">الرسوم الدراسية</p>
                    <p className="font-semibold">
                      ${selectedUniversity.tuition_fee_min?.toLocaleString()} - ${selectedUniversity.tuition_fee_max?.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedUniversity.student_count && (
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">عدد الطلاب</p>
                    <p className="font-semibold">{selectedUniversity.student_count?.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedUniversity.acceptance_rate && (
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">معدل القبول</p>
                    <p className="font-semibold">{selectedUniversity.acceptance_rate}%</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Programs */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">البرامج الأكاديمية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <Card key={program.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{program.name_ar}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{program.degree_level}</Badge>
                      <Badge variant="outline">{program.field_of_study}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {program.description_ar?.substring(0, 100)}...
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
                          <span>الرسوم: ${program.tuition_fee?.toLocaleString()}</span>
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
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">الجامعات المعتمدة</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اكتشف أفضل الجامعات المعتمدة حول العالم واختر الجامعة المناسبة لتخصصك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((university) => (
            <Card key={university.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden rounded-t-lg">
                {university.image_url ? (
                  <img 
                    src={university.image_url} 
                    alt={university.name_ar}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    {university.logo_url ? (
                      <img 
                        src={university.logo_url} 
                        alt={university.name_ar}
                        className="w-24 h-24 object-contain bg-white rounded-lg p-2"
                      />
                    ) : (
                      <span className="text-white text-xl font-bold">{university.name_ar}</span>
                    )}
                  </div>
                )}
                {university.is_featured && (
                  <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                    <Star className="w-4 h-4 mr-1" />
                    مميزة
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <div className="flex items-center gap-3">
                  {university.countries?.flag_url && (
                    <img 
                      src={university.countries.flag_url} 
                      alt={university.countries.name_ar}
                      className="w-6 h-4 rounded object-cover"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{university.name_ar}</CardTitle>
                    {university.city && university.countries && (
                      <p className="text-sm text-muted-foreground">
                        {university.city}, {university.countries.name_ar}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {university.description_ar}
                </p>
                
                <div className="space-y-2 mb-4">
                  {university.world_ranking && (
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>ترتيب عالمي: #{university.world_ranking}</span>
                    </div>
                  )}
                  {university.tuition_fee_min && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span>الرسوم: ${university.tuition_fee_min?.toLocaleString()}+</span>
                    </div>
                  )}
                </div>
                
                <Button asChild className="w-full">
                  <Link to={`/universities/${university.slug}`}>
                    تفاصيل الجامعة
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {universities.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-4">لا توجد جامعات متاحة حالياً</h3>
            <p className="text-muted-foreground">سيتم إضافة المزيد من الجامعات قريباً</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Universities;