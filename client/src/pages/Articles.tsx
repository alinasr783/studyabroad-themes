import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, Eye, User, BookOpen, Share2 } from "lucide-react";

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

const Articles = () => {
  const { slug } = useParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (slug) {
        // Fetch specific article
        const { data: articleData } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();
        
        if (articleData) {
          setSelectedArticle(articleData);
          
          // Increment view count
          await supabase
            .from('articles')
            .update({ views_count: (articleData.views_count || 0) + 1 })
            .eq('id', articleData.id);
        }
      } else {
        // Fetch all published articles
        const { data: articlesData } = await supabase
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });
        
        setArticles(articlesData || []);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (selectedArticle) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            {/* Article Header */}
            <div className="mb-8">
              {selectedArticle.featured_image && (
                <div className="relative mb-6 rounded-2xl overflow-hidden">
                  <img 
                    src={selectedArticle.featured_image} 
                    alt={selectedArticle.title_ar}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}
              
              <div className="space-y-4">
                {selectedArticle.category && (
                  <Badge variant="secondary" className="mb-2">
                    {selectedArticle.category}
                  </Badge>
                )}
                
                <h1 className="text-4xl font-bold leading-tight">{selectedArticle.title_ar}</h1>
                
                {selectedArticle.excerpt_ar && (
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {selectedArticle.excerpt_ar}
                  </p>
                )}
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground border-y py-4">
                  {selectedArticle.author_name && (
                    <div className="flex items-center gap-2">
                      {selectedArticle.author_avatar ? (
                        <img 
                          src={selectedArticle.author_avatar} 
                          alt={selectedArticle.author_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                      <span>{selectedArticle.author_name}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedArticle.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                  
                  {selectedArticle.reading_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{selectedArticle.reading_time} دقيقة قراءة</span>
                    </div>
                  )}
                  
                  {selectedArticle.views_count && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{selectedArticle.views_count.toLocaleString()} مشاهدة</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg prose-arabic max-w-none mb-8">
              <div 
                className="leading-relaxed"
                style={{ whiteSpace: 'pre-line' }}
              >
                {selectedArticle.content_ar}
              </div>
            </div>

            {/* Article Tags */}
            {selectedArticle.tags && selectedArticle.tags.length > 0 && (
              <div className="border-t pt-6 mb-8">
                <h3 className="text-lg font-semibold mb-3">الوسوم</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">شارك المقال</h3>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  مشاركة
                </Button>
              </div>
            </div>
          </article>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
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
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                )}
                {article.is_featured && (
                  <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                    مميز
                  </Badge>
                )}
                {article.category && (
                  <Badge variant="secondary" className="absolute bottom-3 right-3">
                    {article.category}
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg leading-tight line-clamp-2">
                  {article.title_ar}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                <p className="text-muted-foreground mb-4 line-clamp-3">
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
                        <span>{article.views_count.toLocaleString()}</span>
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Articles;