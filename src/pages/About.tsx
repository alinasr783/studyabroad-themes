import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Phone, Mail, MapPin, Clock, Globe } from "lucide-react";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold font-cairo mb-6">
              لماذا نحن؟
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              نحن شركة متخصصة في توجيه الطلاب نحو أفضل الجامعات العالمية. خبرتنا الطويلة وشراكاتنا القوية 
              مع أكثر من 250 جامعة حول العالم تجعلنا الخيار الأمثل لتحقيق أحلامك الأكاديمية.
            </p>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-cairo">
                من نحن
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                فيوتشر إنترناشونال جروب هي شركة رائدة في مجال الاستشارات التعليمية والتوجيه الأكاديمي. 
                نساعد الطلاب العرب في العثور على أفضل الفرص التعليمية في الجامعات المعتمدة عالمياً.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                منذ تأسيسنا، ساعدنا آلاف الطلاب في تحقيق أحلامهم الأكاديمية والمهنية من خلال خدماتنا المتميزة 
                ومتابعتنا الشخصية لكل طالب منذ بداية رحلته حتى التخرج.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                      <div className="text-sm text-muted-foreground">طالب نجح</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-500 mb-2">250+</div>
                      <div className="text-sm text-muted-foreground">جامعة شريكة</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://d2pi0n2fm836iz.cloudfront.net/488796/05102023153512645bb9b085666.png" 
                alt="About us"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-cairo mb-4">
              خدماتنا المتميزة
            </h2>
            <p className="text-xl text-muted-foreground">
              نقدم خدمات شاملة لضمان نجاح رحلتك التعليمية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "استشارة أكاديمية مجانية",
                description: "نقدم استشارة شاملة لاختيار أفضل التخصصات والجامعات المناسبة لك",
                icon: "🎓"
              },
              {
                title: "معالجة طلبات القبول",
                description: "نتولى إعداد وتقديم جميع الوثائق المطلوبة للحصول على القبول الجامعي",
                icon: "📄"
              },
              {
                title: "مساعدة في الحصول على الفيزا",
                description: "نوجهك خلال عملية الحصول على تأشيرة الدراسة بكل سهولة",
                icon: "✈️"
              },
              {
                title: "ترتيب السكن",
                description: "نساعدك في العثور على أفضل خيارات السكن الطلابي المناسبة",
                icon: "🏠"
              },
              {
                title: "المتابعة الشخصية",
                description: "فريقنا يتابع تقدمك الأكاديمي ويقدم الدعم المستمر",
                icon: "👥"
              },
              {
                title: "خدمات ما بعد الوصول",
                description: "نقدم الدعم والمساعدة حتى بعد وصولك للدولة الدراسية",
                icon: "🌟"
              },
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold font-cairo mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-cairo mb-4">
              فريق الخبراء
            </h2>
            <p className="text-xl text-muted-foreground">
              فريق من المستشارين التعليميين ذوي الخبرة الطويلة
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👨‍💼</span>
                </div>
                <h3 className="text-2xl font-bold font-cairo mb-2">
                  د/ محمد صلاح الدسوقي
                </h3>
                <p className="text-muted-foreground mb-4">
                  المدير التنفيذي للشركة
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  خبرة تزيد عن 15 عامًا في مجال التعليم الدولي والاستشارات الأكاديمية. 
                  ساعد آلاف الطلاب في تحقيق أحلامهم التعليمية في أفضل الجامعات العالمية.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-cairo mb-4">
              مستعد لبدء رحلتك معنا؟
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              تواصل معنا اليوم واحصل على استشارة مجانية
            </p>
            <Button 
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <a href="/contact">
                اتصل بنا الآن
                <ArrowLeft className="mr-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;