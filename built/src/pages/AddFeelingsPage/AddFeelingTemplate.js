"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeelingTemplate = void 0;
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const recoil_1 = require("recoil");
const react_i18next_1 = require("react-i18next");
const react_router_1 = require("react-router");
const FeelingsAPI_1 = require("@api/FeelingsAPI");
const _store_1 = require("@store");
const FeelingsList_1 = require("@consts/FeelingsList");
require("@translations/i18n");
require("./AddFeelingsPage.scss");
const FeelingTemplate = ({ feelingCategory, feelingsList, feelingDate, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const darkModeStatus = (0, recoil_1.useRecoilValue)(_store_1.darkModeState);
    const navigate = (0, react_router_1.useNavigate)();
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
            react_1.default.createElement("div", { className: "feelings-menu-desktop" },
                react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "brown" : "peach", size: "lg", className: "feelings-title" },
                    t(feelingCategory),
                    FeelingsList_1.feelingsEmojis[feelingCategory]),
                react_1.default.createElement("br", null),
                feelingsList.map((feelingName) => (react_1.default.createElement(react_bootstrap_1.Button, { key: feelingName, className: darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light", size: "lg", onClick: () => {
                        console.log(feelingDate);
                        (0, FeelingsAPI_1.addFeeling)(feelingName, feelingCategory, feelingDate);
                        setTimeout(() => {
                            navigate("/Home/MyFeelings");
                        }, 100);
                    } }, t(feelingName))))),
            react_1.default.createElement("div", { className: "feelings-menu-mobile" },
                react_1.default.createElement(react_bootstrap_1.Navbar, { collapseOnSelect: true, expand: "lg" },
                    react_1.default.createElement(react_bootstrap_1.Navbar.Toggle, { className: darkModeStatus ? "feelings-title-dark" : "feelings-title-light" },
                        t(feelingCategory),
                        FeelingsList_1.feelingsEmojis[feelingCategory]),
                    react_1.default.createElement(react_bootstrap_1.Navbar.Collapse, null,
                        react_1.default.createElement(react_bootstrap_1.Nav, { className: "navbar-custom" }, feelingsList.map((feelingName) => (react_1.default.createElement(react_bootstrap_1.Button, { key: feelingName, className: darkModeStatus
                                ? "btn-my-feelings-dark btn-feelings-dark"
                                : "btn-my-feelings-light btn-feelings-light", size: "lg", onClick: () => {
                                console.log(feelingDate);
                                (0, FeelingsAPI_1.addFeeling)(feelingName, feelingCategory, feelingDate);
                                setTimeout(() => {
                                    navigate("/Home/MyFeelings");
                                }, 100);
                            } }, t(feelingName)))))))))));
};
exports.FeelingTemplate = FeelingTemplate;
