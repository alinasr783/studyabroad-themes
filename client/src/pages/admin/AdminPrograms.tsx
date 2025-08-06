import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { articlesApi, countriesApi, universitiesApi, programsApi, consultationsApi, contactMessagesApi, testimonialsApi } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";

interface Program {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar?: string;
  description_en?: string;
  degree_level: string;
  field_of_study: string;
  duration_years?: number;
  duration_months?: number;
  tuition_fee?: number;
  language?: string;
  requirements_ar?: string;
  requirements_en?: string;
  career_prospects_ar?: string;
  career_prospects_en?: string;
  is_featured: boolean;
  start_date?: string;
  application_deadline?: string;
  country_id?: string;
  university_id?: string;
  client_id?: string;
  created_at: string;
}

interface Country {
  id: string;
  name_ar: string;
  name_en: string;
}

interface University {
  id: string;
  name_ar: string;
  name_en: string;
}

const AdminPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
    description_ar: "",
    description_en: "",
    degree_level: "",
    field_of_study: "",
    duration_years: "",
    duration_months: "",
    tuition_fee: "",
    language: "",
    requirements_ar: "",
    requirements_en: "",
    career_prospects_ar: "",
    career_prospects_en: "",
    is_featured: false,
    start_date: "",
    application_deadline: "",
    country_id: "",
    university_id: "",
  });

  useEffect(() => {
    fetchPrograms();
    fetchCountries();
    fetchUniversities();
  }, []);

  const getClientId = () => {
    const session = localStorage.getItem("manager_session");
    return session ? JSON.parse(session).client_id : null;
  };

  const fetchPrograms = async () => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل البرامج",
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
    }
  };

  const fetchUniversities = async () => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const { data, error } = await supabase
        .from("universities")
        .select("id, name_ar, name_en")
        .eq("client_id", clientId);

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from Arabic name
    if (field === "name_ar" && value) {
      const slug = value
        .toLowerCase()
        .replace(/[\u0600-\u06FF\s]+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
      
      setFormData(prev => ({
        ...prev,
        slug: slug || Math.random().toString(36).substr(2, 9)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const programData = {
        ...formData,
        client_id: clientId,
        duration_years: formData.duration_years ? parseInt(formData.duration_years) : null,
        duration_months: formData.duration_months ? parseInt(formData.duration_months) : null,
        tuition_fee: formData.tuition_fee ? parseInt(formData.tuition_fee) : null,
        start_date: formData.start_date || null,
        application_deadline: formData.application_deadline || null,
        country_id: formData.country_id || null,
        university_id: formData.university_id || null,
      };

      if (editingProgram) {
        const { error } = await supabase
          .from("programs")
          .update(programData)
          .eq("id", editingProgram.id);

        if (error) throw error;

        toast({
          title: "تم التحديث",
          description: "تم تحديث البرنامج بنجاح",
        });
      } else {
        const { error } = await supabase
          .from("programs")
          .insert([programData]);

        if (error) throw error;

        toast({
          title: "تم الإضافة",
          description: "تم إضافة البرنامج بنجاح",
        });
      }

      fetchPrograms();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving program:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ البرنامج",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      name_ar: program.name_ar,
      name_en: program.name_en,
      slug: program.slug,
      description_ar: program.description_ar || "",
      description_en: program.description_en || "",
      degree_level: program.degree_level,
      field_of_study: program.field_of_study,
      duration_years: program.duration_years?.toString() || "",
      duration_months: program.duration_months?.toString() || "",
      tuition_fee: program.tuition_fee?.toString() || "",
      language: program.language || "",
      requirements_ar: program.requirements_ar || "",
      requirements_en: program.requirements_en || "",
      career_prospects_ar: program.career_prospects_ar || "",
      career_prospects_en: program.career_prospects_en || "",
      is_featured: program.is_featured,
      start_date: program.start_date || "",
      application_deadline: program.application_deadline || "",
      country_id: program.country_id || "",
      university_id: program.university_id || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا البرنامج؟")) return;

    try {
      const { error } = await supabase
        .from("programs")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف البرنامج بنجاح",
      });

      fetchPrograms();
    } catch (error) {
      console.error("Error deleting program:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف البرنامج",
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
      degree_level: "",
      field_of_study: "",
      duration_years: "",
      duration_months: "",
      tuition_fee: "",
      language: "",
      requirements_ar: "",
      requirements_en: "",
      career_prospects_ar: "",
      career_prospects_en: "",
      is_featured: false,
      start_date: "",
      application_deadline: "",
      country_id: "",
      university_id: "",
    });
    setEditingProgram(null);
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
            <h1 className="text-3xl font-bold">إدارة البرامج الدراسية</h1>
            <p className="text-muted-foreground">إدارة البرامج الدراسية المتاحة</p>
          </div>
          
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة برنامج جديد
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProgram ? "تعديل البرنامج" : "إضافة برنامج جديد"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name_ar">الاسم بالعربية *</Label>
                    <Input
                      id="name_ar"
                      value={formData.name_ar}
                      onChange={(e) => handleInputChange("name_ar", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="name_en">الاسم بالإنجليزية *</Label>
                    <Input
                      id="name_en"
                      value={formData.name_en}
                      onChange={(e) => handleInputChange("name_en", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="degree_level">مستوى الدرجة *</Label>
                    <Select value={formData.degree_level} onValueChange={(value) => handleInputChange("degree_level", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر مستوى الدرجة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="بكالوريوس">بكالوريوس</SelectItem>
                        <SelectItem value="ماجستير">ماجستير</SelectItem>
                        <SelectItem value="دكتوراه">دكتوراه</SelectItem>
                        <SelectItem value="دبلوم">دبلوم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="field_of_study">مجال الدراسة *</Label>
                    <Input
                      id="field_of_study"
                      value={formData.field_of_study}
                      onChange={(e) => handleInputChange("field_of_study", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="duration_years">المدة (سنوات)</Label>
                    <Input
                      id="duration_years"
                      type="number"
                      value={formData.duration_years}
                      onChange={(e) => handleInputChange("duration_years", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration_months">المدة (شهور)</Label>
                    <Input
                      id="duration_months"
                      type="number"
                      value={formData.duration_months}
                      onChange={(e) => handleInputChange("duration_months", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tuition_fee">الرسوم الدراسية</Label>
                    <Input
                      id="tuition_fee"
                      type="number"
                      value={formData.tuition_fee}
                      onChange={(e) => handleInputChange("tuition_fee", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country_id">الدولة</Label>
                    <Select value={formData.country_id} onValueChange={(value) => handleInputChange("country_id", value)}>
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
                    <Label htmlFor="university_id">الجامعة</Label>
                    <Select value={formData.university_id} onValueChange={(value) => handleInputChange("university_id", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الجامعة" />
                      </SelectTrigger>
                      <SelectContent>
                        {universities.map((university) => (
                          <SelectItem key={university.id} value={university.id}>
                            {university.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description_ar">الوصف بالعربية</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => handleInputChange("description_ar", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => handleInputChange("description_en", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">
                    {editingProgram ? "تحديث" : "إضافة"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة البرامج ({programs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>البرنامج</TableHead>
                  <TableHead>المستوى</TableHead>
                  <TableHead>المجال</TableHead>
                  <TableHead>المدة</TableHead>
                  <TableHead>الرسوم</TableHead>
                  <TableHead>الجامعة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{program.name_ar}</div>
                        <div className="text-sm text-muted-foreground">{program.name_en}</div>
                      </div>
                    </TableCell>
                    <TableCell>{program.degree_level}</TableCell>
                    <TableCell>{program.field_of_study}</TableCell>
                    <TableCell>
                      {program.duration_years && `${program.duration_years} سنة`}
                      {program.duration_months && ` ${program.duration_months} شهر`}
                    </TableCell>
                    <TableCell>
                      {program.tuition_fee ? `$${program.tuition_fee.toLocaleString()}` : "غير محدد"}
                    </TableCell>
                    <TableCell>
                      {universities.find(u => u.id === program.university_id)?.name_ar || "غير محدد"}
                    </TableCell>
                    <TableCell>
                      {program.is_featured ? (
                        <Badge>مميز</Badge>
                      ) : (
                        <Badge variant="secondary">عادي</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(program)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(program.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {programs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">لا توجد برامج دراسية حتى الآن</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPrograms;