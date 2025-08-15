import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, Eye, User, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

interface SiteSettings {
  primary_color_1?: string;
  primary_color_2?: string;
  primary_color_3?: string;
}

const ArticlesList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  // جلب معرف العميل أولاً
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const domain = window.location.hostname;
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("id")
          .eq("domain", domain)
          .maybeSingle();

        if (clientError) throw clientError;
        if (!clientData) throw new Error("لم يتم العثور على عميل لهذا الدومين");

        setClientId(clientData.id);
      } catch (err) {
        console.error("Error fetching client ID:", err);
        setError("حدث خطأ أثناء تحميل البيانات. يرجى المحاولة لاحقاً.");
        setLoading(false);
      }
    };

    fetchClientId();
  }, []);

  // جلب إعدادات الموقع من Supabase بناءً على clientId
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['siteSettings', clientId],
    queryFn: async () => {
      if (!clientId) return null;

      const { data, error } = await supabase
        .from('site_settings')
        .select('primary_color_1, primary_color_2, primary_color_3')
        .eq('client_id', clientId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!clientId
  });

  // تطبيق ألوان الموقع الديناميكية
  useEffect(() => {
    if (siteSettings) {
      const root = document.documentElement;
      if (siteSettings.primary_color_1) {
        root.style.setProperty('--primary', siteSettings.primary_color_1);
      }
      if (siteSettings.primary_color_2) {
        root.style.setProperty('--primary-2', siteSettings.primary_color_2);
      }
      if (siteSettings.primary_color_3) {
        root.style.setProperty('--primary-3', siteSettings.primary_color_3);
      }
    }
  }, [siteSettings]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!clientId) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .eq('client_id', clientId)
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
  }, [clientId]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div 
            className="animate-spin rounded-full h-32 w-32 border-b-2"
            style={{
              borderColor: siteSettings?.primary_color_1 || '#3b82f6'
            }}
          ></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div 
            className="p-4 rounded-lg max-w-md mx-auto"
            style={{
              backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}10` : 'rgba(59, 130, 246, 0.1)',
              borderColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}30` : 'rgba(59, 130, 246, 0.2)',
              color: siteSettings?.primary_color_1 || '#3b82f6'
            }}
          >
            <p>{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              style={{
                backgroundColor: siteSettings?.primary_color_1 || '#3b82f6',
                '&:hover': {
                  backgroundColor: siteSettings?.primary_color_2 || '#6366f1'
                }
              }}
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
            <Card 
              key={article.id} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}20` : 'rgba(59, 130, 246, 0.1)'
              }}
            >
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
                  <div 
                    className="w-full h-48 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(to right, ${siteSettings?.primary_color_1 || '#3b82f6'}, ${siteSettings?.primary_color_2 || '#6366f1'})`
                    }}
                  >
                    <BookOpen 
                      className="w-16 h-16 text-white" 
                    />
                  </div>
                )}
                {article.is_featured && (
                  <Badge 
                    className="absolute top-3 left-3"
                    style={{
                      backgroundColor: siteSettings?.primary_color_1 || '#3b82f6',
                      color: 'white'
                    }}
                  >
                    مميز
                  </Badge>
                )}
                {article.category && (
                  <Badge 
                    variant="secondary" 
                    className="absolute bottom-3 left-3"
                    style={{
                      backgroundColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}10` : 'rgba(59, 130, 246, 0.1)',
                      color: siteSettings?.primary_color_1 || '#3b82f6',
                      borderColor: siteSettings?.primary_color_1 ? `${siteSettings.primary_color_1}30` : 'rgba(59, 130, 246, 0.2)'
                    }}
                  >
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
                      <User 
                        className="w-4 h-4"
                        style={{
                          color: siteSettings?.primary_color_1 || '#3b82f6'
                        }}
                      />
                      <span>{article.author_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar 
                      className="w-4 h-4"
                      style={{
                        color: siteSettings?.primary_color_1 || '#3b82f6'
                      }}
                    />
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
                        <Clock 
                          className="w-4 h-4"
                          style={{
                            color: siteSettings?.primary_color_1 || '#3b82f6'
                          }}
                        />
                        <span>{article.reading_time} دقيقة</span>
                      </div>
                    )}
                    {article.views_count && (
                      <div className="flex items-center gap-1">
                        <Eye 
                          className="w-4 h-4"
                          style={{
                            color: siteSettings?.primary_color_1 || '#3b82f6'
                          }}
                        />
                        <span>{article.views_count.toLocaleString('ar')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  asChild 
                  className="w-full"
                  style={{
                    backgroundColor: siteSettings?.primary_color_1 || '#3b82f6',
                    '&:hover': {
                      backgroundColor: siteSettings?.primary_color_2 || '#6366f1'
                    }
                  }}
                >
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
            <Button 
              asChild 
              className="mt-4"
              style={{
                backgroundColor: siteSettings?.primary_color_1 || '#3b82f6',
                '&:hover': {
                  backgroundColor: siteSettings?.primary_color_2 || '#6366f1'
                }
              }}
            >
              <Link to="/">العودة إلى الصفحة الرئيسية</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ArticlesList;