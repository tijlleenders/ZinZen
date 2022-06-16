"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQPage = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const HeaderFAQPage_1 = require("@components/FAQPageUserPanel/HeaderFAQPage");
const FAQPageUserPanel_1 = require("@components/FAQPageUserPanel/FAQPageUserPanel");
const FAQPage = () => (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
    react_1.default.createElement(react_bootstrap_1.Row, null,
        react_1.default.createElement(HeaderFAQPage_1.HeaderFAQPage, null)),
    react_1.default.createElement(react_bootstrap_1.Row, null,
        react_1.default.createElement(react_bootstrap_1.Col, { sm: 1 }),
        react_1.default.createElement(react_bootstrap_1.Col, { sm: true },
            react_1.default.createElement(FAQPageUserPanel_1.FAQPageUserPanel, null)),
        react_1.default.createElement(react_bootstrap_1.Col, { sm: 1 }))));
exports.FAQPage = FAQPage;
