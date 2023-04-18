import { atom } from "recoil";

export const themeSelectionState = atom({
  key: "themeSelection",
  default: localStorage.getItem("theme") ? localStorage.getItem("theme") : "light",
});
