import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sentry from '@sentry/astro';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://ketojourney.fun';

export default defineConfig({
  site: SITE,
  output: 'server',
  security: {
    checkOrigin: false,
  },
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [
    tailwind(),
    sitemap({
      // SSR pages that aren't auto-discovered must be listed manually
      customPages: [
        `${SITE}/`,
        `${SITE}/blog`,
        `${SITE}/recipes`,
        `${SITE}/login`,
        `${SITE}/signup`,
        `${SITE}/start`,
      ],
      // Exclude dashboard, API, and admin pages from the sitemap
      filter: (page) =>
        !page.includes('/dashboard') &&
        !page.includes('/api/') &&
        !page.includes('/admin'),
    }),
    sentry({
      sourceMapsUploadOptions: {
        project: 'keto-journey',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
});
