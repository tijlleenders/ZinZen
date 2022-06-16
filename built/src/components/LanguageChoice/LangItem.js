"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangItem = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const recoil_1 = require("recoil");
const i18next_1 = __importDefault(require("i18next"));
const react_router_dom_1 = require("react-router-dom");
const _store_1 = require("@store");
require("./LanguageChoice.scss");
const LangItem = ({ lang }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [, setIsLanguageChosen] = (0, recoil_1.useRecoilState)(_store_1.languageSelectionState);
    const remainder = Number(lang.sno) % 4;
    const handleClick = (langId) => {
        setIsLanguageChosen(langId);
        i18next_1.default.changeLanguage(langId);
        localStorage.setItem("language", JSON.stringify(langId));
        navigate("/");
    };
    return (react_1.default.createElement("div", { className: "containerLang" }, remainder === 1 ? (react_1.default.createElement(react_bootstrap_1.Button, { variant: "peach", size: "lg", className: "lang-btn1", onClick: () => {
            handleClick(lang.langId);
        } }, lang.title)) : remainder === 2 ? (react_1.default.createElement(react_bootstrap_1.Button, { variant: "dark-pink", size: "lg", className: "lang-btn1", onClick: () => {
            handleClick(lang.langId);
        } }, lang.title)) : remainder === 3 ? (react_1.default.createElement(react_bootstrap_1.Button, { variant: "grey-base", size: "lg", className: "lang-btn2", onClick: () => {
            handleClick(lang.langId);
        } }, lang.title)) : (react_1.default.createElement(react_bootstrap_1.Button, { variant: "pale-blue", size: "lg", className: "lang-btn2", onClick: () => {
            handleClick(lang.langId);
        } }, lang.title))));
};
exports.LangItem = LangItem;
