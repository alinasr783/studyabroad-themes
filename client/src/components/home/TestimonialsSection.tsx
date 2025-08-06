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
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Quote className="h-6 w-6 md:h-8 md:w-8 text-primary flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text">
              قصص <span className="text-primary">النجاح</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            اكتشف كيف ساعدنا آلاف الطلاب في تحقيق أحلامهم والدراسة في أفضل الجامعات حول العالم
          </p>
        </div>

        {/* بطاقات آراء العملاء */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-background rounded-xl overflow-hidden hover:border-primary/50"
            >
              <CardContent className="p-5 sm:p-6">
                {/* أيقونة الاقتباس الخلفية */}
                <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Quote className="h-20 w-20 text-primary" />
                </div>

                {/* التقييم */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`} 
                    />
                  ))}
                </div>

                {/* محتوى الرأي */}
                <blockquote className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5 relative z-10">
                  "{testimonial.content}"
                </blockquote>

                {/* معلومات الطالب */}
                <div className="border-t pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-base">{testimonial.name}</h4>
                        <Badge variant="secondary" className="text-xs py-0.5">
                          {testimonial.year}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{testimonial.program}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <span className="text-base">{testimonial.flag}</span>
                        <span>{testimonial.university}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-12 md:mt-16 pt-12 border-t">
          {[
            { value: "10,000+", label: "طالب نجح", color: "text-primary" },
            { value: "500+", label: "جامعة شريكة", color: "text-secondary" },
            { value: "50+", label: "دولة متاحة", color: "text-primary" },
            { value: "98%", label: "نسبة النجاح", color: "text-secondary" },
          ].map((stat, index) => (
            <div key={index} className="text-center space-y-1">
              <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;