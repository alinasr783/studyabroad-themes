import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Search, 
  BarChart3, 
  Users, 
  Building, 
  GraduationCap,
  FileText,
  MessageSquare,
  Calendar,
  Globe,
  TrendingUp,
  Activity
} from "lucide-react";

interface DetailedStats {
  clients: any[];
  totalUsers: number;
  totalCountries: number;
  totalUniversities: number;
  totalPrograms: number;
  totalArticles: number;
  totalConsultations: number;
  totalMessages: number;
  recentActivity: any[];
}

const PlatformStats = () => {
  const [stats, setStats] = useState<DetailedStats>({
    clients: [],
    totalUsers: 0,
    totalCountries: 0,
    totalUniversities: 0,
    totalPrograms: 0,
    totalArticles: 0,
    totalConsultations: 0,
    totalMessages: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is platform owner
    const session = localStorage.getItem("platform_owner_session");
    if (!session) {
      setLocation("/platform/login");
      return;
    }

    fetchDetailedStats();
  }, [setLocation]);

  const fetchDetailedStats = async () => {
    try {
      // Fetch all data with detailed information
      const [
        { data: clients },
        { data: managers },
        { data: countries },
        { data: universities },
        { data: programs },
        { data: articles },
        { data: consultations },
        { data: messages }
      ] = await Promise.all([
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('managers').select('*').order('created_at', { ascending: false }),
        supabase.from('countries').select('*').order('created_at', { ascending: false }),
        supabase.from('universities').select('*').order('created_at', { ascending: false }),
        supabase.from('programs').select('*').order('created_at', { ascending: false }),
        supabase.from('articles').select('*').order('created_at', { ascending: false }),
        supabase.from('consultations').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      ]);

      // Combine recent activity
      const recentActivity = [
        ...(consultations?.slice(0, 5)?.map(c => ({ 
          type: 'consultation', 
          title: `استشارة جديدة من ${c.full_name}`, 
          time: c.created_at,
          client_id: c.client_id 
        })) || []),
        ...(messages?.slice(0, 5)?.map(m => ({ 
          type: 'message', 
          title: `رسالة جديدة من ${m.full_name}`, 
          time: m.created_at,
          client_id: m.client_id 
        })) || []),
        ...(articles?.slice(0, 3)?.map(a => ({ 
          type: 'article', 
          title: `مقال جديد: ${a.title_ar}`, 
          time: a.created_at,
          client_id: a.client_id 
        })) || [])
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

      setStats({
        clients: clients || [],
        totalUsers: managers?.length || 0,
        totalCountries: countries?.length || 0,
        totalUniversities: universities?.length || 0,
        totalPrograms: programs?.length || 0,
        totalArticles: articles?.length || 0,
        totalConsultations: consultations?.length || 0,
        totalMessages: messages?.length || 0,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching detailed stats:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل الإحصائيات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = stats.clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'consultation': return Calendar;
      case 'message': return MessageSquare;
      case 'article': return FileText;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'text-blue-600';
      case 'message': return 'text-green-600';
      case 'article': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p>جاري تحميل الإحصائيات التفصيلية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 space-x-reverse mb-8">
          <Button variant="outline" onClick={() => navigate("/platform/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة للوحة التحكم
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              الإحصائيات التفصيلية
            </h1>
            <p className="text-muted-foreground">تقارير شاملة لجميع المواقع والأنشطة</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المواقع</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.clients.length}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% هذا الشهر
                  </p>
                </div>
                <Globe className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% هذا الشهر
                  </p>
                </div>
                <Users className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الجامعات</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalUniversities}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15% هذا الشهر
                  </p>
                </div>
                <Building className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الاستشارات</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.totalConsultations}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +22% هذا الشهر
                  </p>
                </div>
                <Calendar className="w-12 h-12 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clients Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>نظرة عامة على المواقع</CardTitle>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="البحث في المواقع..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: client.primary_color_1 }}
                        >
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{client.name}</h3>
                          <p className="text-sm text-muted-foreground">/{client.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Badge variant={client.is_active ? "default" : "secondary"}>
                          {client.is_active ? "نشط" : "معطل"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(client.created_at).toLocaleDateString('ar')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={index} className="flex items-start space-x-3 space-x-reverse p-3 rounded-lg bg-muted/30">
                        <Icon className={`w-5 h-5 mt-0.5 ${getActivityColor(activity.type)}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.time).toLocaleString('ar')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>إحصائيات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">المقالات</span>
                  <span className="font-semibold">{stats.totalArticles}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">البرامج</span>
                  <span className="font-semibold">{stats.totalPrograms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">الدول</span>
                  <span className="font-semibold">{stats.totalCountries}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">الرسائل</span>
                  <span className="font-semibold">{stats.totalMessages}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;