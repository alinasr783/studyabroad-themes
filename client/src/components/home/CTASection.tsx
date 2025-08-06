import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";

// البيانات المنفصلة في كائن JSON
const ctaData = {
  title: "مستعد لبدء رحلتك التعليمية؟",
  description: "احصل على استشارة مجانية من خبرائنا واكتشف الفرص المتاحة أمامك",
  contactOptions: [
    { icon: <Phone className="h-5 w-5" />, title: "اتصل بنا", desc: "+966 50 123 4567" },
    { icon: <MessageCircle className="h-5 w-5" />, title: "واتساب", desc: "دردشة فورية" },
    { icon: <Mail className="h-5 w-5" />, title: "بريد إلكتروني", desc: "info@study.com" }
  ],
  trustIndicators: ["✓ استشارة مجانية", "✓ فريق خبراء", "✓ متابعة شخصية"],
  form: {
    title: "احجز استشارتك المجانية",
    subtitle: "املأ النموذج وسنتواصل معك خلال 24 ساعة",
    fields: {
      firstName: { placeholder: "الاسم الأول" },
      lastName: { placeholder: "اسم العائلة" },
      email: { placeholder: "البريد الإلكتروني", type: "email" },
      phone: { placeholder: "رقم الهاتف", type: "tel" },
      country: {
        placeholder: "اختر الدولة",
        options: ["الولايات المتحدة", "كندا", "المملكة المتحدة", "أستراليا", "ألمانيا", "فرنسا", "اليابان", "ماليزيا"]
      },
      level: {
        placeholder: "المستوى الدراسي",
        options: ["بكالوريوس", "ماجستير", "دكتوراه", "دبلوم", "لغة انجليزية", "ثانوية عامة"]
      }
    },
    submitText: "احجز استشارتك الآن",
    termsText: "بالنقر فإنك توافق على",
    termsLinks: ["الشروط", "الخصوصية"]
  }
};

const CTASection = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5">
      <div className="container px-4 mx-auto">
        <Card className="border-0 bg-gradient-to-br from-primary via-primary/90 to-secondary shadow-xl overflow-hidden relative transition-all duration-500 hover:shadow-2xl">
          <div className="absolute inset-0 bg-black/5" />
          <CardContent className="p-6 md:p-12 relative">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* المحتوى */}
              <div className="space-y-6 text-white">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    {ctaData.title}
                  </h2>
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                    {ctaData.description}
                  </p>
                </div>

                {/* خيارات التواصل */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ctaData.contactOptions.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{item.title}</div>
                        <div className="text-xs text-white/80">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* مؤشرات الثقة */}
                <div className="flex flex-wrap gap-4 text-sm text-white/90">
                  {ctaData.trustIndicators.map((item, i) => (
                    <span key={i} className="flex items-center gap-1">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* النموذج */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg transform transition-all hover:scale-[1.01]">
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      {ctaData.form.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {ctaData.form.subtitle}
                    </p>
                  </div>

                  <form className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input placeholder={ctaData.form.fields.firstName.placeholder} className="text-right" />
                      <Input placeholder={ctaData.form.fields.lastName.placeholder} className="text-right" />
                    </div>

                    <Input 
                      type={ctaData.form.fields.email.type} 
                      placeholder={ctaData.form.fields.email.placeholder} 
                      className="text-right" 
                    />
                    <Input 
                      type={ctaData.form.fields.phone.type} 
                      placeholder={ctaData.form.fields.phone.placeholder} 
                      className="text-right" 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* حقل اختيار الدول */}
                      <div className="relative">
                        <select 
                          className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none text-right"
                        >
                          <option value="" disabled selected className="text-gray-400">
                            {ctaData.form.fields.country.placeholder}
                          </option>
                          {ctaData.form.fields.country.options.map((c, i) => (
                            <option key={i} value={c} className="text-gray-800 hover:bg-primary/10">{c}</option>
                          ))}
                        </select>
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>

                      {/* حقل اختيار المستوى الدراسي */}
                      <div className="relative">
                        <select 
                          className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none text-right"
                        >
                          <option value="" disabled selected className="text-gray-400">
                            {ctaData.form.fields.level.placeholder}
                          </option>
                          {ctaData.form.fields.level.options.map((l, i) => (
                            <option key={i} value={l} className="text-gray-800 hover:bg-primary/10">{l}</option>
                          ))}
                        </select>
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {ctaData.form.submitText}
                      </span>
                      <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      {ctaData.form.termsText}
                      <span className="text-primary cursor-pointer hover:underline mx-1">
                        {ctaData.form.termsLinks[0]}
                      </span>
                      و
                      <span className="text-primary cursor-pointer hover:underline mx-1">
                        {ctaData.form.termsLinks[1]}
                      </span>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;