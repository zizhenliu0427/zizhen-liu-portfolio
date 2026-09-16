import { assetUrl } from './asset-url';
import { isWallpaper } from './wallpaper';

/** Remove this site's former offline worker without refreshing an open archive. */
export async function retireOfflineCache() {
  if (isWallpaper || !('serviceWorker' in navigator)) return;
  const workerUrl = new URL(assetUrl('sw.js'), location.href).href;
  const scopePath = new URL('.', workerUrl).pathname;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      if ([registration.active, registration.waiting, registration.installing]
        .some(worker => worker?.scriptURL === workerUrl)) await registration.unregister();
    }
    if ('caches' in window) {
      for (const key of await caches.keys()) {
        if (key.startsWith(`zl-archive:${scopePath}:`)) await caches.delete(key);
      }
    }
  } catch { /* Restricted storage must not prevent online browsing. */ }
}
