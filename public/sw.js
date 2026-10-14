// Al-Muslim App Service Worker for Background Adhan & Periodic Reminders

const CACHE_NAME = 'almuslim-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for background notifications and messages from app
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, {
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [300, 150, 300, 150, 600],
      requireInteraction: true,
      tag: options?.tag || 'almuslim-notification',
      renotify: true,
      ...options,
      actions: [
        { action: 'open', title: 'فتح التطبيق 📖' },
      ],
    });
  }
});

// Handle clicking on notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('./');
      }
    })
  );
});
