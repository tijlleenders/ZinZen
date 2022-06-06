import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

const cacheName = 'v1';
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request)
    .then(res => {
      const resClone = res.clone();
      caches
        .open(cacheName)
        .then(cache => {
          cache.put(e.request, resClone);
        });
      return res;
    }).catch(err => caches.match(e.request).then(res => res)));
});
precacheAndRoute(self.__WB_MANIFEST);
