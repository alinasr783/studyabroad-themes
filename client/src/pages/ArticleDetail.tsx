import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, Eye, User, Share2 } from "lucide-react";

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

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  // بيانات وهمية للمقالات (لأغراض العرض المؤقت)
  const dummyArticles: Article[] = [
    {
      id: "1",
      title_ar: "دليل شامل للدراسة في ألمانيا",
      title_en: "Complete Guide to Study in Germany",
      slug: "study-in-germany",
      content_ar: "ألمانيا من أفضل الوجهات للطلاب الدوليين بسبب جودة التعليم العالي وتكلفة المعيشة المعقولة. في هذا المقال سنغطي كل ما تحتاج معرفته للدراسة في ألمانيا:\n\n1. نظام التعليم الألماني\n2. أفضل الجامعات\n3. تكاليف الدراسة والمعيشة\n4. متطلبات القبول\n5. فرص العمل أثناء الدراسة وبعد التخرج\n\nألمانيا توفر تعليماً عالي الجودة مع رسوم دراسية منخفضة أو مجانية في العديد من الجامعات الحكومية.",
      content_en: "Germany is one of the top destinations for international students...",
      excerpt_ar: "كل ما تحتاج معرفته عن الدراسة في ألمانيا من متطلبات القبول إلى تكاليف المعيشة",
      excerpt_en: "Everything you need to know about studying in Germany",
      author_name: "أحمد محمد",
      author_avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      featured_image: "https://images.unsplash.com/photo-1528720208104-3d9bd03cc9d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "الدراسة في الخارج",
      tags: ["ألمانيا", "منح دراسية", "تعليم"],
      is_published: true,
      is_featured: true,
      views_count: 1245,
      reading_time: 8,
      created_at: "2023-05-15T10:00:00Z"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // استخدام البيانات الوهمية مؤقتاً
      const selectedArticle = dummyArticles.find(art => art.slug === slug) || null;
      setArticle(selectedArticle);
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

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center" dir="rtl">
          <h1 className="text-3xl font-bold mb-4">المقال غير موجود</h1>
          <p className="text-xl text-muted-foreground mb-6">لم يتم العثور على المقال المطلوب</p>
          <Button asChild>
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
                <Badge variant="secondary" className="mb-2">
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
              style={{ whiteSpace: 'pre-line' }}
            >
              {article.content_ar}
            </div>
          </div>

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="border-t pt-6 mb-8">
              <h3 className="text-lg font-semibold mb-3">الوسوم</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
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
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title_ar,
                      text: article.excerpt_ar,
                      url: window.location.href,
                    });
                  } else {
                    // Fallback for browsers that don't support Web Share API
                    alert('شارك الرابط: ' + window.location.href);
                  }
                }}>
                  <Share2 className="w-4 h-4" />
                  مشاركة
                </Button>
                <Button asChild variant="secondary">
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