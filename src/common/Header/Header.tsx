import React from "react";
import { Dropdown, Switch } from "antd";
import { useRecoilState } from "recoil";
import { darkModeState } from "@src/store";
import type { MenuProps } from "antd/es/menu/menu";

import bulbIcon from "@assets/images/bulbIcon.svg";
import searchIcon from "@assets/images/searchIcon.svg";
import verticalDots from "@assets/images/verticalDots.svg";

import "./Header.scss";

const HeaderBtn = ({ path, alt } : {path: string, alt: string}) => {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const items: MenuProps["items"] = [
    {
      label: (
        <div style={{ display: "flex" }}>
          <p>Dark Mode</p>
          <Switch
            checked={darkMode}
            onChange={() => { setDarkMode(!darkMode); }}
          />
        </div>
      ),
      key: "1",
    }
  ];
  return (
    <div style={{ alignSelf: "center" }}>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <img className="theme-icon header-icon" src={path} alt={alt} />
      </Dropdown>
    </div>
  );
};

const Header = ({ title } : { title: string }) => (
  <div className="header">
    <h1>{title || "My Goals"}</h1>
    <div className="header-items">
      <HeaderBtn path={searchIcon} alt="zinzen search" />
      <HeaderBtn path={bulbIcon} alt="zinzen hints" />
      <HeaderBtn path={verticalDots} alt="zinzen settings" />
    </div>
  </div>
);
export default Header;
