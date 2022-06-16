"use strict";
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderFAQPage = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
require("@translations/i18n");
const LogoTextLight_svg_1 = __importDefault(require("@assets/images/LogoTextLight.svg"));
const zinzenlogo_png_1 = __importDefault(require("@assets/images/zinzenlogo.png"));
require("bootstrap/dist/css/bootstrap.min.css");
require("./FAQPageUserPanel.scss");
const HeaderFAQPage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    return (react_1.default.createElement(react_bootstrap_1.Navbar, { collapseOnSelect: true, expand: "lg" },
        react_1.default.createElement("img", { role: "presentation", src: zinzenlogo_png_1.default, alt: "Text Nav", className: "zinzen-logo-nav-landing-page-query", onClick: () => {
                navigate("/");
            } }),
        react_1.default.createElement("img", { src: LogoTextLight_svg_1.default, alt: "Logo Nav", className: "zinzen-text-logo-nav-landing-page-query" })));
};
exports.HeaderFAQPage = HeaderFAQPage;
