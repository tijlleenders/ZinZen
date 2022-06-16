"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplorePage = void 0;
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const recoil_1 = require("recoil");
const react_i18next_1 = require("react-i18next");
const health_fitness_goals_jpg_1 = __importDefault(require("@assets/images/health-fitness-goals.jpg"));
const career_goals_jpg_1 = __importDefault(require("@assets/images/career-goals.jpg"));
const mind_spirit_goals_jpg_1 = __importDefault(require("@assets/images/mind-spirit-goals.jpg"));
const nature_environment_goals_jpeg_1 = __importDefault(require("@assets/images/nature-environment-goals.jpeg"));
const personalGrowth_goals_jpg_1 = __importDefault(require("@assets/images/personalGrowth-goals.jpg"));
const relationship_goals_jpg_1 = __importDefault(require("@assets/images/relationship-goals.jpg"));
const store_1 = require("@src/store");
require("@translations/i18n");
require("./explorepage.scss");
const ExplorePage = () => {
    const darkModeStatus = (0, recoil_1.useRecoilValue)(store_1.darkModeState);
    const goals = [
        { goalName: "healthGoals", goalImage: health_fitness_goals_jpg_1.default },
        { goalName: "relationshipGoals", goalImage: relationship_goals_jpg_1.default },
        { goalName: "spiritualGoals", goalImage: mind_spirit_goals_jpg_1.default },
        { goalName: "careerGoals", goalImage: career_goals_jpg_1.default },
        { goalName: "environmentGoals", goalImage: nature_environment_goals_jpeg_1.default },
        { goalName: "personalGrowthGoals", goalImage: personalGrowth_goals_jpg_1.default },
    ];
    const { t } = (0, react_i18next_1.useTranslation)();
    return (react_1.default.createElement("div", { id: `explore-container-${darkModeStatus ? "dark" : "light"}` },
        react_1.default.createElement(react_bootstrap_1.Container, { fluid: true, className: "slide" },
            react_1.default.createElement("div", { id: "goals-container" }, goals.map((goal) => (react_1.default.createElement("div", { className: "goal-row" },
                react_1.default.createElement("div", { className: "goal-card" },
                    react_1.default.createElement("img", { className: "goal-img", alt: "my-goals", src: goal.goalImage }),
                    react_1.default.createElement("div", { className: "goal-title" }, t(goal.goalName)),
                    react_1.default.createElement("h1", { className: "addGoal-btn" }, "+")))))))));
};
exports.ExplorePage = ExplorePage;
