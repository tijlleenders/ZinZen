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
  '/QueryZinZen',
  '/ZinZenFAQ',
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

self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(caches.open(cacheName1).then((cache) => {
      return fetch(e.request.url).then((fetchedResponse) => {
        cache.put(e.request, fetchedResponse.clone());
        return fetchedResponse;
      }).catch(() => {
        return cache.match(e.request.url);
      });
    }));
  } else {
    return 'error';
  }
});

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);
