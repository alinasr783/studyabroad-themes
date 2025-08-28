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
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
            <p className="text-sm text-gray-400">
              {session?.client?.name || "مدير النظام"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-300">{session?.full_name || session?.email || "زائر"}</span>
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-red-700 text-red-400 hover:bg-red-900/40 hover:border-red-600 transition-colors duration-200">
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-l border-gray-700 min-h-[calc(100vh-80px)] shadow-xl">
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={`w-full justify-start h-11 rounded-lg font-medium transition-all duration-200 ${
                      isActive 
                        ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700 shadow-md" 
                        : "text-gray-400 hover:bg-gray-700/60 hover:text-white"
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
        <main className="flex-1 p-6 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-gray-800/70 rounded-xl border border-gray-700 p-6 shadow-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;