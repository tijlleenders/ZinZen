"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderDashboard = void 0;
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const recoil_1 = require("recoil");
const react_dark_mode_toggle_1 = __importDefault(require("react-dark-mode-toggle"));
const react_router_dom_1 = require("react-router-dom");
const _store_1 = require("@store");
const LogoTextLight_svg_1 = __importDefault(require("@assets/images/LogoTextLight.svg"));
const LogoTextDark_svg_1 = __importDefault(require("@assets/images/LogoTextDark.svg"));
const zinzenlogo_png_1 = __importDefault(require("@assets/images/zinzenlogo.png"));
require("@translations/i18n");
require("./HeaderDashboard.scss");
const HeaderDashboard = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [darkModeStatus, setDarkModeStatus] = (0, recoil_1.useRecoilState)(_store_1.darkModeState);
    const toggleTheme = () => {
        setDarkModeStatus(!darkModeStatus);
        if (darkModeStatus) {
            localStorage.setItem("theme", "light");
        }
        else {
            localStorage.setItem("theme", "dark");
        }
    };
    return (react_1.default.createElement("div", { className: darkModeStatus ? "positioning-dark" : "positioning-light" },
        react_1.default.createElement(react_bootstrap_1.Navbar, { collapseOnSelect: true, expand: "lg" },
            react_1.default.createElement("img", { role: "presentation", src: zinzenlogo_png_1.default, alt: "ZinZen Logo", className: "zinzen-logo-nav-dashboard", onClick: () => {
                    navigate("/Home");
                } }),
            darkModeStatus ? (react_1.default.createElement("img", { role: "presentation", src: LogoTextDark_svg_1.default, alt: "ZinZen Text Logo", className: "zinzen-text-logo-nav-dashboard", onClick: () => {
                    navigate("/Home");
                } })) : (react_1.default.createElement("img", { role: "presentation", src: LogoTextLight_svg_1.default, alt: "ZinZen Text Logo", className: "zinzen-text-logo-nav-dashboard", onClick: () => {
                    navigate("/Home");
                } })),
            react_1.default.createElement(react_bootstrap_1.Navbar.Collapse, { id: "responsive-navbar-nav" },
                react_1.default.createElement(react_bootstrap_1.Nav, { className: "navbar-custom" })),
            react_1.default.createElement(react_dark_mode_toggle_1.default, { onChange: toggleTheme, checked: darkModeStatus, size: 60, className: "dark-mode-toggle" }))));
};
exports.HeaderDashboard = HeaderDashboard;
