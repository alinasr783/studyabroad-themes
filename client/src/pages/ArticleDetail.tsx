import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, Eye, User, Share2 } from "lucide-react";
import DOMPurify from "dompurify";
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

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
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

  // دالة لتنظيف وعرض HTML بأمان
  const createMarkup = (htmlContent: string) => {
    return {
      __html: DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 
                      'strong', 'em', 'a', 'br', 'div', 'span', 'img'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class']
      })
    };
  };

  // إنشاء ستايل ديناميكي للألوان
  const getGradientStyle = () => {
    if (!siteSettings) return {};

    return {
      background: `linear-gradient(to right, ${siteSettings.primary_color_1 || '#3b82f6'}, ${siteSettings.primary_color_2 || '#6366f1'})`,
      backgroundImage: `linear-gradient(to right, ${siteSettings.primary_color_1 || '#3b82f6'}, ${siteSettings.primary_color_2 || '#6366f1'})`
    };
  };

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug || !clientId) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .eq('client_id', clientId)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        if (!data) {
          throw new Error('المقال غير موجود');
        }

        // زيادة عدد المشاهدات
        await supabase
          .from('articles')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', data.id)
          .eq('client_id', clientId);

        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب المقال');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, clientId]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div 
            className="animate-spin rounded-full h-32 w-32 border-b-2"
            style={{ borderColor: siteSettings?.primary_color_1 || '#3b82f6' }}
          ></div>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center" dir="rtl">
          <h1 className="text-3xl font-bold mb-4">المقال غير موجود</h1>
          <p className="text-xl text-muted-foreground mb-6">{error || 'لم يتم العثور على المقال المطلوب'}</p>
          <Button asChild style={getGradientStyle()}>
            <Link to="/articles">العودة إلى قائمة المقالات</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            {article.featured_image && (
              <div className="relative mb-6 rounded-2xl overflow-hidden">
                <img 
                  src={article.featured_image} 
                  alt={article.title_ar}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}

            <div className="space-y-4">
              {article.category && (
                <Badge 
                  variant="secondary" 
                  className="mb-2"
                  style={{ 
                    backgroundColor: `${siteSettings?.primary_color_1 || '#3b82f6'}20`,
                    color: siteSettings?.primary_color_1 || '#3b82f6'
                  }}
                >
                  {article.category}
                </Badge>
              )}

              <h1 className="text-4xl font-bold leading-tight">{article.title_ar}</h1>

              {article.excerpt_ar && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {article.excerpt_ar}
                </p>
              )}

              <div className="flex items-center gap-6 text-sm text-muted-foreground border-y py-4 flex-wrap">
                {article.author_name && (
                  <div className="flex items-center gap-2">
                    {article.author_avatar ? (
                      <img 
                        src={article.author_avatar} 
                        alt={article.author_name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://www.gravatar.com/avatar/default?s=200&d=mp";
                        }}
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span>{article.author_name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.created_at).toLocaleDateString('ar-SA')}</span>
                </div>

                {article.reading_time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.reading_time} دقيقة قراءة</span>
                  </div>
                )}

                {article.views_count && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{article.views_count.toLocaleString('ar')} مشاهدة</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8" dir="rtl">
            <div 
              className="leading-relaxed text-right"
              dangerouslySetInnerHTML={createMarkup(article.content_ar)}
            />
          </div>

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="border-t pt-6 mb-8">
              <h3 className="text-lg font-semibold mb-3">الوسوم</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    style={{ 
                      borderColor: siteSettings?.primary_color_1 || '#3b82f6',
                      color: siteSettings?.primary_color_1 || '#3b82f6'
                    }}
                  >
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
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: article.title_ar,
                        text: article.excerpt_ar || article.title_ar,
                        url: window.location.href,
                      });
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      alert('شارك الرابط: ' + window.location.href);
                    }
                  }}
                  style={{ 
                    borderColor: siteSettings?.primary_color_1 || '#3b82f6',
                    color: siteSettings?.primary_color_1 || '#3b82f6'
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  مشاركة
                </Button>
                <Button 
                  asChild 
                  variant="secondary"
                  style={getGradientStyle()}
                >
                  <Link to="/articles">العودة إلى المقالات</Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default ArticleDetail;