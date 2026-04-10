import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: process.env.PUBLIC_SENTRY_DSN || import.meta.env.PUBLIC_SENTRY_DSN,
  environment: process.env.PUBLIC_APP_URL?.includes('localhost') ? 'development' : 'production',

  // Capture all server-side errors
  tracesSampleRate: 0.1,

  // Tag every error with useful context
  initialScope: {
    tags: {
      runtime: 'server',
      app: 'keto-journey',
    },
  },
});
