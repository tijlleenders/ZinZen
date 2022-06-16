"use strict";
// File: i18n.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.languagesAvailable = exports.i18n = void 0;
const i18next_1 = __importDefault(require("i18next"));
exports.i18n = i18next_1.default;
const react_i18next_1 = require("react-i18next");
const i18next_browser_languagedetector_1 = __importDefault(require("i18next-browser-languagedetector"));
const moment_1 = __importDefault(require("moment"));
const translation_json_1 = __importDefault(require("./en/translation.json"));
const translation_json_2 = __importDefault(require("./es/translation.json"));
const translation_json_3 = __importDefault(require("./fr/translation.json"));
const translation_json_4 = __importDefault(require("./hi/translation.json"));
const translation_json_5 = __importDefault(require("./nl/translation.json"));
const translation_json_6 = __importDefault(require("./de/translation.json"));
const translation_json_7 = __importDefault(require("./pt/translation.json"));
i18next_1.default
    .use(i18next_browser_languagedetector_1.default)
    .use(react_i18next_1.initReactI18next)
    .init({
    fallbackLng: "en",
    returnEmptyString: false,
    resources: {
        en: {
            translation: translation_json_1.default,
        },
        es: {
            translation: translation_json_2.default,
        },
        fr: {
            translation: translation_json_3.default,
        },
        hi: {
            translation: translation_json_4.default,
        },
        nl: {
            translation: translation_json_5.default,
        },
        de: {
            translation: translation_json_6.default,
        },
        pt: {
            translation: translation_json_7.default,
        },
    },
});
i18next_1.default.init({
    interpolation: {
        format(value, format) {
            if (value instanceof Date)
                return (0, moment_1.default)(value).format(format);
            if (typeof value === "number")
                return new Intl.NumberFormat().format(value);
            return value;
        },
    },
});
const languagesAvailable = ["de", "en", "es", "fr", "hi", "nl"];
exports.languagesAvailable = languagesAvailable;
