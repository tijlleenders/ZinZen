"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const recoil_1 = require("recoil");
const react_bootstrap_1 = require("react-bootstrap");
const _store_1 = require("@store");
const LandingPage_1 = require("@pages/LandingPage/LandingPage");
const LandingPageThemeChoice_1 = require("@pages/LandingPageThemeChoicePage/LandingPageThemeChoice");
const AddFeelingsPage_1 = require("@pages/AddFeelingsPage/AddFeelingsPage");
const HomePage_1 = require("@pages/HomePage/HomePage");
const NotFoundPage_1 = require("@pages/NotFoundPage/NotFoundPage");
const ZinZenMenuPage_1 = require("@pages/ZinZenMenuPage/ZinZenMenuPage");
const FeedbackPage_1 = require("@pages/FeedbackPage/FeedbackPage");
const ShowFeelingsPage_1 = require("@pages/ShowFeelingsPage/ShowFeelingsPage");
const ExplorePage_1 = require("@pages/ExplorePage/ExplorePage");
const MyGoalsPage_1 = require("@pages/MyGoalsPage/MyGoalsPage");
const QueryPage_1 = require("@pages/QueryPage/QueryPage");
const FAQPage_1 = require("@pages/FAQPage/FAQPage");
const HeaderDashboard_1 = require("@components/HeaderDashboard/HeaderDashboard");
require("./customize.scss");
require("./App.scss");
require("bootstrap/dist/css/bootstrap.min.css");
require("@fontsource/montserrat");
const App = () => {
    const darkModeEnabled = (0, recoil_1.useRecoilValue)(_store_1.darkModeState);
    const theme = (0, recoil_1.useRecoilValue)(_store_1.themeSelectionState);
    const isThemeChosen = theme !== "No theme chosen.";
    const language = (0, recoil_1.useRecoilValue)(_store_1.languageSelectionState);
    const isLanguageChosen = language !== "No language chosen.";
    return (react_1.default.createElement("div", { className: darkModeEnabled ? "App-dark" : "App-light" },
        react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
            isLanguageChosen && isThemeChosen && (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
                react_1.default.createElement(react_bootstrap_1.Row, null,
                    react_1.default.createElement(HeaderDashboard_1.HeaderDashboard, null)))),
            react_1.default.createElement(react_router_dom_1.Routes, null,
                !isLanguageChosen ? (react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement(LandingPage_1.LandingPage, null) })) : !isThemeChosen ? (react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement(LandingPageThemeChoice_1.LandingPageThemeChoice, null) })) : (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(react_router_dom_1.Route, { path: "/Home", element: react_1.default.createElement(HomePage_1.HomePage, null) }),
                    react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement(HomePage_1.HomePage, null) }))),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/Home/AddFeelings", element: react_1.default.createElement(AddFeelingsPage_1.AddFeelingsPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/Home/Explore", element: react_1.default.createElement(ExplorePage_1.ExplorePage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/Home/ZinZen", element: react_1.default.createElement(ZinZenMenuPage_1.ZinZenMenuPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/Home/ZinZen/Feedback", element: react_1.default.createElement(FeedbackPage_1.FeedbackPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/Home/MyGoals", element: react_1.default.createElement(MyGoalsPage_1.MyGoalsPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/Home/MyFeelings", element: react_1.default.createElement(ShowFeelingsPage_1.ShowFeelingsPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "*", element: react_1.default.createElement(NotFoundPage_1.NotFoundPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/QueryZinZen", element: react_1.default.createElement(QueryPage_1.QueryPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/ZinZenFAQ", element: react_1.default.createElement(FAQPage_1.FAQPage, null) })))));
};
exports.default = App;
