import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { atom } from "recoil";

export const languageSelectionState = atom({
  key: "keyModalState",
  default: localStorage.getItem(LocalStorageKeys.LANGUAGE)
    ? localStorage.getItem(LocalStorageKeys.LANGUAGE)
    : "No language chosen.",
});
