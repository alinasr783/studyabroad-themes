import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Home, Globe, GraduationCap, BookOpen, FileText, MessageSquare, Settings, Users, Star } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

interface ManagerSession {
  id: string;
  email: string;
  client_id: string;
  client: {
    name: string;
    slug: string;
  };
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [session, setSession] = useState<ManagerSession | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedSession = localStorage.getItem("manager_session");
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("manager_session");
    navigate("/login");
  };

  const menuItems = [
    { icon: Home, label: "الرئيسية", path: "/admin/dashboard" },
    { icon: Globe, label: "الدول", path: "/admin/countries" },
    { icon: GraduationCap, label: "الجامعات", path: "/admin/universities" },
    { icon: BookOpen, label: "البرامج الدراسية", path: "/admin/programs" },
    { icon: FileText, label: "المقالات", path: "/admin/articles" },
    { icon: Star, label: "آراء العملاء", path: "/admin/testimonials" },
    { icon: MessageSquare, label: "طلبات الاستشارة", path: "/admin/consultations" },
    { icon: MessageSquare, label: "رسائل التواصل", path: "/admin/messages" },
    { icon: Users, label: "المديرين", path: "/admin/managers" },
    { icon: Settings, label: "إعدادات الموقع", path: "/admin/settings" },
  ];

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/10">
      {/* Header */}
      <header className="bg-background border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
            <p className="text-sm text-muted-foreground">
              {session.client ? session.client.name : "مدير النظام"}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-l min-h-[calc(100vh-80px)]">
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="w-4 h-4 ml-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;