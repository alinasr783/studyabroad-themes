import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Globe, Users, Building2, GraduationCap, Star, Calendar } from "lucide-react";

// أنواع البيانات المنسقة مع ملف الجامعات
interface Country {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  flag_url?: string;
  description_ar?: string;
  capital?: string;
  population?: number;
  area?: number;
  languages?: string;
  currency?: string;
  time_zone?: string;
  calling_code?: string;
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
  local_ranking?: number;
  tuition_fee_min?: number;
  tuition_fee_max?: number;
  student_count?: number;
  acceptance_rate?: number;
  international_students_percentage?: number;
  language_requirements?: string;
  application_deadline?: string;
  is_featured?: boolean;
  country_id?: string;
  countries?: Country;
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
  university_id?: string;
}

const UniversityDetail = () => {
  const { slug } = useParams();
  const [university, setUniversity] = useState<University | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);

  // بيانات الدول الوهمية من ملف الجامعات
  const dummyCountries: Country[] = [
    {
      id: "1",
      name_ar: "الولايات المتحدة",
      name_en: "United States",
      slug: "united-states",
      flag_url: "https://flagcdn.com/w320/us.png",
      capital: "واشنطن العاصمة",
      is_featured: true
    },
    {
      id: "2",
      name_ar: "المملكة المتحدة",
      name_en: "United Kingdom",
      slug: "united-kingdom",
      flag_url: "https://flagcdn.com/w320/gb.png",
      capital: "لندن",
      is_featured: true
    },
    {
      id: "3",
      name_ar: "كندا",
      name_en: "Canada",
      slug: "canada",
      flag_url: "https://flagcdn.com/w320/ca.png",
      capital: "أوتاوا",
      is_featured: true
    },
    {
      id: "4",
      name_ar: "أستراليا",
      name_en: "Australia",
      slug: "australia",
      flag_url: "https://flagcdn.com/w320/au.png",
      capital: "كانبرا",
      is_featured: true
    },
    {
      id: "5",
      name_ar: "ألمانيا",
      name_en: "Germany",
      slug: "germany",
      flag_url: "https://flagcdn.com/w320/de.png",
      capital: "برلين",
      is_featured: true
    }
  ];

  // بيانات الجامعات الوهمية من ملف الجامعات
  const dummyUniversities: University[] = [
    {
      id: "1",
      name_ar: "جامعة هارفارد",
      name_en: "Harvard University",
      slug: "harvard-university",
      description_ar: "جامعة هارفارد هي أقدم مؤسسة للتعليم العالي في الولايات المتحدة وتعتبر من أعرق الجامعات في العالم. تأسست عام 1636 وتضم أكثر من 20,000 طالب في مختلف التخصصات.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_logo.svg/1200px-Harvard_University_logo.svg.png",
      image_url: "https://www.harvard.edu/wp-content/uploads/2020/07/harvard-yard-1800x1200.jpg",
      city: "كامبريدج",
      website_url: "https://www.harvard.edu",
      world_ranking: 1,
      tuition_fee_min: 50000,
      tuition_fee_max: 55000,
      student_count: 21000,
      acceptance_rate: 5,
      international_students_percentage: 23,
      language_requirements: "شهادة توفل بحد أدنى 100 أو آيلتس بحد أدنى 7.0",
      application_deadline: "2024-01-01",
      is_featured: true,
      country_id: "1",
      countries: dummyCountries[0]
    },
    {
      id: "2",
      name_ar: "جامعة ستانفورد",
      name_en: "Stanford University",
      slug: "stanford-university",
      description_ar: "جامعة ستانفورد هي جامعة بحثية خاصة تقع في ستانفورد بولاية كاليفورنيا. تأسست عام 1885 وتشتهر بقوتها في مجالات التكنولوجيا وريادة الأعمال.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Stanford_University_logo_2008.svg/1200px-Stanford_University_logo_2008.svg.png",
      image_url: "https://www.stanford.edu/wp-content/uploads/2017/03/stanford-campus-aerial-view.jpg",
      city: "ستانفورد",
      website_url: "https://www.stanford.edu",
      world_ranking: 2,
      tuition_fee_min: 52000,
      tuition_fee_max: 54000,
      student_count: 17000,
      acceptance_rate: 4,
      international_students_percentage: 24,
      language_requirements: "شهادة توفل بحد أدنى 100 أو آيلتس بحد أدنى 7.0",
      application_deadline: "2024-01-05",
      is_featured: true,
      country_id: "1",
      countries: dummyCountries[0]
    },
    {
      id: "3",
      name_ar: "جامعة كامبريدج",
      name_en: "University of Cambridge",
      slug: "university-of-cambridge",
      description_ar: "جامعة كامبريدج هي جامعة بحثية عامة في المملكة المتحدة وتعد ثاني أقدم جامعة في العالم الناطق باللغة الإنجليزية. تأسست عام 1209 ولديها 31 كلية.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/University_of_Cambridge_coat_of_arms.svg/1200px-University_of_Cambridge_coat_of_arms.svg.png",
      image_url: "https://www.cam.ac.uk/sites/www.cam.ac.uk/files/styles/content-885x432/public/news/research/news/king_s_college_from_the_back.jpg",
      city: "كامبريدج",
      website_url: "https://www.cam.ac.uk",
      world_ranking: 3,
      tuition_fee_min: 30000,
      tuition_fee_max: 35000,
      student_count: 19000,
      acceptance_rate: 21,
      international_students_percentage: 35,
      language_requirements: "شهادة توفل بحد أدنى 110 أو آيلتس بحد أدنى 7.5",
      application_deadline: "2024-01-15",
      is_featured: true,
      country_id: "2",
      countries: dummyCountries[1]
    },
    {
      id: "4",
      name_ar: "جامعة أكسفورد",
      name_en: "University of Oxford",
      slug: "university-of-oxford",
      description_ar: "جامعة أكسفورد هي أقدم جامعة في العالم الناطق باللغة الإنجليزية وتقع في مدينة أكسفورد بإنجلترا. تضم 38 كلية و6 قاعات خاصة.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/University_of_Oxford.svg/1200px-University_of_Oxford.svg.png",
      image_url: "https://www.ox.ac.uk/sites/files/oxford/styles/ow_medium_feature/public/field/field_image_main/oxford_0.jpg",
      city: "أكسفورد",
      website_url: "https://www.ox.ac.uk",
      world_ranking: 4,
      tuition_fee_min: 28000,
      tuition_fee_max: 32000,
      student_count: 22000,
      acceptance_rate: 17,
      international_students_percentage: 43,
      language_requirements: "شهادة توفل بحد أدنى 110 أو آيلتس بحد أدنى 7.5",
      application_deadline: "2024-01-10",
      is_featured: true,
      country_id: "2",
      countries: dummyCountries[1]
    },
    {
      id: "5",
      name_ar: "معهد ماساتشوستس للتكنولوجيا",
      name_en: "Massachusetts Institute of Technology",
      slug: "massachusetts-institute-of-technology",
      description_ar: "معهد ماساتشوستس للتكنولوجيا هي جامعة بحثية خاصة في كامبريدج، ماساتشوستس. تأسست عام 1861 وتشتهر بالبحث العلمي والتكنولوجيا.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png",
      image_url: "https://web.mit.edu/sites/default/files/images/202106/MIT%20Great%20Dome%20and%20Killian%20Court.jpg",
      city: "كامبريدج",
      website_url: "https://www.mit.edu",
      world_ranking: 5,
      tuition_fee_min: 53000,
      tuition_fee_max: 55000,
      student_count: 11000,
      acceptance_rate: 7,
      international_students_percentage: 33,
      language_requirements: "شهادة توفل بحد أدنى 100 أو آيلتس بحد أدنى 7.0",
      application_deadline: "2024-01-03",
      is_featured: true,
      country_id: "1",
      countries: dummyCountries[0]
    }
  ];

  // بيانات البرامج الوهمية
  const dummyPrograms: Program[] = [
    {
      id: "1",
      name_ar: "بكالوريوس علوم الحاسوب",
      name_en: "Bachelor of Computer Science",
      slug: "computer-science",
      description_ar: "برنامج علوم الحاسوب يقدم أساسيات البرمجة والخوارزميات وهندسة البرمجيات والذكاء الاصطناعي.",
      degree_level: "بكالوريوس",
      field_of_study: "علوم الحاسوب",
      duration_years: 4,
      tuition_fee: 52000,
      language: "الإنجليزية",
      start_date: "2024-09-01",
      application_deadline: "2024-01-01",
      requirements_ar: "شهادة ثانوية بمعدل لا يقل عن 90% + اجتياز اختبار الرياضيات + شهادة توفل",
      career_prospects_ar: "مبرمج، مهندس برمجيات، محلل نظم، خبير أمن معلوماتي",
      is_featured: true,
      university_id: "1"
    },
    {
      id: "2",
      name_ar: "ماجستير إدارة الأعمال",
      name_en: "Master of Business Administration",
      slug: "mba",
      description_ar: "برنامج MBA مصمم لتطوير المهارات القيادية والإدارية في قطاعات الأعمال المختلفة.",
      degree_level: "ماجستير",
      field_of_study: "إدارة الأعمال",
      duration_years: 2,
      tuition_fee: 75000,
      language: "الإنجليزية",
      start_date: "2024-09-01",
      application_deadline: "2024-03-15",
      requirements_ar: "بكالوريوس في أي تخصص + خبرة عمل سنتين + رسائل توصية + شهادة توفل",
      career_prospects_ar: "مدير تنفيذي، مدير مشاريع، استشاري إداري، رجل أعمال",
      is_featured: true,
      university_id: "1"
    },
    {
      id: "3",
      name_ar: "دكتوراه في الطب",
      name_en: "Doctor of Medicine",
      slug: "medicine",
      description_ar: "برنامج الطب يقدم تعليماً شاملاً في العلوم الطبية الأساسية والإكلينيكية.",
      degree_level: "دكتوراه",
      field_of_study: "الطب البشري",
      duration_years: 6,
      tuition_fee: 60000,
      language: "الإنجليزية",
      start_date: "2024-09-01",
      application_deadline: "2024-02-01",
      requirements_ar: "شهادة ثانوية بمعدل ممتاز + اجتياز اختبار القبول + شهادة توفل",
      career_prospects_ar: "طبيب عام، أخصائي، باحث طبي",
      is_featured: false,
      university_id: "1"
    }
  ];

  useEffect(() => {
    if (slug) {
      // Simulate API call with mock data
      const foundUniversity = dummyUniversities.find(u => u.slug === slug);
      setUniversity(foundUniversity || null);

      // Get programs for this university
      if (foundUniversity) {
        const universityPrograms = dummyPrograms.filter(p => p.university_id === foundUniversity.id);
        setPrograms(universityPrograms);
      } else {
        setPrograms([]);
      }
    }
  }, [slug]);

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