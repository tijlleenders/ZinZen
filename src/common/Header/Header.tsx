import React, { useState } from "react";
import { Dropdown, Switch } from "antd";
import { useRecoilState, useSetRecoilState } from "recoil";
import { darkModeState, displayToast } from "@src/store";
import type { MenuProps } from "antd/es/menu/menu";

import bulbIcon from "@assets/images/bulbIcon.svg";
import searchIcon from "@assets/images/searchIcon.svg";
import verticalDots from "@assets/images/verticalDots.svg";

import "./Header.scss";
import React from "react";

const HeaderBtn = ({ path, alt } : {path: string, alt: string}) => {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);

  const setShowToast = useSetRecoilState(displayToast);
  const items: MenuProps["items"] = [
    {
      label: (
        <div style={{ display: "flex" }}>
          <p>Dark Mode</p>
          <Switch
            checked={darkMode}
            onChange={() => { localStorage.setItem("darkMode", darkMode ? "off" : "on"); setDarkMode(!darkMode); }}
          />
        </div>
      ),
      key: "1",
    }
  ];

  const handleClick = async () => {
    // setLoading(true);
    if (alt === "zinzen hints") {
      setShowToast({ open: true, message: "Coming soon...", extra: "" });
      // const res = await getPublicGoals(selectedGoalId === "root" ? "root" : (await getGoal(selectedGoalId))?.title || "root");
      // if (res.status && res.data?.length > 0) {
      //   const tmpPG = [...res.data];
      //   setShowSuggestionsModal({ selected: "Public", goals: [...tmpPG] });
      // } else {
      //   setShowToast({ open: true, message: "Awww... no hints today. We'll keep looking!", extra: "" });
      // }
    }
    // setLoading(false);
  };
  return (
    <div style={{ alignSelf: "center" }}>
      { alt === "zinzen settings" ? (
        <Dropdown menu={{ items }} trigger={["click"]}>
          <img className="theme-icon header-icon" src={path} alt={alt} />
        </Dropdown>
      ) : (
        <img
          onClickCapture={handleClick}
          className="theme-icon header-icon"
          src={path}
          alt={alt}
        />
      )}
    </div>
  );
};
const Header = ({ title } : { title: string }) => (
  <div className="header">
    <h6>{title || "My Goals"}</h6>
    <div className="header-items">
      <HeaderBtn path={searchIcon} alt="zinzen search" />
      <HeaderBtn path={bulbIcon} alt="zinzen hints" />
      <HeaderBtn path={verticalDots} alt="zinzen settings" />
    </div>
  </div>
);
export default Header;
