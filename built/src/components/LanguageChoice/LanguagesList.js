"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguagesList = void 0;
const react_1 = __importDefault(require("react"));
const LangItem_1 = require("@components/LanguageChoice/LangItem");
const LanguagesList = (props) => {
    const { languages } = props;
    return (react_1.default.createElement("div", { className: "containerLang" }, languages.map((lang) => (react_1.default.createElement(LangItem_1.LangItem, { key: String(lang.sno), lang: lang })))));
};
exports.LanguagesList = LanguagesList;
