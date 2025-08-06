import { Globe, GraduationCap, Users, BookOpen, Award, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: Globe,
      title: "تغطية عالمية شاملة",
      description: "أكثر من 50 دولة و 500+ جامعة معتمدة حول العالم",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: GraduationCap,
      title: "برامج دراسية متنوعة",
      description: "آلاف التخصصات والبرامج في جميع المجالات الأكاديمية",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: Users,
      title: "فريق استشاري محترف",
      description: "خبراء متخصصون لمساعدتك في كل خطوة من رحلتك",
      color: "text-violet-500",
      bgColor: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      icon: BookOpen,
      title: "موارد تعليمية شاملة",
      description: "أدلة وموارد مفصلة لكل ما تحتاجه للدراسة بالخارج",
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: Award,
      title: "ضمان الجودة",
      description: "شراكات مع أفضل الجامعات المعتمدة دولياً",
      color: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      icon: Headphones,
      title: "دعم على مدار الساعة",
      description: "فريق دعم متاح 24/7 لمساعدتك في أي وقت",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30 dark:bg-muted/10">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            لماذا تختار <span className="text-primary">Study Abroad Buddy</span>؟
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نقدم لك تجربة متكاملة ومخصصة لتحقيق حلمك في الدراسة بالخارج. 
            من البحث عن الجامعة المناسبة إلى الحصول على القبول والفيزا.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-background dark:bg-muted/10 hover:-translate-y-1"
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed dark:text-muted-foreground/80">
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