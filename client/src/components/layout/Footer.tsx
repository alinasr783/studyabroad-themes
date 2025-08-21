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
  whatsapp_number?: string;
  whatsapp_title?: string;
  whatsapp_description?: string;
  email?: string;
  phone_numbers?: string[];
  email_addresses?: string[];
  office_location?: string;
  working_hours?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  snapchat_url?: string;
  map_link?: string;
  map_placeholder?: string;
  newsletter_title?: string;
  newsletter_description?: string;
}

// نوع بيانات نموذج النشرة الإخبارية
interface NewsletterFormData {
  email: string;
}

const Footer = () => {
  // استخدام client_id المحدد مباشرة
  const clientId = '6b9bc8b0-46cd-4960-bfa2-ae4b5d8dd6c9';

  // جلب بيانات التواصل من Supabase بناءً على client_id
  const { data: contactInfo } = useQuery<ContactInfo>({
    queryKey: ['contactInfo', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (error) {
        console.error('Error fetching contact info:', error);
        return null;
      }
      return data;
    }
  });

  // جلب إعدادات الموقع من Supabase بناءً على client_id
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['siteSettings', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        return null;
      }
      return data;
    }
  });

  // جلب بيانات العميل
  const { data: clientData } = useQuery({
    queryKey: ['clientData', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Error fetching client data:', error);
        return null;
      }
      return data;
    }
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
        .insert({ 
          email, 
          client_id: clientId 
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('تم الاشتراك بنجاح! شكراً لتسجيلك معنا.');
      reset();
    },
    onError: (error) => {
      toast.error('حدث خطأ أثناء الاشتراك، يرجى المحاولة مرة أخرى');
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

  // دالة للحصول على رابط وسائل التواصل الاجتماعي
  const getSocialLink = (key: string) => {
    if (contactInfo?.social_links?.[key as keyof typeof contactInfo.social_links]) {
      return contactInfo.social_links[key as keyof typeof contactInfo.social_links];
    }

    if (siteSettings) {
      const socialMap: Record<string, string | undefined> = {
        'facebook': siteSettings.facebook_url,
        'twitter': siteSettings.twitter_url,
        'instagram': siteSettings.instagram_url,
        'linkedin': siteSettings.linkedin_url,
        'youtube': siteSettings.youtube_url,
        'tiktok': siteSettings.tiktok_url,
        'snapchat': siteSettings.snapchat_url
      };

      return socialMap[key];
    }

    return null;
  };

  // إنشاء ستايل ديناميكي للألوان
  const getGradientStyle = () => {
    if (!siteSettings) return {};

    return {
      background: `linear-gradient(to right, ${siteSettings.primary_color_1 || '#3b82f6'}, ${siteSettings.primary_color_2 || '#6366f1'})`,
      backgroundImage: `linear-gradient(to right, ${siteSettings.primary_color_1 || '#3b82f6'}, ${siteSettings.primary_color_2 || '#6366f1'})`
    };
  };

  // الحصول على أرقام الهواتف
  const getPhoneNumbers = () => {
    if (contactInfo?.phone_numbers?.length > 0) {
      return contactInfo.phone_numbers;
    }
    if (siteSettings?.phone_numbers?.length > 0) {
      return siteSettings.phone_numbers;
    }
    if (clientData?.phone) {
      return [clientData.phone];
    }
    return ['لم يتم تحديد رقم هاتف'];
  };

  // الحصول على عناوين البريد الإلكتروني
  const getEmailAddresses = () => {
    if (contactInfo?.email_addresses?.length > 0) {
      return contactInfo.email_addresses;
    }
    if (siteSettings?.email_addresses?.length > 0) {
      return siteSettings.email_addresses;
    }
    if (siteSettings?.email) {
      return [siteSettings.email];
    }
    if (clientData?.email) {
      return [clientData.email];
    }
    return ['info@example.com'];
  };

  // الحصول على العنوان
  const getAddress = () => {
    return contactInfo?.address || siteSettings?.office_location || 'الرياض، المملكة العربية السعودية';
  };

  // الحصول على ساعات العمل
  const getWorkingHours = () => {
    return contactInfo?.working_hours || siteSettings?.working_hours;
  };

  // الحصول على وصف النشرة الإخبارية
  const getNewsletterDescription = () => {
    return contactInfo?.newsletter_description || siteSettings?.newsletter_description || 'اشترك في نشرتنا البريدية لتصلك آخر العروض والأخبار';
  };

  // الحصول على عنوان النشرة الإخبارية
  const getNewsletterTitle = () => {
    return contactInfo?.newsletter_title || siteSettings?.newsletter_title || 'النشرة الإخبارية';
  };

  // الحصول على رابط الشعار
  const getLogoUrl = () => {
    return siteSettings?.logo_url || clientData?.logo_url;
  };

  // الحصول على اسم الموقع
  const getSiteName = () => {
    return siteSettings?.site_name_ar || clientData?.name || 'Study Abroad';
  };

  // الحصول على وصف الموقع
  const getTagline = () => {
    return siteSettings?.tagline_ar || clientData?.description || 'دليلك للدراسة في الخارج';
  };

  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* معلومات الشركة */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              {getLogoUrl() ? (
                <img 
                  src={getLogoUrl()} 
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
                  {getSiteName()}
                </span>
                <span className="text-sm text-muted-foreground">
                  {getTagline()}
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {contactInfo?.description || 'نوفر لك أحدث المعلومات عن الجامعات والبرامج الدراسية حول العالم لمساعدتك في رحلتك التعليمية.'}
            </p>
            <div className="flex gap-2 flex-wrap">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const link = getSocialLink(social.key);
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
                  {getPhoneNumbers().map((phone, index) => (
                    <div key={index}>{phone}</div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  {getEmailAddresses().map((email, index) => (
                    <div key={index}>{email}</div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{getAddress()}</span>
              </div>
              {getWorkingHours() && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>⏰</span>
                  <span>{getWorkingHours()}</span>
                </div>
              )}
            </div>

            {/* قسم النشرة الإخبارية */}
            <div className="space-y-3">
              <h4 className="font-medium">{getNewsletterTitle()}</h4>
              <p className="text-sm text-muted-foreground">
                {getNewsletterDescription()}
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
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-start">
            © {new Date().getFullYear()} {getSiteName()}. جميع الحقوق محفوظة.
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