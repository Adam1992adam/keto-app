import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.PUBLIC_APP_URL?.includes('localhost') ? 'development' : 'production',

  // Capture 10% of sessions for performance monitoring (free tier friendly)
  tracesSampleRate: 0.1,

  // Capture replays only on errors
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: false,
    }),
  ],

  // Don't send errors from browser extensions or localhost
  beforeSend(event) {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') return null;
    return event;
  },
});
