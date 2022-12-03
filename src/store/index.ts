import { atom } from "recoil";
import { darkModeState, darkModeStateToggle } from "./DarkModeState";
import { themeSelectionState } from "./ThemeSelectionState";
import { languageSelectionState } from "./LanguageSelectionState";

export const displayLoader = atom({
  key: "displayLoader",
  default: false as boolean
});

export const displayArchiveOption = atom({
  key: "displayArchiveOption",
  default: false as boolean
});

export { darkModeState, darkModeStateToggle, themeSelectionState, languageSelectionState };
