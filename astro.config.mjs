import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sentry from '@sentry/astro';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [
    tailwind(),
    sentry({
      sourceMapsUploadOptions: {
        project: 'keto-journey',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
});
