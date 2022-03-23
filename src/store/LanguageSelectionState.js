import { atom } from "recoil";

export const languageSelectionState = atom({
    key: "keyModalState",
    default: localStorage.getItem("language")
        ? localStorage.getItem("language")
        : "No language chosen.",
});
