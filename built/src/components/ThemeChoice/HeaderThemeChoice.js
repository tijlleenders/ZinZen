"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderThemeChoice = void 0;
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const LogoTextLight_svg_1 = __importDefault(require("@assets/images/LogoTextLight.svg"));
const zinzenlogo_png_1 = __importDefault(require("@assets/images/zinzenlogo.png"));
require("./ThemeChoice.scss");
const HeaderThemeChoice = () => (react_1.default.createElement(react_bootstrap_1.Navbar, { collapseOnSelect: true, expand: "lg" },
    react_1.default.createElement("img", { src: zinzenlogo_png_1.default, alt: "Text Nav", className: "zinzen-logo-nav-theme-choice" }),
    react_1.default.createElement("img", { src: LogoTextLight_svg_1.default, alt: "Logo Nav", className: "zinzen-text-logo-nav-theme-choice" })));
exports.HeaderThemeChoice = HeaderThemeChoice;
