"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFeelingsChoices = void 0;
const react_1 = __importDefault(require("react"));
const FeelingsList_1 = require("@consts/FeelingsList");
const AddFeelingTemplate_1 = require("./AddFeelingTemplate");
const AddFeelingsChoices = ({ date }) => (react_1.default.createElement("div", null, FeelingsList_1.feelingsCategories.map((feelingCategory) => (react_1.default.createElement(AddFeelingTemplate_1.FeelingTemplate, { key: feelingCategory, feelingCategory: feelingCategory, feelingsList: FeelingsList_1.feelingsList[feelingCategory], feelingDate: date })))));
exports.AddFeelingsChoices = AddFeelingsChoices;
