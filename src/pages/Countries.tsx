import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  MapPin, 
  GraduationCap, 
  Users, 
  TrendingUp,
  ArrowLeft,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Countries = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const countries = [
    {
      id: "usa",
      name: "الولايات المتحدة",
      nameEn: "United States",
      flag: "🇺🇸",
      region: "north-america",
      capital: "واشنطن",
      universities: 150,
      students: 5200,
      trending: true,
      popular: true,
      description: "موطن أفضل الجامعات في العالم مع تنوع أكاديمي لا مثيل له",
      features: ["تنوع أكاديمي", "فرص بحثية", "شبكة خريجين قوية"],
      averageCost: "$25,000 - $60,000",
      language: "الإنجليزية",
      programs: ["الهندسة", "الطب", "إدارة الأعمال", "علوم الحاسوب"],
    },
    {
      id: "canada",
      name: "كندا",
      nameEn: "Canada",
      flag: "🇨🇦",
      region: "north-america",
      capital: "أوتاوا",
      universities: 95,
      students: 3500,
      trending: true,
      popular: true,
      description: "تعليم عالي الجودة مع مجتمع متعدد الثقافات وبيئة آمنة",
      features: ["رسوم معقولة", "إمكانية الهجرة", "بيئة آمنة"],
      averageCost: "$15,000 - $35,000",
      language: "الإنجليزية والفرنسية",
      programs: ["الهندسة", "التقنية", "العلوم الطبية", "الأعمال"],
    },
    {
      id: "uk",
      name: "المملكة المتحدة",
      nameEn: "United Kingdom",
      flag: "🇬🇧",
      region: "europe",
      capital: "لندن",
      universities: 120,
      students: 4200,
      trending: false,
      popular: true,
      description: "تاريخ عريق في التعليم مع جامعات مرموقة عالمياً",
      features: ["تاريخ أكاديمي", "مدة دراسة قصيرة", "شهادات معترفة"],
      averageCost: "$20,000 - $45,000",
      language: "الإنجليزية",
      programs: ["الطب", "القانون", "الأدب", "العلوم"],
    },
    {
      id: "australia",
      name: "أستراليا",
      nameEn: "Australia",
      flag: "🇦🇺",
      region: "oceania",
      capital: "كانبرا",
      universities: 85,
      students: 2800,
      trending: true,
      popular: false,
      description: "تعليم متميز في بيئة طبيعية خلابة مع جودة حياة عالية",
      features: ["جودة حياة", "مناخ معتدل", "فرص عمل"],
      averageCost: "$18,000 - $40,000",
      language: "الإنجليزية",
      programs: ["الهندسة", "الطب البيطري", "البيئة", "التقنية"],
    },
    {
      id: "germany",
      name: "ألمانيا",
      nameEn: "Germany",
      flag: "🇩🇪",
      region: "europe",
      capital: "برلين",
      universities: 110,
      students: 3200,
      trending: true,
      popular: false,
      description: "تعليم مجاني أو منخفض التكلفة مع تركيز على التكنولوجيا",
      features: ["رسوم منخفضة", "قوة اقتصادية", "تقنية متقدمة"],
      averageCost: "$0 - $5,000",
      language: "الألمانية",
      programs: ["الهندسة", "التقنية", "الطب", "العلوم"],
    },
    {
      id: "france",
      name: "فرنسا",
      nameEn: "France",
      flag: "🇫🇷",
      region: "europe",
      capital: "باريس",
      universities: 75,
      students: 2500,
      trending: false,
      popular: false,
      description: "مركز للثقافة والفنون مع جامعات عريقة ومتنوعة",
      features: ["ثقافة غنية", "تعليم متميز", "موقع استراتيجي"],
      averageCost: "$3,000 - $15,000",
      language: "الفرنسية",
      programs: ["الفنون", "الطب", "الهندسة", "الأعمال"],
    },
  ];

  const regions = [
    { value: "all", label: "جميع المناطق" },
    { value: "north-america", label: "أمريكا الشمالية" },
    { value: "europe", label: "أوروبا" },
    { value: "oceania", label: "أوقيانوسيا" },
    { value: "asia", label: "آسيا" },
  ];

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10">
        <div className="container">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <Globe className="h-8 w-8 text-primary" />
              <h1 className="text-4xl lg:text-5xl font-bold">
                اكتشف <span className="text-primary">وجهتك</span> التعليمية
              </h1>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              اختر من بين أفضل الدول في العالم للدراسة واعثر على الجامعات والبرامج 
              التي تناسب أهدافك الأكاديمية والمهنية
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن الدولة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-right"
              />
            </div>

            {/* Region Filter */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-right"
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredCountries.length} دولة متاحة
            </div>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCountries.map((country) => (
              <Card 
                key={country.id}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30"
              >
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="text-4xl">{country.flag}</span>
                        <div>
                          <h3 className="text-xl font-semibold">{country.name}</h3>
                          <p className="text-sm text-muted-foreground">{country.nameEn}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        {country.trending && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            رائج
                          </Badge>
                        )}
                        {country.popular && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            شائع
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {country.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{country.universities} جامعة</span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                          <Users className="h-4 w-4 text-secondary" />
                          <span className="text-muted-foreground">{country.students.toLocaleString()}+ طالب</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{country.capital}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">اللغة: {country.language}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm font-medium text-foreground">متوسط التكلفة السنوية</div>
                      <div className="text-lg font-bold text-primary">{country.averageCost}</div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {country.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Programs Preview */}
                    <div className="mb-6">
                      <div className="text-sm font-medium mb-2">التخصصات الشائعة:</div>
                      <div className="flex flex-wrap gap-2">
                        {country.programs.slice(0, 3).map((program, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {program}
                          </Badge>
                        ))}
                        {country.programs.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{country.programs.length - 3} المزيد
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="px-6 pb-6">
                    <Button 
                      asChild
                      className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                      variant="outline"
                    >
                      <Link to={`/countries/${country.id}`}>
                        اكتشف الجامعات والبرامج
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCountries.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لم نجد أي نتائج</h3>
              <p className="text-muted-foreground">جرب تغيير كلمات البحث أو الفلاتر</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Countries;