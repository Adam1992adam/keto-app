const CACHE_NAME = 'keto-journey-v1';

self.addEventListener('install', () => {
  console.log('SW: installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        clientList[0].focus();
        clientList[0].navigate('/dashboard');
      } else {
        self.clients.openWindow('/dashboard');
      }
    })
  );
});
