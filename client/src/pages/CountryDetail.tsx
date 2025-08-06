import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Globe, Clock, Building2, Star, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// بيانات مؤقتة للدول
const tempCountries = [
  {
    id: "1",
    name_ar: "قيرغيزستان",
    name_en: "Kyrgyzstan",
    slug: "kyrgyzstan",
    description_ar: "تتميز قيرغيزستان بجامعاتها المعترف بها عالميًا وتكاليف الدراسة المنخفضة، مع برامج دراسية باللغتين الإنجليزية والروسية خاصة في الطب والهندسة. النظام التعليمي في قيرغيزستان يتبع المعايير الدولية ويوفر بيئة دراسية متعددة الثقافات.",
    flag_url: "https://flagcdn.com/w320/kg.png",
    image_url: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    language: "القرغيزية، الروسية، الإنجليزية",
    currency: "سوم قرغيزي (KGS)",
    climate: "قاري مع صيف دافئ وشتاء بارد",
    visa_requirements_ar: "تأشيرة طالب لمدة سنة قابلة للتجديد، تتطلب قبول جامعي وإثبات قدرة مالية",
    popular_cities: ["بيشكيك", "أوش", "جلال أباد"],
    study_cost_min: 2000,
    study_cost_max: 4000,
    living_cost_min: 1500,
    living_cost_max: 3000,
    is_trending: true
  },
  {
    id: "2",
    name_ar: "روسيا",
    name_en: "Russia",
    slug: "russia",
    description_ar: "تشتهر روسيا بجودة التعليم العالي وبرامجها المتنوعة، خاصة في مجالات الهندسة والطب بتكاليف معقولة مقارنة بالدول الغربية. الجامعات الروسية لديها تاريخ عريق في التميز الأكاديمي والبحث العلمي.",
    flag_url: "https://flagcdn.com/w320/ru.png",
    image_url: "https://images.unsplash.com/photo-1513326738677-b964603b136d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1490&q=80",
    language: "الروسية، بعض البرامج بالإنجليزية",
    currency: "الروبل الروسي (RUB)",
    climate: "متنوع من القاري إلى القطبي",
    visa_requirements_ar: "تأشيرة طالب لمدة عام مع إمكانية التمديد، تتطلب دعوة رسمية من الجامعة",
    popular_cities: ["موسكو", "سانت بطرسبرغ", "كازان"],
    study_cost_min: 3000,
    study_cost_max: 6000,
    living_cost_min: 3000,
    living_cost_max: 5000,
    is_trending: true
  }
];

// بيانات مؤقتة للجامعات
const tempUniversities = [
  {
    id: "1",
    name_ar: "الجامعة الدولية في قيرغيزستان",
    name_en: "International University of Kyrgyzstan",
    slug: "iuk",
    description_ar: "إحدى أفضل الجامعات في قيرغيزستان وتقدم برامج طبية ممتازة",
    logo_url: "https://via.placeholder.com/100x100?text=IUK",
    image_url: "https://via.placeholder.com/600x400?text=IUK+Campus",
    city: "بيشكيك",
    world_ranking: 3500,
    tuition_fee_min: 2500,
    tuition_fee_max: 4000,
    is_featured: true,
    country_id: "1"
  },
  {
    id: "2",
    name_ar: "جامعة موسكو الحكومية",
    name_en: "Lomonosov Moscow State University",
    slug: "msu",
    description_ar: "أعرق الجامعات الروسية وتصنف من أفضل 100 جامعة عالميًا",
    logo_url: "https://via.placeholder.com/100x100?text=MSU",
    image_url: "https://via.placeholder.com/600x400?text=MSU+Campus",
    city: "موسكو",
    world_ranking: 78,
    tuition_fee_min: 5000,
    tuition_fee_max: 8000,
    is_featured: true,
    country_id: "2"
  }
];

