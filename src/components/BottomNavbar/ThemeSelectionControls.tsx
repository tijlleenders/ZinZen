import React, { useCallback, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import BottomNavLayout from "@src/layouts/BottomNavLayout";
import Backdrop from "@src/common/Backdrop";
import Icon from "@src/common/Icon";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { themeSelectionMode, themeState } from "@src/store/ThemeState";
import { darkModeState } from "@src/store";
import "./ThemeSelectionControls.scss";

interface ThemeSelectionControlsProps {
  onClose: () => void;
}

const ThemeSelectionControls: React.FC<ThemeSelectionControlsProps> = ({ onClose }) => {
  const [theme, setTheme] = useRecoilState(themeState);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const setThemeSelection = useSetRecoilState(themeSelectionMode);

  useEffect(() => {
    return () => {
      setThemeSelection(false);
    };
  }, [setThemeSelection]);

  const handleClose = useCallback(() => {
    setThemeSelection(false);
    onClose();
  }, [onClose, setThemeSelection]);

  const themeChange = (nav: -1 | 1) => {
    let choice = theme[darkModeStatus ? "dark" : "light"] + nav;
    if (choice >= 8) {
      choice = 1;
    } else if (choice === 0) {
      choice = 8;
    }
    const newTheme = { ...theme, [darkModeStatus ? "dark" : "light"]: choice };
    localStorage.setItem(LocalStorageKeys.THEME, JSON.stringify(newTheme));
    setTheme({ ...newTheme });
  };

  return (
    <>
      <Backdrop opacity={0} onClick={handleClose} />
      <BottomNavLayout>
        <button
          type="button"
          onClick={() => {
            themeChange(-1);
          }}
          className="bottom-nav-item"
        >
          <div className="theme-controls-prev">
            <Icon title="ArrowIcon" />
          </div>
          <p>Prev</p>
        </button>
        <button
          type="button"
          onClick={() => {
            setDarkModeStatus(!darkModeStatus);
          }}
          data-testid="navigation-button-Goals"
          className="bottom-nav-item active"
        >
          <Icon active title="GoalsIcon" />
          <p>Switch Mode</p>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            themeChange(1);
          }}
          className="bottom-nav-item theme-controls-next"
        >
          <Icon title="ArrowIcon" />
          <p>Next</p>
        </button>
      </BottomNavLayout>
    </>
  );
};

export default ThemeSelectionControls;
