import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, GraduationCap, MapPin, DollarSign, Users, Globe, Home, Award, Calendar, Check } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface University {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar?: string;
  description_en?: string;
  logo_url?: string;
  image_url?: string;
  city?: string;
  website?: string;
  website_url?: string;
  world_ranking?: number;
  tuition_fee_min?: number;
  tuition_fee_max?: number;
  student_count?: number;
  acceptance_rate?: number;
  international_students_percentage?: number;
  language_requirements?: string;
  application_deadline?: string;
  is_featured: boolean;
  country_id?: string;
  client_id?: string;
  accreditation?: string;
  founded_year?: number;
  campus_type?: string;
  housing_available?: boolean;
  scholarship_available?: boolean;
  video_url?: string;
  housing_fee?: number;
  visa_fee?: number;
  residence_fee?: number;
  admission_fee?: number;
  procedures_fee?: number;
  commission_fee?: number;
  preparation_fee?: number;
  countries?: {
    name_ar: string;
    name_en: string;
  };
  created_at: string;
  updated_at: string;
}

interface Country {
  id: string;
  name_ar: string;
  name_en: string;
  client_id?: string;
}

interface UniversityMedia {
  id?: string;
  university_id?: string;
  media_type: 'image' | 'video';
  url: string;
  caption_ar?: string;
  caption_en?: string;
  is_featured: boolean;
  display_order: number;
  type?: string;
  client_id?: string;
}

interface UniversityReview {
  id?: string;
  university_id?: string;
  student_name: string;
  student_nationality?: string;
  program_name?: string;
  graduation_year?: number;
  rating: number;
  review_text_ar?: string;
  review_text_en?: string;
  is_approved: boolean;
  client_id?: string;
}

