import { atom } from "recoil";
import { confirmActionState } from "@src/Interfaces/IPopupModals";
import ContactItem from "@src/models/ContactItem";
import { isJSONParsable } from "@src/utils/patterns";
import { darkModeState } from "./DarkModeState";
import { languageSelectionState } from "./LanguageSelectionState";

const defaultConfirmationObj: confirmActionState = {
  open: false,
  goal: {
    archive: true,
    delete: true,
    shareAnonymously: true,
    shareWithOne: true,
    restore: true,
  },
  collaboration: {
    colabRequest: true,
    delete: true,
    archive: true,
    restore: true,
  },
};

if (isJSONParsable(localStorage.getItem("confirmationState"))) {
  // @ts-ignore
  const savedConfirmationState = JSON.parse(localStorage.getItem("confirmationService"));
  defaultConfirmationObj.goal = { ...defaultConfirmationObj.goal, ...(savedConfirmationState?.goal || {}) };
  defaultConfirmationObj.collaboration = {
    ...defaultConfirmationObj.collaboration,
    ...(savedConfirmationState?.collaboration || {}),
  };
}

export const displayConfirmation = atom({
  key: "displayConfirmation",
  default: defaultConfirmationObj,
});

export const lastAction = atom({
  key: "lastAction",
  default: "",
});

export const searchActive = atom({
  key: "searchActive",
  default: false,
});

export const backupRestoreModal = atom({
  key: "backupRestoreModal",
  default: false,
});

export const languageChangeModal = atom({
  key: "languageChangeModal",
  default: false,
});

export const displayLoader = atom({
  key: "displayLoader",
  default: false as boolean,
});

export const displayFromOptions = atom({
  key: "displayFromOptions",
  default: { archive: false, public: false },
});

export const displayInbox = atom({
  key: "displayInbox",
  default: false,
});

export const openInbox = atom({
  key: "openInbox",
  default: false as boolean,
});

export const displayToast = atom({
  key: "displayToast",
  default: { open: false, message: "Awww... no hints today. We'll keep looking!", extra: "" },
});

export const openDevMode = atom({
  key: "openDevMode",
  default: false,
});

export const displayPartner = atom({
  key: "showPartner",
  default: null as ContactItem | null,
});

export const displayPartnerMode = atom({
  key: "displayPartnerMode",
  default: false,
});

export const currentScheduledTask = atom({
  key: "currentScheduledTask",
  default: "",
});

export const focusTaskTitle = atom({
  key: "focusTaskTitle",
  default: "",
});

export const flipAnimationState = atom({
  key: "flipAnimationState",
  default: false,
});

export { darkModeState, languageSelectionState };
