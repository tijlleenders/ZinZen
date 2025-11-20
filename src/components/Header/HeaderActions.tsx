import React from "react";
import { useRecoilState } from "recoil";

import searchIcon from "@assets/images/searchIcon.svg";
import darkModeIcon from "@assets/images/darkModeIcon.svg";
import lightModeIcon from "@assets/images/lightModeIcon.svg";

import { darkModeState } from "@src/store";
import { showSearchState } from "@src/store/GoalsState";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { PageTitle } from "@src/constants/pageTitle";
import HeaderBtn from "./HeaderBtn";

interface HeaderActionsProps {
  title: PageTitle;
}

const HeaderActions = ({ title }: HeaderActionsProps) => {
  const [showSearch, setShowSearch] = useRecoilState(showSearchState);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);

  const currentHour = new Date().getHours();
  const isNighttime = currentHour >= 18 || currentHour < 6;

  const handleDarkModeToggle = () => {
    localStorage.setItem(LocalStorageKeys.DARK_MODE, darkModeStatus ? "off" : "on");
    setDarkModeStatus(!darkModeStatus);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className="header-items">
      {isNighttime || darkModeStatus ? (
        <HeaderBtn
          path={darkModeStatus ? lightModeIcon : darkModeIcon}
          alt={`${darkModeStatus ? "light" : "dark"} mode`}
          onClick={handleDarkModeToggle}
        />
      ) : (
        <HeaderBtn path={darkModeIcon} alt="light mode" onClick={handleDarkModeToggle} />
      )}
      {title === PageTitle.MyGoals && <HeaderBtn path={searchIcon} alt="zinzen search" onClick={handleSearchToggle} />}
      <HeaderBtn path="" alt="zinzen settings" />
    </div>
  );
};

export default React.memo(HeaderActions);
