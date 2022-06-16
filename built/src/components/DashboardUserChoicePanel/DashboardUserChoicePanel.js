"use strict";
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardUserChoicePanel = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const recoil_1 = require("recoil");
const react_i18next_1 = require("react-i18next");
const react_router_dom_1 = require("react-router-dom");
const AddIconLight_png_1 = __importDefault(require("@assets/images/AddIconLight.png"));
const AddIconDark_png_1 = __importDefault(require("@assets/images/AddIconDark.png"));
const _store_1 = require("@store");
const _utils_1 = require("@utils");
require("@translations/i18n");
require("./DashboardUserChoicePanel.scss");
require("@pages/Dashboard/Dashboard.scss");
const DashboardUserChoicePanel = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const darkModeStatus = (0, recoil_1.useRecoilValue)(_store_1.darkModeState);
    return (react_1.default.createElement("div", { className: "slide" },
        react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "brown" : "peach", size: "lg", className: darkModeStatus ? "dashboard-choice-dark1" : "dashboard-choice-light1", onClick: () => {
                        navigate("/Home/MyGoals");
                    } }, (0, _utils_1.truncateContent)(t("mygoals"))),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "brown" : "peach", className: darkModeStatus ? "dashboard-add-btn-dark1" : "dashboard-add-btn-light1", onClick: () => {
                        navigate("/Home/MyGoals");
                    } }, darkModeStatus ? (react_1.default.createElement("img", { src: AddIconDark_png_1.default, alt: "Add Icon", className: "add-icon" })) : (react_1.default.createElement("img", { src: AddIconLight_png_1.default, alt: "Add Icon", className: "add-icon" })))),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "dark-pink" : "pink", size: "lg", className: darkModeStatus ? "dashboard-choice-dark" : "dashboard-choice-light", onClick: () => {
                        navigate("/Home/MyFeelings");
                    } }, (0, _utils_1.truncateContent)(t("myfeelings"))),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "dark-pink" : "pink", className: darkModeStatus ? "dashboard-add-btn-dark" : "dashboard-add-btn-light", onClick: () => {
                        navigate("/Home/AddFeelings");
                    } }, darkModeStatus ? (react_1.default.createElement("img", { src: AddIconDark_png_1.default, alt: "Add Icon", className: "add-icon" })) : (react_1.default.createElement("img", { src: AddIconLight_png_1.default, alt: "Add Icon", className: "add-icon" })))),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "dark-grey" : "grey-base", size: "lg", className: darkModeStatus ? "dashboard-choice-dark no-add" : "dashboard-choice-light no-add" }, (0, _utils_1.truncateContent)(t("mytime")))),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "dark-blue" : "pale-blue", size: "lg", className: darkModeStatus ? "dashboard-choice-dark no-add" : "dashboard-choice-light no-add", onClick: () => {
                        navigate("/Home/Explore");
                    } }, (0, _utils_1.truncateContent)(t("explore")))),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "dark-purple" : "purple", size: "lg", className: darkModeStatus ? "dashboard-choice-dark no-add" : "dashboard-choice-light no-add", onClick: () => {
                        navigate("/Home/ZinZen");
                    } }, (0, _utils_1.truncateContent)(t("zinzen")))))));
};
exports.DashboardUserChoicePanel = DashboardUserChoicePanel;
