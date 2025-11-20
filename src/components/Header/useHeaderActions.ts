import { useCallback, useMemo } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import darkModeIcon from "@assets/images/darkModeIcon.svg";
import lightModeIcon from "@assets/images/lightModeIcon.svg";

import { darkModeState } from "@src/store";
import { showSearchState } from "@src/store/GoalsState";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";

interface DarkModeIconConfig {
  icon: string;
  alt: string;
}

export const useHeaderActions = () => {
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const setShowSearch = useSetRecoilState(showSearchState);

  const currentHour = new Date().getHours();
  const isNighttime = currentHour >= 18 || currentHour < 6;

  const darkModeIconConfig = useMemo<DarkModeIconConfig>(() => {
    const shouldShowToggle = isNighttime || darkModeStatus;

    if (!shouldShowToggle) {
      return {
        icon: darkModeIcon,
        alt: "dark mode",
      };
    }

    if (darkModeStatus) {
      return {
        icon: lightModeIcon,
        alt: "light mode",
      };
    }

    return {
      icon: darkModeIcon,
      alt: "dark mode",
    };
  }, [isNighttime, darkModeStatus]);

  const handleDarkModeToggle = useCallback(() => {
    setDarkModeStatus((prev) => {
      const newStatus = !prev;
      localStorage.setItem(LocalStorageKeys.DARK_MODE, newStatus ? "on" : "off");
      return newStatus;
    });
  }, [setDarkModeStatus]);

  const handleSearchToggle = useCallback(() => {
    setShowSearch((prev) => !prev);
  }, [setShowSearch]);

  return {
    darkModeIconConfig,
    handleDarkModeToggle,
    handleSearchToggle,
  };
};
