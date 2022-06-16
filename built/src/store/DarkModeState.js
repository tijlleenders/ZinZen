"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.darkModeStateToggle = exports.darkModeState = void 0;
const recoil_1 = require("recoil");
exports.darkModeState = (0, recoil_1.atom)({
    key: "darkModeState",
    default: localStorage.getItem("theme") === "dark",
});
exports.darkModeStateToggle = (0, recoil_1.selector)({
    key: "darkModeStateToggle",
    get: ({ get }) => {
        get(exports.darkModeState);
    },
    set: ({ get, set }) => {
        const currentState = get(exports.darkModeState);
        set(exports.darkModeState, !currentState);
    },
});
