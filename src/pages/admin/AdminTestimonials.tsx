import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface Testimonial {
  id: string;
  name_ar: string;
  name_en: string;
  title_ar?: string;
  title_en?: string;
  content_ar: string;
  content_en: string;
  avatar_url?: string;
  rating: number;
  is_featured: boolean;
  client_id: string;
  created_at: string;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    title_ar: "",
    title_en: "",
    content_ar: "",
    content_en: "",
    avatar_url: "",
    rating: 5,
    is_featured: false,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const getClientId = () => {
    const session = localStorage.getItem("manager_session");
    return session ? JSON.parse(session).client_id : null;
  };

  const fetchTestimonials = async () => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل آراء العملاء",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const testimonialData = {
        ...formData,
        client_id: clientId,
      };

      if (editingTestimonial) {
        const { error } = await supabase
          .from("testimonials")
          .update(testimonialData)
          .eq("id", editingTestimonial.id);

        if (error) throw error;

        toast({
          title: "تم التحديث",
          description: "تم تحديث رأي العميل بنجاح",
        });
      } else {
        const { error } = await supabase
          .from("testimonials")
          .insert([testimonialData]);

        if (error) throw error;

        toast({
          title: "تم الإضافة",
          description: "تم إضافة رأي العميل بنجاح",
        });
      }

      fetchTestimonials();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ رأي العميل",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name_ar: testimonial.name_ar,
      name_en: testimonial.name_en,
      title_ar: testimonial.title_ar || "",
      title_en: testimonial.title_en || "",
      content_ar: testimonial.content_ar,
      content_en: testimonial.content_en,
      avatar_url: testimonial.avatar_url || "",
      rating: testimonial.rating,
      is_featured: testimonial.is_featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الرأي؟")) return;

    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف رأي العميل بنجاح",
      });

      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف رأي العميل",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name_ar: "",
      name_en: "",
      title_ar: "",
      title_en: "",
      content_ar: "",
      content_en: "",
      avatar_url: "",
      rating: 5,
      is_featured: false,
    });
    setEditingTestimonial(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
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
            <h1 className="text-3xl font-bold">إدارة آراء العملاء</h1>
            <p className="text-muted-foreground">إدارة آراء وتقييمات العملاء</p>
          </div>
          
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة رأي جديد
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTestimonial ? "تعديل رأي العميل" : "إضافة رأي جديد"}
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
                    <Label htmlFor="title_ar">المسمى الوظيفي (عربي)</Label>
                    <Input
                      id="title_ar"
                      value={formData.title_ar}
                      onChange={(e) => handleInputChange("title_ar", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="title_en">المسمى الوظيفي (إنجليزي)</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en}
                      onChange={(e) => handleInputChange("title_en", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="avatar_url">رابط الصورة الشخصية</Label>
                    <Input
                      id="avatar_url"
                      value={formData.avatar_url}
                      onChange={(e) => handleInputChange("avatar_url", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="rating">التقييم (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => handleInputChange("rating", parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="content_ar">المحتوى بالعربية *</Label>
                  <Textarea
                    id="content_ar"
                    value={formData.content_ar}
                    onChange={(e) => handleInputChange("content_ar", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content_en">المحتوى بالإنجليزية *</Label>
                  <Textarea
                    id="content_en"
                    value={formData.content_en}
                    onChange={(e) => handleInputChange("content_en", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                  />
                  <Label htmlFor="is_featured">مميز</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">
                    {editingTestimonial ? "تحديث" : "إضافة"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة آراء العملاء ({testimonials.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead>المحتوى</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإضافة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {testimonial.avatar_url && (
                          <img
                            src={testimonial.avatar_url}
                            alt={testimonial.name_ar}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{testimonial.name_ar}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.name_en}</div>
                          {testimonial.title_ar && (
                            <div className="text-xs text-muted-foreground">{testimonial.title_ar}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={testimonial.content_ar}>
                        {testimonial.content_ar}
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderStars(testimonial.rating)}
                    </TableCell>
                    <TableCell>
                      {testimonial.is_featured ? (
                        <Badge>مميز</Badge>
                      ) : (
                        <Badge variant="secondary">عادي</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(testimonial.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {testimonials.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">لا توجد آراء عملاء حتى الآن</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;