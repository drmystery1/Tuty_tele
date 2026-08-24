const CACHE = 'tele-tuty-V94-directory-history';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  const d = e.data || {};

  if (d.type === 'SHOW_NOTIFICATION') {
    const title = d.title || 'Tele Tuty';

    const options = Object.assign({
      icon: '/tele-tuty-logo.png',
      badge: '/tele-tuty-logo.png',
      data: {
        url: '/',
        jobId: d.jobId || null
      },
      renotify: true
    }, d.options || {});

    e.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});

self.addEventListener('push', e => {
  if (!e.data) return;

  let d;

  try {
    d = e.data.json();
  } catch {
    d = {
      notification: {
        body: e.data.text()
      }
    };
  }

  const n = d.notification || d;

  e.waitUntil(
    self.registration.showNotification(
      n.title || 'Tele Tuty',
      {
        body: n.body || '',
        icon: n.icon || '/tele-tuty-logo.png',
        badge: n.badge || '/tele-tuty-logo.png',
        data: d.data || {},
        renotify: true
      }
    )
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();

  e.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(async list => {

      for (const c of list) {
        if ('focus' in c) {
          try {
            await c.focus();
          } catch {}

          try {
            c.postMessage({
              type: 'OPEN_NOTIFICATION_JOB',
              jobId: e.notification?.data?.jobId || null
            });
          } catch {}

          return c;
        }
      }

      return clients.openWindow('/');
    })
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match(e.request)
    )
  );
});
