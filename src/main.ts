import { registerSW } from 'virtual:pwa-register'

if ('serviceWorker' in navigator) {
  //&& !/localhost/.test(window.location)) {
  registerSW();
}
