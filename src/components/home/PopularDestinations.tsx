import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, GraduationCap, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PopularDestinations = () => {
  const destinations = [
    {
      id: "usa",
      name: "الولايات المتحدة",
      nameEn: "United States",
      flag: "🇺🇸",
      universities: 150,
      students: "5000+",
      popular: true,
      description: "موطن أفضل الجامعات في العالم مثل هارفارد وMIT",
      features: ["تنوع أكاديمي", "فرص عمل ممتازة", "بحث علمي متقدم"],
    },
    {
      id: "canada",
      name: "كندا",
      nameEn: "Canada",
      flag: "🇨🇦",
      universities: 95,
      students: "3500+",
      popular: true,
      description: "تعليم عالي الجودة ومجتمع متعدد الثقافات",
      features: ["رسوم معقولة", "إمكانية الهجرة", "بيئة آمنة"],
    },
    {
      id: "uk",
      name: "المملكة المتحدة",
      nameEn: "United Kingdom",
      flag: "🇬🇧",
      universities: 120,
      students: "4200+",
      popular: true,
      description: "تاريخ عريق في التعليم مع جامعات أكسفورد وكامبريدج",
      features: ["تاريخ أكاديمي", "مدة دراسة قصيرة", "شهادات معترفة"],
    },
    {
      id: "australia",
      name: "أستراليا",
      nameEn: "Australia",
      flag: "🇦🇺",
      universities: 85,
      students: "2800+",
      popular: false,
      description: "تعليم متميز في بيئة طبيعية خلابة",
      features: ["جودة حياة عالية", "مناخ معتدل", "فرص عمل"],
    },
    {
      id: "germany",
      name: "ألمانيا",
      nameEn: "Germany",
      flag: "🇩🇪",
      universities: 110,
      students: "3200+",
      popular: false,
      description: "تعليم مجاني أو منخفض التكلفة مع تركيز على التكنولوجيا",
      features: ["رسوم منخفضة", "قوة اقتصادية", "تقنية متقدمة"],
    },
    {
      id: "france",
      name: "فرنسا",
      nameEn: "France",
      flag: "🇫🇷",
      universities: 75,
      students: "2500+",
      popular: false,
      description: "مركز للثقافة والفنون مع جامعات عريقة",
      features: ["ثقافة غنية", "تعليم متميز", "موقع استراتيجي"],
    },
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold">
            <span className="text-primary">الوجهات</span> الأكثر شعبية
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            اكتشف أفضل الدول للدراسة في الخارج واعثر على الوجهة المثالية التي تناسب أهدافك الأكاديمية والمهنية
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Card 
              key={destination.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30"
            >
              <CardContent className="p-0">
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <span className="text-3xl">{destination.flag}</span>
                      <div>
                        <h3 className="text-xl font-semibold">{destination.name}</h3>
                        <p className="text-sm text-muted-foreground">{destination.nameEn}</p>
                      </div>
                    </div>
                    {destination.popular && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        الأكثر شعبية
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {destination.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{destination.universities} جامعة</span>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                      <Users className="h-4 w-4 text-secondary" />
                      <span className="text-muted-foreground">{destination.students} طالب</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {destination.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <Button 
                    asChild
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    variant="outline"
                  >
                    <Link to={`/countries/${destination.id}`}>
                      اكتشف المزيد
                      <ArrowLeft className="mr-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link to="/countries">
              عرض جميع الدول
              <MapPin className="mr-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;