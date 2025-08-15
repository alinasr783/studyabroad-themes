import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch"; // Added Switch import
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, GraduationCap, MapPin, DollarSign, Users, Globe } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface University {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar?: string;
  description_en?: string;
  city?: string;
  logo_url?: string;
  image_url?: string;
  website_url?: string;
  world_ranking?: number;
  local_ranking?: number;
  student_count?: number;
  tuition_fee_min?: number;
  tuition_fee_max?: number;
  acceptance_rate?: number;
  international_students_percentage?: number;
  language_requirements?: string;
  application_deadline?: string;
  is_featured: boolean;
  country_id?: string;
  client_id?: string;
  countries?: {
    name_ar: string;
    name_en: string;
  };
}

interface Country {
  id: string;
  name_ar: string;
  name_en: string;
  client_id?: string;
}

const AdminUniversities = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
    description_ar: "",
    description_en: "",
    city: "",
    logo_url: "",
    image_url: "",
    website_url: "",
    world_ranking: "",
    local_ranking: "",
    student_count: "",
    tuition_fee_min: "",
    tuition_fee_max: "",
    acceptance_rate: "",
    international_students_percentage: "",
    language_requirements: "",
    application_deadline: "",
    is_featured: false,
    country_id: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUniversities();
    fetchCountries();
  }, []);

  // دالة لاستخراج client_id من جلسة المدير
  const getClientId = () => {
    const session = localStorage.getItem("manager_session");
    return session ? JSON.parse(session).client_id : null;
  };

  const fetchUniversities = async () => {
    try {
      const clientId = getClientId();
      if (!clientId) {
        toast({
          title: "خطأ في المصادقة",
          description: "تعذر تحديد هوية العميل",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("universities")
        .select(`
          *,
          countries (
            name_ar,
            name_en
          )
        `)
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error("Error fetching universities:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل بيانات الجامعات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const { data, error } = await supabase
        .from("countries")
        .select("id, name_ar, name_en")
        .eq("client_id", clientId);

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل قائمة الدول",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clientId = getClientId();
      if (!clientId) {
        toast({
          title: "خطأ في المصادقة",
          description: "تعذر تحديد هوية العميل",
          variant: "destructive",
        });
        return;
      }

      const universityData = {
        ...formData,
        client_id: clientId,
        world_ranking: formData.world_ranking ? parseInt(formData.world_ranking) : null,
        local_ranking: formData.local_ranking ? parseInt(formData.local_ranking) : null,
        student_count: formData.student_count ? parseInt(formData.student_count) : null,
        tuition_fee_min: formData.tuition_fee_min ? parseInt(formData.tuition_fee_min) : null,
        tuition_fee_max: formData.tuition_fee_max ? parseInt(formData.tuition_fee_max) : null,
        acceptance_rate: formData.acceptance_rate ? parseFloat(formData.acceptance_rate) : null,
        international_students_percentage: formData.international_students_percentage ? parseFloat(formData.international_students_percentage) : null,
        country_id: formData.country_id || null,
        application_deadline: formData.application_deadline || null,
      };

      if (editingUniversity) {
        // التأكد من أن الجامعة التي يتم تعديلها تخص العميل الحالي
        if (editingUniversity.client_id !== clientId) {
          toast({
            title: "خطأ في الصلاحيات",
            description: "لا تملك صلاحية تعديل هذه الجامعة",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from("universities")
          .update(universityData)
          .eq("id", editingUniversity.id)
          .eq("client_id", clientId); // التأكد من تحديث الجامعات الخاصة بالعميل فقط

        if (error) throw error;

        toast({
          title: "تم التحديث",
          description: "تم تحديث بيانات الجامعة بنجاح",
        });
      } else {
        const { error } = await supabase
          .from("universities")
          .insert([{ ...universityData, client_id: clientId }]);

        if (error) throw error;

        toast({
          title: "تم الإضافة",
          description: "تم إضافة الجامعة الجديدة بنجاح",
        });
      }

      resetForm();
      fetchUniversities();
    } catch (error) {
      console.error("Error saving university:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ بيانات الجامعة",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (university: University) => {
    const clientId = getClientId();

    // التأكد من أن الجامعة تخص العميل الحالي قبل التعديل
    if (university.client_id !== clientId) {
      toast({
        title: "خطأ في الصلاحيات",
        description: "لا تملك صلاحية تعديل هذه الجامعة",
        variant: "destructive",
      });
      return;
    }

    setEditingUniversity(university);
    setFormData({
      name_ar: university.name_ar,
      name_en: university.name_en,
      slug: university.slug,
      description_ar: university.description_ar || "",
      description_en: university.description_en || "",
      city: university.city || "",
      logo_url: university.logo_url || "",
      image_url: university.image_url || "",
      website_url: university.website_url || "",
      world_ranking: university.world_ranking?.toString() || "",
      local_ranking: university.local_ranking?.toString() || "",
      student_count: university.student_count?.toString() || "",
      tuition_fee_min: university.tuition_fee_min?.toString() || "",
      tuition_fee_max: university.tuition_fee_max?.toString() || "",
      acceptance_rate: university.acceptance_rate?.toString() || "",
      international_students_percentage: university.international_students_percentage?.toString() || "",
      language_requirements: university.language_requirements || "",
      application_deadline: university.application_deadline || "",
      is_featured: university.is_featured,
      country_id: university.country_id || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الجامعة؟")) return;

    try {
      const clientId = getClientId();
      if (!clientId) return;

      // التأكد من أن الجامعة تخص العميل الحالي قبل الحذف
      const { error: deleteError } = await supabase
        .from("universities")
        .delete()
        .eq("id", id)
        .eq("client_id", clientId);

      if (deleteError) throw deleteError;

      toast({
        title: "تم الحذف",
        description: "تم حذف الجامعة بنجاح",
      });

      fetchUniversities();
    } catch (error) {
      console.error("Error deleting university:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الجامعة",
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
      city: "",
      logo_url: "",
      image_url: "",
      website_url: "",
      world_ranking: "",
      local_ranking: "",
      student_count: "",
      tuition_fee_min: "",
      tuition_fee_max: "",
      acceptance_rate: "",
      international_students_percentage: "",
      language_requirements: "",
      application_deadline: "",
      is_featured: false,
      country_id: "",
    });
    setEditingUniversity(null);
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
            <h1 className="text-3xl font-bold">إدارة الجامعات</h1>
            <p className="text-muted-foreground">إضافة وتعديل الجامعات</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة جامعة جديدة
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingUniversity ? "تعديل الجامعة" : "إضافة جامعة جديدة"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name_ar">اسم الجامعة بالعربية *</Label>
                    <Input
                      id="name_ar"
                      name="name_ar"
                      value={formData.name_ar}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name_en">اسم الجامعة بالإنجليزية *</Label>
                    <Input
                      id="name_en"
                      name="name_en"
                      value={formData.name_en}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">الرابط المختصر *</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country_id">الدولة</Label>
                    <Select 
                      value={formData.country_id} 
                      onValueChange={(value) => handleSelectChange("country_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الدولة" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.id}>
                            {country.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="city">المدينة</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website_url">موقع الجامعة</Label>
                    <Input
                      id="website_url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="world_ranking">الترتيب العالمي</Label>
                    <Input
                      id="world_ranking"
                      name="world_ranking"
                      type="number"
                      min="0"
                      value={formData.world_ranking}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="local_ranking">الترتيب المحلي</Label>
                    <Input
                      id="local_ranking"
                      name="local_ranking"
                      type="number"
                      min="0"
                      value={formData.local_ranking}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="student_count">عدد الطلاب</Label>
                    <Input
                      id="student_count"
                      name="student_count"
                      type="number"
                      min="0"
                      value={formData.student_count}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="acceptance_rate">معدل القبول (%)</Label>
                    <Input
                      id="acceptance_rate"
                      name="acceptance_rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.acceptance_rate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tuition_fee_min">أقل رسوم دراسية ($)</Label>
                    <Input
                      id="tuition_fee_min"
                      name="tuition_fee_min"
                      type="number"
                      min="0"
                      value={formData.tuition_fee_min}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tuition_fee_max">أعلى رسوم دراسية ($)</Label>
                    <Input
                      id="tuition_fee_max"
                      name="tuition_fee_max"
                      type="number"
                      min="0"
                      value={formData.tuition_fee_max}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="is_featured">وضع مميز</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    {editingUniversity ? "حفظ التعديلات" : "إضافة الجامعة"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>قائمة الجامعات ({universities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الجامعة</TableHead>
                  <TableHead>الدولة</TableHead>
                  <TableHead>المدينة</TableHead>
                  <TableHead>الترتيب العالمي</TableHead>
                  <TableHead>الرسوم الدراسية</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.map((university) => (
                  <TableRow key={university.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {university.logo_url && (
                          <img
                            src={university.logo_url}
                            alt={university.name_ar}
                            className="w-10 h-10 object-contain"
                          />
                        )}
                        <div>
                          <div className="font-medium">{university.name_ar}</div>
                          <div className="text-sm text-muted-foreground">{university.name_en}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{university.countries?.name_ar || "-"}</TableCell>
                    <TableCell>{university.city || "-"}</TableCell>
                    <TableCell>{university.world_ranking || "-"}</TableCell>
                    <TableCell>
                      {university.tuition_fee_min && university.tuition_fee_max ? (
                        <span>${university.tuition_fee_min.toLocaleString()} - ${university.tuition_fee_max.toLocaleString()}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {university.is_featured ? (
                        <Badge variant="default">مميز</Badge>
                      ) : (
                        <Badge variant="secondary">عادي</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(university)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(university.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {universities.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">لا توجد جامعات مسجلة حتى الآن</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUniversities;