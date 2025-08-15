import React, { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, Palette, User, Mail, Lock, Building } from "lucide-react";

type CreateClientForm = {
  site_name: string;
  client_name: string;
  admin_email: string;
  admin_password: string;
  primary_color_1: string;
  primary_color_2: string;
  primary_color_3: string;
  logo_url: string;
  description: string;
};

type CreateVercelProjectResponse = {
  projectId: string;
  projectUrl?: string;
  customDomain?: string;
};

type ClientRow = {
  id: string;
  name: string;
  client_name: string;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
  vercel_project_id?: string | null;
  vercel_url?: string | null;
  custom_domain?: string | null;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !!email && emailRegex.test(email.trim());
};

const isValidHexColor = (value: string): boolean => {
  if (!value) return false;
  const v = value.trim();
  const hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
  return hexRegex.test(v);
};

const cleanString = (s: string): string => (s ?? "").trim();

const makeSlug = (name: string): string => {
  return cleanString(name)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
};

const isStrongPasswordEnough = (p: string): boolean => {
  return typeof p === "string" && p.length >= 6;
};

const isValidUrl = (s?: string): boolean => {
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const stripSpaces = (s: string): string => s.replace(/\s+/g, "");

const pushError = (errors: string[], msg: string) => {
  if (msg && !errors.includes(msg)) errors.push(msg);
};

const CreateClient: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [deploymentLoading, setDeploymentLoading] = useState(false);
  const [formData, setFormData] = useState<CreateClientForm>({
    site_name: "",
    client_name: "",
    admin_email: "",
    admin_password: "",
    primary_color_1: "#3b82f6",
    primary_color_2: "#1e40af",
    primary_color_3: "#1e3a8a",
    logo_url: "",
    description: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const siteSlug = useMemo(() => makeSlug(formData.site_name), [formData.site_name]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === "admin_email") {
        setFormData((prev) => ({ ...prev, [name]: stripSpaces(value) }));
        return;
      }
      if (name === "admin_password") {
        setFormData((prev) => ({ ...prev, [name]: value }));
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleColorChange = useCallback((colorName: keyof CreateClientForm, value: string) => {
    setFormData((prev) => ({ ...prev, [colorName]: value }));
  }, []);

  const validateBeforeSubmit = useCallback((data: CreateClientForm): string[] => {
    const errors: string[] = [];
    if (!cleanString(data.site_name)) {
      pushError(errors, "اسم الموقع مطلوب.");
    }
    if (!cleanString(data.client_name)) {
      pushError(errors, "اسم العميل مطلوب.");
    }
    if (!cleanString(data.admin_email)) {
      pushError(errors, "البريد الإلكتروني مطلوب.");
    }
    if (!cleanString(data.admin_password)) {
      pushError(errors, "كلمة المرور مطلوبة.");
    }
    if (data.admin_email && !isValidEmail(data.admin_email)) {
      pushError(errors, "البريد الإلكتروني غير صحيح.");
    }
    if (data.admin_password && !isStrongPasswordEnough(data.admin_password)) {
      pushError(errors, "كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
    }
    if (!isValidHexColor(data.primary_color_1)) {
      pushError(errors, "اللون الأساسي الأول يجب أن يكون قيمة hex صحيحة (مثال: #3b82f6).");
    }
    if (!isValidHexColor(data.primary_color_2)) {
      pushError(errors, "اللون الأساسي الثاني يجب أن يكون قيمة hex صحيحة (مثال: #1e40af).");
    }
    if (!isValidHexColor(data.primary_color_3)) {
      pushError(errors, "اللون الأساسي الثالث يجب أن يكون قيمة hex صحيحة (مثال: #1e3a8a).");
    }
    if (cleanString(data.logo_url) && !isValidUrl(data.logo_url)) {
      pushError(errors, "رابط اللوجو غير صالح. استخدم http(s)://...");
    }
    if (!siteSlug) {
      pushError(errors, "اسم الموقع غير صالح بعد التحويل إلى Slug. يرجى تعديل الاسم.");
    }
    return errors;
  }, [siteSlug]);

  const deployToVercel = useCallback(
    async (clientId: string): Promise<CreateVercelProjectResponse> => {
      setDeploymentLoading(true);
      try {
        const nameForVercel = siteSlug || formData.site_name;

        // التحقق من اتصال Supabase
        if (!supabase) {
          throw new Error("اتصال Supabase غير متوفر");
        }

        // استدعاء Edge Function مع معالجة الأخطاء المحسنة
        let data: CreateVercelProjectResponse | null = null;
        let error: Error | null = null;

        try {
          const response = await supabase.functions.invoke<CreateVercelProjectResponse>(
            "create-vercel-project",
            {
              body: {
                name: nameForVercel,
                clientId,
              },
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 15000 // 15 ثانية مهلة للطلب
            }
          );

          data = response.data;
          error = response.error;
        } catch (invokeError) {
          console.error("فشل استدعاء Edge Function:", invokeError);
          throw new Error("تعذر الاتصال بخدمة النشر. يرجى المحاولة لاحقاً");
        }

        if (error || !data) {
          throw new Error(error?.message || "فشل في إنشاء مشروع Vercel");
        }

        if (!data.projectId) {
          throw new Error("لم يتم استلام معرف المشروع من Vercel");
        }

        // تحديث سجل العميل بمعلومات Vercel
        const updatePayload: Partial<ClientRow> = {
          vercel_project_id: data.projectId,
          vercel_url: data.projectUrl || null,
          custom_domain: data.customDomain || null
        };

        const { error: updateError } = await supabase
          .from("clients")
          .update(updatePayload)
          .eq("id", clientId);

        if (updateError) {
          console.error("خطأ تحديث العميل:", updateError);
          throw new Error("تم النشر ولكن تعذر حفظ معلومات المشروع");
        }

        return data;
      } catch (err: any) {
        console.error("تفاصيل خطأ النشر:", err);
        throw err;
      } finally {
        setDeploymentLoading(false);
      }
    },
    [formData.site_name, siteSlug]
  );

  const createClientRow = useCallback(
    async (data: CreateClientForm): Promise<ClientRow> => {
      try {
        const { data: client, error: clientError } = await supabase
          .from("clients")
          .insert([
            {
              name: cleanString(data.site_name),
              client_name: cleanString(data.client_name),
              logo_url: cleanString(data.logo_url) || null,
              description: cleanString(data.description) || null,
              is_active: true,
            }
          ])
          .select()
          .single();

        if (clientError) {
          console.error("تفاصيل خطأ إنشاء العميل:", clientError);
          throw new Error(clientError.message || "تعذر إنشاء سجل العميل");
        }

        if (!client || !client.id) {
          throw new Error("تعذر استرجاع بيانات العميل بعد الإنشاء");
        }

        return client;
      } catch (err) {
        console.error("خطأ في إنشاء سجل العميل:", err);
        throw err;
      }
    },
    []
  );

  const assertEmailNotTaken = useCallback(async (email: string) => {
    try {
      const { data: existingManager, error: emailError } = await supabase
        .from("managers")
        .select("id")
        .eq("email", cleanString(email))
        .maybeSingle();

      if (emailError) {
        console.error("تفاصيل خطأ التحقق من البريد:", emailError);
        throw new Error(emailError.message || "تعذر التحقق من البريد الإلكتروني");
      }

      if (existingManager) {
        throw new Error("البريد الإلكتروني محجوز مسبقاً، يرجى استخدام بريد آخر");
      }
    } catch (err) {
      console.error("خطأ في التحقق من البريد الإلكتروني:", err);
      throw err;
    }
  }, []);

  const createSiteSettings = useCallback(async (clientId: string, data: CreateClientForm) => {
    try {
      const payload = {
        client_id: clientId,
        site_name_ar: cleanString(data.site_name),
        site_name_en: cleanString(data.site_name),
        logo_url: cleanString(data.logo_url) || null,
        primary_color_1: data.primary_color_1,
        primary_color_2: data.primary_color_2,
        primary_color_3: data.primary_color_3,
        show_countries_section: true,
        show_universities_section: true,
        show_programs_section: true,
        show_articles_section: true,
        show_testimonials_section: true,
        tagline_ar: "منصة متخصصة في الدراسة بالخارج",
        tagline_en: "Specialized platform for studying abroad",
      };

      const { error: settingsError } = await supabase.from("site_settings").insert([payload]);

      if (settingsError) {
        console.error("تفاصيل خطأ إعدادات الموقع:", settingsError);
        throw new Error(settingsError.message || "تعذر إنشاء إعدادات الموقع");
      }
    } catch (err) {
      console.error("خطأ في إنشاء إعدادات الموقع:", err);
      throw err;
    }
  }, []);

  const createManagerAccount = useCallback(async (clientId: string, data: CreateClientForm) => {
    try {
      const payload = {
        email: cleanString(data.admin_email),
        password: data.admin_password,
        name: cleanString(data.client_name),
        client_id: clientId,
        is_super_admin: true,
      };

      const { error: managerError } = await supabase.from("managers").insert([payload]);

      if (managerError) {
        console.error("تفاصيل خطأ إنشاء المدير:", managerError);
        throw new Error(managerError.message || "تعذر إنشاء حساب المدير");
      }
    } catch (err) {
      console.error("خطأ في إنشاء حساب المدير:", err);
      throw err;
    }
  }, []);

  const createDefaultContactInfo = useCallback(async (clientId: string, email: string) => {
    try {
      const payload = {
        client_id: clientId,
        phone_numbers: [] as string[],
        email_addresses: [cleanString(email)],
        social_links: {
          tiktok: "",
          twitter: "",
          youtube: "",
          facebook: "",
          linkedin: "",
          snapchat: "",
          instagram: "",
        },
        newsletter_title: "النشرة الإخبارية",
        newsletter_description: "اشترك في نشرتنا البريدية لتصلك آخر العروض والأخبار",
      };

      const { error: contactInfoError } = await supabase.from("contact_info").insert([payload]);

      if (contactInfoError) {
        console.error("تفاصيل خطأ معلومات الاتصال:", contactInfoError);
        throw new Error(contactInfoError.message || "تعذر إنشاء معلومات الاتصال الافتراضية");
      }
    } catch (err) {
      console.error("خطأ في إنشاء معلومات الاتصال:", err);
      throw err;
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const prepared: CreateClientForm = {
        site_name: cleanString(formData.site_name),
        client_name: cleanString(formData.client_name),
        admin_email: cleanString(formData.admin_email),
        admin_password: formData.admin_password,
        primary_color_1: cleanString(formData.primary_color_1),
        primary_color_2: cleanString(formData.primary_color_2),
        primary_color_3: cleanString(formData.primary_color_3),
        logo_url: cleanString(formData.logo_url),
        description: cleanString(formData.description),
      };

      try {
        // التحقق من صحة البيانات
        const errors = validateBeforeSubmit(prepared);
        if (errors.length > 0) {
          toast({
            title: "هناك أخطاء في البيانات",
            description: errors.join(" | "),
            variant: "destructive",
          });
          return;
        }

        // التحقق من اتصال Supabase
        if (!supabase) {
          toast({
            title: "خطأ في الاتصال",
            description: "لا يوجد اتصال بقاعدة البيانات",
            variant: "destructive",
          });
          return;
        }

        // إنشاء العميل والبيانات الأساسية
        await assertEmailNotTaken(prepared.admin_email);
        const client = await createClientRow(prepared);

        await Promise.all([
          createSiteSettings(client.id, prepared),
          createManagerAccount(client.id, prepared),
          createDefaultContactInfo(client.id, prepared.admin_email)
        ]);

        toast({
          title: "تم إنشاء العميل بنجاح",
          description: "جاري تهيئة المشروع ونشره على Vercel...",
        });

        // محاولة النشر على Vercel (مع فصل الأخطاء عن العملية الأساسية)
        try {
          const vercelResult = await deployToVercel(client.id);

          toast({
            title: "تم النشر بنجاح",
            description: vercelResult.projectUrl 
              ? `رابط الموقع: ${vercelResult.projectUrl}`
              : "تم إنشاء الموقع بنجاح",
          });
        } catch (deployError: any) {
          console.warn("خطأ غير حرج في النشر:", deployError);
          toast({
            title: "تم إنشاء العميل",
            description: "تم إنشاء العميل بنجاح ولكن حدث خطأ في النشر. يمكنك إعادة المحاولة لاحقاً",
            variant: "default",
          });
        }

        navigate("/platform/dashboard");
      } catch (err: any) {
        console.error("تفاصيل خطأ إنشاء العميل:", err);
        toast({
          title: "خطأ في إنشاء العميل",
          description: err?.message || "حدث خطأ غير متوقع أثناء إنشاء العميل",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      validateBeforeSubmit,
      toast,
      assertEmailNotTaken,
      createClientRow,
      createSiteSettings,
      createManagerAccount,
      createDefaultContactInfo,
      deployToVercel,
      navigate,
    ]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center space-x-4 space-x-reverse mb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/platform/dashboard")}
            aria-label="العودة للوحة التحكم"
          >
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

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                    autoComplete="off"
                    aria-required="true"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    الاسم المختصر (slug):{" "}
                    <span className="font-mono">{siteSlug || "—"}</span>
                  </p>
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
                    autoComplete="name"
                    aria-required="true"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="logo_url">رابط اللوجو (اختياري)</Label>
                <Input
                  id="logo_url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleInputChange}
                  inputMode="url"
                  placeholder="https://example.com/logo.png"
                  aria-describedby="logo_url_hint"
                />
                <p id="logo_url_hint" className="mt-1 text-xs text-muted-foreground">
                  استخدم رابط مباشر لصورة PNG أو SVG أو JPG.
                </p>
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
                      autoComplete="email"
                      aria-required="true"
                      inputMode="email"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    سنتحقق من أن البريد غير مستخدم سابقًا كمدير.
                  </p>
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
                      placeholder="كلمة مرور قوية (6 أحرف على الأقل)"
                      minLength={6}
                      className="pl-10"
                      autoComplete="new-password"
                      aria-required="true"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    يُفضّل استخدام كلمة مرور فريدة وقوية. (يمكنك لاحقًا تفعيل تسجيل الدخول الفعلي عبر Auth)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                      id="primary_color_1_picker"
                      aria-label="اختيار اللون الأساسي الأول"
                      type="color"
                      value={formData.primary_color_1}
                      onChange={(e) => handleColorChange("primary_color_1", e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      id="primary_color_1"
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
                      id="primary_color_2_picker"
                      aria-label="اختيار اللون الأساسي الثاني"
                      type="color"
                      value={formData.primary_color_2}
                      onChange={(e) => handleColorChange("primary_color_2", e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      id="primary_color_2"
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
                      id="primary_color_3_picker"
                      aria-label="اختيار اللون الأساسي الثالث"
                      type="color"
                      value={formData.primary_color_3}
                      onChange={(e) => handleColorChange("primary_color_3", e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      id="primary_color_3"
                      value={formData.primary_color_3}
                      onChange={(e) => handleColorChange("primary_color_3", e.target.value)}
                      placeholder="#1e3a8a"
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                أدخل قيم Hex صالحة مثل #3b82f6. يمكنك تعديلها لاحقًا من الإعدادات.
              </p>
            </CardContent>
          </Card>
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
              {loading
                ? "جاري الإنشاء..."
                : deploymentLoading
                ? "جاري النشر..."
                : "إنشاء الموقع"}
            </Button>
          </div>
          <div className="pt-2 text-xs text-muted-foreground">
            {loading && !deploymentLoading && (
              <p>⏳ جاري إنشاء الجداول وإدخال البيانات في Supabase...</p>
            )}
            {deploymentLoading && (
              <p>🚀 جاري نشر المشروع على Vercel عبر Edge Function...</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClient;