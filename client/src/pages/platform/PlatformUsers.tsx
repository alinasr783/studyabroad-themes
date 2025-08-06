import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { articlesApi, countriesApi, universitiesApi, programsApi, consultationsApi, contactMessagesApi, testimonialsApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Users, 
  Edit,
  Trash2,
  Plus,
  Mail,
  Shield,
  Globe,
  Settings
} from "lucide-react";

interface Manager {
  id: string;
  email: string;
  created_at: string;
  client_id: string | null;
  clients?: {
    name: string;
    slug: string;
    primary_color_1: string;
  } | null;
}

const PlatformUsers = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is platform owner
    const session = localStorage.getItem("platform_owner_session");
    if (!session) {
      navigate("/platform/login");
      return;
    }

    fetchManagers();
  }, [navigate]);

  const fetchManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('managers')
        .select(`
          *,
          clients (
            name,
            slug,
            primary_color_1
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setManagers(data || []);

    } catch (error) {
      console.error('Error fetching managers:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل بيانات المستخدمين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteManager = async (managerId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المدير؟")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('managers')
        .delete()
        .eq('id', managerId);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف المدير بنجاح",
      });

      fetchManagers();
    } catch (error) {
      console.error('Error deleting manager:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف المدير",
        variant: "destructive",
      });
    }
  };

  const filteredManagers = managers.filter(manager => 
    manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.clients?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.clients?.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const platformOwners = filteredManagers.filter(m => m.client_id === null);
  const siteManagers = filteredManagers.filter(m => m.client_id !== null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p>جاري تحميل بيانات المستخدمين...</p>
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
            <Button variant="outline" onClick={() => navigate("/platform/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة للوحة التحكم
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                إدارة المستخدمين
              </h1>
              <p className="text-muted-foreground">إدارة جميع مديري المواقع والمنصة</p>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="البحث في المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">أصحاب المنصة</p>
                  <p className="text-2xl font-bold text-purple-600">{platformOwners.length}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">مديري المواقع</p>
                  <p className="text-2xl font-bold text-blue-600">{siteManagers.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
                  <p className="text-2xl font-bold text-green-600">{managers.length}</p>
                </div>
                <Globe className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Owners */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              أصحاب المنصة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {platformOwners.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا يوجد أصحاب منصة</p>
              </div>
            ) : (
              <div className="space-y-4">
                {platformOwners.map((manager) => (
                  <div key={manager.id} className="flex items-center justify-between p-4 border rounded-lg bg-purple-50 border-purple-200">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center">
                          {manager.email}
                          <Badge variant="secondary" className="mr-2 bg-purple-100 text-purple-700">
                            Platform Owner
                          </Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          انضم في: {new Date(manager.created_at).toLocaleDateString('ar')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3 mr-1" />
                        تعديل
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Site Managers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                مديري المواقع
              </CardTitle>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                إضافة مدير جديد
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {siteManagers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا يوجد مديري مواقع بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {siteManagers.map((manager) => (
                  <div key={manager.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: manager.clients?.primary_color_1 || '#3b82f6' }}
                      >
                        {manager.clients?.name?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          {manager.email}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          موقع: {manager.clients?.name || 'غير محدد'} • /{manager.clients?.slug || 'unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          انضم في: {new Date(manager.created_at).toLocaleDateString('ar')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Badge variant="outline">مدير موقع</Badge>
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
                        onClick={() => handleDeleteManager(manager.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformUsers;