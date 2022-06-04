export default class Reg {
    constructor() {
      if ("serviceWorker" in navigator && process.env.NODE_ENV === 'production') {
        navigator.serviceWorker
          .register("https://zinzen-fxi1r4z2d-tijlleenders.vercel.app/sw.js", { scope: "./" })
          .then(function () {
            console.log("Service Worker Registered");
          });
      }
    }
  }

  new Reg();
