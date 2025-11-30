import React from "react";
import { PageTitle } from "@src/constants/pageTitle";
import HeaderActions from "./HeaderActions";
import HeaderLogo from "./HeaderLogo";
import HeaderTitle from "./HeaderTitle";
import "./Header.scss";

interface HeaderProps {
  title: PageTitle;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="header">
      <HeaderLogo />
      <HeaderTitle title={title} />
      <HeaderActions title={title} />
    </div>
  );
};

export default React.memo(Header);
