import React, { useEffect, useState } from "react";
import { Dropdown, Switch } from "antd";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { darkModeState, displayInbox, displayToast, searchActive } from "@src/store";
import type { MenuProps } from "antd/es/menu/menu";

import searchIcon from "@assets/images/searchIcon.svg";
import verticalDots from "@assets/images/verticalDots.svg";

import { IHeader } from "@src/Interfaces/ICommon";
import { themeState } from "@src/store/ThemeState";

import { getActiveSharedWMGoals } from "@src/api/SharedWMAPI";
import Search from "../Search";
import { inboxIcon } from "../../assets";

import "./Header.scss";

const HeaderBtn = ({ path, alt } : {path: string, alt: string}) => {
  const theme = useRecoilValue(themeState);

  const setShowToast = useSetRecoilState(displayToast);
  const setDisplaySearch = useSetRecoilState(searchActive);

  const [openInbox, setOpenInbox] = useRecoilState(displayInbox);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);

  const items: MenuProps["items"] = [
    ...["Inbox", "Donate", "Feedback"].map((ele, index) => ({
      label: ele,
      key: `${index}`
    })),
    {
      label: (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Dark Mode</p>
          <Switch
            checked={darkModeStatus}
            onChange={() => { localStorage.setItem("darkMode", darkModeStatus ? "off" : "on"); setDarkModeStatus(!darkModeStatus); }}
          />
        </div>
      ),
      key: "7",
    },
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
    } else if (alt === "zinzen search") {
      setDisplaySearch(true);
    } else if (alt === "zinzen inbox") {
      setOpenInbox(!openInbox);
    }
    // setLoading(false);
  };
  return (
    <div style={{ alignSelf: "center" }}>
      { alt === "zinzen settings" ? (
        <Dropdown rootClassName={`header-dropdown${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`} overlayStyle={{ width: 175 }} menu={{ items }} trigger={["click"]}>
          <img className="theme-icon header-icon settings-icon" src={path} alt={alt} />
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
const Header: React.FC<IHeader> = ({ title, debounceSearch }) => {
  const displaySearch = useRecoilValue(searchActive);
  const darkModeStatus = useRecoilValue(darkModeState);
  const [openInbox, setOpenInbox] = useRecoilState(displayInbox);
  const [showInboxOption, setShowInboxOption] = useState(false);

  useEffect(() => {
    getActiveSharedWMGoals().then((res) => {
      if (res && res.length > 0) {
        setShowInboxOption(true);
      }
    });
  });
  return (
    <div className="header" style={{ background: darkModeStatus ? "var(--selection-color)" : "transparent" }}>
      { displaySearch && debounceSearch ?
        <Search debounceSearch={debounceSearch} />
        : (
          <>
            <h6>{title}</h6>
            <div className="header-items">
              { ["My Goals", "Inbox"].includes(title) && <HeaderBtn path={searchIcon} alt="zinzen search" /> }
              { showInboxOption && <HeaderBtn path={inboxIcon} alt="zinzen inbox" /> }
              {/* { title === "My Time" && (
                <p style={{
                  fontSize: 26,
                  position: "absolute",
                  top: 10,
                  right: 78,
                  fontWeight: 500
                }}>D
                </p>
              ) } */}
              <HeaderBtn path={verticalDots} alt="zinzen settings" />
            </div>
          </>
        )}
    </div>
  );
};
export default Header;
