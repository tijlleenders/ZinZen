"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFeelingsPage = void 0;
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_i18next_1 = require("react-i18next");
const recoil_1 = require("recoil");
const react_router_dom_1 = require("react-router-dom");
const _utils_1 = require("@utils");
const _store_1 = require("@store");
const AddFeelingsChoices_1 = require("./AddFeelingsChoices");
require("@translations/i18n");
require("./AddFeelingsPage.scss");
const AddFeelingsPage = () => {
    const darkModeStatus = (0, recoil_1.useRecoilValue)(_store_1.darkModeState);
    const { t } = (0, react_i18next_1.useTranslation)();
    const location = (0, react_router_dom_1.useLocation)();
    const date = location?.state?.feelingDate !== undefined ? (0, _utils_1.getJustDate)(location?.state?.feelingDate) : (0, _utils_1.getJustDate)(new Date());
    return (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true, className: "slide add-feelings__container" },
        react_1.default.createElement(react_bootstrap_1.Row, null,
            react_1.default.createElement(react_bootstrap_1.Col, null,
                react_1.default.createElement("h3", { className: darkModeStatus ? "my-feelings-font-dark" : "my-feelings-font-light" }, date.getTime() === (0, _utils_1.getJustDate)(new Date()).getTime()
                    ? t("feelingsmessage")
                    : `${t("feelingsMessagePast")} ${date.toDateString()}`),
                react_1.default.createElement(AddFeelingsChoices_1.AddFeelingsChoices, { date: date })),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 1 }))));
};
exports.AddFeelingsPage = AddFeelingsPage;
