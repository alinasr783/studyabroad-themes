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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">لوحة التحكم</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {session?.client?.name || "مدير النظام"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{session?.full_name || session?.email || "زائر"}</span>
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700">
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 min-h-[calc(100vh-80px)] shadow-lg">
          <nav className="p-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={`w-full justify-start h-11 rounded-lg font-medium transition-all duration-200 ${
                      isActive 
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="w-5 h-5 ml-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
