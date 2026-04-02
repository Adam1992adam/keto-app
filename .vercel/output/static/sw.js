const CACHE_NAME = 'keto-journey-v2';

self.addEventListener('install', () => {
  console.log('SW: installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: activated');
  event.waitUntil(self.clients.claim());
});

/* ── PUSH EVENT ── */
self.addEventListener('push', (event) => {
  let data = { title: 'Keto Journey', body: 'You have a new notification', icon: '/icon-192.png', url: '/dashboard' };
  try { if (event.data) data = { ...data, ...event.data.json() }; } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:  data.body,
      icon:  data.icon  || '/icon-192.png',
      badge: '/icon-72.png',
      tag:   data.tag   || 'keto-notification',
      data:  { url: data.url || '/dashboard' },
      vibrate: [200, 100, 200],
      requireInteraction: data.priority === 'urgent',
    })
  );
});

/* ── NOTIFICATION CLICK ── */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab on the same origin
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

/* ── BACKGROUND SYNC (offline resilience) ── */
self.addEventListener('sync', (event) => {
  if (event.tag === 'keto-sync') {
    console.log('SW: background sync triggered');
  }
});
