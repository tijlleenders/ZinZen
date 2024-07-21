import { atom } from "recoil";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";

export const getTheme = () => {
  const x = localStorage.getItem(LocalStorageKeys.THEME);
  if (x && x.search(/^\{"light":\d,"dark":\d\}$/i) === 0) {
    return JSON.parse(x);
  }
  return { light: 1, dark: 1 };
};
export const themeState = atom({
  key: "themeState",
  default: getTheme() as { light: number; dark: number },
});

export const themeSelectionMode = atom({
  key: "themeSelectionMode",
  default: false,
});
