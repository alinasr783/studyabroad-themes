import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Globe, GraduationCap, BookOpen, FileText, MessageSquare, Star } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const session = localStorage.getItem("manager_session");
      if (!session) return;

      const { client_id } = JSON.parse(session);

      const [
        countriesRes,
        universitiesRes,
        programsRes,
        articlesRes,
        consultationsRes,
        messagesRes,
        testimonialsRes,
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
        countries: countriesRes.count || 0,
        universities: universitiesRes.count || 0,
        programs: programsRes.count || 0,
        articles: articlesRes.count || 0,
        consultations: consultationsRes.count || 0,
        messages: messagesRes.count || 0,
        testimonials: testimonialsRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">الرئيسية</h1>
          <p className="text-muted-foreground">نظرة عامة على موقعك</p>
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