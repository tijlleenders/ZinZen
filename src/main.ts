export default class Reg {
  constructor() {
    if ('production' !== process.env.NODE_ENV) {
      navigator.serviceWorker
        .register('sw.js', { scope: '/' })
        .then(() => {
          console.log('Service Worker Registered');
        });
    }
  }
}

new Reg();
