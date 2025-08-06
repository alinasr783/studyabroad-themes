import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Globe, MapPin, DollarSign } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Country {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar?: string;
  description_en?: string;
  flag_url?: string;
  image_url?: string;
  language?: string;
  currency?: string;
  climate?: string;
  visa_requirements_ar?: string;
  visa_requirements_en?: string;
  popular_cities?: string[];
  study_cost_min?: number;
  study_cost_max?: number;
  living_cost_min?: number;
  living_cost_max?: number;
  is_trending: boolean;
}

const AdminCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
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
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCountries();
  }, []);

  const getClientId = () => {
    const session = localStorage.getItem("manager_session");
    return session ? JSON.parse(session).client_id : null;
  };

  const fetchCountries = async () => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل البيانات",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const countryData = {
        ...formData,
        client_id: clientId,
        study_cost_min: formData.study_cost_min ? parseInt(formData.study_cost_min) : null,
        study_cost_max: formData.study_cost_max ? parseInt(formData.study_cost_max) : null,
        living_cost_min: formData.living_cost_min ? parseInt(formData.living_cost_min) : null,
        living_cost_max: formData.living_cost_max ? parseInt(formData.living_cost_max) : null,
      };

      if (editingCountry) {
        const { error } = await supabase
          .from("countries")
          .update(countryData)
          .eq("id", editingCountry.id);
        
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
      fetchCountries();
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
      is_trending: country.is_trending,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الدولة؟")) return;

    try {
      const { error } = await supabase
        .from("countries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف الدولة بنجاح",
      });

      fetchCountries();
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
    });
    setEditingCountry(null);
    setShowForm(false);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">إدارة الدول</h1>
            <p className="text-muted-foreground">إضافة وتعديل دول الدراسة</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة دولة جديدة
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingCountry ? "تعديل الدولة" : "إضافة دولة جديدة"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name_ar">الاسم بالعربية</Label>
                    <Input
                      id="name_ar"
                      name="name_ar"
                      value={formData.name_ar}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name_en">الاسم بالإنجليزية</Label>
                    <Input
                      id="name_en"
                      name="name_en"
                      value={formData.name_en}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">الرابط المختصر</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">اللغة</Label>
                    <Input
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">العملة</Label>
                    <Input
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="climate">المناخ</Label>
                    <Input
                      id="climate"
                      name="climate"
                      value={formData.climate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="description_ar">الوصف بالعربية</Label>
                    <Textarea
                      id="description_ar"
                      name="description_ar"
                      value={formData.description_ar}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
                    <Textarea
                      id="description_en"
                      name="description_en"
                      value={formData.description_en}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="study_cost_min">أقل تكلفة دراسة</Label>
                    <Input
                      id="study_cost_min"
                      name="study_cost_min"
                      type="number"
                      value={formData.study_cost_min}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="study_cost_max">أعلى تكلفة دراسة</Label>
                    <Input
                      id="study_cost_max"
                      name="study_cost_max"
                      type="number"
                      value={formData.study_cost_max}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="living_cost_min">أقل تكلفة معيشة</Label>
                    <Input
                      id="living_cost_min"
                      name="living_cost_min"
                      type="number"
                      value={formData.living_cost_min}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="living_cost_max">أعلى تكلفة معيشة</Label>
                    <Input
                      id="living_cost_max"
                      name="living_cost_max"
                      type="number"
                      value={formData.living_cost_max}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    {editingCountry ? "تحديث" : "إضافة"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>قائمة الدول ({countries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>اللغة</TableHead>
                  <TableHead>العملة</TableHead>
                  <TableHead>تكلفة الدراسة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countries.map((country) => (
                  <TableRow key={country.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{country.name_ar}</div>
                        <div className="text-sm text-muted-foreground">{country.name_en}</div>
                      </div>
                    </TableCell>
                    <TableCell>{country.language}</TableCell>
                    <TableCell>{country.currency}</TableCell>
                    <TableCell>
                      {country.study_cost_min && country.study_cost_max ? (
                        <span>${country.study_cost_min.toLocaleString()} - ${country.study_cost_max.toLocaleString()}</span>
                      ) : (
                        "غير محدد"
                      )}
                    </TableCell>
                    <TableCell>
                      {country.is_trending && <Badge variant="secondary">رائج</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(country)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(country.id)}>
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