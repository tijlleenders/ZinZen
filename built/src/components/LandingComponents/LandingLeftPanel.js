"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingLeftPanel = void 0;
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const LogoTextLight_svg_1 = __importDefault(require("@assets/images/LogoTextLight.svg"));
const zinzenlogo_png_1 = __importDefault(require("@assets/images/zinzenlogo.png"));
require("./LandingComponents.scss");
const LandingLeftPanel = () => (react_1.default.createElement("div", { className: "left-panel" },
    react_1.default.createElement("img", { src: zinzenlogo_png_1.default, alt: "ZinZen Logo", className: "zinzen-logo-landing-page" }),
    react_1.default.createElement("img", { src: LogoTextLight_svg_1.default, alt: "ZinZen Text Logo", className: "zinzen-text-logo-landing-page" }),
    react_1.default.createElement("h4", { className: "left-panel-font1" }, "Realize dreams"),
    react_1.default.createElement("h4", { className: "left-panel-font2" },
        react_1.default.createElement("i", null, "together")),
    react_1.default.createElement("button", { className: "btn-primary-learnmore", type: "button" },
        react_1.default.createElement("span", null, "Learn More!"))));
exports.LandingLeftPanel = LandingLeftPanel;
