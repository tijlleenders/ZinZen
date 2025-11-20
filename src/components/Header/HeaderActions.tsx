import React from "react";

import searchIcon from "@assets/images/searchIcon.svg";

import { PageTitle } from "@src/constants/pageTitle";
import { useHeaderActions } from "./useHeaderActions";
import HeaderBtn from "./HeaderBtn";

interface HeaderActionsProps {
  title: PageTitle;
}

const HeaderActions = ({ title }: HeaderActionsProps) => {
  const { darkModeIconConfig, handleDarkModeToggle, handleSearchToggle } = useHeaderActions();

  return (
    <div className="header-items">
      <HeaderBtn path={darkModeIconConfig.icon} alt={darkModeIconConfig.alt} onClick={handleDarkModeToggle} />
      {title === PageTitle.MyGoals && <HeaderBtn path={searchIcon} alt="zinzen search" onClick={handleSearchToggle} />}
      <HeaderBtn path="" alt="zinzen settings" />
    </div>
  );
};

export default React.memo(HeaderActions);
