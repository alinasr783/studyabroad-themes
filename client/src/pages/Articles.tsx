import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, Eye, User, BookOpen } from "lucide-react";

interface Article {
  id: string;
  title_ar: string;
  title_en: string;
  slug: string;
  content_ar: string;
  content_en: string;
  excerpt_ar?: string;
  excerpt_en?: string;
  author_name?: string;
  author_avatar?: string;
  featured_image?: string;
  category?: string;
  tags?: string[];
  is_published: boolean;
  is_featured?: boolean;
  views_count?: number;
  reading_time?: number;
  created_at: string;
}

const ArticlesList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (supabaseError) {
          throw supabaseError;
        }

        setArticles(data || []);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('حدث خطأ أثناء جلب المقالات. يرجى المحاولة لاحقاً.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg max-w-md mx-auto">
            <p>{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">المقالات والأدلة</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اكتشف أحدث المقالات والأدلة حول الدراسة في الخارج والحصول على المنح الدراسية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden rounded-t-lg">
                {article.featured_image ? (
                  <img 
                    src={article.featured_image} 
                    alt={article.title_ar}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                )}
                {article.is_featured && (
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                    مميز
                  </Badge>
                )}
                {article.category && (
                  <Badge variant="secondary" className="absolute bottom-3 left-3">
                    {article.category}
                  </Badge>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-lg leading-tight line-clamp-2 text-right">
                  {article.title_ar}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  {article.author_name && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{article.author_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(article.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3 text-right">
                  {article.excerpt_ar || article.content_ar.substring(0, 150) + '...'}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {article.reading_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.reading_time} دقيقة</span>
                      </div>
                    )}
                    {article.views_count && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.views_count.toLocaleString('ar')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link to={`/articles/${article.slug}`}>
                    اقرأ المقال
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-4">لا توجد مقالات متاحة حالياً</h3>
            <p className="text-muted-foreground">سيتم إضافة المزيد من المقالات قريباً</p>
            <Button asChild className="mt-4">
              <Link to="/">العودة إلى الصفحة الرئيسية</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ArticlesList;