const CountryDetail = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);

  // استخدام البيانات المؤقتة بدلاً من API
  const country = tempCountries.find(c => c.slug === slug) || null;
  const universities = country ? tempUniversities.filter(u => u.country_id === country.id) : [];

  // محاكاة التحميل
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen">
          <Skeleton className="h-[60vh] w-full rounded-none" />
          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!country) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">الدولة غير موجودة</h1>
          <p className="text-muted-foreground">لم يتم العثور على المعلومات المطلوبة</p>
          <Button asChild className="mt-6">
            <Link to="/countries">
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة إلى قائمة الدول
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen" dir="rtl">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <img 
            src={country.image_url} 
            alt={country.name_ar}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-end pb-16 md:items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl text-white">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={country.flag_url} 
                    alt={`علم ${country.name_ar}`}
                    className="w-16 h-12 rounded object-cover shadow-lg border border-white"
                  />
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold">{country.name_ar}</h1>
                    <p className="text-xl text-white/90">{country.name_en}</p>
                  </div>
                </div>

                {country.is_trending && (
                  <Badge className="bg-orange-500 text-white text-base px-4 py-2 hover:bg-orange-600">
                    <Star className="w-4 h-4 mr-2" />
                    وجهة رائجة للدراسة
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 -mt-12 md:-mt-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Country */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Globe className="w-6 h-6 text-primary" />
                    نبذة عن {country.name_ar}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-gray-700">
                    {country.description_ar}
                  </p>
                </CardContent>
              </Card>

              {/* Universities */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Building2 className="w-6 h-6 text-primary" />
                    أفضل الجامعات في {country.name_ar}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {universities.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {universities.map((university) => (
                        <Card key={university.id} className="hover:shadow-xl transition-shadow border border-gray-100">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={university.logo_url} 
                                  alt={university.name_ar}
                                  className="w-12 h-12 rounded object-cover border"
                                />
                                <div>
                                  <h3 className="font-bold text-lg">{university.name_ar}</h3>
                                  <p className="text-sm text-muted-foreground">{university.city}</p>
                                </div>
                              </div>
                              {university.is_featured && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                  مميزة
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Star className="w-4 h-4 text-primary" />
                                <span>الترتيب العالمي: <strong>#{university.world_ranking}</strong></span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="w-4 h-4 text-primary" />
                                <span>الرسوم السنوية: <strong>${university.tuition_fee_min?.toLocaleString()}</strong>
                                {university.tuition_fee_max && ` - $${university.tuition_fee_max?.toLocaleString()}`}</span>
                              </div>
                            </div>
                            <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                              تفاصيل الجامعة
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">لم يتم إضافة جامعات لهذه الدولة بعد</p>
                      <Button variant="outline" className="mt-4">
                        اقترح جامعة
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Facts */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">معلومات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">اللغة الرسمية</p>
                      <p className="text-sm text-gray-600">{country.language}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">العملة</p>
                      <p className="text-sm text-gray-600">{country.currency}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">المناخ</p>
                      <p className="text-sm text-gray-600">{country.climate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Study Costs */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">التكاليف الدراسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold mb-1 text-gray-700">تكلفة الدراسة السنوية</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${country.study_cost_min?.toLocaleString()}
                      {country.study_cost_max && ` - $${country.study_cost_max?.toLocaleString()}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">لبرامج البكالوريوس</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-semibold mb-1 text-gray-700">تكلفة المعيشة السنوية</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${country.living_cost_min?.toLocaleString()}
                      {country.living_cost_max && ` - $${country.living_cost_max?.toLocaleString()}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">تشمل السكن والمعيشة</p>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Cities */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">المدن الطلابية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {country.popular_cities.map((city, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-sm px-3 py-1 border-gray-200 bg-white"
                      >
                        <MapPin className="w-3 h-3 mr-1 text-primary" />
                        {city}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Visa Requirements */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">متطلبات التأشيرة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{country.visa_requirements_ar}</p>
                  </div>
                  <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
                    استشارة تأشيرة مجانية
                  </Button>
                </CardContent>
              </Card>

              {/* Back Button */}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/countries">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  العودة إلى قائمة الدول
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CountryDetail;