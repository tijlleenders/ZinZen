const CacheName = 'v2';

self.addEventListener('install', (e) => {
  console.log('Service Worker : installed');
});

self.addEventListener('activate', e => {
  console.log('service worker: Activated');
  e.waitUntil(
    caches.keys().then(CacheNames => {
      return Promise.all(
        CacheNames.map(cache => {
          if (cache !== CacheName) {
            console.log('serviceW : clearing old cache');
            return caches.delete(cache);
          }

        })
      );
    })
  );
});

self.addEventListener('fetch', e => {
  console.log('service worker: fetching');
  e.respondWith(
    fetch(e.request)
    .then(res => {
      const resClone = res.clone();
      caches
      .open(CacheName)
      .then(cache => {
        cache.put(e.request, );
      });
      return res;
    }).catch(err => caches.match(e.request).then(res => res))
  );
});
