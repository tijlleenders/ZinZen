importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

console.log('service worker customized');

workbox.routing.registerRoute(
  new RegExp('https://zinzen-qqu97eop7-tijlleenders.vercel.app/Home/MyGoals'),
  workbox.strategies.cacheFirst(),
);
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
