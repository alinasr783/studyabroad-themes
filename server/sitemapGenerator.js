// server/sitemapGenerator.js
const { supabase } = require('../integrations/supabase/client');

const EXTERNAL_DATA_URL = 'https://yourdomain.com';


async function generateSitemap() {
  try {
    // جلب البيانات من Supabase
    const { data: universities, error: uniError } = await supabase
      .from('universities')
      .select('slug, updated_at')
      .eq('is_active', true);

    const { data: countries, error: countryError } = await supabase
      .from('countries')
      .select('slug');

    const { data: programs, error: programError } = await supabase
      .from('programs')
      .select('slug');

    if (uniError || countryError || programError) {
      throw new Error('Error fetching data from Supabase');
    }

    // توليد محتوى Sitemap
    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${EXTERNAL_DATA_URL}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        <url>
          <loc>${EXTERNAL_DATA_URL}/universities</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
        ${universities.map(({ slug, updated_at }) => `
          <url>
            <loc>${EXTERNAL_DATA_URL}/universities/${slug}</loc>
            <lastmod>${new Date(updated_at).toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `).join('')}
        ${countries.map(({ slug }) => `
          <url>
            <loc>${EXTERNAL_DATA_URL}/countries/${slug}</loc>
            <changefreq>monthly</changefreq>
            <priority>0.7</priority>
          </url>
        `).join('')}
        ${programs.map(({ slug }) => `
          <url>
            <loc>${EXTERNAL_DATA_URL}/programs/${slug}</loc>
            <changefreq>monthly</changefreq>
            <priority>0.6</priority>
          </url>
        `).join('')}
      </urlset>
    `;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return null;
  }
}

module.exports = generateSitemap;