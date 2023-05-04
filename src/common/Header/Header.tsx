import React from "react";
import { Dropdown, Switch } from "antd";
import { useNavigate } from "react-router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { darkModeState, displayInbox, displayToast, searchActive } from "@src/store";
import type { MenuProps } from "antd/es/menu/menu";

import searchIcon from "@assets/images/searchIcon.svg";
import verticalDots from "@assets/images/verticalDots.svg";

import { IHeader } from "@src/Interfaces/ICommon";
import { themeState, themeSelectionMode } from "@src/store/ThemeState";
import { goalsHistory } from "@src/store/GoalsState";

import { inboxIcon, openEnvelopeIcon } from "../../assets";
import Search from "../Search";

import "./Header.scss";

const HeaderBtn = ({ path, alt } : {path: string, alt: string}) => {
  const navigate = useNavigate();
  const theme = useRecoilValue(themeState);

  const currentPage = window.location.pathname.split("/")[1];

  const setShowToast = useSetRecoilState(displayToast);
  const setDisplaySearch = useSetRecoilState(searchActive);
  const setThemeSelection = useSetRecoilState(themeSelectionMode);

  const [openInbox, setOpenInbox] = useRecoilState(displayInbox);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);

  const items: MenuProps["items"] = [
    ...["Donate", "Feedback", "Change Theme"].map((ele, index) => ({
      label: ele,
      key: `${index}`,
      onClick: () => {
        if (ele === "Change Theme") {
          setThemeSelection(true);
          if (currentPage !== "MyGoals") { navigate("/MyGoals"); }
        } else if (ele === "Donate") {
          window.open("https://donate.stripe.com/6oE4jK1iPcPT1m89AA", "_self");
        } else if (ele === "Feedback") {
          navigate("/Feedback");
        }
      }
    })),
    {
      label: (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop:12 }}>
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
      if (currentPage !== "MyGoals") navigate("/MyGoals");
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
  const openInbox = useRecoilValue(displayInbox);
  const displaySearch = useRecoilValue(searchActive);
  const subGoalHistory = useRecoilValue(goalsHistory);
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <div className="header" style={{ background: darkModeStatus ? "var(--selection-color)" : "transparent" }}>
      { displaySearch && debounceSearch ?
        <Search debounceSearch={debounceSearch} />
        : (
          <>
            <h6>{openInbox ? "Inbox" : title}</h6>
            <div className="header-items">
              { ["My Goals", "Inbox"].includes(title) && <HeaderBtn path={searchIcon} alt="zinzen search" /> }
              { ["My Goals", "Inbox"].includes(title) && subGoalHistory.length === 0 && <HeaderBtn path={openInbox ? openEnvelopeIcon : inboxIcon} alt="zinzen inbox" /> }
              <HeaderBtn path={verticalDots} alt="zinzen settings" />
            </div>
          </>
        )}
    </div>
  );
};
export default Header;
