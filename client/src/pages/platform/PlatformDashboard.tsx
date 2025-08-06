import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { articlesApi, countriesApi, universitiesApi, programsApi, consultationsApi, contactMessagesApi, testimonialsApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { 
  Crown, 
  Globe, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Building,
  GraduationCap,
  FileText,
  MessageSquare,
  Calendar
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  primary_color_1: string;
  primary_color_2: string;
  primary_color_3: string;
}

interface Stats {
  total_clients: number;
  total_managers: number;
  total_countries: number;
  total_universities: number;
  total_programs: number;
  total_articles: number;
  total_consultations: number;
  total_messages: number;
}

const PlatformDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_clients: 0,
    total_managers: 0,
    total_countries: 0,
    total_universities: 0,
    total_programs: 0,
    total_articles: 0,
    total_consultations: 0,
    total_messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is platform owner
    const session = localStorage.getItem("platform_owner_session");
    if (!session) {
      navigate("/platform/login");
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // Fetch stats
      const [
        { count: clientsCount },
        { count: managersCount },
        { count: countriesCount },
        { count: universitiesCount },
        { count: programsCount },
        { count: articlesCount },
        { count: consultationsCount },
        { count: messagesCount }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('managers').select('*', { count: 'exact', head: true }),
        supabase.from('countries').select('*', { count: 'exact', head: true }),
        supabase.from('universities').select('*', { count: 'exact', head: true }),
        supabase.from('programs').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('consultations').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        total_clients: clientsCount || 0,
        total_managers: managersCount || 0,
        total_countries: countriesCount || 0,
        total_universities: universitiesCount || 0,
        total_programs: programsCount || 0,
        total_articles: articlesCount || 0,
        total_consultations: consultationsCount || 0,
        total_messages: messagesCount || 0,
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("platform_owner_session");
    navigate("/platform/login");
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    });
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموقع؟ هذا الإجراء لا يمكن التراجع عنه.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف الموقع بنجاح",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف الموقع",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p>جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Platform Owner Dashboard
              </h1>
              <p className="text-muted-foreground">إدارة كامل منصة الدراسة بالخارج</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            تسجيل الخروج
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المواقع</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.total_clients}</p>
                </div>
                <Globe className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المديرين</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total_managers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الجامعات</p>
                  <p className="text-2xl font-bold text-green-600">{stats.total_universities}</p>
                </div>
                <Building className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الاستشارات</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.total_consultations}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">المقالات</p>
              <p className="text-xl font-bold">{stats.total_articles}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <GraduationCap className="w-8 h-8 text-teal-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">البرامج</p>
              <p className="text-xl font-bold">{stats.total_programs}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">الدول</p>
              <p className="text-xl font-bold">{stats.total_countries}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">الرسائل</p>
              <p className="text-xl font-bold">{stats.total_messages}</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">إدارة المواقع</CardTitle>
              <Button 
                onClick={() => navigate("/platform/create-client")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                إضافة موقع جديد
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد مواقع مضافة بعد</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <Card key={client.id} className="border-2 hover:border-primary/20 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          {client.logo_url ? (
                            <img 
                              src={client.logo_url} 
                              alt={client.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: client.primary_color_1 }}
                            >
                              {client.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold">{client.name}</h3>
                            <p className="text-sm text-muted-foreground">/{client.slug}</p>
                          </div>
                        </div>
                        <Badge variant={client.is_active ? "default" : "secondary"}>
                          {client.is_active ? "نشط" : "معطل"}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2 space-x-reverse mb-4">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: client.primary_color_1 }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: client.primary_color_2 }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: client.primary_color_3 }}
                        />
                        <span className="text-xs text-muted-foreground">ألوان الموقع</span>
                      </div>

                      <p className="text-xs text-muted-foreground mb-4">
                        تم الإنشاء: {new Date(client.created_at).toLocaleDateString('ar')}
                      </p>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          معاينة
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="w-3 h-3 mr-1" />
                          إدارة
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3 mr-1" />
                          تعديل
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/platform/stats")}
          >
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">الإحصائيات المفصلة</h3>
              <p className="text-sm text-muted-foreground">عرض تقارير شاملة لجميع المواقع</p>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/platform/users")}
          >
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">إدارة المستخدمين</h3>
              <p className="text-sm text-muted-foreground">إدارة جميع مديري المواقع</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Settings className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">إعدادات المنصة</h3>
              <p className="text-sm text-muted-foreground">إعدادات عامة للمنصة</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlatformDashboard;