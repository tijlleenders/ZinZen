"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const DashboardImagePanel_1 = require("@components/DasboardImagePanel/DashboardImagePanel");
const DashboardUserChoicePanel_1 = require("@components/DashboardUserChoicePanel/DashboardUserChoicePanel");
const Dashboard = () => (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
    react_1.default.createElement(react_bootstrap_1.Row, null,
        react_1.default.createElement(react_bootstrap_1.Col, { sm: 2 }),
        react_1.default.createElement(react_bootstrap_1.Col, { sm: 3 },
            react_1.default.createElement(DashboardImagePanel_1.DashboardImagePanel, null)),
        react_1.default.createElement(react_bootstrap_1.Col, { sm: 1 }),
        react_1.default.createElement(react_bootstrap_1.Col, { sm: true },
            react_1.default.createElement(DashboardUserChoicePanel_1.DashboardUserChoicePanel, null)),
        react_1.default.createElement(react_bootstrap_1.Col, { sm: 2 }))));
exports.Dashboard = Dashboard;
