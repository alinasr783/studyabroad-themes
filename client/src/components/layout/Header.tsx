import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, GraduationCap, BookOpen, Users, Phone, Home } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // إغلاق القائمة المتنقلة عند تغيير المسار
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // تأثير التمرير
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

  return (
    <header dir="rtl" className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-lg shadow-sm" : "bg-background/80 backdrop-blur-md"} border-b`}>
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* الشعار */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-cairo font-bold text-lg text-foreground">الدراسة بالخارج</span>
            <span className="font-cairo text-xs text-muted-foreground">بوابتك للتعليم الدولي</span>
          </div>
        </Link>

        {/* التنقل لشاشات الكمبيوتر */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium px-1 transition-colors ${location.pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* أزرار الحث على الإجراء */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden lg:inline-flex">
            اتصل بنا
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            احجز استشارة
          </Button>
        </div>

        {/* زر القائمة المتنقلة */}
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

      {/* القائمة المتنقلة */}
      <div dir="rtl" className={`md:hidden bg-background transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? "max-h-screen border-t" : "max-h-0"}`}>
        <nav className="container px-4 py-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 py-3 px-2 rounded-md transition-colors ${location.pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 space-y-2 mt-2">
            <Button variant="outline" size="sm" className="w-full">
              اتصل بنا
            </Button>
            <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary">
              احجز استشارة مجانية
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;