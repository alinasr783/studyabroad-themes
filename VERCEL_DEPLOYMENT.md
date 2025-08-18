# نشر موقع الدراسة في الخارج على Vercel

## الإعدادات المطلوبة في Vercel

عند رفع المشروع على Vercel، استخدم الإعدادات التالية:

### 1. Framework Preset
اختر: **Other** (لا تختر Vite أو أي إطار عمل آخر)

### 2. Root Directory
اتركه: `./` (الجذر الافتراضي)

### 3. Build Command
`vite build`

### 4. Output Directory
`dist/public`

### 5. Install Command
`npm install`

## الملفات المحدثة

تم تحديث `vercel.json` ليحتوي على الإعدادات الصحيحة:

```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist/public",
  "framework": null,
  "installCommand": "npm install",
  "devCommand": "vite dev",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## كيفية النشر

1. ادخل إلى [Vercel](https://vercel.com)
2. اختر "New Project"
3. اختر "Import from GitHub"
4. اختر repository: `alinasr783/studyabroad-themes`
5. اختر branch: `main`
6. في إعدادات المشروع:
   - **Project Name**: `studyabroad-themes-92zf` (أو أي اسم تريده)
   - **Framework Preset**: **Other**
   - **Root Directory**: `./`
   - باقي الإعدادات ستُقرأ من ملف `vercel.json` تلقائياً

## ملاحظات مهمة

- المشروع يستخدم Supabase كقاعدة بيانات، لذلك لا حاجة لإعدادات إضافية
- جميع بيانات Supabase موجودة في الكود ولا تحتاج متغيرات بيئة إضافية
- الموقع سيعمل كموقع استاتيكي يتصل بـ Supabase مباشرة

## حل مشكلة عرض الكود بدلاً من الموقع

المشكلة كانت أن Vercel كان يحاول تشغيل السيرفر بدلاً من عرض الموقع الاستاتيكي. الآن مع الإعدادات الجديدة، سيعرض الموقع بشكل صحيح.