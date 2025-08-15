import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Globe,
  GraduationCap,
  BookOpen,
  Users,
  Phone,
  Home,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactInfo {
  phone_numbers: string[];
}

interface SiteSettings {
  site_name_ar: string;
  site_name_en: string;
  logo_url: string;
  tagline_ar?: string;
  tagline_en?: string;
  primary_color_1: string;
  primary_color_2: string;
  primary_color_3: string;
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const domain = window.location.hostname;
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("id")
          .eq("domain", domain)
          .maybeSingle();

        if (clientError) {
          console.error("Client fetch error:", clientError);
          throw new Error(clientError.message || "خطأ أثناء جلب بيانات العميل");
        }
        if (!clientData) {
          throw new Error(`لم يتم العثور على عميل لهذا الدومين: ${domain}`);
        }

        const clientId = clientData.id;

        const { data: settingsData, error: settingsError } = await supabase
          .from("site_settings")
          .select(
            "site_name_ar, site_name_en, logo_url, tagline_ar, primary_color_1, primary_color_2, primary_color_3"
          )
          .eq("client_id", clientId)
          .maybeSingle();

        if (settingsError) {
          console.error("Settings fetch error:", settingsError);
        }

        if (settingsData) {
          setSiteSettings(settingsData);
          if (settingsData.primary_color_1) {
            document.documentElement.style.setProperty("--primary", settingsData.primary_color_1);
          }
          if (settingsData.primary_color_2) {
            document.documentElement.style.setProperty("--secondary", settingsData.primary_color_2);
          }
          if (settingsData.primary_color_3) {
            document.documentElement.style.setProperty("--accent", settingsData.primary_color_3);
          }
        }

        const { data: contactData, error: contactError } = await supabase
          .from("contact_info")
          .select("phone_numbers")
          .eq("client_id", clientId)
          .maybeSingle();

        if (contactError) {
          console.error("Contact fetch error:", contactError);
        }

        if (contactData) {
          setContactInfo(contactData);
        }

      } catch (error: any) {
        console.error("Error fetching data:", error?.message || error);
        console.error("Full error object:", JSON.stringify(error, null, 2));
        toast({
          title: "خطأ في تحميل البيانات",
          description: error?.message || "تعذر تحميل إعدادات الموقع، يرجى المحاولة لاحقاً",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { name: "الرئيسية", href: "/", icon: Home },
    { name: "الدول", href: "/countries", icon: Globe },
    { name: "الجامعات", href: "/universities", icon: GraduationCap },
    { name: "البرامج الدراسية", href: "/programs", icon: BookOpen },
    { name: "المقالات", href: "/articles", icon: BookOpen },
    { name: "من نحن", href: "/about", icon: Users },
    { name: "تواصل معنا", href: "/contact", icon: Phone },
  ];

  const handleContactClick = () => {
    if (contactInfo?.phone_numbers?.length) {
      const phoneNumber = contactInfo.phone_numbers[0].replace(/[^0-9+]/g, "");
      window.open(`tel:${phoneNumber}`, "_blank");
    } else {
      toast({
        title: "لا يوجد رقم هاتف متاح",
        description: "الرجاء المحاولة لاحقاً أو زيارة صفحة الاتصال",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b h-16">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="animate-pulse flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="hidden sm:flex flex-col gap-1">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      dir="rtl"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-lg shadow-sm" : "bg-background/80 backdrop-blur-md"} border-b`}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          {siteSettings?.logo_url ? (
            <img 
              src={siteSettings.logo_url} 
              alt="Logo" 
              className="w-30 h-20 object-contain"
            />
          ) : (
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{
                background: siteSettings?.primary_color_1 && siteSettings?.primary_color_2 
                  ? `linear-gradient(to bottom right, ${siteSettings.primary_color_1}, ${siteSettings.primary_color_2})`
                  : 'linear-gradient(to bottom right, var(--primary), var(--secondary))'
              }}
            >
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          )}
          <div className="hidden sm:flex flex-col">
            <span className="font-cairo font-bold text-lg text-foreground">
              {siteSettings?.site_name_ar || "الدراسة بالخارج"}
            </span>
            <span className="font-cairo text-xs text-muted-foreground">
              {siteSettings?.tagline_ar || "بوابتك للتعليم الدولي"}
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium px-1 transition-colors ${location.pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              style={{
                color: location.pathname === item.href 
                  ? siteSettings?.primary_color_1 || 'var(--primary)'
                  : undefined
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden lg:inline-flex"
            onClick={handleContactClick}
          >
            اتصل بنا
          </Button>
          <Button
            size="sm"
            style={{
              background: siteSettings?.primary_color_1 && siteSettings?.primary_color_2 
                ? `linear-gradient(to right, ${siteSettings.primary_color_1}, ${siteSettings.primary_color_2})`
                : 'linear-gradient(to right, var(--primary), var(--secondary))',
            }}
            className="hover:opacity-90"
            onClick={() => navigate('/contact')}
          >
            احجز استشارة
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="تبديل القائمة"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 transition-transform duration-200" />
          ) : (
            <Menu className="h-5 w-5 transition-transform duration-200" />
          )}
        </Button>
      </div>

      <div
        dir="rtl"
        className={`md:hidden bg-background transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? "max-h-screen border-t" : "max-h-0"}`}
      >
        <nav className="container px-4 py-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 py-3 px-2 rounded-md transition-colors ${location.pathname === item.href ? "text-primary" : "text-muted-foreground hover:bg-accent"}`}
                style={{
                  backgroundColor: location.pathname === item.href 
                    ? `${siteSettings?.primary_color_1 || 'var(--primary)'}10`
                    : undefined,
                  color: location.pathname === item.href 
                    ? siteSettings?.primary_color_1 || 'var(--primary)'
                    : undefined
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 space-y-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleContactClick}
            >
              اتصل بنا
            </Button>
            <Button
              size="sm"
              style={{
                background: siteSettings?.primary_color_1 && siteSettings?.primary_color_2 
                  ? `linear-gradient(to right, ${siteSettings.primary_color_1}, ${siteSettings.primary_color_2})`
                  : 'linear-gradient(to right, var(--primary), var(--secondary))',
              }}
              className="w-full hover:opacity-90"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/contact');
              }}
            >
              احجز استشارة مجانية
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
