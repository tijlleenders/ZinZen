"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageSelectionState = void 0;
const recoil_1 = require("recoil");
exports.languageSelectionState = (0, recoil_1.atom)({
    key: "keyModalState",
    default: localStorage.getItem("language") ? localStorage.getItem("language") : "No language chosen.",
});
