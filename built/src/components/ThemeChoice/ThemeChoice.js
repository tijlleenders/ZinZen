"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeChoice = void 0;
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const recoil_1 = require("recoil");
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const _store_1 = require("@store");
const DashboardThemeDark_svg_1 = __importDefault(require("@assets/images/DashboardThemeDark.svg"));
const DashboardThemeLight_svg_1 = __importDefault(require("@assets/images/DashboardThemeLight.svg"));
require("./ThemeChoice.scss");
const ThemeChoice = () => {
    const [, setIsThemeChosen] = (0, recoil_1.useRecoilState)(_store_1.themeSelectionState);
    const [, setDarkModeStatus] = (0, recoil_1.useRecoilState)(_store_1.darkModeState);
    const navigate = (0, react_router_dom_1.useNavigate)();
    return (react_1.default.createElement("div", { className: "themerow" },
        react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", size: "lg", className: "theme-choice-btn", onClick: () => {
                setIsThemeChosen(true);
                localStorage.setItem("theme", "light");
                navigate("/QueryZinZen");
            } },
            react_1.default.createElement("img", { src: DashboardThemeLight_svg_1.default, alt: "Light Theme", className: "themechoice" })),
        react_1.default.createElement("br", null),
        react_1.default.createElement("br", null),
        react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", size: "lg", className: "theme-choice-btn", onClick: () => {
                setIsThemeChosen(true);
                localStorage.setItem("theme", "dark");
                navigate("/QueryZinZen");
                setDarkModeStatus(true);
            } },
            react_1.default.createElement("img", { src: DashboardThemeDark_svg_1.default, alt: "Dark Theme", className: "themechoice" }))));
};
exports.ThemeChoice = ThemeChoice;
