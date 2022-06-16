"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardImagePanel = void 0;
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const bookicon_svg_1 = __importDefault(require("@assets/images/bookicon.svg"));
require("./DashboardImagePanel.scss");
const DashboardImagePanel = () => react_1.default.createElement("img", { src: bookicon_svg_1.default, alt: "Book Icon", className: "book-icon-dashboard" });
exports.DashboardImagePanel = DashboardImagePanel;
