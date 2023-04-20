import { atom } from "recoil";

export const getTheme = () => {
  const x = localStorage.getItem("theme");
  return x ? JSON.parse(x) : { light: 0, dark: 0 };
};
export const themeState = atom({
  key: "themeState",
  default: getTheme() as { light: number, dark: number },
});
