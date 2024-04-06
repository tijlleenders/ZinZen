import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // "https://zinzen.vercel.app/",
    chromeWebSecurity: false,
    specPattern: "cypress/**/*.spec.ts",
    testIsolation: false,
  },
});
