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
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const recoil_1 = require("recoil");
const react_2 = require("@testing-library/react");
const api = __importStar(require("@api/FeedbackAPI"));
const FeedbackPage_1 = require("@pages/FeedbackPage/FeedbackPage");
const globals_1 = require("@jest/globals");
global.alert = jest.fn();
global.fetch = jest.fn(() => {
    Promise.resolve({
        json: () => Promise.resolve({
            status: "success",
            message: "Thank you so much for your feedback!",
        }),
    });
});
beforeEach(() => {
    fetch.mockClear();
});
describe("Feedback Page", () => {
    it("submitFeedback API success flow", async () => {
        const res = await api.submitFeedback("this is a jest call");
        (0, globals_1.expect)(res.status).toEqual("success");
    });
    it("submitFeedback API failure flow", async () => {
        fetch.mockImplementationOnce(() => Promise.reject(new Error("Api error")));
        const res = await api.submitFeedback("this is a jest call");
        (0, globals_1.expect)(res.status).toEqual("error");
    });
    it("Feedback Page success flow  ", async () => {
        const { findAllByText, getByText } = (0, react_2.render)(react_1.default.createElement(recoil_1.RecoilRoot, null,
            react_1.default.createElement(FeedbackPage_1.FeedbackPage, null)));
        const button = getByText("submit");
        react_2.fireEvent.click(button);
        await (0, react_2.act)(async () => (0, react_2.render)(react_1.default.createElement(recoil_1.RecoilRoot, null,
            react_1.default.createElement(FeedbackPage_1.FeedbackPage, null))));
        (0, globals_1.expect)(fetch).toHaveBeenCalledTimes(1);
        (0, globals_1.expect)(global.alert).toHaveBeenCalledTimes(1);
        const boxes = await findAllByText("★");
        (0, globals_1.expect)(boxes[0].parentElement).toHaveClass("notDecided");
    });
    it("Feedback Page Failure flow  ", async () => {
        fetch.mockImplementationOnce(() => Promise.reject(new Error("Api error")));
        const { findAllByText, getByText } = (0, react_2.render)(react_1.default.createElement(recoil_1.RecoilRoot, null,
            react_1.default.createElement(FeedbackPage_1.FeedbackPage, null)));
        const button = getByText("submit");
        react_2.fireEvent.click(button);
        (0, globals_1.expect)(fetch).toHaveBeenCalledTimes(1);
        (0, globals_1.expect)(global.alert).toHaveBeenCalledTimes(1);
        const boxes = await findAllByText("★");
        (0, globals_1.expect)(boxes[0].parentElement).toHaveClass("decided");
    });
});
