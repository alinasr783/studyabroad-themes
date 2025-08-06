import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap, 
  Globe, 
  Phone, 
  Mail, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Crown
} from "lucide-react";

const Footer = () => {
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

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* معلومات الشركة */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">Study Abroad</span>
                <span className="text-sm text-muted-foreground">دليلك للدراسة في الخارج</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              نوفر لك أحدث المعلومات عن الجامعات والبرامج الدراسية حول العالم لمساعدتك في رحلتك التعليمية.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-primary hover:text-white transition-colors"
                    asChild
                  >
                    <a href={social.href} aria-label={social.label}>
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                );
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
                <span>+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>info@studyabroad.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">النشرة الإخبارية</h4>
              <form className="flex flex-col sm:flex-row gap-2">
                <Input 
                  type="email" 
                  placeholder="بريدك الإلكتروني" 
                  className="flex-1 text-sm"
                  required
                />
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  type="submit"
                >
                  اشترك
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-start">
            © {new Date().getFullYear()} Study Abroad. جميع الحقوق محفوظة.
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