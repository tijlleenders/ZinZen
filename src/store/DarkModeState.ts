import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { atom } from "recoil";

export const getDarkModeValue = () => {
  const mode = localStorage.getItem(LocalStorageKeys.DARK_MODE);
  if (mode && (mode === "on" || mode === "off")) {
    return mode;
  }
  return "on";
};
export const darkModeState = atom({
  key: "darkModeState",
  default: getDarkModeValue() === "on",
});
