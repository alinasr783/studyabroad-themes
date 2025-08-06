import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PopularDestinations = () => {
  const destinations = [
    {
      id: "kyrgyzstan",
      name: "دولة قيرغيزستان",
      flag: "🇰🇬",
      description: "التعليم الجامعي في قيرغيزستان يوفر فرصًا مميزة للطلاب الأجانب، مع برامج دراسية معتمدة عالميًا وتكاليف معيشة ودراسة منخفضة.",
      image: "https://d2pi0n2fm836iz.cloudfront.net/617793/0116202519080467895914092f2.png",
      trending: true,
    },
    {
      id: "russia",
      name: "دولة روسيا", 
      flag: "🇷🇺",
      description: "التعليم الجامعي في روسيا يُعد خيارًا شائعًا للطلاب الأجانب، بفضل جامعاتها المعترف بها عالميًا وبرامجها المتنوعة.",
      image: "https://d2pi0n2fm836iz.cloudfront.net/617793/011620251908296789592d77d68.png",
    },
    {
      id: "eu",
      name: "دول الاتحاد الاوروبي",
      flag: "🇪🇺", 
      description: "التعليم الجامعي في دول الاتحاد الأوروبي يتميز بجودة عالية وبرامج دراسية متنوعة تُقدم بلغات متعددة.",
      image: "https://d2pi0n2fm836iz.cloudfront.net/617793/0116202519074667895902a57e8.png",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-cairo mb-4 text-gray-800">
            أشهر الوجهات الدراسية
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف أفضل الوجهات للدراسة في الخارج والتي يختارها الطلاب العرب
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div 
              key={destination.id}
              className="relative group transition-all duration-300 hover:-translate-y-2"
            >
              <Card className="h-full overflow-hidden shadow-sm hover:shadow-md border-gray-200">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Image with overlay */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {destination.trending && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        رائج
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{destination.flag}</span>
                      <h3 className="text-xl font-bold font-cairo text-gray-800">
                        {destination.name}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
                      {destination.description}
                    </p>

                    <Button 
                      asChild
                      variant="link"
                      className="w-full mt-auto px-0 text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      <Link to={`/countries/${destination.id}`} className="flex items-center justify-end">
                        اعرف المزيد
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
            <Link to="/countries" className="font-semibold">
              استعرض جميع الوجهات
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;