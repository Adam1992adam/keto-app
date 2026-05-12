// Dynamic blog posts sitemap — queries blog_posts table in real time.
// Every published post appears here automatically; no rebuild needed.
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const SITE = 'https://www.ketojourney.fun';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>`;
  const xmlHeaders = { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' };

  try {
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL  || import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return new Response(emptyXml, { headers: xmlHeaders });

    const db = createClient(supabaseUrl, supabaseKey);

    const { data: posts, error } = await db
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(1000);

    if (error) console.error('[sitemap-posts] db error:', error.message);

    const urls = (posts || []).map(post => {
      const rawDate = post.updated_at || post.published_at;
      const lastmod  = rawDate ? rawDate.split('T')[0] : '';
      const loc      = escapeXml(`${SITE}/blog/${post.slug}`);
      return `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(xml, { headers: xmlHeaders });
  } catch (err) {
    console.error('[sitemap-posts] unexpected error:', err);
    return new Response(emptyXml, { headers: xmlHeaders });
  }
}