const AdminUniversities = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [universityMedia, setUniversityMedia] = useState<UniversityMedia[]>([]);
  const [universityReviews, setUniversityReviews] = useState<UniversityReview[]>([]);
  const [showMediaSection, setShowMediaSection] = useState(false);
  const [showReviewsSection, setShowReviewsSection] = useState(false);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
    description_ar: "",
    description_en: "",
    city: "",
    logo_url: "",
    image_url: "",
    website: "",
    website_url: "",
    world_ranking: "",
    tuition_fee_min: "",
    tuition_fee_max: "",
    student_count: "",
    acceptance_rate: "",
    international_students_percentage: "",
    language_requirements: "",
    application_deadline: "",
    is_featured: false,
    country_id: "",
    accreditation: "",
    founded_year: "",
    campus_type: "",
    housing_available: false,
    scholarship_available: false,
    video_url: "",
    housing_fee: "",
    visa_fee: "",
    residence_fee: "",
    admission_fee: "",
    procedures_fee: "",
    commission_fee: "",
    preparation_fee: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUniversities();
    fetchCountries();
  }, []);

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

      // Transform null values to undefined to match interface
      const transformedData = (data || []).map(university => ({
        ...university,
        description_ar: university.description_ar ?? undefined,
        description_en: university.description_en ?? undefined,
        logo_url: university.logo_url ?? undefined,
        image_url: university.image_url ?? undefined,
        city: university.city ?? undefined,
        website: university.website ?? undefined,
        website_url: university.website_url ?? undefined,
        world_ranking: university.world_ranking ?? undefined,
        tuition_fee_min: university.tuition_fee_min ?? undefined,
        tuition_fee_max: university.tuition_fee_max ?? undefined,
        student_count: university.student_count ?? undefined,
        acceptance_rate: university.acceptance_rate ?? undefined,
        international_students_percentage: university.international_students_percentage ?? undefined,
        language_requirements: university.language_requirements ?? undefined,
        application_deadline: university.application_deadline ?? undefined,
        country_id: university.country_id ?? undefined,
        client_id: university.client_id ?? undefined,
        accreditation: university.accreditation ?? undefined,
        founded_year: university.founded_year ?? undefined,
        campus_type: university.campus_type ?? undefined,
        housing_available: university.housing_available ?? undefined,
        scholarship_available: university.scholarship_available ?? undefined,
        video_url: university.video_url ?? undefined,
        housing_fee: university.housing_fee ?? undefined,
        visa_fee: university.visa_fee ?? undefined,
        residence_fee: university.residence_fee ?? undefined,
        admission_fee: university.admission_fee ?? undefined,
        procedures_fee: university.procedures_fee ?? undefined,
        commission_fee: university.commission_fee ?? undefined,
        preparation_fee: university.preparation_fee ?? undefined
      }));

      setUniversities(transformedData);
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

  const fetchUniversityMedia = async (universityId: string) => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const { data, error } = await supabase
        .from("university_media")
        .select("*")
        .eq("university_id", universityId)
        .eq("client_id", clientId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setUniversityMedia(data || []);
    } catch (error) {
      console.error("Error fetching university media:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل ميديا الجامعة",
        variant: "destructive",
      });
    }
  };

  const fetchUniversityReviews = async (universityId: string) => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const { data, error } = await supabase
        .from("university_reviews")
        .select("*")
        .eq("university_id", universityId)
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUniversityReviews(data || []);
    } catch (error) {
      console.error("Error fetching university reviews:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل مراجعات الجامعة",
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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Media Management Functions
  const addMediaItem = () => {
    const newMedia: UniversityMedia = {
      media_type: 'image',
      url: '',
      caption_ar: '',
      caption_en: '',
      is_featured: false,
      display_order: universityMedia.length
    };
    setUniversityMedia([...universityMedia, newMedia]);
  };

  const updateMediaItem = (index: number, field: keyof UniversityMedia, value: any) => {
    const updatedMedia = [...universityMedia];
    updatedMedia[index] = { ...updatedMedia[index], [field]: value };
    setUniversityMedia(updatedMedia);
  };

  const removeMediaItem = (index: number) => {
    const updatedMedia = universityMedia.filter((_, i) => i !== index);
    setUniversityMedia(updatedMedia);
  };

  // Reviews Management Functions
  const addReviewItem = () => {
    const newReview: UniversityReview = {
      student_name: '',
      student_nationality: '',
      program_name: '',
      graduation_year: new Date().getFullYear(),
      rating: 5,
      review_text_ar: '',
      review_text_en: '',
      is_approved: true
    };
    setUniversityReviews([...universityReviews, newReview]);
  };

  const updateReviewItem = (index: number, field: keyof UniversityReview, value: any) => {
    const updatedReviews = [...universityReviews];
    updatedReviews[index] = { ...updatedReviews[index], [field]: value };
    setUniversityReviews(updatedReviews);
  };

  const removeReviewItem = (index: number) => {
    const updatedReviews = universityReviews.filter((_, i) => i !== index);
    setUniversityReviews(updatedReviews);
  };

  const saveUniversityMedia = async (universityId: string) => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      // Delete existing media for this university
      const { error: deleteError } = await supabase
        .from("university_media")
        .delete()
        .eq("university_id", universityId)
        .eq("client_id", clientId);

      if (deleteError) throw deleteError;

      // Insert new media items
      if (universityMedia.length > 0) {
        const mediaToInsert = universityMedia.map(media => ({
          ...media,
          university_id: universityId,
          client_id: clientId
        }));

        const { error: insertError } = await supabase
          .from("university_media")
          .insert(mediaToInsert);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error("Error saving university media:", error);
      throw error;
    }
  };

  const saveUniversityReviews = async (universityId: string) => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      // Delete existing reviews for this university
      const { error: deleteError } = await supabase
        .from("university_reviews")
        .delete()
        .eq("university_id", universityId)
        .eq("client_id", clientId);

      if (deleteError) throw deleteError;

      // Insert new review items
      if (universityReviews.length > 0) {
        const reviewsToInsert = universityReviews.map(review => ({
          ...review,
          university_id: universityId,
          client_id: clientId
        }));

        const { error: insertError } = await supabase
          .from("university_reviews")
          .insert(reviewsToInsert);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error("Error saving university reviews:", error);
      throw error;
    }
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
        student_count: formData.student_count ? parseInt(formData.student_count) : null,
        tuition_fee_min: formData.tuition_fee_min ? parseFloat(formData.tuition_fee_min) : null,
        tuition_fee_max: formData.tuition_fee_max ? parseFloat(formData.tuition_fee_max) : null,
        acceptance_rate: formData.acceptance_rate ? parseFloat(formData.acceptance_rate) : null,
        international_students_percentage: formData.international_students_percentage ? parseFloat(formData.international_students_percentage) : null,
        country_id: formData.country_id || null,
        application_deadline: formData.application_deadline || null,
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
        housing_fee: formData.housing_fee ? parseFloat(formData.housing_fee) : null,
        visa_fee: formData.visa_fee ? parseFloat(formData.visa_fee) : null,
        residence_fee: formData.residence_fee ? parseFloat(formData.residence_fee) : null,
        admission_fee: formData.admission_fee ? parseFloat(formData.admission_fee) : null,
        procedures_fee: formData.procedures_fee ? parseFloat(formData.procedures_fee) : null,
        commission_fee: formData.commission_fee ? parseFloat(formData.commission_fee) : null,
        preparation_fee: formData.preparation_fee ? parseFloat(formData.preparation_fee) : null,
      };

      let universityId: string;

      if (editingUniversity) {
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
          .eq("client_id", clientId);

        if (error) throw error;
        universityId = editingUniversity.id;

        toast({
          title: "تم التحديث",
          description: "تم تحديث بيانات الجامعة بنجاح",
        });
      } else {
        const { data, error } = await supabase
          .from("universities")
          .insert([{ ...universityData, client_id: clientId }])
          .select('id');

        if (error) throw error;
        universityId = data[0].id;

        toast({
          title: "تم الإضافة",
          description: "تم إضافة الجامعة الجديدة بنجاح",
        });
      }

      // Save media and reviews
      await saveUniversityMedia(universityId);
      await saveUniversityReviews(universityId);

      toast({
        title: "تم الحفظ",
        description: "تم حفظ بيانات الجامعة والميديا والمراجعات بنجاح",
      });

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

  const handleEdit = async (university: University) => {
    const clientId = getClientId();

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
      website: university.website || "",
      website_url: university.website_url || "",
      world_ranking: university.world_ranking?.toString() || "",
      tuition_fee_min: university.tuition_fee_min?.toString() || "",
      tuition_fee_max: university.tuition_fee_max?.toString() || "",
      student_count: university.student_count?.toString() || "",
      acceptance_rate: university.acceptance_rate?.toString() || "",
      international_students_percentage: university.international_students_percentage?.toString() || "",
      language_requirements: university.language_requirements || "",
      application_deadline: university.application_deadline || "",
      is_featured: university.is_featured || false,
      country_id: university.country_id || "",
      accreditation: university.accreditation || "",
      founded_year: university.founded_year?.toString() || "",
      campus_type: university.campus_type || "",
      housing_available: university.housing_available || false,
      scholarship_available: university.scholarship_available || false,
      video_url: university.video_url || "",
      housing_fee: university.housing_fee?.toString() || "",
      visa_fee: university.visa_fee?.toString() || "",
      residence_fee: university.residence_fee?.toString() || "",
      admission_fee: university.admission_fee?.toString() || "",
      procedures_fee: university.procedures_fee?.toString() || "",
      commission_fee: university.commission_fee?.toString() || "",
      preparation_fee: university.preparation_fee?.toString() || "",
    });

    // Load existing media and reviews
    await fetchUniversityMedia(university.id);
    await fetchUniversityReviews(university.id);

    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الجامعة؟")) return;

    try {
      const clientId = getClientId();
      if (!clientId) return;

      // First delete related media and reviews
      await supabase
        .from("university_media")
        .delete()
        .eq("university_id", id)
        .eq("client_id", clientId);

      await supabase
        .from("university_reviews")
        .delete()
        .eq("university_id", id)
        .eq("client_id", clientId);

      // Then delete the university
      const { error: deleteError } = await supabase
        .from("universities")
        .delete()
        .eq("id", id)
        .eq("client_id", clientId);

      if (deleteError) throw deleteError;

      toast({
        title: "تم الحذف",
        description: "تم حذف الجامعة وبياناتها المرتبطة بنجاح",
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
      website: "",
      website_url: "",
      world_ranking: "",
      tuition_fee_min: "",
      tuition_fee_max: "",
      student_count: "",
      acceptance_rate: "",
      international_students_percentage: "",
      language_requirements: "",
      application_deadline: "",
      is_featured: false,
      country_id: "",
      accreditation: "",
      founded_year: "",
      campus_type: "",
      housing_available: false,
      scholarship_available: false,
      video_url: "",
      housing_fee: "",
      visa_fee: "",
      residence_fee: "",
      admission_fee: "",
      procedures_fee: "",
      commission_fee: "",
      preparation_fee: "",
    });
    setUniversityMedia([]);
    setUniversityReviews([]);
    setShowMediaSection(false);
    setShowReviewsSection(false);
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
          <Button className="btn-admin-success" onClick={() => setShowForm(true)}>
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
                    <Label htmlFor="founded_year">سنة التأسيس</Label>
                    <Input
                      id="founded_year"
                      name="founded_year"
                      type="number"
                      min="1000"
                      max="2100"
                      value={formData.founded_year}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">الموقع الإلكتروني</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website_url">رابط الموقع الإلكتروني</Label>
                    <Input
                      id="website_url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo_url">رابط الشعار</Label>
                    <Input
                      id="logo_url"
                      name="logo_url"
                      value={formData.logo_url}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">رابط الصورة الرئيسية</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="video_url">رابط الفيديو</Label>
                    <Input
                      id="video_url"
                      name="video_url"
                      value={formData.video_url}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accreditation">الاعتماد الأكاديمي</Label>
                    <Input
                      id="accreditation"
                      name="accreditation"
                      value={formData.accreditation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="campus_type">نوع الحرم الجامعي</Label>
                    <Input
                      id="campus_type"
                      name="campus_type"
                      value={formData.campus_type}
                      onChange={handleInputChange}
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
                  <div>
                    <Label htmlFor="international_students_percentage">نسبة الطلاب الدوليين (%)</Label>
                    <Input
                      id="international_students_percentage"
                      name="international_students_percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.international_students_percentage}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tuition_fee_min">أقل رسوم دراسية ($)</Label>
                    <Input
                      id="tuition_fee_min"
                      name="tuition_fee_min"
                      type="number"
                      min="0"
                      step="0.01"
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
                      step="0.01"
                      value={formData.tuition_fee_max}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="language_requirements">متطلبات اللغة</Label>
                    <Input
                      id="language_requirements"
                      name="language_requirements"
                      value={formData.language_requirements}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="housing_fee">رسوم السكن ($)</Label>
                    <Input
                      id="housing_fee"
                      name="housing_fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.housing_fee}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="visa_fee">رسوم التأشيرة ($)</Label>
                    <Input
                      id="visa_fee"
                      name="visa_fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.visa_fee}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="residence_fee">رسوم الإقامة ($)</Label>
                    <Input
                      id="residence_fee"
                      name="residence_fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.residence_fee}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="admission_fee">رسوم القبول ($)</Label>
                    <Input
                      id="admission_fee"
                      name="admission_fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.admission_fee}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="procedures_fee">رسوم الإجراءات ($)</Label>
                    <Input
                      id="procedures_fee"
                      name="procedures_fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.procedures_fee}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="commission_fee">رسوم العمولة ($)</Label>
                    <Input
                      id="commission_fee"
                      name="commission_fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.commission_fee}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="preparation_fee">رسوم التحضير ($)</Label>
                    <Input
                      id="preparation_fee"
                      name="preparation_fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.preparation_fee}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="application_deadline">موعد التقديم</Label>
                  <Input
                    id="application_deadline"
                    name="application_deadline"
                    type="date"
                    value={formData.application_deadline}
                    onChange={handleInputChange}
                  />
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleSwitchChange("is_featured", checked)}
                    />
                    <Label htmlFor="is_featured">وضع مميز</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="housing_available"
                      checked={formData.housing_available}
                      onCheckedChange={(checked) => handleSwitchChange("housing_available", checked)}
                    />
                    <Label htmlFor="housing_available">سكن جامعي متاح</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="scholarship_available"
                      checked={formData.scholarship_available}
                      onCheckedChange={(checked) => handleSwitchChange("scholarship_available", checked)}
                    />
                    <Label htmlFor="scholarship_available">منح دراسية متاحة</Label>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">ميديا الجامعة</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMediaSection(!showMediaSection)}
                    >
                      {showMediaSection ? "إخفاء" : "إظهار"} الميديا
                    </Button>
                  </div>

                  {showMediaSection && (
                    <div className="space-y-4">
                      {universityMedia.map((media, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">عنصر الميديا #{index + 1}</h4>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeMediaItem(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>نوع الميديا</Label>
                              <Select
                                value={media.media_type}
                                onValueChange={(value) => updateMediaItem(index, 'media_type', value as 'image' | 'video')}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="image">صورة</SelectItem>
                                  <SelectItem value="video">فيديو</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>رابط الميديا</Label>
                              <Input
                                value={media.url}
                                onChange={(e) => updateMediaItem(index, 'url', e.target.value)}
                                placeholder="https://example.com/media.jpg"
                              />
                            </div>
                            <div>
                              <Label>ترتيب العرض</Label>
                              <Input
                                type="number"
                                min="0"
                                value={media.display_order}
                                onChange={(e) => updateMediaItem(index, 'display_order', parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>التوضيح بالعربية</Label>
                              <Input
                                value={media.caption_ar || ''}
                                onChange={(e) => updateMediaItem(index, 'caption_ar', e.target.value)}
                                placeholder="توضيح الصورة بالعربية"
                              />
                            </div>
                            <div>
                              <Label>التوضيح بالإنجليزية</Label>
                              <Input
                                value={media.caption_en || ''}
                                onChange={(e) => updateMediaItem(index, 'caption_en', e.target.value)}
                                placeholder="Caption in English"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={media.is_featured}
                              onCheckedChange={(checked) => updateMediaItem(index, 'is_featured', checked)}
                            />
                            <Label>ميديا مميز</Label>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addMediaItem}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة عنصر ميديا جديد
                      </Button>
                    </div>
                  )}
                </div>

                {/* University Reviews Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">مراجعات الطلاب</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReviewsSection(!showReviewsSection)}
                    >
                      {showReviewsSection ? "إخفاء" : "إظهار"} المراجعات
                    </Button>
                  </div>

                  {showReviewsSection && (
                    <div className="space-y-4">
                      {universityReviews.map((review, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">مراجعة #{index + 1}</h4>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeReviewItem(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>اسم الطالب</Label>
                              <Input
                                value={review.student_name}
                                onChange={(e) => updateReviewItem(index, 'student_name', e.target.value)}
                                placeholder="أحمد محمد"
                                required
                              />
                            </div>
                            <div>
                              <Label>الجنسية</Label>
                              <Input
                                value={review.student_nationality || ''}
                                onChange={(e) => updateReviewItem(index, 'student_nationality', e.target.value)}
                                placeholder="مصر"
                              />
                            </div>
                            <div>
                              <Label>البرنامج الدراسي</Label>
                              <Input
                                value={review.program_name || ''}
                                onChange={(e) => updateReviewItem(index, 'program_name', e.target.value)}
                                placeholder="هندسة الحاسوب"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>سنة التخرج</Label>
                              <Input
                                type="number"
                                min="2000"
                                max="2030"
                                value={review.graduation_year || ''}
                                onChange={(e) => updateReviewItem(index, 'graduation_year', parseInt(e.target.value) || undefined)}
                                placeholder="2024"
                              />
                            </div>
                            <div>
                              <Label>التقييم (1-5 نجوم)</Label>
                              <Select
                                value={review.rating.toString()}
                                onValueChange={(value) => updateReviewItem(index, 'rating', parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">⭐ (1)</SelectItem>
                                  <SelectItem value="2">⭐⭐ (2)</SelectItem>
                                  <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                                  <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                                  <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label>المراجعة بالعربية</Label>
                            <Textarea
                              value={review.review_text_ar || ''}
                              onChange={(e) => updateReviewItem(index, 'review_text_ar', e.target.value)}
                              placeholder="أكتب تجربة الطالب بالعربية..."
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label>المراجعة بالإنجليزية</Label>
                            <Textarea
                              value={review.review_text_en || ''}
                              onChange={(e) => updateReviewItem(index, 'review_text_en', e.target.value)}
                              placeholder="Write student experience in English..."
                              rows={3}
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={review.is_approved}
                              onCheckedChange={(checked) => updateReviewItem(index, 'is_approved', checked)}
                            />
                            <Label>مراجعة معتمدة</Label>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addReviewItem}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة مراجعة جديدة
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="btn-admin-primary">
                    {editingUniversity ? "حفظ التعديلات" : "إضافة الجامعة"}
                  </Button>
                  <Button 
                    type="button" 
                    className="btn-admin-outline"
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
                  <TableHead>الترتيب</TableHead>
                  <TableHead>الرسوم</TableHead>
                  <TableHead>الخصائص</TableHead>
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
                    <TableCell>
                      {university.world_ranking ? `#${university.world_ranking}` : "-"}
                    </TableCell>
                    <TableCell>
                      {university.tuition_fee_min && university.tuition_fee_max ? (
                        <span>${university.tuition_fee_min.toLocaleString()} - ${university.tuition_fee_max.toLocaleString()}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {university.is_featured && <Badge variant="default">مميز</Badge>}
                        {university.housing_available && <Badge variant="secondary">سكن</Badge>}
                        {university.scholarship_available && <Badge variant="outline">منح</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="btn-admin-info"
                          onClick={() => handleEdit(university)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="btn-admin-danger"
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