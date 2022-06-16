"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingContainer = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const LandingLeftPanel_1 = require("./LandingLeftPanel");
const LandingMiddlePanel_1 = require("./LandingMiddlePanel");
const LandingRightPanel_1 = require("./LandingRightPanel");
const LandingContainer = () => (react_1.default.createElement("div", { className: "h-100 d-inline-block" },
    react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
        react_1.default.createElement(react_bootstrap_1.Row, null,
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 1 }),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: true },
                react_1.default.createElement(LandingLeftPanel_1.LandingLeftPanel, null)),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: true },
                react_1.default.createElement(LandingMiddlePanel_1.LandingMiddlePanel, null)),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: true },
                react_1.default.createElement(LandingRightPanel_1.LandingRightPanel, null)),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 1 })))));
exports.LandingContainer = LandingContainer;
