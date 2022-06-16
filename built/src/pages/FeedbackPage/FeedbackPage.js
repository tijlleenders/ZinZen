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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackPage = void 0;
/* eslint-disable no-alert */
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_i18next_1 = require("react-i18next");
const recoil_1 = require("recoil");
const _store_1 = require("@store");
const FeedbackAPI_1 = require("@src/api/FeedbackAPI");
require("@translations/i18n");
require("./feedbackpage.scss");
const FeedbackPage = () => {
    const [userRating, setUserRating] = (0, react_1.useState)(5);
    const [userFeedback, setUserFeedback] = (0, react_1.useState)("");
    const darkModeStatus = (0, recoil_1.useRecoilValue)(_store_1.darkModeState);
    async function submitToAPI(feedback) {
        const updatedFeedback = `Rating : ${userRating}\n${feedback}`;
        const res = await (0, FeedbackAPI_1.submitFeedback)(updatedFeedback);
        if (res.status === "success") {
            alert(res.message);
            setUserFeedback("");
            setUserRating(0);
        }
        else {
            alert(res.message);
        }
    }
    const { t } = (0, react_i18next_1.useTranslation)();
    return (react_1.default.createElement("div", { id: "feedback-container" },
        react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
            userRating === 0 ? react_1.default.createElement("h1", null, "hello") : null,
            react_1.default.createElement("div", { style: { color: `${darkModeStatus ? "white" : "black"}` } },
                react_1.default.createElement("p", { id: "feedback-line-1" }, t("opinion")),
                react_1.default.createElement("h1", { id: "feedback-line-2" },
                    " ",
                    t("rate")),
                react_1.default.createElement("div", { className: "rating" }, [...Array(5).keys()].map((index) => {
                    const idx = index + 1;
                    return (react_1.default.createElement("button", { id: "userRating-btn", type: "button", key: idx, className: idx <= userRating ? "decided" : "notDecided", onClick: () => {
                            setUserRating(idx);
                        } },
                        react_1.default.createElement("span", { className: "star" }, "\u2605")));
                })),
                react_1.default.createElement("h5", { id: "feedback-line-3" }, t("experience")),
                react_1.default.createElement("textarea", { id: "feedback-textbox", value: userFeedback, onChange: (e) => {
                        setUserFeedback(e.target.value);
                    }, placeholder: t("feedbackPlaceholder") }),
                react_1.default.createElement("p", { id: "feedback-line-4" }, t("anonymousFeedback")),
                react_1.default.createElement(react_bootstrap_1.Button, { id: "feedback-submit-btn", onClick: () => {
                        submitToAPI(userFeedback);
                    } },
                    " ",
                    t("submit"))))));
};
exports.FeedbackPage = FeedbackPage;
