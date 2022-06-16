"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingMiddlePanel = void 0;
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const bookicon_svg_1 = __importDefault(require("@assets/images/bookicon.svg"));
require("./LandingComponents.scss");
const LandingMiddlePanel = () => (react_1.default.createElement("div", null,
    react_1.default.createElement("img", { src: bookicon_svg_1.default, alt: "Book Icon", className: "book-icon-landing-page" })));
exports.LandingMiddlePanel = LandingMiddlePanel;
