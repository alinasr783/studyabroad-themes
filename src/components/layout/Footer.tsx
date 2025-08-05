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
  Youtube
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
    <footer className="bg-muted/30 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-cairo font-bold text-lg">Study Abroad</span>
                <span className="font-cairo text-sm text-muted-foreground">دليلك للدراسة في الخارج</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              نحن نساعدك في العثور على أفضل الجامعات والبرامج الدراسية حول العالم. 
              رحلتك التعليمية تبدأ من هنا.
            </p>
            <div className="flex space-x-2 rtl:space-x-reverse">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-primary hover:text-white"
                    asChild
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-cairo font-semibold text-lg">روابط سريعة</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-cairo font-semibold text-lg">المصادر</h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-cairo font-semibold text-lg">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+966 50 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@studyabroad.com</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-cairo font-medium">اشترك في النشرة الإخبارية</h4>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Input 
                  type="email" 
                  placeholder="بريدك الإلكتروني" 
                  className="text-sm"
                />
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                  اشترك
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 Study Abroad Buddy. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
              الشروط والأحكام
            </Link>
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">
              هل أنت مدير الموقع؟ تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;