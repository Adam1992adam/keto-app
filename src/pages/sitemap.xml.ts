import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = (import.meta.env.PUBLIC_APP_URL || 'https://ketojourney.fun').replace(/\/$/, '');

const STATIC_PAGES = [
  { url: '/',               priority: '1.0', changefreq: 'weekly'  },
  { url: '/free-book',      priority: '0.9', changefreq: 'monthly' },
  { url: '/start',          priority: '0.9', changefreq: 'monthly' },
  { url: '/login',          priority: '0.5', changefreq: 'monthly' },
  { url: '/blog',           priority: '0.8', changefreq: 'daily'   },
  { url: '/recipes',        priority: '0.8', changefreq: 'weekly'  },
  { url: '/terms',          priority: '0.3', changefreq: 'yearly'  },
  { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly'  },
  { url: '/refund-policy',  priority: '0.3', changefreq: 'yearly'  },
  { url: '/disclaimer',     priority: '0.3', changefreq: 'yearly'  },
];

function urlEntry(loc: string, lastmod?: string, changefreq?: string, priority?: string) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod   ? `    <lastmod>${lastmod}</lastmod>`         : '',
    changefreq? `    <changefreq>${changefreq}</changefreq>`: '',
    priority  ? `    <priority>${priority}</priority>`      : '',
    '  </url>',
  ].filter(Boolean).join('\n');
}

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().split('T')[0];

  const staticEntries = STATIC_PAGES.map(p =>
    urlEntry(SITE_URL + p.url, today, p.changefreq, p.priority)
  );

  // Fetch published blog posts
  const supabaseUrl  = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  let blogEntries: string[] = [];
  let recipeEntries: string[] = [];

  try {
    const db = createClient(supabaseUrl, supabaseAnon);

    const [{ data: posts }, { data: recipes }] = await Promise.all([
      db.from('blog_posts')
        .select('slug, published_at, updated_at')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(500),
      db.from('recipes')
        .select('id, title, updated_at')
        .limit(500),
    ]);

    blogEntries = (posts || []).map(p =>
      urlEntry(
        `${SITE_URL}/blog/${p.slug}`,
        (p.updated_at || p.published_at || today).split('T')[0],
        'monthly',
        '0.7',
      )
    );

    recipeEntries = (recipes || []).map(r =>
      urlEntry(
        `${SITE_URL}/recipes/${r.id}`,
        (r.updated_at || today).split('T')[0],
        'monthly',
        '0.6',
      )
    );
  } catch {
    // If DB is unavailable, return static pages only
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticEntries,
    ...blogEntries,
    ...recipeEntries,
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};
