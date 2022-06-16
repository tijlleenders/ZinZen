"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleSwitch = void 0;
const react_1 = __importDefault(require("react"));
require("./ToggleSwitch.scss");
const ToggleSwitch = ({ label }) => (react_1.default.createElement("div", { className: "container" },
    label,
    " ",
    react_1.default.createElement("div", { className: "toggle-switch" },
        react_1.default.createElement("input", { type: "checkbox", className: "checkbox", name: label, id: label }),
        react_1.default.createElement("label", { className: "label", htmlFor: label },
            react_1.default.createElement("span", { className: "inner" }),
            react_1.default.createElement("span", { className: "switch" })))));
exports.ToggleSwitch = ToggleSwitch;
