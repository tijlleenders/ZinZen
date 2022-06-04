export default class Reg {
  constructor() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('sw.js', { scope: '/' })
        .then(() => {
          console.log('Service Worker Registered');
        });
    }
  }
}

new Reg();
