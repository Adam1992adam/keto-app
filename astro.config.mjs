import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import sentry from '@sentry/astro';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [
    tailwind(),
    sentry({
      dsn: process.env.PUBLIC_SENTRY_DSN,
      sourceMapsUploadOptions: {
        project: 'keto-journey',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
});
