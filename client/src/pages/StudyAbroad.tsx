import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, GraduationCap, Clock, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const PopularDestinationsSection = () => {
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

const StudyAbroad = () => {
  return (
    <Layout>
      <PopularDestinationsSection />
      
      {/* Video Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-cairo mb-4">
              الدراسة في قيرغيزستان
            </h2>
            <p className="text-xl text-muted-foreground">
              قيرغيزستان أصبحت وجهة شائعة للطلاب الدوليين، خاصة في مجالات الطب والهندسة
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold font-cairo mb-4">
                  معلومات عن دولة قيرغيزستان
                </h3>
                <p className="text-muted-foreground mb-6">
                  يقدمها د/ محمد صلاح الدسوقي المدير التنفيذي للشركة
                </p>
                
                {/* Placeholder for video */}
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎥</div>
                    <p className="text-muted-foreground">فيديو تعريفي عن الدراسة في قيرغيزستان</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">ابدأ مغامرتك الدراسية</h4>
                      <p className="text-sm text-muted-foreground">
                        اكتشف الفرص المتاحة في قيرغيزستان
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">استقبال الطلاب</h4>
                      <p className="text-sm text-muted-foreground">
                        متابعة ورعاية شاملة للطلاب
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-cairo mb-4">
              **تواصل مع أكثر من 250 جامعة تتعاون معنا**
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              "https://d2pi0n2fm836iz.cloudfront.net/617793/011620251943216789615945ea9.png",
              "https://d2pi0n2fm836iz.cloudfront.net/617793/0116202519334367895f17d38e8.png", 
              "https://d2pi0n2fm836iz.cloudfront.net/617793/0116202519315367895ea998e63.png",
              "https://d2pi0n2fm836iz.cloudfront.net/617793/0116202519371367895fe9e1b6b.png",
              "https://d2pi0n2fm836iz.cloudfront.net/617793/01162025194131678960ebbbaa1.png",
              "https://d2pi0n2fm836iz.cloudfront.net/617793/011620251943216789615945ea9.png",
            ].map((logo, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={logo} 
                  alt={`University ${index + 1}`}
                  className="w-full h-16 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
            <CardContent className="p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl lg:text-4xl font-bold font-cairo">
                    انضم إلى طلابنا ودعنا نكون شريكك في رحلتك نحو النجاح والتخرج
                  </h2>
                  <p className="text-xl text-blue-100">
                    خطوة واحدة تفصلك عن تحقيق حلمك... تواصل معنا الآن
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      asChild
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-gray-100"
                    >
                      <Link to="/about">
                        لماذا نحن
                      </Link>
                    </Button>
                    <Button 
                      asChild
                      variant="outline" 
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-blue-600"
                    >
                      <Link to="/contact">
                        اتصل بنا
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <img 
                    src="https://d2pi0n2fm836iz.cloudfront.net/488796/05102023153512645bb9b085666.png" 
                    alt="Students success"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA for Kyrgyzstan */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold font-cairo mb-4">
                **ادرس في قيرغيزستان**
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                اشهر وجهة دراسية الان
              </p>
              
              <Button 
                asChild
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Link to="/countries/kyrgyzstan">
                  تعرف على المزيد
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>

              <div className="mt-8">
                <img 
                  src="https://d2pi0n2fm836iz.cloudfront.net/617793/01172025122046678a4b1e9f4e7.pexels-photo-8624849.jpeg" 
                  alt="Study in Kyrgyzstan"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-cairo mb-4">
              لا يزال لديك أسئلة؟
            </h2>
            <Button 
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link to="/contact">
                تواصل معنا الآن
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StudyAbroad;