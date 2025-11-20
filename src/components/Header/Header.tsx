import React from "react";
import { PageTitle } from "@src/constants/pageTitle";
import HeaderActions from "./HeaderActions";
import HeaderLogo from "./HeaderLogo";
import HeaderTitle from "./HeaderTitle";
import "./Header.scss";

interface HeaderProps {
  title: PageTitle;
  onTitleClick?: () => void;
  onLogoClick?: () => void;
}

const Header = ({ title, onTitleClick, onLogoClick }: HeaderProps) => {
  return (
    <div className="header">
      <HeaderLogo onLogoClick={onLogoClick} />

      <HeaderTitle title={title} onTitleClick={onTitleClick} />

      <HeaderActions title={title} />
    </div>
  );
};

export default React.memo(Header);
