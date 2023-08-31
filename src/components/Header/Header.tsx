import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { darkModeState, displayInbox, displayPartner, displayToast, openInbox, searchActive } from "@src/store";

import zinzenDarkLogo from "@assets/images/zinzenDarkLogo.svg";
import zinzenLightLogo from "@assets/images/zinzenLightLogo.svg";
import searchIcon from "@assets/images/searchIcon.svg";

import { IHeader } from "@src/Interfaces/ICommon";

import Search from "../../common/Search";
import { inboxIcon, openEnvelopeIcon } from "../../assets";

import "./Header.scss";
import Settings from "./Settings";

const HeaderBtn = ({ path, alt }: { path: string; alt: string }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isInboxOpen = useRecoilValue(openInbox);
  const setShowToast = useSetRecoilState(displayToast);

  const handleClick = async () => {
    if (alt === "zinzen hints") {
      setShowToast({ open: true, message: "Coming soon...", extra: "" });
    } else if (alt === "zinzen search") {
      navigate("/MyGoals", { state: { ...state, displaySearch: true } });
    } else if (alt === "zinzen inbox") {
      if (isInboxOpen) {
        window.history.go(-((state?.goalsHistory?.length || 0) + 1));
      } else {
        const newState = { ...state };
        if (newState.goalsHistory) {
          delete newState.goalsHistory;
        }
        if (newState.activeGoalId) {
          delete newState.activeGoalId;
        }
        navigate("/MyGoals", { state: { ...newState, goalsHistory: [], isInboxOpen: true } });
      }
    }
  };

  return (
    <div style={{ alignSelf: "center", display: "flex" }}>
      {alt === "zinzen settings" ? (
        <Settings />
      ) : (
        <img onClickCapture={handleClick} className="theme-icon header-icon" src={path} alt={alt} />
      )}
    </div>
  );
};

const Header: React.FC<IHeader> = ({ title, debounceSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isInboxOpen, setIsInboxOpen] = useRecoilState(openInbox);
  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);
  const showInbox = useRecoilValue(displayInbox);
  const darkModeStatus = useRecoilValue(darkModeState);
  const [showPartner, setShowPartner] = useRecoilState(displayPartner);

  const handlePartner = () => {
    navigate("/MyGoals", {
      state: {
        displayPartner: true,
      },
    });
  };
  const handlePopState = () => {
    const locationState = location.state || {};
    if (isInboxOpen || "isInboxOpen" in locationState) {
      setIsInboxOpen(locationState?.isInboxOpen || false);
    }
    if (displaySearch || locationState?.displaySearch) {
      setDisplaySearch(locationState?.displaySearch || false);
    } else if (showPartner || locationState?.displayPartner) {
      setShowPartner(locationState?.displayPartner || false)
    }
  };

  useEffect(() => {
    handlePopState();
  }, [location]);
  return (
    <div className="header" style={{ background: darkModeStatus ? "var(--selection-color)" : "transparent" }}>
      {displaySearch && debounceSearch ? (
        <Search debounceSearch={debounceSearch} />
      ) : (
        <>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img onClickCapture={handlePartner} src={darkModeStatus ? zinzenDarkLogo : zinzenLightLogo} alt="ZinZen" />
            <h6>{isInboxOpen ? "Inbox" : t(title)}</h6>
          </div>
          <div className="header-items">
            {["mygoals", "Inbox"].includes(title) && !isInboxOpen && (
              <HeaderBtn path={searchIcon} alt="zinzen search" />
            )}
            {["mygoals", "Inbox"].includes(title) && showInbox && (
              <HeaderBtn path={isInboxOpen ? openEnvelopeIcon : inboxIcon} alt="zinzen inbox" />
            )}
            <HeaderBtn path="" alt="zinzen settings" />
          </div>
        </>
      )}
    </div>
  );
};
export default Header;
