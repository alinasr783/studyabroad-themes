import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, Clock, Tag, User, Image, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface Article {
  id: string;
  title_ar: string;
  title_en: string;
  slug: string;
  content_ar: string;
  content_en: string;
  excerpt_ar?: string | null;
  excerpt_en?: string | null;
  featured_image?: string | null;
  author_name?: string | null;
  author_avatar?: string | null;
  category?: string | null;
  tags?: string[] | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  views_count: number | null;
  reading_time?: number | null;
  created_at: string;
  updated_at: string;
  client_id?: string | null;
}

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    slug: "",
    content_ar: "",
    content_en: "",
    excerpt_ar: "",
    excerpt_en: "",
    featured_image: "",
    author_name: "",
    author_avatar: "",
    category: "",
    tags: "",
    is_published: false,
    is_featured: false,
    reading_time: "",
  });

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

        await fetchArticles(sessionData.client_id);
      } catch (err) {
        console.error("Error initializing articles:", err);
        setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        setLoading(false);
      }
    };

    checkSessionAndFetchData();
  }, [navigate]);

  const fetchArticles = async (clientId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("حدث خطأ أثناء تحميل المقالات");
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل المقالات",
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

    // Auto-generate slug from Arabic title
    if (field === "title_ar" && value) {
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
      const session = localStorage.getItem("manager_session");
      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { client_id } = JSON.parse(session);
      const tagsArray = formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [];

      const articleData = {
        ...formData,
        client_id,
        tags: tagsArray,
        reading_time: formData.reading_time ? parseInt(formData.reading_time) : null,
        views_count: editingArticle?.views_count || 0,
      };

      if (editingArticle) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", editingArticle.id);

        if (error) throw error;

        toast({
          title: "تم التحديث",
          description: "تم تحديث المقال بنجاح",
        });
      } else {
        const { error } = await supabase
          .from("articles")
          .insert([articleData]);

        if (error) throw error;

        toast({
          title: "تم الإضافة",
          description: "تم إضافة المقال بنجاح",
        });
      }

      fetchArticles(client_id);
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المقال",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title_ar: article.title_ar,
      title_en: article.title_en,
      slug: article.slug,
      content_ar: article.content_ar,
      content_en: article.content_en,
      excerpt_ar: article.excerpt_ar || "",
      excerpt_en: article.excerpt_en || "",
      featured_image: article.featured_image || "",
      author_name: article.author_name || "",
      author_avatar: article.author_avatar || "",
      category: article.category || "",
      tags: article.tags?.join(", ") || "",
      is_published: article.is_published || false,
      is_featured: article.is_featured || false,
      reading_time: article.reading_time?.toString() || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;

    try {
      const session = localStorage.getItem("manager_session");
      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { client_id } = JSON.parse(session);

      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id)
        .eq("client_id", client_id);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف المقال بنجاح",
      });

      fetchArticles(client_id);
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المقال",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title_ar: "",
      title_en: "",
      slug: "",
      content_ar: "",
      content_en: "",
      excerpt_ar: "",
      excerpt_en: "",
      featured_image: "",
      author_name: "",
      author_avatar: "",
      category: "",
      tags: "",
      is_published: false,
      is_featured: false,
      reading_time: "",
    });
    setEditingArticle(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
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
            <h1 className="text-3xl font-bold text-[#1e293b]">إدارة المقالات</h1>
            <p className="text-[#64748b]">إدارة المقالات والمحتوى التعليمي</p>
          </div>

          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white"
                onClick={() => resetForm()}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة مقال جديد
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#f8fafc] border-[#e2e8f0]">
              <DialogHeader className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white p-4 rounded-t-lg">
                <DialogTitle>
                  {editingArticle ? "تعديل المقال" : "إضافة مقال جديد"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title_ar" className="text-[#374151]">العنوان بالعربية *</Label>
                    <Input
                      id="title_ar"
                      value={formData.title_ar}
                      onChange={(e) => handleInputChange("title_ar", e.target.value)}
                      required
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title_en" className="text-[#374151]">العنوان بالإنجليزية</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en}
                      onChange={(e) => handleInputChange("title_en", e.target.value)}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug" className="text-[#374151]">الرابط المختصر *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                      required
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-[#374151]">التصنيف</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="excerpt_ar" className="text-[#374151]">المقتطف بالعربية</Label>
                    <Textarea
                      id="excerpt_ar"
                      value={formData.excerpt_ar}
                      onChange={(e) => handleInputChange("excerpt_ar", e.target.value)}
                      rows={3}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt_en" className="text-[#374151]">المقتطف بالإنجليزية</Label>
                    <Textarea
                      id="excerpt_en"
                      value={formData.excerpt_en}
                      onChange={(e) => handleInputChange("excerpt_en", e.target.value)}
                      rows={3}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="content_ar" className="text-[#374151]">المحتوى بالعربية *</Label>
                  <Textarea
                    id="content_ar"
                    value={formData.content_ar}
                    onChange={(e) => handleInputChange("content_ar", e.target.value)}
                    rows={6}
                    required
                    className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                  />
                </div>

                <div>
                  <Label htmlFor="content_en" className="text-[#374151]">المحتوى بالإنجليزية</Label>
                  <Textarea
                    id="content_en"
                    value={formData.content_en}
                    onChange={(e) => handleInputChange("content_en", e.target.value)}
                    rows={6}
                    className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="featured_image" className="text-[#374151]">رابط الصورة الرئيسية</Label>
                    <Input
                      id="featured_image"
                      value={formData.featured_image}
                      onChange={(e) => handleInputChange("featured_image", e.target.value)}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reading_time" className="text-[#374151]">وقت القراءة (دقائق)</Label>
                    <Input
                      id="reading_time"
                      type="number"
                      min="1"
                      value={formData.reading_time}
                      onChange={(e) => handleInputChange("reading_time", e.target.value)}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author_name" className="text-[#374151]">اسم الكاتب</Label>
                    <Input
                      id="author_name"
                      value={formData.author_name}
                      onChange={(e) => handleInputChange("author_name", e.target.value)}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author_avatar" className="text-[#374151]">رابط صورة الكاتب</Label>
                    <Input
                      id="author_avatar"
                      value={formData.author_avatar}
                      onChange={(e) => handleInputChange("author_avatar", e.target.value)}
                      className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags" className="text-[#374151]">الكلمات المفتاحية (مفصولة بفواصل)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="تعليم, جامعات, دراسة"
                    className="border-[#d1d5db] focus:border-[#6366f1] focus:ring-[#6366f1]"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => handleInputChange("is_published", checked)}
                      className="data-[state=checked]:bg-[#6366f1]"
                    />
                    <Label htmlFor="is_published" className="text-[#374151]">نشر المقال</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                      className="data-[state=checked]:bg-[#8b5cf6]"
                    />
                    <Label htmlFor="is_featured" className="text-[#374151]">وضع مميز</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    className="bg-gradient-to-r from-[#64748b] to-[#94a3b8] hover:from-[#475569] hover:to-[#64748b] text-white"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white"
                  >
                    {editingArticle ? "حفظ التغييرات" : "إضافة المقال"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-[#e2e8f0]">
          <CardHeader className="bg-gradient-to-r from-[#0ea5e9] to-[#0c4a6e] text-white rounded-t-lg">
            <CardTitle>قائمة المقالات ({articles.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f1f5f9]">
                  <TableHead className="text-[#334155] font-bold">العنوان</TableHead>
                  <TableHead className="text-[#334155] font-bold">الكاتب</TableHead>
                  <TableHead className="text-[#334155] font-bold">التصنيف</TableHead>
                  <TableHead className="text-[#334155] font-bold">المشاهدات</TableHead>
                  <TableHead className="text-[#334155] font-bold">الحالة</TableHead>
                  <TableHead className="text-[#334155] font-bold">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-[#334155] font-bold">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id} className="hover:bg-[#f8fafc]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {article.featured_image && (
                          <img
                            src={article.featured_image}
                            alt={article.title_ar}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium text-[#1e293b]">{article.title_ar}</div>
                          <div className="text-sm text-[#64748b]">{article.title_en}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {article.author_avatar && (
                          <img
                            src={article.author_avatar}
                            alt={article.author_name || "كاتب"}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span className="text-[#475569]">{article.author_name || "غير محدد"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#475569]">
                      {article.category || "غير محدد"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-[#475569]">
                        <Eye className="w-4 h-4" />
                        {article.views_count || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {article.is_published ? (
                          <Badge className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white">
                            منشور
                          </Badge>
                        ) : (
                          <Badge className="bg-gradient-to-r from-[#64748b] to-[#475569] text-white">
                            مسودة
                          </Badge>
                        )}
                        {article.is_featured && (
                          <Badge className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white">
                            مميز
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-[#475569]">
                        {formatDate(article.created_at)}
                        {article.reading_time && (
                          <Badge className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.reading_time} د
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          className="bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white"
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {articles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#64748b]">لا توجد مقالات حتى الآن</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminArticles;