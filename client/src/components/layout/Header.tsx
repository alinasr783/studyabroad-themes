import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, GraduationCap, BookOpen, Users, Phone, Home } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-cairo font-bold text-lg text-foreground">Study Abroad</span>
            <span className="font-cairo text-sm text-muted-foreground">دليلك للدراسة في الخارج</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
          <Button variant="outline" size="sm">
            اتصل بنا
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
            احجز استشارة مجانية
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-3 rtl:space-x-reverse py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                اتصل بنا
              </Button>
              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary">
                احجز استشارة مجانية
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;