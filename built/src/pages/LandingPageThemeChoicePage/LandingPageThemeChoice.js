"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingPageThemeChoice = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_i18next_1 = require("react-i18next");
const ThemeChoice_1 = require("@components/ThemeChoice/ThemeChoice");
const HeaderThemeChoice_1 = require("@components/ThemeChoice/HeaderThemeChoice");
require("@translations/i18n");
require("@components/ThemeChoice/ThemeChoice.scss");
const LandingPageThemeChoice = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement(HeaderThemeChoice_1.HeaderThemeChoice, null)),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement(react_bootstrap_1.Col, { sm: 1 }),
                react_1.default.createElement(react_bootstrap_1.Col, null,
                    react_1.default.createElement("h3", { className: "theme-choice-panel-font" }, t("themechoice")),
                    react_1.default.createElement(ThemeChoice_1.ThemeChoice, null)),
                react_1.default.createElement(react_bootstrap_1.Col, { sm: 1 })))));
};
exports.LandingPageThemeChoice = LandingPageThemeChoice;
