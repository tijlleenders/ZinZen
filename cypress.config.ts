import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://zinzen.vercel.app/",
    chromeWebSecurity: false,
    specPattern: "**/*.spec.ts",
  },
});
