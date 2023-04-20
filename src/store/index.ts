import { atom } from "recoil";
import { confirmActionState } from "@src/Interfaces/IPopupModals";
import { darkModeState } from "./DarkModeState";
import { languageSelectionState } from "./LanguageSelectionState";

export const showConfirmation = atom({
  key: "showConfirmation",
  default: JSON.parse(localStorage.getItem("confirmationState") || JSON.stringify({
    open: false,
    goal: {
      archive: true,
      delete: true,
      shareAnonymously: true,
      shareWithOne: true
    },
    collaboration: {
      colabRequest: true,
      delete: true,
      archive: true
    },
  })) as confirmActionState
});

export const lastAction = atom({
  key: "lastAction",
  default: ""
});

export const searchActive = atom({
  key: "searchActive",
  default: false
});

export const backupRestoreModal = atom({
  key: "backupRestoreModal",
  default: false
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

export { darkModeState, languageSelectionState };
