import React from "react";
import bulbIcon from "@assets/images/bulbIcon.svg";
import searchIcon from "@assets/images/searchIcon.svg";
import verticalDots from "@assets/images/verticalDots.svg";

import "./Header.scss";

const Header = ({ title } : { title: string }) => (
  <div className="header">
    <h1>{title || "My Goals"}</h1>
    <div className="header-items">
      <img className="theme-icon header-icon" src={searchIcon} alt="zinzen search" />
      <img className="theme-icon header-icon bulb-icon" src={bulbIcon} alt="zinzen hints" />
      <img className="theme-icon header-icon settings-icon" src={verticalDots} alt="zinzen settings" />
    </div>
  </div>
);

export default Header;
