import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  DollarSign, 
  Building2, 
  GraduationCap, 
  Search, 
  Star,
  Globe, 
  Users, 
  Calendar,
  Flag
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Country {
  id: string;
  name_ar: string;
  name_en: string;
  flag_url?: string;
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
}

const UniversitiesPage = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch countries
        const { data: countriesData, error: countriesError } = await supabase
          .from('countries')
          .select('id, name_ar, name_en, flag_url')
          .order('name_ar');

        if (countriesError) throw countriesError;

        // Fetch universities
        const { data: universitiesData, error: universitiesError } = await supabase
          .from('universities')
          .select('*')
          .order('name_ar');

        if (universitiesError) throw universitiesError;

        setCountries(countriesData || []);
        setUniversities(universitiesData || []);
        setFilteredUniversities(universitiesData || []);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter universities based on search and selected country
    let result = [...universities];

    if (selectedCountry) {
      result = result.filter(u => u.country_id === selectedCountry);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name_ar?.toLowerCase().includes(query) || 
        u.name_en?.toLowerCase().includes(query) ||
        u.city?.toLowerCase().includes(query)
      );
    }

    setFilteredUniversities(result);
  }, [selectedCountry, searchQuery, universities]);

  const getCountryName = (countryId: string | undefined) => {
    if (!countryId) return "";
    const country = countries.find(c => c.id === countryId);
    return country?.name_ar || "";
  };

  const getCountryFlag = (countryId: string | undefined) => {
    if (!countryId) return null;
    const country = countries.find(c => c.id === countryId);
    return country?.flag_url || null;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "غير محدد";
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen">
          <section className="relative h-[40vh] min-h-[300px] overflow-hidden bg-gradient-to-br from-primary to-secondary">
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 text-center">
                <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-16 h-16 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-red-500 max-w-md mx-auto p-6 bg-red-50 rounded-lg">
            <Building2 className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">حدث خطأ في جلب البيانات</h3>
            <p className="mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
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
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ابحث عن جامعة..."
                className="pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-full md:w-auto">
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={selectedCountry || ""}
                onChange={(e) => setSelectedCountry(e.target.value || null)}
              >
                <option value="">كل الدول</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name_ar}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Countries Quick Filter */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-right">تصفح حسب الدولة</h2>
            <div className="flex flex-wrap gap-2">
              {countries.map((country) => (
                <Button
                  key={country.id}
                  variant={selectedCountry === country.id ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => setSelectedCountry(selectedCountry === country.id ? null : country.id)}
                >
                  {country.flag_url ? (
                    <img 
                      src={country.flag_url} 
                      alt={country.name_ar}
                      className="w-6 h-4 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-flag.png';
                      }}
                    />
                  ) : (
                    <Flag className="w-4 h-4" />
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
                  ? `جامعات ${getCountryName(selectedCountry)}` 
                  : "أهم الجامعات العالمية"}
                <span className="text-sm font-normal text-muted-foreground mr-2">
                  ({filteredUniversities.length} جامعة)
                </span>
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
                  <Card 
                    key={university.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/universities/${university.slug}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        {university.logo_url ? (
                          <img 
                            src={university.logo_url} 
                            alt={university.name_ar}
                            className="w-16 h-16 rounded-lg bg-white p-2 shadow-sm border object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-university.png';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-100 p-2 shadow-sm border flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-lg">{university.name_ar}</CardTitle>
                          <p className="text-sm text-muted-foreground">{university.name_en}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {university.country_id && getCountryFlag(university.country_id) ? (
                              <img 
                                src={getCountryFlag(university.country_id)} 
                                alt={getCountryName(university.country_id)}
                                className="w-6 h-4 object-cover rounded"
                              />
                            ) : (
                              <Flag className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className="text-sm text-muted-foreground">
                              {university.city && `${university.city}, `}
                              {getCountryName(university.country_id)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {university.is_featured && (
                          <Badge className="bg-accent text-accent-foreground">
                            <Star className="w-3 h-3 mr-1" /> مميزة
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
                            <span>الرسوم: ${university.tuition_fee_min.toLocaleString()}</span>
                          </div>
                        )}
                        {university.student_count && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-primary" />
                            <span>الطلاب: {university.student_count.toLocaleString()}</span>
                          </div>
                        )}
                        {university.acceptance_rate && (
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            <span>القبول: {(university.acceptance_rate * 100).toFixed(1)}%</span>
                          </div>
                        )}
                        {university.application_deadline && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>آخر موعد: {formatDate(university.application_deadline)}</span>
                          </div>
                        )}
                      </div>

                      <Button className="w-full">
                        عرض التفاصيل
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
                    ? `لا توجد جامعات مسجلة لـ ${getCountryName(selectedCountry)}`
                    : searchQuery
                    ? "لا توجد نتائج تطابق بحثك"
                    : "لا توجد جامعات مسجلة في قاعدة البيانات"}
                </p>
                {(selectedCountry || searchQuery) && (
                  <Button 
                    variant="ghost" 
                    className="mt-4"
                    onClick={() => {
                      setSelectedCountry(null);
                      setSearchQuery("");
                    }}
                  >
                    عرض جميع الجامعات
                  </Button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default UniversitiesPage;