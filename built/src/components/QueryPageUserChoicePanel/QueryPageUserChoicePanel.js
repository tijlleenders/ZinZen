"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryPageUserChoicePanel = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const recoil_1 = require("recoil");
const react_i18next_1 = require("react-i18next");
const react_router_dom_1 = require("react-router-dom");
const _store_1 = require("@store");
require("@translations/i18n");
require("./QueryPageUserChoicePanel.scss");
const QueryPageUserChoicePanel = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const darkModeStatus = (0, recoil_1.useRecoilValue)(_store_1.darkModeState);
    return (react_1.default.createElement("div", { className: "slide" },
        react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement("h4", { className: "left-panel-font1-query" }, "Realize dreams"),
                react_1.default.createElement("h4", { className: "left-panel-font2-query" },
                    react_1.default.createElement("i", null, "together"))),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "brown" : "peach", size: "lg", className: darkModeStatus ? "query-choice-dark1" : "query-choice-light1", onClick: () => {
                        navigate("/ZinZenFAQ");
                    } }, t("ihavequestions")),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "brown" : "peach", size: "lg", className: darkModeStatus ? "query-choice-dark" : "query-choice-light", onClick: () => {
                        navigate("/Home");
                    } }, t("ialreadyknowZinZen"))))));
};
exports.QueryPageUserChoicePanel = QueryPageUserChoicePanel;
