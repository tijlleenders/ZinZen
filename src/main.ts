export default class Reg {
    constructor() {
      if ("serviceWorker" in navigator && process.env.NODE_ENV === 'production') {
        navigator.serviceWorker
          .register('./index.tsx')
          .then(function () {
            console.log("Service Worker Registered");
          });
      }
    }
  }

  new Reg();
