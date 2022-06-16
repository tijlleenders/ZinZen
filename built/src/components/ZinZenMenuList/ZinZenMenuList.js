"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZinZenMenuList = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const recoil_1 = require("recoil");
const react_i18next_1 = require("react-i18next");
const react_router_dom_1 = require("react-router-dom");
const _store_1 = require("@store");
const _utils_1 = require("@utils");
require("@translations/i18n");
require("./ZinZenMenuList.scss");
const ZinZenMenuList = () => {
    const darkModeStatus = (0, recoil_1.useRecoilValue)(_store_1.darkModeState);
    const { t } = (0, react_i18next_1.useTranslation)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement("a", { href: "https://github.com/tijlleenders/ZinZen" },
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "brown" : "peach", size: "lg", className: darkModeStatus ? "zinzen-menu-choice-dark1" : "zinzen-menu-choice-light1" }, (0, _utils_1.truncateContent)(t("discover"))))),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement("a", { href: "https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate" },
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "dark-pink" : "pink", size: "lg", className: darkModeStatus ? "zinzen-menu-choice-dark" : "zinzen-menu-choice-light" }, (0, _utils_1.truncateContent)(t("donate"))))),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement("a", { href: "##" },
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "dark-grey" : "grey-base", size: "lg", className: darkModeStatus ? "zinzen-menu-choice-dark" : "zinzen-menu-choice-light", onClick: (e) => {
                            e.preventDefault();
                            navigate("/Home/ZinZen/Feedback");
                        } }, (0, _utils_1.truncateContent)(t("feedback"))))),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement("a", { href: "https://blog.zinzen.me/" },
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "dark-blue" : "pale-blue", size: "lg", className: darkModeStatus ? "zinzen-menu-choice-dark" : "zinzen-menu-choice-light" }, (0, _utils_1.truncateContent)(t("blog"))))))));
};
exports.ZinZenMenuList = ZinZenMenuList;
