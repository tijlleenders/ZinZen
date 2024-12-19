import React from "react";
import { createRoot } from "react-dom/client";
import * as serviceWorkerRegistration from "./service-worker/serviceWorkerRegistration";

import App from "./App";
import Providers from "./Providers";

// @ts-ignore
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
);

serviceWorkerRegistration.register();
