import React, { useEffect, useState } from "react";
import { Dropdown, Switch } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { darkModeState, displayInbox, displayToast, searchActive } from "@src/store";
import type { MenuProps } from "antd/es/menu/menu";

import searchIcon from "@assets/images/searchIcon.svg";
import verticalDots from "@assets/images/verticalDots.svg";

import useGlobalStore from "@src/hooks/useGlobalStore";
import { IHeader } from "@src/Interfaces/ICommon";
import { goalsHistory } from "@src/store/GoalsState";
import { themeState } from "@src/store/ThemeState";

import Search from "../Search";
import { inboxIcon, openEnvelopeIcon } from "../../assets";

import "./Header.scss";

const HeaderBtn = ({ path, alt } : {path: string, alt: string}) => {
  const navigate = useNavigate();
  const theme = useRecoilValue(themeState);
  const openInbox = useRecoilValue(displayInbox);
  const { handleChangeTheme, handleBackResModal } = useGlobalStore();

  const setShowToast = useSetRecoilState(displayToast);

  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const dropdownOptions = ["Donate", "Feedback", "Blog", "Backup", "Change Theme"];

  const toggleDarkModeStatus = () => {
    localStorage.setItem("darkMode", darkModeStatus ? "off" : "on");
    setDarkModeStatus(!darkModeStatus);
  };

  const items: MenuProps["items"] = [
    ...[...dropdownOptions, ...(showInstall ? ["Install"] : [])].map((ele, index) => ({
      label: ele,
      key: `${index}`,
      onClick: () => {
        if (ele === "Change Theme") {
          handleChangeTheme();
        } else if (ele === "Donate") {
          window.open("https://donate.stripe.com/6oE4jK1iPcPT1m89AA", "_self");
        } else if (ele === "Feedback") {
          navigate("/Feedback");
        } else if (ele === "Blog") {
          window.open("https://blog.zinzen.me", "_self");
        } else if (ele === "Backup") {
          handleBackResModal();
        } else if (ele === "Install") {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
              if (choiceResult.outcome === "accepted") {
                setShowInstall(false);
                setDeferredPrompt(null);
              }
            });
          }
        }
      }
    })),
    {
      label: (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }} onClickCapture={toggleDarkModeStatus}>
          <p>Dark Mode</p>
          <Switch checked={darkModeStatus} />
        </div>
      ),
      key: "7",
    },
  ];

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleClick = async () => {
    // setLoading(true);
    if (alt === "zinzen hints") {
      setShowToast({ open: true, message: "Coming soon...", extra: "" });
    } else if (alt === "zinzen search") {
      navigate("/MyGoals", { state: { displaySearch: true } });
    } else if (alt === "zinzen inbox") {
      if (openInbox) { window.history.back(); } else {
        navigate("/MyGoals", { state: { openInbox: true } });
      }
    }
  };

  return (
    <div style={{ alignSelf: "center", display: "flex" }}>
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
  const location = useLocation();
  const [openInbox, setOpenInbox] = useRecoilState(displayInbox);
  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);

  const subGoalHistory = useRecoilValue(goalsHistory);
  const darkModeStatus = useRecoilValue(darkModeState);

  const handlePopState = () => {
    const locationState = location.state || {};
    if (openInbox || "openInbox" in locationState) {
      setOpenInbox(locationState?.openInbox || false);
    } else if (displaySearch || "displaySearch" in locationState) {
      setDisplaySearch(locationState?.displaySearch || false);
    }
  };

  useEffect(() => {
    handlePopState();
  }, [location]);

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
