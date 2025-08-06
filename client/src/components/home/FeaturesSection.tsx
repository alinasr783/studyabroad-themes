import { Globe, GraduationCap, Users, BookOpen, Award, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: Globe,
      title: "تغطية عالمية شاملة",
      description: "أكثر من 50 دولة و 500+ جامعة معتمدة حول العالم",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: GraduationCap,
      title: "برامج دراسية متنوعة",
      description: "آلاف التخصصات والبرامج في جميع المجالات الأكاديمية",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Users,
      title: "فريق استشاري محترف",
      description: "خبراء متخصصون لمساعدتك في كل خطوة من رحلتك",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: BookOpen,
      title: "موارد تعليمية شاملة",
      description: "أدلة وموارد مفصلة لكل ما تحتاجه للدراسة بالخارج",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Award,
      title: "ضمان الجودة",
      description: "شراكات مع أفضل الجامعات المعتمدة دولياً",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Headphones,
      title: "دعم على مدار الساعة",
      description: "فريق دعم متاح 24/7 لمساعدتك في أي وقت",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold">
            لماذا تختار <span className="text-primary">Study Abroad Buddy</span>؟
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نقدم لك تجربة متكاملة ومخصصة لتحقيق حلمك في الدراسة بالخارج. 
            من البحث عن الجامعة المناسبة إلى الحصول على القبول والفيزا.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-background"
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;