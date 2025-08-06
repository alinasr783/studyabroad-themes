import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Globe, Users, Building2, GraduationCap, Star, Calendar } from "lucide-react";

// أنواع البيانات
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

const UniversitiesPage = () => {
  // بيانات الدول الوهمية
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
    },
    {
      id: "6",
      name_ar: "فرنسا",
      name_en: "France",
      slug: "france",
      flag_url: "https://flagcdn.com/w320/fr.png",
      capital: "باريس",
      is_featured: false
    },
    {
      id: "7",
      name_ar: "اليابان",
      name_en: "Japan",
      slug: "japan",
      flag_url: "https://flagcdn.com/w320/jp.png",
      capital: "طوكيو",
      is_featured: false
    },
    {
      id: "8",
      name_ar: "ماليزيا",
      name_en: "Malaysia",
      slug: "malaysia",
      flag_url: "https://flagcdn.com/w320/my.png",
      capital: "كوالالمبور",
      is_featured: false
    }
  ];

  // بيانات الجامعات الوهمية
  const dummyUniversities: University[] = [
    {
      id: "1",
      name_ar: "جامعة هارفارد",
      name_en: "Harvard University",
      slug: "harvard-university",
      description_ar: "جامعة هارفارد هي أقدم مؤسسة للتعليم العالي في الولايات المتحدة وتعتبر من أعرق الجامعات في العالم.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_logo.svg/1200px-Harvard_University_logo.svg.png",
      image_url: "https://example.com/harvard.jpg",
      city: "كامبريدج",
      website_url: "https://www.harvard.edu",
      world_ranking: 1,
      tuition_fee_min: 50000,
      tuition_fee_max: 55000,
      student_count: 21000,
      acceptance_rate: 5,
      international_students_percentage: 23,
      language_requirements: "شهادة توفل بحد أدنى 100 أو آيلتس بحد أدنى 7.0",
      is_featured: true,
      country_id: "1",
      countries: dummyCountries[0]
    },
    {
      id: "2",
      name_ar: "جامعة ستانفورد",
      name_en: "Stanford University",
      slug: "stanford-university",
      description_ar: "جامعة ستانفورد هي جامعة بحثية خاصة تقع في ستانفورد بولاية كاليفورنيا.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Stanford_University_logo_2008.svg/1200px-Stanford_University_logo_2008.svg.png",
      image_url: "https://example.com/stanford.jpg",
      city: "ستانفورد",
      website_url: "https://www.stanford.edu",
      world_ranking: 2,
      tuition_fee_min: 52000,
      tuition_fee_max: 54000,
      student_count: 17000,
      acceptance_rate: 4,
      international_students_percentage: 24,
      language_requirements: "شهادة توفل بحد أدنى 100 أو آيلتس بحد أدنى 7.0",
      is_featured: true,
      country_id: "1",
      countries: dummyCountries[0]
    },
    {
      id: "3",
      name_ar: "جامعة كامبريدج",
      name_en: "University of Cambridge",
      slug: "university-of-cambridge",
      description_ar: "جامعة كامبريدج هي جامعة بحثية عامة في المملكة المتحدة وتعد ثاني أقدم جامعة في العالم الناطق باللغة الإنجليزية.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/University_of_Cambridge_coat_of_arms.svg/1200px-University_of_Cambridge_coat_of_arms.svg.png",
      image_url: "https://example.com/cambridge.jpg",
      city: "كامبريدج",
      website_url: "https://www.cam.ac.uk",
      world_ranking: 3,
      tuition_fee_min: 30000,
      tuition_fee_max: 35000,
      student_count: 19000,
      acceptance_rate: 21,
      international_students_percentage: 35,
      language_requirements: "شهادة توفل بحد أدنى 110 أو آيلتس بحد أدنى 7.5",
      is_featured: true,
      country_id: "2",
      countries: dummyCountries[1]
    },
    {
      id: "4",
      name_ar: "جامعة أكسفورد",
      name_en: "University of Oxford",
      slug: "university-of-oxford",
      description_ar: "جامعة أكسفورد هي أقدم جامعة في العالم الناطق باللغة الإنجليزية وتقع في مدينة أكسفورد بإنجلترا.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/University_of_Oxford.svg/1200px-University_of_Oxford.svg.png",
      image_url: "https://example.com/oxford.jpg",
      city: "أكسفورد",
      website_url: "https://www.ox.ac.uk",
      world_ranking: 4,
      tuition_fee_min: 28000,
      tuition_fee_max: 32000,
      student_count: 22000,
      acceptance_rate: 17,
      international_students_percentage: 43,
      language_requirements: "شهادة توفل بحد أدنى 110 أو آيلتس بحد أدنى 7.5",
      is_featured: true,
      country_id: "2",
      countries: dummyCountries[1]
    },
    {
      id: "5",
      name_ar: "معهد ماساتشوستس للتكنولوجيا",
      name_en: "Massachusetts Institute of Technology",
      slug: "massachusetts-institute-of-technology",
      description_ar: "معهد ماساتشوستس للتكنولوجيا هي جامعة بحثية خاصة في كامبريدج، ماساتشوستس.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png",
      image_url: "https://example.com/mit.jpg",
      city: "كامبريدج",
      website_url: "https://www.mit.edu",
      world_ranking: 5,
      tuition_fee_min: 53000,
      tuition_fee_max: 55000,
      student_count: 11000,
      acceptance_rate: 7,
      international_students_percentage: 33,
      language_requirements: "شهادة توفل بحد أدنى 100 أو آيلتس بحد أدنى 7.0",
      is_featured: true,
      country_id: "1",
      countries: dummyCountries[0]
    },
    {
      id: "6",
      name_ar: "جامعة تورنتو",
      name_en: "University of Toronto",
      slug: "university-of-toronto",
      description_ar: "جامعة تورنتو هي جامعة بحثية عامة في تورنتو، أونتاريو، كندا.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/University_of_Toronto_logo.svg/1200px-University_of_Toronto_logo.svg.png",
      image_url: "https://example.com/toronto.jpg",
      city: "تورنتو",
      website_url: "https://www.utoronto.ca",
      world_ranking: 18,
      tuition_fee_min: 45000,
      tuition_fee_max: 50000,
      student_count: 90000,
      acceptance_rate: 43,
      international_students_percentage: 25,
      language_requirements: "شهادة توفل بحد أدنى 90 أو آيلتس بحد أدنى 6.5",
      is_featured: false,
      country_id: "3",
      countries: dummyCountries[2]
    },
    {
      id: "7",
      name_ar: "جامعة ملبورن",
      name_en: "University of Melbourne",
      slug: "university-of-melbourne",
      description_ar: "جامعة ملبورن هي جامعة بحثية عامة تقع في ملبورن، أستراليا.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/University_of_Melbourne_logo.svg/1200px-University_of_Melbourne_logo.svg.png",
      image_url: "https://example.com/melbourne.jpg",
      city: "ملبورن",
      website_url: "https://www.unimelb.edu.au",
      world_ranking: 33,
      tuition_fee_min: 35000,
      tuition_fee_max: 40000,
      student_count: 48000,
      acceptance_rate: 70,
      international_students_percentage: 48,
      language_requirements: "شهادة توفل بحد أدنى 79 أو آيلتس بحد أدنى 6.5",
      is_featured: false,
      country_id: "4",
      countries: dummyCountries[3]
    },
    {
      id: "8",
      name_ar: "جامعة لودفيغ ماكسيميليان في ميونخ",
      name_en: "Ludwig Maximilian University of Munich",
      slug: "ludwig-maximilian-university-of-munich",
      description_ar: "جامعة لودفيغ ماكسيميليان في ميونخ هي جامعة بحثية عامة تقع في ميونخ، ألمانيا.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_Ludwig-Maximilians-Universit%C3%A4t_M%C3%BCnchen.svg/1200px-Logo_Ludwig-Maximilians-Universit%C3%A4t_M%C3%BCnchen.svg.png",
      image_url: "https://example.com/munich.jpg",
      city: "ميونخ",
      website_url: "https://www.lmu.de",
      world_ranking: 63,
      tuition_fee_min: 1000,
      tuition_fee_max: 1500,
      student_count: 51000,
      acceptance_rate: 80,
      international_students_percentage: 17,
      language_requirements: "شهادة توفل بحد أدنى 80 أو آيلتس بحد أدنى 6.0 أو شهادة لغة ألمانية",
      is_featured: false,
      country_id: "5",
      countries: dummyCountries[4]
    }
  ];

  const [countries, setCountries] = useState<Country[]>(dummyCountries);
  const [universities, setUniversities] = useState<University[]>(dummyUniversities);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const filteredUniversities = selectedCountry
    ? universities.filter(u => u.country_id === selectedCountry)
    : universities;

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
                    : "جاري تحميل البيانات أو لا توجد جامعات مسجلة"}
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