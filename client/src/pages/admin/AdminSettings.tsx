import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Palette, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, Tiktok, Snapchat } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface SiteSettings {
  id?: string;
  client_id: string;
  site_name_ar: string;
  site_name_en: string;
  tagline_ar?: string;
  tagline_en?: string;
  logo_url?: string;
  logo_animation?: string;
  primary_color_1: string;
  primary_color_2: string;
  primary_color_3: string;
  whatsapp_number?: string;
  whatsapp_title?: string;
  whatsapp_description?: string;
  email?: string;
  phone_numbers?: string[];
  email_addresses?: string[];
  office_location?: string;
  working_hours?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  snapchat_url?: string;
  map_link?: string;
  map_placeholder?: string;
  newsletter_title?: string;
  newsletter_description?: string;
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
    tagline_ar: "شعار الموقع بالعربية",
    tagline_en: "Site tagline in English",
    logo_url: "",
    logo_animation: "",
    primary_color_1: "#3b82f6",
    primary_color_2: "#1e40af",
    primary_color_3: "#1e3a8a",
    whatsapp_number: "",
    whatsapp_title: "تواصل معنا عبر واتساب",
    whatsapp_description: "نحن متاحون للرد على استفساراتك عبر واتساب",
    email: "",
    phone_numbers: [],
    email_addresses: [],
    office_location: "",
    working_hours: "الأحد - الخميس: 9 ص - 5 م",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    linkedin_url: "",
    youtube_url: "",
    tiktok_url: "",
    snapchat_url: "",
    map_link: "",
    map_placeholder: "",
    newsletter_title: "النشرة الإخبارية",
    newsletter_description: "اشترك في نشرتنا البريدية لتصلك آخر العروض والأخبار",
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

  const handleArrayInputChange = (name: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [name]: value.split(',').map(item => item.trim()),
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tagline_ar">الشعار بالعربية</Label>
                <Input
                  id="tagline_ar"
                  name="tagline_ar"
                  value={settings.tagline_ar || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="tagline_en">الشعار بالإنجليزية</Label>
                <Input
                  id="tagline_en"
                  name="tagline_en"
                  value={settings.tagline_en || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="logo_animation">رابط لوجو متحرك</Label>
                <Input
                  id="logo_animation"
                  name="logo_animation"
                  value={settings.logo_animation || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo-animation.gif"
                />
              </div>
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
                <Label htmlFor="whatsapp_title">عنوان الواتساب</Label>
                <Input
                  id="whatsapp_title"
                  name="whatsapp_title"
                  value={settings.whatsapp_title || ""}
                  onChange={handleInputChange}
                  placeholder="تواصل معنا عبر واتساب"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="whatsapp_description">وصف الواتساب</Label>
              <Textarea
                id="whatsapp_description"
                name="whatsapp_description"
                value={settings.whatsapp_description || ""}
                onChange={handleInputChange}
                placeholder="نحن متاحون للرد على استفساراتك عبر واتساب"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني الرئيسي</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={settings.email || ""}
                  onChange={handleInputChange}
                  placeholder="info@example.com"
                />
              </div>
              <div>
                <Label htmlFor="working_hours">ساعات العمل</Label>
                <Input
                  id="working_hours"
                  name="working_hours"
                  value={settings.working_hours || ""}
                  onChange={handleInputChange}
                  placeholder="الأحد - الخميس: 9 ص - 5 م"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone_numbers">أرقام الهاتف (مفصولة بفواصل)</Label>
              <Input
                id="phone_numbers"
                value={settings.phone_numbers?.join(', ') || ""}
                onChange={(e) => handleArrayInputChange("phone_numbers", e.target.value)}
                placeholder="+966501234567, +966502345678"
              />
            </div>
            <div>
              <Label htmlFor="email_addresses">عنواين البريد الإلكتروني (مفصولة بفواصل)</Label>
              <Input
                id="email_addresses"
                value={settings.email_addresses?.join(', ') || ""}
                onChange={(e) => handleArrayInputChange("email_addresses", e.target.value)}
                placeholder="info@example.com, support@example.com"
              />
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

        {/* Map & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              الخريطة والموقع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="map_link">رابط الخريطة</Label>
                <Input
                  id="map_link"
                  name="map_link"
                  value={settings.map_link || ""}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div>
                <Label htmlFor="map_placeholder">صورة الخريطة البديلة</Label>
                <Input
                  id="map_placeholder"
                  name="map_placeholder"
                  value={settings.map_placeholder || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com/map-placeholder.jpg"
                />
              </div>
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
              <div>
                <Label htmlFor="youtube_url">يوتيوب</Label>
                <Input
                  id="youtube_url"
                  name="youtube_url"
                  value={settings.youtube_url || ""}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
              <div>
                <Label htmlFor="tiktok_url">تيك توك</Label>
                <Input
                  id="tiktok_url"
                  name="tiktok_url"
                  value={settings.tiktok_url || ""}
                  onChange={handleInputChange}
                  placeholder="https://tiktok.com/@yourpage"
                />
              </div>
              <div>
                <Label htmlFor="snapchat_url">سناب شات</Label>
                <Input
                  id="snapchat_url"
                  name="snapchat_url"
                  value={settings.snapchat_url || ""}
                  onChange={handleInputChange}
                  placeholder="https://snapchat.com/add/yourpage"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              النشرة البريدية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newsletter_title">عنوان النشرة</Label>
                <Input
                  id="newsletter_title"
                  name="newsletter_title"
                  value={settings.newsletter_title || ""}
                  onChange={handleInputChange}
                  placeholder="النشرة الإخبارية"
                />
              </div>
              <div>
                <Label htmlFor="newsletter_description">وصف النشرة</Label>
                <Input
                  id="newsletter_description"
                  name="newsletter_description"
                  value={settings.newsletter_description || ""}
                  onChange={handleInputChange}
                  placeholder="اشترك في نشرتنا البريدية لتصلك آخر العروض والأخبار"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Page Visibility - Coming Soon */}
        <Card className="relative opacity-70">
          <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg py-2 px-4">
              قريبًا
            </Badge>
          </div>
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
                    disabled
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