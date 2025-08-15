import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Palette, Upload, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface SiteSettings {
  id?: string;
  client_id: string;
  site_name_ar: string;
  site_name_en: string;
  logo_url?: string;
  primary_color_1: string;
  primary_color_2: string;
  primary_color_3: string;
  whatsapp_number?: string;
  email?: string;
  office_location?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  show_countries_section: boolean;
  show_universities_section: boolean;
  show_programs_section: boolean;
  show_articles_section: boolean;
  show_testimonials_section: boolean;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    client_id: "",
    site_name_ar: "موقع الدراسة بالخارج",
    site_name_en: "Study Abroad Site",
    logo_url: "",
    primary_color_1: "#3b82f6",
    primary_color_2: "#1e40af",
    primary_color_3: "#1e3a8a",
    whatsapp_number: "",
    email: "",
    office_location: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    linkedin_url: "",
    show_countries_section: true,
    show_universities_section: true,
    show_programs_section: true,
    show_articles_section: true,
    show_testimonials_section: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
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

        await fetchSettings(sessionData.client_id);
      } catch (err) {
        console.error("Error initializing settings:", err);
        setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        setLoading(false);
      }
    };

    checkSessionAndFetchData();
  }, [navigate]);

  const fetchSettings = async (clientId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("client_id", clientId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings(data);
      } else {
        // Create default settings
        setSettings(prev => ({ ...prev, client_id: clientId }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("حدث خطأ أثناء تحميل الإعدادات");
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل إعدادات الموقع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleColorChange = (colorName: string, color: string) => {
    setSettings(prev => ({
      ...prev,
      [colorName]: color,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const session = localStorage.getItem("manager_session");
      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { client_id } = JSON.parse(session);
      const settingsData = { ...settings, client_id };

      if (settings.id) {
        const { error } = await supabase
          .from("site_settings")
          .update(settingsData)
          .eq("id", settings.id)
          .eq("client_id", client_id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("site_settings")
          .insert(settingsData)
          .select()
          .single();

        if (error) throw error;
        setSettings(data);
      }

      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات الموقع بنجاح",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <p className="font-bold">خطأ!</p>
            <p>{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">إعدادات الموقع</h1>
            <p className="text-muted-foreground">إدارة إعدادات ومظهر الموقع</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 ml-2" />
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </Button>
        </div>

        {/* Site Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              هوية الموقع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="site_name_ar">اسم الموقع بالعربية</Label>
                <Input
                  id="site_name_ar"
                  name="site_name_ar"
                  value={settings.site_name_ar}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="site_name_en">اسم الموقع بالإنجليزية</Label>
                <Input
                  id="site_name_en"
                  name="site_name_en"
                  value={settings.site_name_en}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="logo_url">رابط اللوجو</Label>
              <Input
                id="logo_url"
                name="logo_url"
                value={settings.logo_url || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              ألوان الموقع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primary_color_1">اللون الأساسي الأول</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={settings.primary_color_1}
                    onChange={(e) => handleColorChange("primary_color_1", e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.primary_color_1}
                    onChange={(e) => handleColorChange("primary_color_1", e.target.value)}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="primary_color_2">اللون الأساسي الثاني</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={settings.primary_color_2}
                    onChange={(e) => handleColorChange("primary_color_2", e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.primary_color_2}
                    onChange={(e) => handleColorChange("primary_color_2", e.target.value)}
                    placeholder="#1e40af"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="primary_color_3">اللون الأساسي الثالث</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={settings.primary_color_3}
                    onChange={(e) => handleColorChange("primary_color_3", e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.primary_color_3}
                    onChange={(e) => handleColorChange("primary_color_3", e.target.value)}
                    placeholder="#1e3a8a"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              معلومات التواصل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="whatsapp_number">رقم الواتساب</Label>
                <Input
                  id="whatsapp_number"
                  name="whatsapp_number"
                  value={settings.whatsapp_number || ""}
                  onChange={handleInputChange}
                  placeholder="+966501234567"
                />
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={settings.email || ""}
                  onChange={handleInputChange}
                  placeholder="info@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="office_location">عنوان المكتب</Label>
              <Textarea
                id="office_location"
                name="office_location"
                value={settings.office_location || ""}
                onChange={handleInputChange}
                placeholder="الرياض، المملكة العربية السعودية"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Facebook className="w-5 h-5" />
              وسائل التواصل الاجتماعي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook_url">فيسبوك</Label>
                <Input
                  id="facebook_url"
                  name="facebook_url"
                  value={settings.facebook_url || ""}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="instagram_url">إنستغرام</Label>
                <Input
                  id="instagram_url"
                  name="instagram_url"
                  value={settings.instagram_url || ""}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="twitter_url">تويتر</Label>
                <Input
                  id="twitter_url"
                  name="twitter_url"
                  value={settings.twitter_url || ""}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="linkedin_url">لينكد إن</Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  value={settings.linkedin_url || ""}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/company/yourpage"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Page Visibility */}
        <Card>
          <CardHeader>
            <CardTitle>إظهار/إخفاء أقسام الموقع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { key: "show_countries_section", label: "قسم الدول" },
                { key: "show_universities_section", label: "قسم الجامعات" },
                { key: "show_programs_section", label: "قسم البرامج الدراسية" },
                { key: "show_articles_section", label: "قسم المقالات" },
                { key: "show_testimonials_section", label: "قسم آراء العملاء" },
              ].map((section) => (
                <div key={section.key} className="flex items-center justify-between">
                  <Label htmlFor={section.key}>{section.label}</Label>
                  <Switch
                    id={section.key}
                    checked={settings[section.key as keyof SiteSettings] as boolean}
                    onCheckedChange={(checked) => handleSwitchChange(section.key, checked)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="w-4 h-4 ml-2" />
            {saving ? "جاري الحفظ..." : "حفظ جميع الإعدادات"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;