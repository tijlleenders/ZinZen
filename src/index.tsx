import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';

import { App } from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
);

serviceWorkerRegistration.register();
