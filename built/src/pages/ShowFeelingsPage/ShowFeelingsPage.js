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
exports.ShowFeelingsPage = void 0;
// @ts-nocheck
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const recoil_1 = require("recoil");
const react_i18next_1 = require("react-i18next");
const react_router_1 = require("react-router");
const FeelingsAPI_1 = require("@api/FeelingsAPI");
const _store_1 = require("@store");
const _utils_1 = require("@utils");
const GoalsAddIcon_svg_1 = __importDefault(require("@assets/images/GoalsAddIcon.svg"));
const ShowFeelingTemplate_1 = require("./ShowFeelingTemplate");
require("./ShowFeelingsPage.scss");
require("./ShowFeelings.scss");
const ShowFeelingsPage = () => {
    const darkModeStatus = (0, recoil_1.useRecoilValue)(_store_1.darkModeState);
    const { t } = (0, react_i18next_1.useTranslation)();
    const navigate = (0, react_router_1.useNavigate)();
    const [feelingsList, setFeelingsList] = (0, react_1.useState)([]);
    const [selectedFeeling, setSelectedFeeling] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        const getData = async () => {
            const allFeelings = await (0, FeelingsAPI_1.getAllFeelings)();
            const feelingsByDates = allFeelings.reduce((dates, feeling) => {
                if (dates[feeling.date]) {
                    dates[feeling.date].push(feeling);
                }
                else {
                    // eslint-disable-next-line no-param-reassign
                    dates[feeling.date] = [feeling];
                }
                return dates;
            }, {});
            setFeelingsList(feelingsByDates);
        };
        getData();
    }, []);
    const dateArr = Object.keys(feelingsList).map((date) => date);
    const dateRangeArr = (0, _utils_1.getDates)(new Date(dateArr[0]), new Date()).reverse();
    (0, react_1.useEffect)(() => {
        async function getFeelings() {
            // Highly inefficient way to achive this, will replace this with a boolean function of
            // "Is Feelings Collection empty?" later
            const feelingsArr = await (0, FeelingsAPI_1.getAllFeelings)();
            return feelingsArr;
        }
        getFeelings().then((feelingsArr) => {
            const timer1 = setTimeout(() => {
                if (feelingsArr.length === 0) {
                    navigate("/Home/AddFeelings", {
                        state: { feelingDate: new Date() },
                    });
                }
            }, 500);
            return () => {
                clearTimeout(timer1);
            };
        });
    }, []);
    return (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true, className: "slide show-feelings__container" },
        react_1.default.createElement(react_bootstrap_1.Row, null,
            react_1.default.createElement(react_bootstrap_1.Col, null,
                react_1.default.createElement("h3", { className: darkModeStatus ? "my-feelings-font-dark" : "my-feelings-font-light" }, t("showfeelingsmessage")),
                feelingsList !== null &&
                    dateRangeArr.map((date) => (react_1.default.createElement("div", { key: date, className: "show-feelings__list-category" },
                        react_1.default.createElement("h3", { className: darkModeStatus ? "my-feelings-font-dark" : "my-feelings-font-light" },
                            react_1.default.createElement("span", { role: "button", tabIndex: 0, onClick: () => {
                                    navigate("/Home/AddFeelings", {
                                        state: { feelingDate: new Date(date) },
                                    });
                                }, onKeyDown: () => {
                                    navigate("/Home/AddFeelings", {
                                        state: { feelingDate: new Date(date) },
                                    });
                                }, style: { cursor: "pointer" } }, new Date(date).toDateString() === new Date().toDateString()
                                ? "Today"
                                : new Date(date).toDateString())),
                        feelingsList[date] ? (react_1.default.createElement(ShowFeelingTemplate_1.ShowFeelingTemplate, { key: date, feelingsListObject: feelingsList[date], setFeelingsListObject: { feelingsList, setFeelingsList }, currentFeelingsList: feelingsList, handleFocus: { selectedFeeling, setSelectedFeeling } })) : (react_1.default.createElement("input", { type: "image", tabIndex: 0, key: date, src: GoalsAddIcon_svg_1.default, alt: "add-goal", style: { margin: "5px 0 0 30px", height: "30px", width: "30px" }, onClick: () => {
                                navigate("/Home/AddFeelings", {
                                    state: { feelingDate: new Date(date) },
                                });
                            }, onKeyDown: () => {
                                navigate("/Home/AddFeelings", {
                                    state: { feelingDate: new Date(date) },
                                });
                            } })))))))));
};
exports.ShowFeelingsPage = ShowFeelingsPage;
