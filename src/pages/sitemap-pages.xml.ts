// Static marketing pages sitemap.
// Update this list whenever you add a new public marketing page.
export const prerender = true;

interface Page {
  url: string;
  priority: string;
  changefreq: string;
}

const SITE = 'https://ketojourney.fun';

const PAGES: Page[] = [
  { url: `${SITE}/`,               priority: '1.0', changefreq: 'weekly'  },
  { url: `${SITE}/blog`,           priority: '0.9', changefreq: 'daily'   },
  { url: `${SITE}/recipes`,        priority: '0.9', changefreq: 'daily'   },
  { url: `${SITE}/start`,          priority: '0.8', changefreq: 'monthly' },
  { url: `${SITE}/login`,          priority: '0.5', changefreq: 'yearly'  },
  { url: `${SITE}/signup`,         priority: '0.5', changefreq: 'yearly'  },
  { url: `${SITE}/privacy-policy`, priority: '0.3', changefreq: 'yearly'  },
  { url: `${SITE}/terms`,          priority: '0.3', changefreq: 'yearly'  },
  { url: `${SITE}/refund-policy`,  priority: '0.3', changefreq: 'yearly'  },
  { url: `${SITE}/disclaimer`,     priority: '0.3', changefreq: 'yearly'  },
];

export async function GET() {
  const urls = PAGES.map(p => `  <url>
    <loc>${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
