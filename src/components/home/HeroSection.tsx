import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import globeStudents from "@/assets/globe-students.jpg";

const HeroSection = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Gradient - مطابق للموقع المرجعي */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-white order-2 lg:order-1">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight font-cairo">
                حقق حلمك وانضم الى الكلية التى{" "}
                <span className="text-yellow-300">لطالما رغبت بها</span>{" "}
                من خلال خدمتنا المتميزة
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                نحن هنا لنساعدك في كل خطوة على طريق تحقيق هدفك الأكاديمي
              </p>
            </div>

            {/* CTA Buttons مطابقة للموقع المرجعي */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white border-2 border-white/20 hover:border-white/40 transition-all duration-300"
              >
                اعرف اكثر
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                <Phone className="ml-2 h-5 w-5" />
                اتصل بنا
              </Button>
            </div>
          </div>

          {/* Hero Globe Image - مطابق للموقع المرجعي */}
          <div className="relative order-1 lg:order-2">
            <div className="relative flex items-center justify-center">
              <div className="w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full relative animate-float">
                <img 
                  src={globeStudents} 
                  alt="Globe with international students"
                  className="w-full h-full object-cover rounded-full"
                />
                {/* تأثير الإضاءة حول الكرة الأرضية */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400/20 via-transparent to-blue-300/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;