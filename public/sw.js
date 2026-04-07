/* ═══════════════════════════════════════════════════════════════
   KetoJourney Service Worker  — v3
   Cache strategy:
     PRECACHE   → offline.html + key icons
     Cache First  → /_astro/* (built bundles), /fonts/, images
     Network First (3s) → /dashboard/* pages (SSR, auth-gated)
     Stale-While-Revalidate → /api/meals/*, /api/recipes*
     Network Only + BG Sync → mutating API calls
   ═══════════════════════════════════════════════════════════════ */

const CACHE_VERSION  = 'v6';
const STATIC_CACHE   = 'keto-static-'  + CACHE_VERSION;
const PAGES_CACHE    = 'keto-pages-'   + CACHE_VERSION;
const DATA_CACHE     = 'keto-data-'    + CACHE_VERSION;
const IMAGE_CACHE    = 'keto-images-'  + CACHE_VERSION;
const SYNC_QUEUE_KEY = 'keto-sync-queue';

/* Assets to pre-cache on install */
const PRECACHE_URLS = [
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
];

/* Pages to cache on first visit (network-first) */
const CACHEABLE_PAGES = [
  '/dashboard',
  '/dashboard/recipes',
  '/dashboard/shopping',
  '/dashboard/fasting',
  '/dashboard/progress',
  '/dashboard/keto-calculator',
];

/* API routes that are safe to serve stale (read-only data) */
const STALE_API_PATTERNS = [
  /\/api\/meals\/today/,
  /\/api\/recipes/,
  /\/api\/notifications\?/,
  /\/api\/meals\/today/,
];

/* Mutating API routes — network only, queue offline */
const MUTATION_PATTERNS = [
  /\/api\/checkin\//,
  /\/api\/tasks\//,
  /\/api\/fasting\//,
  /\/api\/weekly\//,
  /\/api\/measurements\//,
  /\/api\/profile\//,
  /\/api\/ketones\//,
  /\/api\/water\//,
  /\/api\/food-log\//,
  /\/api\/reflection\//,
];

/* ══ INSTALL ════════════════════════════════════════════════ */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('SW precache: some assets failed', err);
      });
    }).then(() => self.skipWaiting())
  );
});

/* ══ ACTIVATE ═══════════════════════════════════════════════ */
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, PAGES_CACHE, DATA_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name.startsWith('keto-') && !currentCaches.includes(name))
          .map((name) => {
            console.log('SW: deleting old cache', name);
            return caches.delete(name);
          })
      )
    ).then(() => self.clients.claim())
  );
});

/* ══ FETCH ══════════════════════════════════════════════════ */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  /* Skip non-GET mutations — handle via BG Sync */
  if (req.method !== 'GET') {
    if (isMutationAPI(url.pathname)) {
      event.respondWith(networkWithQueueFallback(req));
    }
    return;
  }

  /* Cross-origin requests — pass through */
  if (url.origin !== self.location.origin) {
    if (url.hostname.includes('supabase.co') || url.hostname.includes('fonts.googleapis')) {
      return; // let browser handle
    }
    /* Recipe/food images from external CDNs — cache first */
    if (req.destination === 'image') {
      event.respondWith(cacheFirstImage(req));
      return;
    }
    return;
  }

  const path = url.pathname;

  /* ── Static built assets: Cache First ────────────────── */
  if (path.startsWith('/_astro/') || path.startsWith('/fonts/') || path.match(/\.(ico|svg|png|jpg|webp|woff2?)$/)) {
    event.respondWith(cacheFirstStatic(req));
    return;
  }

  /* ── Stale-while-revalidate read APIs ─────────────────── */
  if (STALE_API_PATTERNS.some((p) => p.test(path))) {
    event.respondWith(staleWhileRevalidate(req, DATA_CACHE));
    return;
  }

  /* ── Mutating APIs — network only (already handled above) */
  if (isMutationAPI(path)) return;

  /* ── Payment/upgrade pages: bypass SW entirely ───────── */
  if (path === '/dashboard/upgrade') {
    return; /* let browser fetch directly — no SW interference */
  }

  /* ── Dashboard pages: Network First ───────────────────── */
  if (path.startsWith('/dashboard') || path === '/') {
    event.respondWith(networkFirstPage(req));
    return;
  }
});

/* ══ STRATEGIES ═════════════════════════════════════════════ */

/* Cache First — built assets, images */
async function cacheFirstStatic(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    return new Response('Asset unavailable offline', { status: 503 });
  }
}

/* Cache First — external images (recipe photos) */
async function cacheFirstImage(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      /* Limit image cache to 120 entries */
      await trimCache(IMAGE_CACHE, 120);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    return caches.match('/icon-192.png');
  }
}

