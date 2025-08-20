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
    { title: "الدول", value: stats.countries, icon: Globe, color: "text-blue-600" },
    { title: "الجامعات", value: stats.universities, icon: GraduationCap, color: "text-green-600" },
    { title: "البرامج الدراسية", value: stats.programs, icon: BookOpen, color: "text-purple-600" },
    { title: "المقالات", value: stats.articles, icon: FileText, color: "text-orange-600" },
    { title: "طلبات الاستشارة", value: stats.consultations, icon: MessageSquare, color: "text-red-600" },
    { title: "رسائل التواصل", value: stats.messages, icon: MessageSquare, color: "text-yellow-600" },
    { title: "آراء العملاء", value: stats.testimonials, icon: Star, color: "text-pink-600" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>جاري تحميل البيانات...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 ">

          <div className="text-center text-red-500">
            <p className="font-bold">خطأ!</p>
            <p>{error}</p>
            {clientId && <p className="text-sm mt-2">Client ID: {clientId}</p>}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground">نظرة عامة على موقعك {clientId && `(Client ID: ${clientId})`}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>أحدث طلبات الاستشارة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                لا توجد طلبات جديدة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>أحدث رسائل التواصل</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                لا توجد رسائل جديدة
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;