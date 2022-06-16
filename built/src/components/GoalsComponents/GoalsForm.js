"use strict";
// @ts-nocheck
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalsForm = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const recoil_1 = require("recoil");
const react_i18next_1 = require("react-i18next");
const _store_1 = require("@store");
require("@translations/i18n");
require("./GoalsComponents.scss");
const GoalsForm = () => {
    const darkModeStatus = (0, recoil_1.useRecoilValue)(_store_1.darkModeState);
    const darkrooms = ["#443027", "#9C4663", "#646464", "#2B517B", " #612854"];
    const lightcolors = [" #EDC7B7", "#AC3B61", " #BAB2BC", " #3B6899", " #8E3379"];
    const { t } = (0, react_i18next_1.useTranslation)();
    const [selectedColorIndex, setColorIndex] = (0, react_1.useState)(0);
    const [tableData, setTableData] = (0, react_1.useState)([]);
    const [formInputData, setFormInputData] = (0, react_1.useState)({
        inputGoal: "",
        id: "",
    });
    const handleChange = (e) => {
        const { value } = e.target;
        const idNum = crypto.randomUUID();
        setFormInputData({
            ...formInputData,
            id: idNum,
            [e.target.name]: value,
        });
    };
    const handleSubmit = (e) => {
        if (formInputData.inputGoal) {
            const newData = (data) => [...data, formInputData];
            setTableData(newData);
        }
        setFormInputData({
            inputGoal: "",
            id: "",
        });
        e.preventDefault();
    };
    const removeItem = () => {
        setTableData([]);
    };
    function suggestion() {
        if (formInputData.inputGoal.indexOf("daily") !== -1) {
            return "daily";
        }
        return "";
    }
    function duration() {
        const tracker = /(1[0-9]|2[0-4]|[1-9])+(h)/;
        const checkGoal = parseInt(formInputData.inputGoal.match(tracker), 10);
        const parseGoal = parseInt(formInputData.inputGoal.match(tracker), 10) <= 24;
        if (formInputData.inputGoal.search(tracker) !== -1 && parseGoal) {
            return `${checkGoal} hours`;
        }
        return "";
    }
    const changeColor = () => {
        const newColorIndex = selectedColorIndex + 1;
        if (darkrooms[newColorIndex])
            setColorIndex(newColorIndex);
        else
            setColorIndex(0);
    };
    return (react_1.default.createElement("form", { className: "todo-form", onSubmit: handleSubmit },
        react_1.default.createElement("div", null,
            react_1.default.createElement("input", { style: darkModeStatus
                    ? { backgroundColor: darkrooms[selectedColorIndex] }
                    : { backgroundColor: lightcolors[selectedColorIndex] }, className: darkModeStatus ? "addtask-dark" : "addtask-light", type: "text", name: "inputGoal", placeholder: t("addGoalPlaceholder"), value: formInputData.inputGoal, onChange: handleChange })),
        react_1.default.createElement("div", { className: "duration" },
            react_1.default.createElement("button", { type: "button", style: darkModeStatus
                    ? { backgroundColor: darkrooms[selectedColorIndex] }
                    : { backgroundColor: lightcolors[selectedColorIndex] }, className: duration() !== "" ? "duration" : "blank" }, duration()),
            react_1.default.createElement("button", { type: "button", style: darkModeStatus
                    ? { backgroundColor: darkrooms[selectedColorIndex] }
                    : { backgroundColor: lightcolors[selectedColorIndex] }, className: suggestion() === "daily" ? "suggestion" : "blank" }, suggestion())),
        react_1.default.createElement("div", { className: darkModeStatus ? "mygoalsbutton-dark" : "mygoalsbutton-light" },
            react_1.default.createElement(react_bootstrap_1.Button, { variant: darkModeStatus ? "pink" : "peach", onClick: handleSubmit, className: "addtask-button" }, "Add Task"),
            react_1.default.createElement("div", { className: "changeColor" },
                react_1.default.createElement("button", { type: "button", className: "color-button", style: darkModeStatus
                        ? { backgroundColor: darkrooms[selectedColorIndex] }
                        : { backgroundColor: lightcolors[selectedColorIndex] }, onClick: changeColor }, "Change color"))),
        react_1.default.createElement("div", { className: "inputs" }, tableData.map((data, index) => (react_1.default.createElement("div", { key: crypto.randomUUID(), style: darkModeStatus ? { backgroundColor: darkrooms[index % 5] } : { backgroundColor: lightcolors[index % 5] }, className: darkModeStatus ? "addtask-dark" : "addtask-light" },
            react_1.default.createElement("div", { role: "button", tabIndex: 0, className: darkModeStatus ? "deletetodo-dark" : "deletetodo-light", "aria-label": "Remove Item", onClick: removeItem, onKeyDown: removeItem }),
            react_1.default.createElement("div", { className: "input-goal" }, data.inputGoal)))))));
};
exports.GoalsForm = GoalsForm;
