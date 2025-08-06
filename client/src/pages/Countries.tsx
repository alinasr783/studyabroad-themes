import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const CountriesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const allDestinations = [
    {
      id: "kyrgyzstan",
      name: "قيرغيزستان",
      flag: "🇰🇬",
      description: "تتميز قيرغيزستان بجامعاتها المعترف بها عالميًا وتكاليف الدراسة المنخفضة، مع برامج دراسية باللغتين الإنجليزية والروسية خاصة في الطب والهندسة.",
      image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      featured: true,
      continent: "asia",
      cost: "منخفضة",
      popularFields: ["الطب", "الهندسة", "إدارة الأعمال"]
    },
    {
      id: "russia",
      name: "روسيا", 
      flag: "🇷🇺",
      description: "تشتهر روسيا بجودة التعليم العالي وبرامجها المتنوعة، خاصة في مجالات الهندسة والطب بتكاليف معقولة مقارنة بالدول الغربية.",
      image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1490&q=80",
      featured: true,
      continent: "europe",
      cost: "متوسطة",
      popularFields: ["الهندسة", "الطب", "تكنولوجيا المعلومات"]
    },
    {
      id: "eu",
      name: "الاتحاد الأوروبي", 
      flag: "🇪🇺",
      description: "تقدم دول الاتحاد الأوروبي تعليمًا عالي الجودة ببرامج متنوعة وبيئات دراسية متعددة الثقافات، مع تركيز على البحث العلمي والتطوير.",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      featured: true,
      continent: "europe",
      cost: "مرتفعة",
      popularFields: ["الهندسة", "علوم الحاسب", "إدارة الأعمال"]
    },
    {
      id: "turkey",
      name: "تركيا",
      flag: "🇹🇷",
      description: "تجمع تركيا بين جودة التعليم الأوروبي وتكاليف معقولة، مع برامج دراسية باللغة الإنجليزية وبيئة طلابية دولية نشطة.",
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      continent: "asia",
      cost: "متوسطة",
      popularFields: ["الطب", "الهندسة", "العلوم السياسية"]
    },
    {
      id: "malaysia",
      name: "ماليزيا",
      flag: "🇲🇾",
      description: "تشتهر ماليزيا بجامعاتها المصنفة عالميًا وتكاليف المعيشة المنخفضة، مع بيئة آمنة وبرامج دراسية باللغة الإنجليزية.",
      image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1557&q=80",
      continent: "asia",
      cost: "منخفضة",
      popularFields: ["تكنولوجيا المعلومات", "إدارة الأعمال", "الهندسة"]
    },
    {
      id: "canada",
      name: "كندا",
      flag: "🇨🇦",
      description: "كندا من أفضل الوجهات الدراسية عالميًا بجامعاتها المرموقة وفرص العمل بعد التخرج، مع مجتمع متعدد الثقافات.",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
      continent: "america",
      cost: "مرتفعة",
      popularFields: ["علوم الحاسب", "الهندسة", "العلوم الصحية"]
    },
    {
      id: "uk",
      name: "المملكة المتحدة",
      flag: "🇬🇧",
      description: "تتميز الجامعات البريطانية بتاريخ عريق وسمعة عالمية، مع تركيز على البحث العلمي والابتكار في مختلف التخصصات.",
      image: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      continent: "europe",
      cost: "مرتفعة",
      popularFields: ["القانون", "الطب", "الأدب الإنجليزي"]
    },
    {
      id: "australia",
      name: "أستراليا",
      flag: "🇦🇺",
      description: "تقدم أستراليا تعليمًا عالي الجودة في بيئة دولية، مع فرص للعمل أثناء الدراسة وبعد التخرج.",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      continent: "australia",
      cost: "مرتفعة",
      popularFields: ["العلوم البحرية", "الهندسة", "السياحة"]
    },
    {
      id: "germany",
      name: "ألمانيا",
      flag: "🇩🇪",
      description: "تشتهر ألمانيا بجامعاتها المميزة وتكاليف الدراسة المنخفضة أو المجانية في بعض الولايات، مع برامج دراسية متنوعة.",
      image: "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      continent: "europe",
      cost: "متوسطة",
      popularFields: ["الهندسة", "الطب", "علوم الحاسب"]
    }
  ];

  const filteredDestinations = activeTab === "all" 
    ? allDestinations 
    : allDestinations.filter(dest => dest.continent === activeTab);

  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Layout >
      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            {/* العنوان الرئيسي مع التبويبات */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold font-cairo mb-4 text-gray-800">
                الوجهات الدراسية حول العالم
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                اكتشف أفضل الدول للدراسة في الخارج حسب تخصصك وميزانيتك
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <Button 
                  variant={activeTab === "all" ? "default" : "outline"} 
                  onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
                  className="rounded-full px-4"
                >
                  جميع الدول
                </Button>
                <Button 
                  variant={activeTab === "asia" ? "default" : "outline"} 
                  onClick={() => { setActiveTab("asia"); setCurrentPage(1); }}
                  className="rounded-full px-4"
                >
                  آسيا
                </Button>
                <Button 
                  variant={activeTab === "europe" ? "default" : "outline"} 
                  onClick={() => { setActiveTab("europe"); setCurrentPage(1); }}
                  className="rounded-full px-4"
                >
                  أوروبا
                </Button>
                <Button 
                  variant={activeTab === "america" ? "default" : "outline"} 
                  onClick={() => { setActiveTab("america"); setCurrentPage(1); }}
                  className="rounded-full px-4"
                >
                  أمريكا
                </Button>
                <Button 
                  variant={activeTab === "australia" ? "default" : "outline"} 
                  onClick={() => { setActiveTab("australia"); setCurrentPage(1); }}
                  className="rounded-full px-4"
                >
                  أستراليا
                </Button>
              </div>
            </div>

            {/* بطاقات الدول */}
            {paginatedDestinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedDestinations.map((destination) => (
                  <div key={destination.id} className="relative group">
                    <Card className="h-full overflow-hidden shadow-sm hover:shadow-md border-gray-200 transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0 h-full flex flex-col">
                        {/* صورة العلم مع العلامة المميزة */}
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={destination.image} 
                            alt={`معالم ${destination.name}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                          {destination.featured && (
                            <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span>مميزة</span>
                            </div>
                          )}
                        </div>

                        {/* محتوى البطاقة */}
                        <div className="p-5 flex-grow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{destination.flag}</span>
                              <h3 className="text-xl font-bold font-cairo text-gray-800">
                                {destination.name}
                              </h3>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              destination.cost === "منخفضة" ? "bg-green-100 text-green-800" :
                              destination.cost === "متوسطة" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {destination.cost}
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                            {destination.description}
                          </p>

                          {/* التخصصات الشائعة */}
                          <div className="mb-5">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">التخصصات الشائعة:</h4>
                            <div className="flex flex-wrap gap-2">
                              {destination.popularFields.map((field, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {field}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* زر التفاصيل */}
                          <Button 
                            asChild
                            className="w-full mt-auto bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            <Link to={`/countries/${destination.id}`} className="flex items-center justify-center gap-2">
                              <span>استكشف الدراسة في {destination.name}</span>
                              <ArrowLeft className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">لا توجد دول متاحة في هذا القسم حالياً</p>
              </div>
            )}

            {/* عناصر التنقل والتحكم */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  {totalPages > 0 ? `الصفحة ${currentPage} من ${totalPages}` : 'لا توجد صفحات'}
                </span>
              </div>

              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link to="/contact" className="font-semibold flex items-center gap-2">
                  احصل على استشارة مجانية
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      </Layout>
    </div>
  );
};

export default CountriesPage;