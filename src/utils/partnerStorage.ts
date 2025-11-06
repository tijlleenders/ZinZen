import { LocalStorageKeys } from "@src/constants/localStorageKeys";

export const setCurrentPartnerInLocalStorage = (partnerId: string): void => {
  localStorage.setItem(LocalStorageKeys.CURRENT_PARTNER, partnerId);
};

export const getCurrentPartnerFromLocalStorage = (): string | null => {
  return localStorage.getItem(LocalStorageKeys.CURRENT_PARTNER);
};
