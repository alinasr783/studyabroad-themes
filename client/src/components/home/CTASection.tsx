import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactInfo {
  phone_numbers: string[];
  email_addresses: string[];
  whatsapp_number?: string;
  working_hours?: string;
}

interface SiteSettings {
  primary_color_1: string;
  primary_color_2: string;
  primary_color_3: string;
}

// البيانات الثابتة
const ctaData = {
  title: "مستعد لبدء رحلتك التعليمية؟",
  description: "احصل على استشارة مجانية من خبرائنا واكتشف الفرص المتاحة أمامك",
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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    level: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب إعدادات الموقع بما فيها الألوان
        const { data: settingsData } = await supabase
          .from("site_settings")
          .select("primary_color_1, primary_color_2, primary_color_3")
          .maybeSingle();

        if (settingsData) {
          setSiteSettings(settingsData);
        }

        // جلب معلومات الاتصال
        const { data: contactData } = await supabase
          .from("contact_info")
          .select("phone_numbers, email_addresses, whatsapp_number, working_hours")
          .maybeSingle();

        if (contactData) {
          setContactInfo(contactData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "تعذر تحميل إعدادات الموقع، يرجى المحاولة لاحقاً",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "خطأ في الإرسال",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('consultations')
        .insert([{
          full_name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          country_preference: formData.country,
          study_level: formData.level,
          client_id: "00000000-0000-0000-0000-000000000001"
        }]);

      if (error) throw error;

      toast({
        title: "تم إرسال طلب الاستشارة بنجاح",
        description: "سنتواصل معك قريباً لتأكيد التفاصيل",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        level: ""
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء محاولة إرسال النموذج",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // خيارات التواصل الديناميكية
  const contactOptions = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: "اتصل بنا",
      desc: contactInfo?.phone_numbers?.[0] || "+966 50 123 4567",
      action: () => {
        if (contactInfo?.phone_numbers?.[0]) {
          const phoneNumber = contactInfo.phone_numbers[0].replace(/[^0-9+]/g, '');
          window.open(`tel:${phoneNumber}`, '_blank');
        }
      }
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "واتساب",
      desc: "دردشة فورية",
      action: () => {
        if (contactInfo?.whatsapp_number) {
          const whatsappNumber = contactInfo.whatsapp_number.replace(/[^0-9+]/g, '');
          window.open(`https://wa.me/${whatsappNumber}`, '_blank');
        }
      }
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "بريد إلكتروني",
      desc: contactInfo?.email_addresses?.[0] || "info@study.com",
      action: () => {
        if (contactInfo?.email_addresses?.[0]) {
          window.open(`mailto:${contactInfo.email_addresses[0]}`, '_blank');
        }
      }
    }
  ];

  // الحصول على ألوان التدرج أو استخدام القيم الافتراضية
  const gradientBackground = siteSettings?.primary_color_1 && siteSettings?.primary_color_2
    ? `linear-gradient(to bottom right, ${siteSettings.primary_color_1}, ${siteSettings.primary_color_2})`
    : 'linear-gradient(to bottom right, var(--primary), var(--secondary))';

  const buttonGradient = siteSettings?.primary_color_1 && siteSettings?.primary_color_2
    ? `linear-gradient(to right, ${siteSettings.primary_color_1}, ${siteSettings.primary_color_2})`
    : 'linear-gradient(to right, var(--primary), var(--secondary))';

  return (
    <section 
      className="py-12 md:py-20"
      style={{
        background: siteSettings?.primary_color_1 && siteSettings?.primary_color_3
          ? `linear-gradient(to bottom right, ${siteSettings.primary_color_1}10, ${siteSettings.primary_color_3}10)`
          : 'linear-gradient(to bottom right, var(--primary)/10, var(--accent)/10)'
      }}
    >
      <div className="container px-4 mx-auto">
        <Card 
          className="border-0 shadow-xl overflow-hidden relative transition-all duration-500 hover:shadow-2xl"
          style={{
            background: gradientBackground
          }}
        >
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
                  {contactOptions.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer"
                      onClick={item.action}
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: siteSettings?.primary_color_1
                            ? `${siteSettings.primary_color_1}20`
                            : 'rgba(255, 255, 255, 0.2)'
                        }}
                      >
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

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder={ctaData.form.fields.firstName.placeholder} 
                        className="text-right" 
                        required
                      />
                      <Input 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder={ctaData.form.fields.lastName.placeholder} 
                        className="text-right" 
                        required
                      />
                    </div>

                    <Input 
                      name="email"
                      type={ctaData.form.fields.email.type} 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={ctaData.form.fields.email.placeholder} 
                      className="text-right" 
                      required
                    />
                    <Input 
                      name="phone"
                      type={ctaData.form.fields.phone.type} 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={ctaData.form.fields.phone.placeholder} 
                      className="text-right" 
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* حقل اختيار الدول */}
                      <div className="relative">
                        <select 
                          name="country"
                          value={formData.country}
                          onChange={handleSelectChange}
                          className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none text-right"
                          required
                        >
                          <option value="" disabled className="text-gray-400">
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
                          name="level"
                          value={formData.level}
                          onChange={handleSelectChange}
                          className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none text-right"
                          required
                        >
                          <option value="" disabled className="text-gray-400">
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
                      className="w-full hover:opacity-90 transition-all group"
                      style={{ background: buttonGradient }}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          جاري الإرسال...
                        </span>
                      ) : (
                        <>
                          <span className="group-hover:translate-x-1 transition-transform">
                            {ctaData.form.submitText}
                          </span>
                          <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      {ctaData.form.termsText}
                      <span 
                        className="cursor-pointer hover:underline mx-1"
                        style={{
                          color: siteSettings?.primary_color_1 || 'var(--primary)'
                        }}
                      >
                        {ctaData.form.termsLinks[0]}
                      </span>
                      و
                      <span 
                        className="cursor-pointer hover:underline mx-1"
                        style={{
                          color: siteSettings?.primary_color_1 || 'var(--primary)'
                        }}
                      >
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