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
import { Plus, Edit, Trash2, Eye } from "lucide-react";
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
}

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const { toast } = useToast();

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
    fetchArticles();
  }, []);

  const getClientId = () => {
    const session = localStorage.getItem("manager_session");
    return session ? JSON.parse(session).client_id : null;
  };

  const fetchArticles = async () => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
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
      const clientId = getClientId();
      if (!clientId) return;

      const tagsArray = formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [];

      const articleData = {
        ...formData,
        client_id: clientId,
        tags: tagsArray,
        reading_time: formData.reading_time ? parseInt(formData.reading_time) : null,
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

      fetchArticles();
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
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف المقال بنجاح",
      });

      fetchArticles();
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
            <h1 className="text-3xl font-bold">إدارة المقالات</h1>
            <p className="text-muted-foreground">إدارة المقالات والمحتوى التعليمي</p>
          </div>
          
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة مقال جديد
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArticle ? "تعديل المقال" : "إضافة مقال جديد"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title_ar">العنوان بالعربية *</Label>
                    <Input
                      id="title_ar"
                      value={formData.title_ar}
                      onChange={(e) => handleInputChange("title_ar", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="title_en">العنوان بالإنجليزية *</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en}
                      onChange={(e) => handleInputChange("title_en", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category">التصنيف</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="reading_time">وقت القراءة (دقائق)</Label>
                    <Input
                      id="reading_time"
                      type="number"
                      value={formData.reading_time}
                      onChange={(e) => handleInputChange("reading_time", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">الوسوم (مفصولة بفاصلة)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                      placeholder="تعليم، دراسة، جامعات"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author_name">اسم الكاتب</Label>
                    <Input
                      id="author_name"
                      value={formData.author_name}
                      onChange={(e) => handleInputChange("author_name", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="featured_image">رابط الصورة الرئيسية</Label>
                    <Input
                      id="featured_image"
                      value={formData.featured_image}
                      onChange={(e) => handleInputChange("featured_image", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt_ar">المقتطف بالعربية</Label>
                  <Textarea
                    id="excerpt_ar"
                    value={formData.excerpt_ar}
                    onChange={(e) => handleInputChange("excerpt_ar", e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt_en">المقتطف بالإنجليزية</Label>
                  <Textarea
                    id="excerpt_en"
                    value={formData.excerpt_en}
                    onChange={(e) => handleInputChange("excerpt_en", e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="content_ar">المحتوى بالعربية *</Label>
                  <Textarea
                    id="content_ar"
                    value={formData.content_ar}
                    onChange={(e) => handleInputChange("content_ar", e.target.value)}
                    rows={8}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content_en">المحتوى بالإنجليزية *</Label>
                  <Textarea
                    id="content_en"
                    value={formData.content_en}
                    onChange={(e) => handleInputChange("content_en", e.target.value)}
                    rows={8}
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => handleInputChange("is_published", checked)}
                    />
                    <Label htmlFor="is_published">منشور</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                    />
                    <Label htmlFor="is_featured">مميز</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">
                    {editingArticle ? "تحديث" : "إضافة"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة المقالات ({articles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العنوان</TableHead>
                  <TableHead>الكاتب</TableHead>
                  <TableHead>التصنيف</TableHead>
                  <TableHead>المشاهدات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{article.title_ar}</div>
                        <div className="text-sm text-muted-foreground">{article.title_en}</div>
                      </div>
                    </TableCell>
                    <TableCell>{article.author_name || "غير محدد"}</TableCell>
                    <TableCell>{article.category || "غير محدد"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.views_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {article.is_published ? (
                          <Badge>منشور</Badge>
                        ) : (
                          <Badge variant="secondary">مسودة</Badge>
                        )}
                        {article.is_featured && (
                          <Badge variant="outline">مميز</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(article.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
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
                <p className="text-muted-foreground">لا توجد مقالات حتى الآن</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminArticles;