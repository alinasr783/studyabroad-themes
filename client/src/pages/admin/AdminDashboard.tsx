import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Globe, GraduationCap, BookOpen, FileText, MessageSquare, Star } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";

interface Stats {
  countries: number;
  universities: number;
  programs: number;
  articles: number;
  consultations: number;
  messages: number;
  testimonials: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    countries: 0,
    universities: 0,
    programs: 0,
    articles: 0,
    consultations: 0,
    messages: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionAndFetchData = async () => {
      try {
        const session = localStorage.getItem("manager_session");
        if (!session) {
          navigate("/admin/login");
          return;
        }

        const sessionData = JSON.parse(session);
        if (!sessionData.client_id) {
          throw new Error("بيانات الجلسة غير صالحة");
        }

        // التحقق من أن الجلسة لم تنتهي (30 دقيقة)
        const sessionAge = Date.now() - (sessionData.timestamp || 0);
        if (sessionAge > 30 * 60 * 1000) {
          localStorage.removeItem("manager_session");
          navigate("/admin/login");
          return;
        }

        setClientId(sessionData.client_id);
        await fetchStats(sessionData.client_id);
      } catch (err) {
        console.error("Error initializing dashboard:", err);
        setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        setLoading(false);
      }
    };

    checkSessionAndFetchData();
  }, [navigate]);

  const fetchStats = async (client_id: string) => {
    try {
      setLoading(true);
      setError(null);

      const [
        { count: countriesCount },
        { count: universitiesCount },
        { count: programsCount },
        { count: articlesCount },
        { count: consultationsCount },
        { count: messagesCount },
        { count: testimonialsCount },
      ] = await Promise.all([
        supabase.from("countries").select("id", { count: "exact" }).eq("client_id", client_id),
        supabase.from("universities").select("id", { count: "exact" }).eq("client_id", client_id),
        supabase.from("programs").select("id", { count: "exact" }).eq("client_id", client_id),
        supabase.from("articles").select("id", { count: "exact" }).eq("client_id", client_id),
        supabase.from("consultations").select("id", { count: "exact" }).eq("client_id", client_id),
        supabase.from("contact_messages").select("id", { count: "exact" }).eq("client_id", client_id),
        supabase.from("testimonials").select("id", { count: "exact" }).eq("client_id", client_id),
      ]);

      setStats({
        countries: countriesCount || 0,
        universities: universitiesCount || 0,
        programs: programsCount || 0,
        articles: articlesCount || 0,
        consultations: consultationsCount || 0,
        messages: messagesCount || 0,
        testimonials: testimonialsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("حدث خطأ أثناء جلب البيانات. يرجى التحقق من اتصال الشبكة أو إعادة المحاولة لاحقًا.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "الدول", value: stats.countries, icon: Globe, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800" },
    { title: "الجامعات", value: stats.universities, icon: GraduationCap, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800" },
    { title: "البرامج الدراسية", value: stats.programs, icon: BookOpen, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200 dark:border-purple-800" },
    { title: "المقالات", value: stats.articles, icon: FileText, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-200 dark:border-orange-800" },
    { title: "طلبات الاستشارة", value: stats.consultations, icon: MessageSquare, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800" },
    { title: "رسائل التواصل", value: stats.messages, icon: MessageSquare, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800" },
    { title: "آراء العملاء", value: stats.testimonials, icon: Star, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/20", border: "border-pink-200 dark:border-pink-800" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400 mx-auto mb-6"></div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">جاري تحميل البيانات...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center bg-red-50 dark:bg-red-900/20 p-8 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-red-600 dark:text-red-400">
              <p className="font-bold text-lg mb-2">خطأ!</p>
              <p className="mb-4">{error}</p>
              {clientId && <p className="text-sm opacity-80">Client ID: {clientId}</p>}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">لوحة التحكم</h1>
          <p className="text-gray-600 dark:text-gray-300">نظرة عامة على موقعك {clientId && `(Client ID: ${clientId})`}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className={`${card.bg} border-2 ${card.border} hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">{card.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${card.bg}`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <MessageSquare className="w-5 h-5 ml-2 text-blue-600 dark:text-blue-400" />
                أحدث طلبات الاستشارة
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  لا توجد طلبات جديدة
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <MessageSquare className="w-5 h-5 ml-2 text-green-600 dark:text-green-400" />
                أحدث رسائل التواصل
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  لا توجد رسائل جديدة
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;