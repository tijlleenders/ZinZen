"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQPageUserPanel = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const recoil_1 = require("recoil");
const react_i18next_1 = require("react-i18next");
const react_router_dom_1 = require("react-router-dom");
const _store_1 = require("@store");
require("@translations/i18n");
require("./FAQPageUserPanel.scss");
const FAQPageUserPanel = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const darkModeStatus = (0, recoil_1.useRecoilValue)(_store_1.darkModeState);
    return (react_1.default.createElement("div", { className: "slide" },
        react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement("h3", { className: darkModeStatus ? "faq-question-text-dark" : "faq-question-text-light" }, t("Qwhatiszinzen")),
                react_1.default.createElement("p", { className: darkModeStatus ? "faq-answer-text-dark" : "faq-answer-text-light" }, t("AnsWhatiszinzen"))),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement("h3", { className: darkModeStatus ? "faq-question-text-dark" : "faq-question-text-light" }, t("Qiszinzenprivate")),
                react_1.default.createElement("p", { className: darkModeStatus ? "faq-answer-text-dark" : "faq-answer-text-light" }, t("Ansiszinzenprivate"))),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement("h3", { className: darkModeStatus ? "faq-question-text-dark" : "faq-question-text-light" }, t("Qiszinzenexpensive")),
                react_1.default.createElement("p", { className: darkModeStatus ? "faq-answer-text-dark" : "faq-answer-text-light" }, t("Ansiszinzenexpensive"))),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement("h3", { className: darkModeStatus ? "faq-question-text-dark" : "faq-question-text-light" }, t("Qtoogoodtobetrue")),
                react_1.default.createElement("p", { className: darkModeStatus ? "faq-answer-text-dark" : "faq-answer-text-light" }, t("Anstoogoodtobetrue"))),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "brown" : "peach", size: "lg", className: darkModeStatus ? "faq-choice-dark" : "faq-choice-light", onClick: () => {
                        navigate("/Home/ZinZen/Feedback");
                    } }, t("ihavedifferentquestions")),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "brown" : "peach", size: "lg", className: darkModeStatus ? "faq-choice-dark" : "faq-choice-light", onClick: () => {
                        navigate("/Home");
                    } }, t("ihavenomorequestions"))))));
};
exports.FAQPageUserPanel = FAQPageUserPanel;
