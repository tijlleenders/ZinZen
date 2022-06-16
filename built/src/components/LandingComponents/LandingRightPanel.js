"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingRightPanel = void 0;
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const LanguagesList_1 = require("@components/LanguageChoice/LanguagesList");
require("@translations/i18n");
require("./LandingComponents.scss");
const LandingRightPanel = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const languages = [
        {
            sno: 1,
            title: t("english"),
            langId: "en",
        },
        {
            sno: 2,
            title: t("french"),
            langId: "fr",
        },
        {
            sno: 3,
            title: t("dutch"),
            langId: "nl",
        },
        {
            sno: 4,
            title: t("hindi"),
            langId: "hi",
        },
        {
            sno: 5,
            title: t("spanish"),
            langId: "es",
        },
        {
            sno: 6,
            title: t("german"),
            langId: "de",
        },
        {
            sno: 7,
            title: t("portuguese"),
            langId: "pt",
        },
    ];
    return (react_1.default.createElement("div", { className: "right-panel" },
        react_1.default.createElement("h3", { className: "right-panel-font" }, t("langchoice")),
        react_1.default.createElement(LanguagesList_1.LanguagesList, { languages: languages })));
};
exports.LandingRightPanel = LandingRightPanel;
