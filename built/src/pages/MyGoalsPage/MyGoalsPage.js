"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyGoalsPage = void 0;
// @ts-nocheck
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_bootstrap_icons_1 = require("react-bootstrap-icons");
const GoalsAddIcon_svg_1 = __importDefault(require("@assets/images/GoalsAddIcon.svg"));
const GoalsAPI_1 = require("@api/GoalsAPI");
require("./MyGoalsPage.scss");
const MyGoalsPage = () => {
    const [tapCount, setTapCount] = (0, react_1.useState)([-1, 0]);
    const [userGoals, setUserGoals] = (0, react_1.useState)();
    let debounceTimeout;
    async function populateDummyGoals() {
        const dummyData = ["shopping karni hai", "sabji lekr kaun ayega", "padosi ke ghar se aam leke ane hai"];
        dummyData.map((goal) => (0, GoalsAPI_1.addGoal)({
            title: goal,
            duration: 2,
            sublist: ["abc", "xyz"],
            repeat: "Daily",
            start: null,
            finish: null,
        }));
    }
    async function updateUserGoals(goal, index) {
        const updatedTitle = document.querySelector(`.goal-title:nth-child(${index + 1}`)?.textContent;
        if (updatedTitle && tapCount[0] === index && updatedTitle !== goal.title) {
            await (0, GoalsAPI_1.updateGoal)(goal.id, { title: updatedTitle });
            const goals = await (0, GoalsAPI_1.getAllGoals)();
            setUserGoals(goals);
            console.log("update");
        }
    }
    async function removeUserGoal(id) {
        await (0, GoalsAPI_1.removeGoal)(id);
        const goals = await (0, GoalsAPI_1.getAllGoals)();
        setUserGoals(goals);
    }
    async function search(text) {
        const goals = await (0, GoalsAPI_1.getAllGoals)();
        setUserGoals(goals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())));
    }
    function debounceSearch(event) {
        const { value } = event.target;
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        debounceTimeout = setTimeout(() => {
            search(value);
        }, 300);
    }
    (0, react_1.useEffect)(() => {
        (async () => {
            await populateDummyGoals();
            const goals = await (0, GoalsAPI_1.getAllGoals)();
            console.log(goals);
            setUserGoals(goals);
        })();
    }, []);
    return (react_1.default.createElement("div", { id: "myGoals-container", onClickCapture: () => setTapCount([-1, 0]) },
        react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
            react_1.default.createElement("input", { id: "goal-searchBar", onClickCapture: () => setTapCount([-1, 0]), placeholder: "Search", onChange: (e) => debounceSearch(e) }),
            react_1.default.createElement("h1", { id: "myGoals_title", onClickCapture: () => setTapCount([-1, 0]) }, "My Goals"),
            react_1.default.createElement("div", { id: "myGoals-list" }, userGoals?.map((goal, index) => (react_1.default.createElement("div", { key: String(`task-${index}`), className: "user-goal", onClickCapture: () => {
                    setTapCount([index, tapCount[1] + 1]);
                } },
                react_1.default.createElement("div", { className: "goal-title", contentEditable: tapCount[0] === index && tapCount[1] >= 1, onClickCapture: () => setTapCount([index, tapCount[1] + 1]), onBlur: () => {
                        updateUserGoals(goal, index);
                    }, suppressContentEditableWarning: true }, goal.title),
                tapCount[0] === index && tapCount[1] > 0 ? (react_1.default.createElement("div", { className: "interactables" },
                    react_1.default.createElement(react_bootstrap_icons_1.PlusLg, null),
                    react_1.default.createElement(react_bootstrap_icons_1.Trash3Fill, { onClick: () => {
                            removeUserGoal(goal.id);
                        } }),
                    react_1.default.createElement(react_bootstrap_icons_1.PencilSquare, null),
                    react_1.default.createElement(react_bootstrap_icons_1.CheckLg, null))) : null)))),
            react_1.default.createElement("img", { id: "addGoal-btn", src: GoalsAddIcon_svg_1.default, alt: "add-goal" }))));
};
exports.MyGoalsPage = MyGoalsPage;
