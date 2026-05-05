import type { APIRoute } from 'astro';

const SITE_URL = (import.meta.env.PUBLIC_APP_URL || 'https://ketojourney.fun').replace(/\/$/, '');

export const GET: APIRoute = () => {
  const content = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Block private/backend paths',
    'Disallow: /dashboard/',
    'Disallow: /api/',
    'Disallow: /login',
    'Disallow: /signup',
    'Disallow: /forgot-password',
    'Disallow: /reset-password',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
