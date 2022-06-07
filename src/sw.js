import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

const cacheName1 = 'v1';
const cacheName = 'v2';

const cacheAssets = [
  '/',
  '/Home',
  '/Home/MyGoals',
  '/Home/MyFeelings',
  '/Home/AddFeelings',
  '/Home/Explore',
  '/Home/ZinZen',
  '/Home/ZinZen/Feedback',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request)
    .then(res => {
      const resClone = res.clone();
      caches
        .open(cacheName1)
        .then(cache => {
          cache.put(e.request, resClone);
        });
      return res;
    }).catch(err => caches.match(e.request).then(res => res)));
});

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);
