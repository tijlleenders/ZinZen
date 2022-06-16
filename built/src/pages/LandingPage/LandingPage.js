"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingPage = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const LandingContainer_1 = require("@components/LandingComponents/LandingContainer");
const MobileHeader_1 = require("@components/LandingComponents/MobileHeader");
require("@components/LandingComponents/LandingComponents.scss");
require("bootstrap/dist/css/bootstrap.min.css");
require("./LandingPage.scss");
const LandingPage = () => (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true, className: "landing-page__container" },
    react_1.default.createElement(react_bootstrap_1.Row, null,
        react_1.default.createElement(MobileHeader_1.MobileHeader, null)),
    react_1.default.createElement(react_bootstrap_1.Row, null,
        react_1.default.createElement(LandingContainer_1.LandingContainer, null))));
exports.LandingPage = LandingPage;
