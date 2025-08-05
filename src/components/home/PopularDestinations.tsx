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
      description: "التعليم الجامعي في قيرغيزستان يوفر فرصًا مميزة للطلاب الأجانب، مع برامج دراسية معتمدة عالميًا وتكاليف معيشة ودراسة منخفضة. تقدم الجامعات تخصصات متنوعة باللغة الإنجليزية أو الروسية، خاصة في مجالات الطب والهندسة، في بيئة متعددة الثقافات وداعمة للطلاب الدوليين.",
      image: "https://d2pi0n2fm836iz.cloudfront.net/617793/0116202519080467895914092f2.png",
      trending: true,
    },
    {
      id: "russia",
      name: "دولة روسيا", 
      flag: "🇷🇺",
      description: "التعليم الجامعي في روسيا يُعد خيارًا شائعًا للطلاب الأجانب، بفضل جامعاتها المعترف بها عالميًا وبرامجها المتنوعة باللغة الروسية والإنجليزية. تتميز روسيا بجودة تعليم عالية، خاصة في مجالات الهندسة، الطب، وتكنولوجيا المعلومات، إلى جانب تكاليف دراسية ومعيشية معقولة مقارنة بالدول الأخرى",
      image: "https://d2pi0n2fm836iz.cloudfront.net/617793/011620251908296789592d77d68.png",
    },
    {
      id: "eu",
      name: "دول الاتحاد الاوروبي",
      flag: "🇪🇺", 
      description: "التعليم الجامعي في دول الاتحاد الأوروبي يتميز بجودة عالية وبرامج دراسية متنوعة تُقدم بلغات متعددة، بما في ذلك الإنجليزية. ومع ذلك، فإن تكاليف الدراسة والمعيشة تكون مرتفعة في العديد من الدول الأوروبية، مما يجعلها وجهة تتطلب تخطيطًا ماليًا دقيقًا للطلاب الدوليين",
      image: "https://d2pi0n2fm836iz.cloudfront.net/617793/0116202519074667895902a57e8.png",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold font-cairo mb-4">
            أشهر الوجهات الدراسية
          </h2>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <Card 
              key={destination.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {destination.trending && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      رائج
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                    <span className="text-2xl">{destination.flag}</span>
                    <h3 className="text-xl font-bold font-cairo">{destination.name}</h3>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                    {destination.description}
                  </p>

                  <Button 
                    asChild
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Link to={`/countries/${destination.id}`}>
                      اعرف اكثر
                      <ArrowLeft className="mr-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;