"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZinZenMenuPage = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const ZinZenMenuList_1 = require("@components/ZinZenMenuList/ZinZenMenuList");
const ZinZenMenuPage = () => (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
    react_1.default.createElement(react_bootstrap_1.Row, { className: "position" },
        react_1.default.createElement(react_bootstrap_1.Col, { sm: 2 }),
        react_1.default.createElement(react_bootstrap_1.Col, null,
            react_1.default.createElement(ZinZenMenuList_1.ZinZenMenuList, null)),
        react_1.default.createElement(react_bootstrap_1.Col, { sm: 2 }))));
exports.ZinZenMenuPage = ZinZenMenuPage;
