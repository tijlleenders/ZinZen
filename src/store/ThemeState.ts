import { atom } from "recoil";

export const getTheme = () => {
  const x = localStorage.getItem("theme");
  return x ? JSON.parse(x) : { light: 1, dark: 1 };
};
export const themeState = atom({
  key: "themeState",
  default: getTheme() as { light: number, dark: number },
});

export const themeSelectionMode = atom({
  key: "themeSelectionMode",
  default: false
});
