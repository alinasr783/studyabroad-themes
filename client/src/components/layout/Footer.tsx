import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageSquare,
  Crown
} from "lucide-react";
import { Send as Snapchat } from "lucide-react";
import { useEffect } from "react";

// نوع بيانات معلومات التواصل
interface ContactInfo {
  id: string;
  title?: string;
  description?: string;
  phone_numbers: string[];
  email_addresses: string[];
  address?: string;
  working_hours?: string;
  whatsapp_title?: string;
  whatsapp_description?: string;
  whatsapp_number?: string;
  map_placeholder?: string;
  map_link?: string;
  social_links: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
    snapchat: string;
  };
  newsletter_title?: string;
  newsletter_description?: string;
}

// نوع بيانات إعدادات الموقع
interface SiteSettings {
  id: string;
  site_name_ar: string;
  site_name_en: string;
  logo_url: string;
  tagline_ar?: string;
  tagline_en?: string;
  primary_color_1?: string;
  primary_color_2?: string;
  primary_color_3?: string;
}

// نوع بيانات نموذج النشرة الإخبارية
interface NewsletterFormData {
  email: string;
}

const Footer = () => {
  // الحصول على client_id بناءً على النطاق
  const { data: clientData } = useQuery({
    queryKey: ['clientInfo'],
    queryFn: async () => {
      const domain = window.location.hostname;
      const { data, error } = await supabase
        .from('clients')
        .select('id')
        .eq('domain', domain)
        .single();

      if (error) throw error;
      return data;
    }
  });

  // جلب بيانات التواصل من Supabase بناءً على client_id
  const { data: contactInfo } = useQuery<ContactInfo>({
    queryKey: ['contactInfo', clientData?.id],
    queryFn: async () => {
      if (!clientData?.id) return null;

      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('client_id', clientData.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!clientData?.id
  });

  // جلب إعدادات الموقع من Supabase بناءً على client_id
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['siteSettings', clientData?.id],
    queryFn: async () => {
      if (!clientData?.id) return null;

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('client_id', clientData.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!clientData?.id
  });

  // تطبيق ألوان الموقع الديناميكية
  useEffect(() => {
    if (siteSettings) {
      const root = document.documentElement;
      if (siteSettings.primary_color_1) {
        root.style.setProperty('--primary', siteSettings.primary_color_1);
      }
      if (siteSettings.primary_color_2) {
        root.style.setProperty('--primary-2', siteSettings.primary_color_2);
      }
      if (siteSettings.primary_color_3) {
        root.style.setProperty('--primary-3', siteSettings.primary_color_3);
      }
    }
  }, [siteSettings]);

  // إعداد نموذج النشرة الإخبارية
  const { register, handleSubmit, reset } = useForm<NewsletterFormData>();

  // معالجة الاشتراك في النشرة الإخبارية
  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, client_id: clientData?.id });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('تم الاشتراك بنجاح! شكراً لتسجيلك معنا.');
      reset();
    },
    onError: (error) => {
      toast.error('حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.');
      console.error('Newsletter subscription error:', error);
    }
  });

  const onSubmit = (data: NewsletterFormData) => {
    newsletterMutation.mutate(data.email);
  };

  const quickLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "الدول", href: "/countries" },
    { name: "الجامعات", href: "/universities" },
    { name: "البرامج الدراسية", href: "/programs" },
  ];

  const resources = [
    { name: "المقالات", href: "/articles" },
    { name: "دليل التقديم", href: "/guide" },
    { name: "الأسئلة الشائعة", href: "/faq" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  // روابط التواصل الاجتماعي مع الأيقونات المناسبة
  const socialLinks = [
    { icon: Facebook, key: 'facebook', label: 'Facebook' },
    { icon: Twitter, key: 'twitter', label: 'Twitter' },
    { icon: Instagram, key: 'instagram', label: 'Instagram' },
    { icon: Linkedin, key: 'linkedin', label: 'LinkedIn' },
    { icon: Youtube, key: 'youtube', label: 'YouTube' },
    { icon: MessageSquare, key: 'tiktok', label: 'TikTok' },
    { icon: Snapchat, key: 'snapchat', label: 'Snapchat' },
  ];

  // إنشاء ستايل ديناميكي للألوان
  const getGradientStyle = () => {
    if (!siteSettings) return {};

    return {
      background: `linear-gradient(to right, ${siteSettings.primary_color_1 || '#3b82f6'}, ${siteSettings.primary_color_2 || '#6366f1'})`,
      backgroundImage: `linear-gradient(to right, ${siteSettings.primary_color_1 || '#3b82f6'}, ${siteSettings.primary_color_2 || '#6366f1'})`
    };
  };

  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* معلومات الشركة */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              {siteSettings?.logo_url ? (
                <img 
                  src={siteSettings.logo_url} 
                  alt="Logo" 
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div 
                  className="flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{
                    background: `linear-gradient(to right, ${siteSettings?.primary_color_1 || '#3b82f6'}, ${siteSettings?.primary_color_2 || '#6366f1'})`
                  }}
                >
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-lg">
                  {siteSettings?.site_name_ar || 'Study Abroad'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {siteSettings?.tagline_ar || 'دليلك للدراسة في الخارج'}
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {contactInfo?.description || 'نوفر لك أحدث المعلومات عن الجامعات والبرامج الدراسية حول العالم لمساعدتك في رحلتك التعليمية.'}
            </p>
            <div className="flex gap-2 flex-wrap">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const link = contactInfo?.social_links?.[social.key as keyof typeof contactInfo.social_links];
                return link ? (
                  <Button
                    key={social.key}
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-primary hover:text-white transition-colors"
                    asChild
                  >
                    <a 
                      href={link} 
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                ) : null;
              })}
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">روابط سريعة</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* مصادر */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">المصادر</h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل معنا */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  {contactInfo?.phone_numbers?.map((phone, index) => (
                    <div key={index}>{phone}</div>
                  )) || 'لم يتم تحديد رقم هاتف'}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  {contactInfo?.email_addresses?.map((email, index) => (
                    <div key={index}>{email}</div>
                  )) || 'info@example.com'}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{contactInfo?.address || 'الرياض، المملكة العربية السعودية'}</span>
              </div>
            </div>

            {/* قسم النشرة الإخبارية */}
            {/* <div className="space-y-3">
              <h4 className="font-medium">{contactInfo?.newsletter_title || 'النشرة الإخبارية'}</h4>
              <p className="text-sm text-muted-foreground">
                {contactInfo?.newsletter_description || 'اشترك في نشرتنا البريدية لتصلك آخر العروض والأخبار'}
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
                <Input 
                  type="email" 
                  placeholder="بريدك الإلكتروني" 
                  className="flex-1 text-sm"
                  required
                  {...register("email", { 
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "بريد إلكتروني غير صالح"
                    }
                  })}
                  disabled={newsletterMutation.isPending}
                />
                <Button 
                  size="sm" 
                  style={getGradientStyle()}
                  type="submit"
                  disabled={newsletterMutation.isPending}
                >
                  {newsletterMutation.isPending ? 'جاري الإرسال...' : 'اشترك'}
                </Button>
              </form>
            </div> */}
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-start">
            © {new Date().getFullYear()} {siteSettings?.site_name_ar || 'Study Abroad'}. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              الشروط والأحكام
            </Link>
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              تسجيل دخول المدير
            </Link>
            <Link 
              to="/platform/login" 
              className="text-sm text-muted-foreground hover:text-purple-600 transition-colors flex items-center gap-1"
            >
              <Crown className="w-3 h-3" />
              <span>Platform Owner</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;