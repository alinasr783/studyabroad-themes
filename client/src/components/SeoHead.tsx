import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImageUrl?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  keywords?: string[];
  author?: string;
  publisher?: string;
  twitterHandle?: string;
  twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
  university?: {
    name: string;
    logo: string;
    rating?: number;
    ratingCount?: number;
    address?: {
      street?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      country?: string;
    };
  };
  noIndex?: boolean;
  noFollow?: boolean;
}

export default function SeoHead({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImageUrl = '/default-og-image.jpg',
  ogImageAlt = 'StudyAbroad Platform',
  ogImageWidth = 1200,
  ogImageHeight = 630,
  keywords = [],
  author = 'StudyAbroad Team',
  publisher = 'StudyAbroad Inc.',
  twitterHandle = '@StudyAbroad',
  twitterCardType = 'summary_large_image',
  article,
  university,
  noIndex = false,
  noFollow = false,
}: SeoHeadProps) {
  const location = useLocation();
  const baseUrl = 'https://www.studyabroad.com';
  const fullUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : `${baseUrl}${location.pathname}`;
  const fullTitle = `${title} | StudyAbroad`;
  const metaKeywords = [
    'دراسة بالخارج',
    'جامعات عالمية',
    'منح دراسية',
    'تخصصات جامعية',
    ...keywords,
  ].join(', ');

  useEffect(() => {
    // تحديث عنوان الصفحة
    document.title = fullTitle;

    // إضافة أو تحديث وصف الميتا
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // إضافة أو تحديث كلمات المفتاحية
    let metaKeywordsTag = document.querySelector('meta[name="keywords"]');
    if (!metaKeywordsTag) {
      metaKeywordsTag = document.createElement('meta');
      metaKeywordsTag.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywordsTag);
    }
    metaKeywordsTag.setAttribute('content', metaKeywords);

    // إضافة أو تحديث canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', fullUrl);

    // إضافة أو تحديث Open Graph tags
    const ogTags = [
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: fullUrl },
      { property: 'og:image', content: ogImageUrl },
      { property: 'og:image:alt', content: ogImageAlt },
      { property: 'og:image:width', content: ogImageWidth.toString() },
      { property: 'og:image:height', content: ogImageHeight.toString() },
      { property: 'og:site_name', content: 'StudyAbroad' },
      { property: 'og:locale', content: 'ar_AR' },
    ];

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });

    // إضافة أو تحديث Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: twitterCardType },
      { name: 'twitter:site', content: twitterHandle },
      { name: 'twitter:creator', content: twitterHandle },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImageUrl },
      { name: 'twitter:image:alt', content: ogImageAlt },
    ];

    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', tag.name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });

    // إضافة أو تحديث article tags إذا كان محتوى مقال
    if (article && ogType === 'article') {
      const articleTags = [
        { property: 'article:published_time', content: article.publishedTime },
        { property: 'article:modified_time', content: article.modifiedTime },
        { property: 'article:section', content: article.section },
        ...(article.tags || []).map(tag => ({
          property: 'article:tag',
          content: tag,
        })),
      ].filter(tag => tag.content);

      articleTags.forEach(tag => {
        let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', tag.property);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', tag.content);
      });
    }

    // إضافة أو تحديث noindex/nofollow
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (noIndex || noFollow) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      const content = [
        noIndex ? 'noindex' : 'index',
        noFollow ? 'nofollow' : 'follow',
      ].join(', ');
      robotsMeta.setAttribute('content', content);
    } else if (robotsMeta) {
      robotsMeta.remove();
    }

    // إضافة أو تحديث author و publisher
    let authorMeta = document.querySelector('meta[name="author"]');
    if (!authorMeta) {
      authorMeta = document.createElement('meta');
      authorMeta.setAttribute('name', 'author');
      document.head.appendChild(authorMeta);
    }
    authorMeta.setAttribute('content', author);

    let publisherMeta = document.querySelector('meta[name="publisher"]');
    if (!publisherMeta) {
      publisherMeta = document.createElement('meta');
      publisherMeta.setAttribute('name', 'publisher');
      document.head.appendChild(publisherMeta);
    }
    publisherMeta.setAttribute('content', publisher);

    // إضافة structured data للجامعة إذا كانت متوفرة
    if (university) {
      let scriptTag = document.getElementById('university-structured-data');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'university-structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }

      const universityData = {
        "@context": "https://schema.org",
        "@type": "CollegeOrUniversity",
        "name": university.name,
        "image": university.logo,
        "description": description,
        "url": fullUrl,
        ...(university.address && {
          "address": {
            "@type": "PostalAddress",
            "streetAddress": university.address.street,
            "addressLocality": university.address.city,
            "addressRegion": university.address.region,
            "postalCode": university.address.postalCode,
            "addressCountry": university.address.country,
          },
        }),
        ...(university.rating && {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": university.rating,
            "ratingCount": university.ratingCount?.toString() || "100",
          },
        }),
      };

      scriptTag.textContent = JSON.stringify(universityData);
    }

    // تنظيف عند unmount
    return () => {
      // لا ننظف title و description الأساسية لأنها قد تحتاجها الصفحات الأخرى
      // يمكنك إضافة تنظيف إضافي هنا إذا لزم الأمر
    };
  }, [
    title,
    description,
    canonicalUrl,
    ogType,
    ogImageUrl,
    ogImageAlt,
    ogImageWidth,
    ogImageHeight,
    keywords,
    author,
    publisher,
    twitterHandle,
    twitterCardType,
    article,
    university,
    noIndex,
    noFollow,
    fullTitle,
    metaKeywords,
    fullUrl,
    location.pathname,
  ]);

  return null;
}