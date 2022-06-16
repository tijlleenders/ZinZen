"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const Dashboard_1 = require("@pages/Dashboard/Dashboard");
const HomePage = () => (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
    react_1.default.createElement(react_bootstrap_1.Row, null,
        react_1.default.createElement(Dashboard_1.Dashboard, null))));
exports.HomePage = HomePage;
