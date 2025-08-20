import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Home,
  Globe,
  GraduationCap,
  BookOpen,
  FileText,
  MessageSquare,
  Settings,
  Users,
  Star
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

interface AdminSession {
  id: string;
  email: string;
  full_name: string;
  client_id?: string | null;
  client?: {
    name: string;
    slug: string;
  } | null;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedSession = sessionStorage.getItem("admin_session");
    if (storedSession) {
      try {
        const sessionData: AdminSession = JSON.parse(storedSession);
        setSession(sessionData);
      } catch (error) {
        console.error("Error parsing session data:", error);
        setSession(null);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_session");
    navigate("/admin/dashboard");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>جار التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 ">
      {/* Header */}
      <header className="bg-background border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
            <p className="text-sm text-muted-foreground">
              {session?.client?.name || "مدير النظام"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">{session?.full_name || session?.email || "زائر"}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
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
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
