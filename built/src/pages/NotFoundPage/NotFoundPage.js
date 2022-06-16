"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundPage = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const recoil_1 = require("recoil");
const react_router_dom_1 = require("react-router-dom");
const _store_1 = require("@store");
require("./NotFoundPage.scss");
const NotFoundPage = () => {
    const darkModeStatus = (0, recoil_1.useRecoilValue)(_store_1.darkModeState);
    const navigate = (0, react_router_dom_1.useNavigate)();
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
            react_1.default.createElement(react_bootstrap_1.Row, null),
            react_1.default.createElement(react_bootstrap_1.Row, null),
            react_1.default.createElement(react_bootstrap_1.Row, null),
            react_1.default.createElement(react_bootstrap_1.Row, null,
                react_1.default.createElement("h1", { className: "error-heading" }, "404 Error"),
                react_1.default.createElement("h3", { className: "error-text" }, "Page Not Found"),
                react_1.default.createElement(react_bootstrap_1.Col, { sm: 1 },
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "dark-pink" : "pink", size: "lg", className: darkModeStatus ? "error-btn-dark" : "error-btn-light", onClick: () => {
                            navigate("/Home");
                        } }, "Home"))))));
};
exports.NotFoundPage = NotFoundPage;
