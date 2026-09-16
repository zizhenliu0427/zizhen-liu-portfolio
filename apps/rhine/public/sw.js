// Retirement worker at the former URL, so older cached releases also migrate.
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const prefix = `zl-archive:${new URL(self.registration.scope).pathname}:`;
    for (const key of await caches.keys()) {
      if (key.startsWith(prefix)) await caches.delete(key);
    }
    await self.registration.unregister();
  })());
});
