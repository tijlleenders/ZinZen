"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeSelectionState = void 0;
const recoil_1 = require("recoil");
exports.themeSelectionState = (0, recoil_1.atom)({
    key: "themeSelection",
    default: localStorage.getItem("theme") ? localStorage.getItem("theme") : "No theme chosen.",
});
