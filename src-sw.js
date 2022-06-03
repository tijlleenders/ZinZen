importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

console.log('service worker customized');

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
