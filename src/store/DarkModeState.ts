import { atom } from "recoil";

export const darkModeState = atom({
  key: "darkModeState",
  default: localStorage.getItem("darkMode") ? localStorage.getItem("darkMode") === "on" : false,
});
