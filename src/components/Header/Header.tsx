import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import zinzenLightLogo from "@assets/images/zinzenLightLogo.svg";
import searchIcon from "@assets/images/searchIcon.svg";
import darkModeIcon from "@assets/images/darkModeIcon.svg";
import lightModeIcon from "@assets/images/lightModeIcon.svg";

import { IHeader } from "@src/Interfaces/ICommon";
import { goalsHistory } from "@src/store/GoalsState";
import { getAllContacts } from "@src/api/ContactsAPI";
import { darkModeState, displayPartnerMode, displayToast, flipAnimationState, searchActive } from "@src/store";

import HeaderBtn from "./HeaderBtn";
import Search from "../../common/Search";

import "./Header.scss";

const Header: React.FC<IHeader> = ({ title, debounceSearch }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const setShowToast = useSetRecoilState(displayToast);

  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalHistory = useRecoilValue(goalsHistory);

  const [showPartnerMode, setShowPartnerMode] = useRecoilState(displayPartnerMode);
  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);
  const [isFlipping, setIsFlipping] = useRecoilState(flipAnimationState);

  const handlePartner = async () => {
    setIsFlipping(true);
    const list = await getAllContacts();
    if (list.length === 0) {
      setShowToast({
        open: true,
        message: "Do you have a partner?",
        extra: "Try sharing a goal privately. Click on a goal circle to start.",
      });
      return;
    }
    if (showPartnerMode) {
      window.history.back();
    } else {
      navigate("/MyGoals", {
        state: {
          displayPartnerMode: true,
          displayPartner: list[0],
        },
      });
    }
  };
  const handlePopState = () => {
    const locationState = location.state || {};
    if (displaySearch || locationState?.displaySearch) {
      setDisplaySearch(locationState?.displaySearch || false);
    } else if (showPartnerMode || locationState?.displayPartnerMode) {
      setShowPartnerMode(locationState?.displayPartnerMode || false);
    }
  };

  useEffect(() => {
    handlePopState();
  }, [location]);

  useEffect(() => {
    const timer = isFlipping ? setTimeout(() => setIsFlipping(false), 500) : undefined;
    return () => clearTimeout(timer);
  }, [isFlipping]);

  const currentHour = new Date().getHours();
  const isNighttime = currentHour >= 18 || currentHour < 6;

  return (
    <div className="header">
      {displaySearch && debounceSearch ? (
        <Search debounceSearch={debounceSearch} />
      ) : (
        <>
          <div>
            <img
              className={isFlipping ? "logo-flip" : ""}
              onClickCapture={handlePartner}
              src={zinzenLightLogo}
              alt="ZinZen"
            />
            <h6
              onClickCapture={() => {
                if (title === "myGoals") {
                  window.history.go(-subGoalHistory.length);
                }
              }}
            >
              {t(title)}
            </h6>
          </div>
          <div className="header-items">
            {isNighttime && !darkModeStatus ? (
              <HeaderBtn path={darkModeIcon} alt="dark mode" />
            ) : !isNighttime && darkModeStatus ? (
              <HeaderBtn path={lightModeIcon} alt="light mode" />
            ) : null}
            {title === "myGoals" && <HeaderBtn path={searchIcon} alt="zinzen search" />}
            <HeaderBtn path="" alt="zinzen settings" />
          </div>
        </>
      )}
    </div>
  );
};
export default Header;
