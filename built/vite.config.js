"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const vite_1 = require("vite");
// eslint-disable-next-line import/no-extraneous-dependencies
const vite_plugin_pwa_1 = require("vite-plugin-pwa");
const tsconfig = __importStar(require("./tsconfig.paths.json"));
function readAliasFromTsConfig() {
    // eslint-disable-next-line prefer-regex-literals
    const pathReplaceRegex = new RegExp(/\/\*$/, "");
    return Object.entries(tsconfig.compilerOptions.paths).reduce((aliases, [fromPaths, toPaths]) => {
        const find = fromPaths.replace(pathReplaceRegex, "");
        const toPath = toPaths[0].replace(pathReplaceRegex, "");
        const replacement = path_1.default.resolve(__dirname, toPath);
        aliases.push({ find, replacement });
        return aliases;
    }, []);
}
exports.default = (0, vite_1.defineConfig)({
    resolve: {
        alias: readAliasFromTsConfig(),
    },
    plugins: [
        (0, vite_plugin_pwa_1.VitePWA)({
            workbox: {
                cleanupOutdatedCaches: true,
                ignoreURLParametersMatching: [],
            },
            registerType: "autoUpdate",
            strategies: "injectManifest",
            srcDir: "src/service-worker",
            filename: "service-worker.ts",
            manifest: {
                short_name: "ZinZen",
                name: "ZinZen: Deliver purpose",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
                start_url: "./",
                background_color: "#3367D6",
                display: "standalone",
                scope: "./",
                related_applications: [
                    {
                        platform: "webapp",
                        url: "https://zinzen.me/manifest.webmanifest",
                    },
                ],
                theme_color: "#3367D6",
                description: "ZinZen for purpose",
            },
            injectManifest: {},
        }),
    ],
});
