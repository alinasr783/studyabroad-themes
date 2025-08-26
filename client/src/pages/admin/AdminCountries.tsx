import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Globe, MapPin, DollarSign, Check } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Country {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar?: string | null;
  description_en?: string | null;
  flag_url?: string | null;
  image_url?: string | null;
  capital?: string | null;
  language?: string | null;
  currency?: string | null;
  climate?: string | null;
  visa_requirements_ar?: string | null;
  visa_requirements_en?: string | null;
  popular_cities?: string[] | null;
  study_cost_min?: number | null;
  study_cost_max?: number | null;
  living_cost_min?: number | null;
  living_cost_max?: number | null;
  is_trending: boolean | null;
  is_featured: boolean | null;
  is_home: boolean | null;
  client_id?: string | null;
  created_at: string;
  updated_at: string;
}

const AdminCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
    description_ar: "",
    description_en: "",
    flag_url: "",
    image_url: "",
    capital: "",
    language: "",
    currency: "",
    climate: "",
    visa_requirements_ar: "",
    visa_requirements_en: "",
    popular_cities: [] as string[],
    study_cost_min: "",
    study_cost_max: "",
    living_cost_min: "",
    living_cost_max: "",
    is_trending: false,
    is_featured: false,
    is_home: false,
  });
  const [newCity, setNewCity] = useState("");
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

        await fetchCountries(sessionData.client_id);
      } catch (err) {
        console.error("Error initializing countries:", err);
        setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        setLoading(false);
      }
    };

    checkSessionAndFetchData();
  }, [navigate]);

  const fetchCountries = async (clientId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError("حدث خطأ أثناء تحميل الدول");
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل قائمة الدول",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCity(e.target.value);
  };

  const addCity = () => {
    if (newCity.trim() && !formData.popular_cities.includes(newCity.trim())) {
      setFormData(prev => ({
        ...prev,
        popular_cities: [...prev.popular_cities, newCity.trim()]
      }));
      setNewCity("");
    }
  };

  const removeCity = (cityToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      popular_cities: prev.popular_cities.filter(city => city !== cityToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const session = localStorage.getItem("manager_session");
      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { client_id } = JSON.parse(session);

      const countryData = {
        ...formData,
        client_id,
        study_cost_min: formData.study_cost_min ? parseInt(formData.study_cost_min) : null,
        study_cost_max: formData.study_cost_max ? parseInt(formData.study_cost_max) : null,
        living_cost_min: formData.living_cost_min ? parseInt(formData.living_cost_min) : null,
        living_cost_max: formData.living_cost_max ? parseInt(formData.living_cost_max) : null,
      };

      if (editingCountry) {
        const { error } = await supabase
          .from("countries")
          .update(countryData)
          .eq("id", editingCountry.id)
          .eq("client_id", client_id);

        if (error) throw error;

        toast({
          title: "تم التحديث",
          description: "تم تحديث الدولة بنجاح",
        });
      } else {
        const { error } = await supabase
          .from("countries")
          .insert(countryData);

        if (error) throw error;

        toast({
          title: "تمت الإضافة",
          description: "تم إضافة الدولة بنجاح",
        });
      }

      resetForm();
      fetchCountries(client_id);
    } catch (error) {
      console.error("Error saving country:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setFormData({
      name_ar: country.name_ar,
      name_en: country.name_en,
      slug: country.slug,
      description_ar: country.description_ar || "",
      description_en: country.description_en || "",
      flag_url: country.flag_url || "",
      image_url: country.image_url || "",
      capital: country.capital || "",
      language: country.language || "",
      currency: country.currency || "",
      climate: country.climate || "",
      visa_requirements_ar: country.visa_requirements_ar || "",
      visa_requirements_en: country.visa_requirements_en || "",
      popular_cities: country.popular_cities || [],
      study_cost_min: country.study_cost_min?.toString() || "",
      study_cost_max: country.study_cost_max?.toString() || "",
      living_cost_min: country.living_cost_min?.toString() || "",
      living_cost_max: country.living_cost_max?.toString() || "",
      is_trending: country.is_trending || false,
      is_featured: country.is_featured || false,
      is_home: country.is_home || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الدولة؟")) return;

    try {
      const session = localStorage.getItem("manager_session");
      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { client_id } = JSON.parse(session);

      const { error } = await supabase
        .from("countries")
        .delete()
        .eq("id", id)
        .eq("client_id", client_id);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف الدولة بنجاح",
      });

      fetchCountries(client_id);
    } catch (error) {
      console.error("Error deleting country:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الدولة",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name_ar: "",
      name_en: "",
      slug: "",
      description_ar: "",
      description_en: "",
      flag_url: "",
      image_url: "",
      capital: "",
      language: "",
      currency: "",
      climate: "",
      visa_requirements_ar: "",
      visa_requirements_en: "",
      popular_cities: [],
      study_cost_min: "",
      study_cost_max: "",
      living_cost_min: "",
      living_cost_max: "",
      is_trending: false,
      is_featured: false,
      is_home: false,
    });
    setEditingCountry(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366f1]"></div>
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
            <h1 className="text-3xl font-bold text-[#1e293b]">إدارة الدول</h1>
            <p className="text-[#64748b]">إضافة وتعديل دول الدراسة</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة دولة جديدة
          </Button>
        </div>

        {showForm && (
          <Card className="border-[#e2e8f0] bg-[#f8fafc]">
            <CardHeader className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-t-lg">
              <CardTitle>{editingCountry ? "تعديل الدولة" : "إضافة دولة جديدة"}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name_ar" className="text-[#374151]">الاسم بالعربية *</Label>
                    <Input
                      id="name_ar"
                      name="name_ar"
                      value={formData.name_ar}
                      onChange={handleInputChange}
                      required
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name_en" className="text-[#374151]">الاسم بالإنجليزية *</Label>
                    <Input
                      id="name_en"
                      name="name_en"
                      value={formData.name_en}
                      onChange={handleInputChange}
                      required
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug" className="text-[#374151]">الرابط المختصر *</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="capital" className="text-[#374151]">العاصمة</Label>
                    <Input
                      id="capital"
                      name="capital"
                      value={formData.capital}
                      onChange={handleInputChange}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="language" className="text-[#374151]">اللغة</Label>
                    <Input
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency" className="text-[#374151]">العملة</Label>
                    <Input
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="climate" className="text-[#374151]">المناخ</Label>
                    <Input
                      id="climate"
                      name="climate"
                      value={formData.climate}
                      onChange={handleInputChange}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="flag_url" className="text-[#374151]">رابط علم الدولة</Label>
                    <Input
                      id="flag_url"
                      name="flag_url"
                      value={formData.flag_url}
                      onChange={handleInputChange}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url" className="text-[#374151]">رابط صورة الدولة</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="description_ar" className="text-[#374151]">الوصف بالعربية</Label>
                    <Textarea
                      id="description_ar"
                      name="description_ar"
                      value={formData.description_ar}
                      onChange={handleInputChange}
                      rows={4}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description_en" className="text-[#374151]">الوصف بالإنجليزية</Label>
                    <Textarea
                      id="description_en"
                      name="description_en"
                      value={formData.description_en}
                      onChange={handleInputChange}
                      rows={4}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="visa_requirements_ar" className="text-[#374151]">متطلبات التأشيرة بالعربية</Label>
                    <Textarea
                      id="visa_requirements_ar"
                      name="visa_requirements_ar"
                      value={formData.visa_requirements_ar}
                      onChange={handleInputChange}
                      rows={4}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="visa_requirements_en" className="text-[#374151]">متطلبات التأشيرة بالإنجليزية</Label>
                    <Textarea
                      id="visa_requirements_en"
                      name="visa_requirements_en"
                      value={formData.visa_requirements_en}
                      onChange={handleInputChange}
                      rows={4}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#374151]">المدن الشهيرة</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCity}
                      onChange={handleCityChange}
                      placeholder="أضف مدينة جديدة"
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                    <Button 
                      type="button" 
                      onClick={addCity}
                      className="bg-[#10b981] hover:bg-[#059669] text-white"
                    >
                      إضافة
                    </Button>
                  </div>
                  {formData.popular_cities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.popular_cities.map((city) => (
                        <Badge 
                          key={city} 
                          className="flex items-center gap-1 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white"
                        >
                          {city}
                          <button
                            type="button"
                            onClick={() => removeCity(city)}
                            className="text-white hover:text-[#f1f5f9]"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="study_cost_min" className="text-[#374151]">أقل تكلفة دراسة</Label>
                    <Input
                      id="study_cost_min"
                      name="study_cost_min"
                      type="number"
                      value={formData.study_cost_min}
                      onChange={handleInputChange}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="study_cost_max" className="text-[#374151]">أعلى تكلفة دراسة</Label>
                    <Input
                      id="study_cost_max"
                      name="study_cost_max"
                      type="number"
                      value={formData.study_cost_max}
                      onChange={handleInputChange}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="living_cost_min" className="text-[#374151]">أقل تكلفة معيشة</Label>
                    <Input
                      id="living_cost_min"
                      name="living_cost_min"
                      type="number"
                      value={formData.living_cost_min}
                      onChange={handleInputChange}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="living_cost_max" className="text-[#374151]">أعلى تكلفة معيشة</Label>
                    <Input
                      id="living_cost_max"
                      name="living_cost_max"
                      type="number"
                      value={formData.living_cost_max}
                      onChange={handleInputChange}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_trending"
                      name="is_trending"
                      checked={formData.is_trending}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#6366f1] focus:ring-[#6366f1] border-[#d1d5db]"
                    />
                    <Label htmlFor="is_trending" className="text-[#374151]">دولة رائجة</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#6366f1] focus:ring-[#6366f1] border-[#d1d5db]"
                    />
                    <Label htmlFor="is_featured" className="text-[#374151]">دولة مميزة</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_home"
                      name="is_home"
                      checked={formData.is_home}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#6366f1] focus:ring-[#6366f1] border-[#d1d5db]"
                    />
                    <Label htmlFor="is_home" className="text-[#374151]">عرض في الصفحة الرئيسية</Label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white"
                  >
                    {editingCountry ? "تحديث" : "إضافة"}
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-gradient-to-r from-[#64748b] to-[#94a3b8] hover:from-[#475569] hover:to-[#64748b] text-white" 
                    onClick={resetForm}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="border-[#e2e8f0]">
          <CardHeader className="bg-gradient-to-r from-[#0ea5e9] to-[#0c4a6e] text-white rounded-t-lg">
            <CardTitle>قائمة الدول ({countries.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f1f5f9]">
                  <TableHead className="text-[#334155] font-bold">الاسم</TableHead>
                  <TableHead className="text-[#334155] font-bold">العاصمة</TableHead>
                  <TableHead className="text-[#334155] font-bold">اللغة</TableHead>
                  <TableHead className="text-[#334155] font-bold">العملة</TableHead>
                  <TableHead className="text-[#334155] font-bold">تكلفة الدراسة</TableHead>
                  <TableHead className="text-[#334155] font-bold">الحالة</TableHead>
                  <TableHead className="text-[#334155] font-bold">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countries.map((country) => (
                  <TableRow key={country.id} className="hover:bg-[#f8fafc]">
                    <TableCell>
                      <div>
                        <div className="font-medium text-[#1e293b]">{country.name_ar}</div>
                        <div className="text-sm text-[#64748b]">{country.name_en}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#475569]">{country.capital}</TableCell>
                    <TableCell className="text-[#475569]">{country.language}</TableCell>
                    <TableCell className="text-[#475569]">{country.currency}</TableCell>
                    <TableCell className="text-[#475569]">
                      {country.study_cost_min && country.study_cost_max ? (
                        <span>${country.study_cost_min.toLocaleString()} - ${country.study_cost_max.toLocaleString()}</span>
                      ) : (
                        "غير محدد"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {country.is_trending && (
                          <Badge className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white">
                            رائج
                          </Badge>
                        )}
                        {country.is_featured && (
                          <Badge className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white">
                            مميز
                          </Badge>
                        )}
                        {country.is_home && (
                          <Badge className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white">
                            رئيسية
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white"
                          onClick={() => handleEdit(country)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white"
                          onClick={() => handleDelete(country.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCountries;