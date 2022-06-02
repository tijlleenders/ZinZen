import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';

import { App } from './App';

import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('../service-worker.js')
    .then((registration) => {
      console.log('Registration successful, scope is:', registration.scope);
    })
    .catch((err) => {
      console.log('Service worker registration failed, error:', err);
    });
}
