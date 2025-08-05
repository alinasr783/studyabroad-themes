import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, Palette, User, Mail, Lock, Building } from "lucide-react";

const CreateClient = () => {
  const [loading, setLoading] = useState(false);
  const [deploymentLoading, setDeploymentLoading] = useState(false);
  const [formData, setFormData] = useState({
    site_name: "",
    client_name: "",
    slug: "",
    admin_email: "",
    admin_password: "",
    primary_color_1: "#3b82f6",
    primary_color_2: "#1e40af", 
    primary_color_3: "#1e3a8a",
    logo_url: "",
    description: ""
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from site name
    if (name === "site_name") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleColorChange = (colorName: string, value: string) => {
    setFormData(prev => ({ ...prev, [colorName]: value }));
  };

  const deployToVercel = async (clientId: string) => {
    setDeploymentLoading(true);
    
    try {
      // This is a placeholder for Vercel deployment
      // In a real implementation, you would call Vercel API here
      console.log("Deploying to Vercel...", {
        clientId,
        siteName: formData.site_name,
        slug: formData.slug
      });
      
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "تم رفع الموقع بنجاح",
        description: `الموقع متاح الآن على: https://${formData.slug}.vercel.app`,
      });
      
      // Here you would normally update the client record with the Vercel URL
      await supabase
        .from('clients')
        .update({ 
          vercel_url: `https://${formData.slug}.vercel.app`,
          deployment_status: 'deployed'
        })
        .eq('id', clientId);
        
    } catch (error) {
      console.error("Deployment error:", error);
      toast({
        title: "خطأ في الرفع",
        description: "حدث خطأ أثناء رفع الموقع على Vercel",
        variant: "destructive"
      });
    } finally {
      setDeploymentLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create client record
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert([{
          name: formData.site_name,
          slug: formData.slug,
          logo_url: formData.logo_url || null,
          primary_color_1: formData.primary_color_1,
          primary_color_2: formData.primary_color_2,
          primary_color_3: formData.primary_color_3,
          is_active: true
        }])
        .select()
        .single();

      if (clientError) throw clientError;

      // Create admin manager for this client
      const { error: managerError } = await supabase
        .from('managers')
        .insert([{
          email: formData.admin_email,
          password: formData.admin_password,
          client_id: client.id
        }]);

      if (managerError) throw managerError;

      // Create default site settings for this client
      const { error: settingsError } = await supabase
        .from('site_settings')
        .insert([{
          client_id: client.id,
          site_name_ar: formData.site_name,
          site_name_en: formData.site_name,
          logo_url: formData.logo_url || null,
          primary_color_1: formData.primary_color_1,
          primary_color_2: formData.primary_color_2,
          primary_color_3: formData.primary_color_3,
          show_countries_section: true,
          show_universities_section: true,
          show_programs_section: true,
          show_articles_section: true,
          show_testimonials_section: true
        }]);

      if (settingsError) throw settingsError;

      toast({
        title: "تم إنشاء الموقع بنجاح",
        description: "جاري رفع الموقع على Vercel...",
      });

      // Deploy to Vercel
      await deployToVercel(client.id);

      // Redirect to platform dashboard
      navigate("/platform/dashboard");

    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إنشاء الموقع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center space-x-4 space-x-reverse mb-8">
          <Button variant="outline" onClick={() => navigate("/platform/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة للوحة التحكم
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              إنشاء موقع جديد
            </h1>
            <p className="text-muted-foreground">إضافة موقع دراسة بالخارج جديد للمنصة</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                معلومات الموقع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_name">اسم الموقع *</Label>
                  <Input
                    id="site_name"
                    name="site_name"
                    value={formData.site_name}
                    onChange={handleInputChange}
                    required
                    placeholder="مثال: موقع أحمد للدراسة بالخارج"
                  />
                </div>
                <div>
                  <Label htmlFor="client_name">اسم العميل *</Label>
                  <Input
                    id="client_name"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    required
                    placeholder="مثال: أحمد محمد"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="slug">اسم النطاق الفرعي *</Label>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    placeholder="ahmed-study-abroad"
                    className="font-mono"
                  />
                  <span className="text-sm text-muted-foreground">.vercel.app</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  سيكون الموقع متاح على: https://{formData.slug || "your-site"}.vercel.app
                </p>
              </div>

              <div>
                <Label htmlFor="logo_url">رابط اللوجو (اختياري)</Label>
                <Input
                  id="logo_url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <Label htmlFor="description">وصف الموقع (اختياري)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="وصف مختصر عن الموقع وخدماته..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Admin Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                حساب المدير الأول
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admin_email">البريد الإلكتروني *</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="admin_email"
                      name="admin_email"
                      type="email"
                      value={formData.admin_email}
                      onChange={handleInputChange}
                      required
                      placeholder="admin@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="admin_password">كلمة المرور *</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="admin_password"
                      name="admin_password"
                      type="password"
                      value={formData.admin_password}
                      onChange={handleInputChange}
                      required
                      placeholder="كلمة مرور قوية"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Design Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                ألوان التصميم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary_color_1">اللون الأساسي الأول</Label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="color"
                      value={formData.primary_color_1}
                      onChange={(e) => handleColorChange("primary_color_1", e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={formData.primary_color_1}
                      onChange={(e) => handleColorChange("primary_color_1", e.target.value)}
                      placeholder="#3b82f6"
                      className="font-mono"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="primary_color_2">اللون الأساسي الثاني</Label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="color"
                      value={formData.primary_color_2}
                      onChange={(e) => handleColorChange("primary_color_2", e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={formData.primary_color_2}
                      onChange={(e) => handleColorChange("primary_color_2", e.target.value)}
                      placeholder="#1e40af"
                      className="font-mono"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="primary_color_3">اللون الأساسي الثالث</Label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="color"
                      value={formData.primary_color_3}
                      onChange={(e) => handleColorChange("primary_color_3", e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={formData.primary_color_3}
                      onChange={(e) => handleColorChange("primary_color_3", e.target.value)}
                      placeholder="#1e3a8a"
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
              
              {/* Color Preview */}
              <div className="mt-4 p-4 border rounded-lg">
                <p className="text-sm font-medium mb-2">معاينة الألوان:</p>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: formData.primary_color_1 }}
                  />
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: formData.primary_color_2 }}
                  />
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: formData.primary_color_3 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 space-x-reverse">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/platform/dashboard")}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading || deploymentLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Building className="w-4 h-4 mr-2" />
              {loading ? "جاري الإنشاء..." : deploymentLoading ? "جاري الرفع..." : "إنشاء الموقع"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClient;