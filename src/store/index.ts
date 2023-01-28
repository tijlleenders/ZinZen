import { atom } from "recoil";
import { darkModeState, darkModeStateToggle } from "./DarkModeState";
import { themeSelectionState } from "./ThemeSelectionState";
import { languageSelectionState } from "./LanguageSelectionState";

export const lastAction = atom({
  key: "lastAction",
  default: ""
});

export const displayLoader = atom({
  key: "displayLoader",
  default: false as boolean
});

export const displayFromOptions = atom({
  key: "displayFromOptions",
  default: { archive: false, public: false }
});

export const displayInbox = atom({
  key: "displayInbox",
  default: false as boolean
});

export const displayToast = atom({
  key: "displayToast",
  default: { open: false, message: "Awww... no hints today. We'll keep looking!", extra: "" }
});

export { darkModeState, darkModeStateToggle, themeSelectionState, languageSelectionState };
