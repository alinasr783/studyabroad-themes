import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, GraduationCap } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "أحمد محمد",
      university: "جامعة هارفارد",
      country: "الولايات المتحدة",
      flag: "🇺🇸",
      program: "ماجستير إدارة الأعمال",
      rating: 5,
      content: "لولا Study Abroad Buddy ما كنت حققت حلمي بالدراسة في هارفارد. الفريق ساعدني في كل خطوة من التقديم حتى الحصول على الفيزا. خدمة استثنائية!",
      year: "2023",
    },
    {
      id: 2,
      name: "فاطمة العلي",
      university: "جامعة تورنتو",
      country: "كندا",
      flag: "🇨🇦",
      program: "دكتوراه في الطب",
      rating: 5,
      content: "الاستشارة المجانية كانت نقطة البداية لرحلتي. حصلت على قبول في أفضل جامعة طبية في كندا مع منحة كاملة. شكراً للفريق المتميز!",
      year: "2023",
    },
    {
      id: 3,
      name: "عبدالله الشمري",
      university: "جامعة أكسفورد",
      country: "المملكة المتحدة",
      flag: "🇬🇧",
      program: "ماجستير الهندسة",
      rating: 5,
      content: "تجربة رائعة من البداية للنهاية. المستشارين محترفين جداً وقدموا لي خيارات متنوعة. الآن أدرس في أكسفورد وأشعر بالفخر والامتنان.",
      year: "2024",
    },
    {
      id: 4,
      name: "نورا خالد",
      university: "جامعة ملبورن",
      country: "أستراليا",
      flag: "🇦🇺",
      program: "بكالوريوس علوم الحاسوب",
      rating: 5,
      content: "كطالبة في المرحلة الثانوية، كنت قلقة من إجراءات التقديم. لكن الفريق سهل عليّ كل شيء وحصلت على قبول في 3 جامعات أسترالية مرموقة!",
      year: "2024",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-4">
            <Quote className="h-8 w-8 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-bold">
              قصص <span className="text-primary">النجاح</span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            اكتشف كيف ساعدنا آلاف الطلاب في تحقيق أحلامهم والدراسة في أفضل الجامعات حول العالم
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-background relative overflow-hidden"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="h-16 w-16 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 rtl:space-x-reverse mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-muted-foreground leading-relaxed mb-6 relative z-10">
                  "{testimonial.content}"
                </blockquote>

                {/* Student Info */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {testimonial.year}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>{testimonial.program}</span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                        <span className="text-lg">{testimonial.flag}</span>
                        <span>{testimonial.university}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">10,000+</div>
            <div className="text-sm text-muted-foreground">طالب نجح</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-secondary">500+</div>
            <div className="text-sm text-muted-foreground">جامعة شريكة</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground">دولة متاحة</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-secondary">98%</div>
            <div className="text-sm text-muted-foreground">نسبة النجاح</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;