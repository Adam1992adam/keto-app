// Master sitemap index — lists all sub-sitemaps.
// Google fetches this first, then follows each <loc> to crawl content.
export const prerender = false;

export async function GET() {
  const SITE = 'https://www.ketojourney.fun';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE}/sitemap-pages.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${SITE}/sitemap-posts.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${SITE}/sitemap-recipes.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
