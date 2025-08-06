import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin, Clock, Globe } from "lucide-react";

// البيانات المنفصلة في كائن JSON
const aboutData = {
  hero: {
    title: "لماذا نختارنا؟",
    description: "نقدم خدمات استشارية متكاملة لتوجيه الطلاب نحو أفضل الجامعات العالمية. بشراكاتنا الواسعة مع أكثر من 250 جامعة حول العالم، نضمن لك تحقيق أحلامك الأكاديمية."
  },
  companyInfo: {
    title: "من نحن؟",
    description1: "فيوتشر إنترناشونال جروب هي وكالة رائدة في الاستشارات التعليمية. نختصر لك الطريق نحو أفضل الجامعات العالمية بشراكاتنا المعتمدة وخبراتنا المتراكمة.",
    description2: "منذ تأسيسنا، ساعدنا آلاف الطلاب في تحقيق طموحاتهم الأكاديمية عبر متابعة شخصية تبدأ من التقديم حتى التخرج.",
    stats: [
      { value: "10,000+", label: "طلاب نجحوا", color: "text-blue-600" },
      { value: "250+", label: "جامعة شريكة", color: "text-orange-500" }
    ],
    imageUrl: "https://d2pi0n2fm836iz.cloudfront.net/488796/05102023153512645bb9b085666.png"
  },
  services: {
    title: "خدماتنا المميزة",
    subtitle: "حلول متكاملة لرحلة أكاديمية ناجحة",
    items: [
      {
        title: "استشارة أكاديمية مجانية",
        description: "تقييم شامل لمؤهلاتك واختيار أفضل التخصصات والجامعات المناسبة",
        icon: "🎓",
        color: "bg-blue-100"
      },
      {
        title: "تقديم طلبات القبول",
        description: "إعداد كامل للمستندات المطلوبة وتقديمها للجامعات المعتمدة",
        icon: "📄",
        color: "bg-purple-100"
      },
      {
        title: "مساعدة في تأشيرة الدراسة",
        description: "توجيهك خطوة بخطوة في إجراءات الحصول على الفيزا الدراسية",
        icon: "✈️",
        color: "bg-green-100"
      },
      {
        title: "حجز السكن الطلابي",
        description: "ترتيب خيارات سكن مناسبة قريبة من جامعتك",
        icon: "🏠",
        color: "bg-yellow-100"
      },
      {
        title: "متابعة أكاديمية شخصية",
        description: "دعم مستمر طوال فترة دراستك حتى التخرج",
        icon: "👥",
        color: "bg-pink-100"
      },
      {
        title: "خدمات ما بعد الوصول",
        description: "مساعدتك في التأقلم بعد وصولك إلى بلد الدراسة",
        icon: "🌟",
        color: "bg-indigo-100"
      }
    ]
  },
  team: {
    title: "فريق خبرائنا",
    subtitle: "مستشارون تعليميون بخبرات دولية واسعة",
    members: [
      {
        name: "د. محمد صلاح الدسوقي",
        position: "المدير التنفيذي",
        bio: "خبرة 15 عامًا في التعليم الدولي، ساعد آلاف الطلاب في الالتحاق بأفضل الجامعات العالمية.",
        emoji: "👨‍💼"
      },
      {
        name: "أ. أحمد خالد",
        position: "مستشار أكاديمي",
        bio: "متخصص في المنح الدراسية والتمويل الأكاديمي، حاصل على شهادات دولية في الإرشاد التعليمي.",
        emoji: "👨‍🎓"
      },
      {
        name: "د. سارة عبد الرحمن",
        position: "خبيرة فيزا",
        bio: "خبيرة في إجراءات التأشيرات الدراسية للدول الأوروبية والأمريكية.",
        emoji: "👩‍⚖️"
      }
    ]
  },
  contactCTA: {
    title: "هل أنت مستعد للبدء؟",
    subtitle: "تواصل معنا اليوم واحصل على استشارة مجانية",
    buttonText: "اتصل بنا الآن"
  }
};

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden text-right">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <div className="container relative">
          <div className="text-right max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-cairo mb-6 leading-tight">
              {aboutData.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed opacity-90">
              {aboutData.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16 md:py-20 text-right">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-left">
              <h2 className="text-3xl md:text-4xl font-bold font-cairo text-gray-800">
                {aboutData.companyInfo.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {aboutData.companyInfo.description1}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {aboutData.companyInfo.description2}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {aboutData.companyInfo.stats.map((stat, index) => (
                  <Card key={index} className="hover:scale-[1.02] transition-transform duration-300 text-center">
                    <CardContent className="p-6">
                      <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in-right">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img 
                  src={aboutData.companyInfo.imageUrl} 
                  alt="من نحن"
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 md:py-20 bg-gray-50 text-right">
        <div className="container">
          <div className="text-right mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold font-cairo mb-4 text-gray-800">
              {aboutData.services.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mr-auto">
              {aboutData.services.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData.services.items.map((service, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-200 text-right"
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mb-4 mr-auto`}>
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold font-cairo mb-3 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-20 bg-white text-right">
        <div className="container">
          <div className="text-right mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold font-cairo mb-4 text-gray-800">
              {aboutData.team.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mr-auto">
              {aboutData.team.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutData.team.members.map((member, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 animate-fade-in-up text-right"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 mr-auto">
                      <span className="text-3xl">{member.emoji}</span>
                    </div>
                    <h3 className="text-xl font-bold font-cairo mb-2 text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {member.position}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {member.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden text-right">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <div className="container relative">
          <div className="text-right max-w-3xl mx-auto animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold font-cairo mb-4">
              {aboutData.contactCTA.title}
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 opacity-90">
              {aboutData.contactCTA.subtitle}
            </p>
            <Button 
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <a href="/contact" className="flex items-center justify-end">
                {aboutData.contactCTA.buttonText}
                <ArrowLeft className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;