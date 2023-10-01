import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { inboxIcon, openEnvelopeIcon } from "@assets/index";
import zinzenDarkLogo from "@assets/images/zinzenDarkLogo.svg";
import zinzenLightLogo from "@assets/images/zinzenLightLogo.svg";
import searchIcon from "@assets/images/searchIcon.svg";

import {
  darkModeState,
  displayInbox,
  displayPartner,
  displayToast,
  openInbox,
  partnerDetails,
  searchActive,
} from "@src/store";
import { IHeader } from "@src/Interfaces/ICommon";
import { goalsHistory } from "@src/store/GoalsState";

import HeaderBtn from "./HeaderBtn";
import Search from "../../common/Search";

import "./Header.scss";

const Header: React.FC<IHeader> = ({ title, debounceSearch }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const setShowToast = useSetRecoilState(displayToast);

  const partner = useRecoilValue(partnerDetails);
  const showInbox = useRecoilValue(displayInbox);
  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalHistory = useRecoilValue(goalsHistory);

  const [isInboxOpen, setIsInboxOpen] = useRecoilState(openInbox);
  const [showPartner, setShowPartner] = useRecoilState(displayPartner);
  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);

  const handlePartner = async () => {
    if (!partner) {
      setShowToast({
        open: true,
        message: "Do you have a partner?",
        extra: "Try sharing a goal privately. Click on a goal circle to start.",
      });
      return;
    }
    if (showPartner) {
      window.history.back();
    }
    if (partner) {
      navigate("/MyGoals", {
        state: {
          displayPartner: true,
        },
      });
    }
  };
  const handlePopState = () => {
    const locationState = location.state || {};
    if (isInboxOpen || "isInboxOpen" in locationState) {
      setIsInboxOpen(locationState?.isInboxOpen || false);
    }
    if (displaySearch || locationState?.displaySearch) {
      setDisplaySearch(locationState?.displaySearch || false);
    } else if (showPartner || locationState?.displayPartner) {
      setShowPartner(locationState?.displayPartner || false);
    }
  };

  useEffect(() => {
    handlePopState();
  }, [location]);

  return (
    <div className="header">
      {displaySearch && debounceSearch ? (
        <Search debounceSearch={debounceSearch} />
      ) : (
        <>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <img
              style={{ height: 30, width: 30, cursor: "pointer" }}
              onClickCapture={handlePartner}
              src={zinzenLightLogo}
              alt="ZinZen"
            />
            <h6
              style={{ cursor: "pointer" }}
              onClickCapture={() => {
                if (["myGoals", "Inbox"].includes(title)) {
                  window.history.go(-subGoalHistory.length);
                }
              }}
            >
              {isInboxOpen ? "Inbox" : t(title)}
            </h6>
          </div>
          <div className="header-items">
            {["myGoals", "Inbox"].includes(title) && !isInboxOpen && (
              <HeaderBtn path={searchIcon} alt="zinzen search" />
            )}
            {["myGoals", "Inbox"].includes(title) && showInbox && (
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