/* Stale While Revalidate — API responses */
async function staleWhileRevalidate(req, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(req);

  const fetchPromise = fetch(req).then((res) => {
    if (res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => null);

  return cached || fetchPromise || offlineJSON({ error: 'Offline' });
}

/* Network First with page cache fallback */
async function networkFirstPage(req) {
  const path = new URL(req.url).pathname;
  const cache = await caches.open(PAGES_CACHE);
  try {
    const res = await fetchWithTimeout(req, 12000);
    if (res.ok) {
      /* Only cache cacheable pages (not user-specific API responses) */
      if (CACHEABLE_PAGES.some((p) => path === p || path.startsWith(p + '/'))) {
        cache.put(req, res.clone());
      }
    }
    return res;
  } catch {
    const cached = await cache.match(req);
    if (cached) return cached;
    return caches.match('/offline.html');
  }
}

/* Network with queue fallback for mutations */
async function networkWithQueueFallback(req) {
  try {
    return await fetch(req.clone());
  } catch {
    /* Clone request body to queue it */
    await queueRequest(req);
    return offlineJSON({ error: 'Offline', queued: true, message: 'Saved — will sync when back online' });
  }
}

/* ══ HELPERS ════════════════════════════════════════════════ */

function isMutationAPI(path) {
  return MUTATION_PATTERNS.some((p) => p.test(path));
}

function offlineJSON(data) {
  return new Response(JSON.stringify(data), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });
}

function fetchWithTimeout(req, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout')), ms);
    fetch(req).then((res) => { clearTimeout(timer); resolve(res); }).catch(reject);
  });
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys  = await cache.keys();
  if (keys.length > maxEntries) {
    const toDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(toDelete.map((k) => cache.delete(k)));
  }
}

/* ── Offline queue (IndexedDB) ─────────────────────────── */
function openQueueDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('keto-offline-queue', 1);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess  = (e) => resolve(e.target.result);
    req.onerror    = (e) => reject(e.target.error);
  });
}

async function queueRequest(req) {
  try {
    const body = req.method !== 'GET' ? await req.text() : null;
    const db   = await openQueueDB();
    const tx   = db.transaction('requests', 'readwrite');
    tx.objectStore('requests').add({
      url:     req.url,
      method:  req.method,
      headers: Object.fromEntries(req.headers.entries()),
      body,
      queued:  Date.now(),
    });
  } catch (e) {
    console.warn('SW: failed to queue request', e);
  }
}

async function replayQueue() {
  try {
    const db   = await openQueueDB();
    const tx   = db.transaction('requests', 'readwrite');
    const store = tx.objectStore('requests');
    const all  = await new Promise((res, rej) => {
      const req = store.getAll();
      req.onsuccess = (e) => res(e.target.result);
      req.onerror   = (e) => rej(e.target.error);
    });

    let replayed = 0;
    for (const entry of all) {
      try {
        const res = await fetch(entry.url, {
          method:  entry.method,
          headers: entry.headers,
          body:    entry.body || undefined,
        });
        if (res.ok || res.status < 500) {
          store.delete(entry.id);
          replayed++;
        }
      } catch {
        /* still offline — leave in queue */
      }
    }

    if (replayed > 0) {
      /* Notify all open clients */
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((c) => c.postMessage({ type: 'SYNC_COMPLETE', replayed }));
    }
  } catch (e) {
    console.warn('SW: queue replay failed', e);
  }
}

/* ══ BACKGROUND SYNC ════════════════════════════════════════ */
self.addEventListener('sync', (event) => {
  if (event.tag === 'keto-sync') {
    event.waitUntil(replayQueue());
  }
});

/* ══ PUSH NOTIFICATION ══════════════════════════════════════ */
self.addEventListener('push', (event) => {
  let data = { title: 'Keto Journey', body: 'You have a new notification', icon: '/icon-192.png', url: '/dashboard' };
  try { if (event.data) data = { ...data, ...event.data.json() }; } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    data.icon  || '/icon-192.png',
      badge:   '/icon-72.png',
      tag:     data.tag   || 'keto-notification',
      data:    { url: data.url || '/dashboard' },
      vibrate: [200, 100, 200],
      requireInteraction: data.priority === 'urgent',
    })
  );
});

/* ══ NOTIFICATION CLICK ═════════════════════════════════════ */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

/* ══ MESSAGE from page ══════════════════════════════════════ */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'CACHE_RECIPES') {
    /* Page sends recipe URLs to pre-cache (called after recipes page loads) */
    const urls = event.data.urls || [];
    caches.open(IMAGE_CACHE).then((cache) => {
      urls.forEach((url) => {
        if (url) fetch(url).then((r) => { if (r.ok) cache.put(url, r); }).catch(() => {});
      });
    });
  }
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
