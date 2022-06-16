"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryPage = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const HeaderDashboard_1 = require("@components/HeaderDashboard/HeaderDashboard");
const QueryPageUserChoicePanel_1 = require("@components/QueryPageUserChoicePanel/QueryPageUserChoicePanel");
const QueryPage = () => (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
    react_1.default.createElement(react_bootstrap_1.Row, null,
        react_1.default.createElement(HeaderDashboard_1.HeaderDashboard, null)),
    react_1.default.createElement(react_bootstrap_1.Row, null,
        react_1.default.createElement(react_bootstrap_1.Col, { sm: 1 }),
        react_1.default.createElement(react_bootstrap_1.Col, { sm: true },
            react_1.default.createElement(QueryPageUserChoicePanel_1.QueryPageUserChoicePanel, null)),
        react_1.default.createElement(react_bootstrap_1.Col, { sm: 1 }))));
exports.QueryPage = QueryPage;
