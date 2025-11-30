import React from "react";
import { useRecoilValue } from "recoil";

import { themeSelectionMode } from "@src/store/ThemeState";
import "./BottomBarContainer.scss";
import ThemeSelectionControls from "./ThemeSelectionControls";
import { BottomNavbar } from "./BottomNavbar";

const BottomBarContainer: React.FC = () => {
  const themeSelection = useRecoilValue(themeSelectionMode);

  if (themeSelection) {
    return <ThemeSelectionControls />;
  }

  return <BottomNavbar />;
};

export default BottomBarContainer;
