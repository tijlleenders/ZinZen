import { useTranslation } from "react-i18next";
import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useRecoilState, useSetRecoilState } from "recoil";

import zinzenLightLogo from "@assets/images/zinzenLightLogo.svg";
import searchIcon from "@assets/images/searchIcon.svg";
import darkModeIcon from "@assets/images/darkModeIcon.svg";
import lightModeIcon from "@assets/images/lightModeIcon.svg";
import { getAllContacts } from "@src/api/ContactsAPI";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";

import PartnerModeTour from "@components/PartnerModeTour";

import { darkModeState, displayToast, flipAnimationState } from "@src/store";
import { displayPartnerModeTour } from "@src/store/TourState";
import { showSearchState } from "@src/store/GoalsState";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import HeaderBtn from "./HeaderBtn";
import "./Header.scss";

const Header = ({ title }: { title: string }) => {
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useRecoilState(showSearchState);
  const { parentId } = useParams({ strict: false }) as { parentId: string };
  const { data: parentGoal } = useGetGoalById(parentId);
  const navigate = useNavigate();
  const setShowToast = useSetRecoilState(displayToast);

  const [partnerModeTour, setPartnerModeTour] = useRecoilState(displayPartnerModeTour);
  const [isFlipping, setIsFlipping] = useRecoilState(flipAnimationState);

  const zinZenLogoRef = useRef(null);

  const handlePartner = async () => {
    setIsFlipping(true);
    const partners = await getAllContacts();
    if (partners.length === 0) {
      setShowToast({
        open: true,
        message: "Do you have a partner?",
        extra: "Try sharing a goal privately. Click on a goal circle to start.",
      });
      return;
    }
    if (partnerModeTour) {
      setPartnerModeTour(false);
    }
    if (window.location.pathname.split("/")[1] === "partners") {
      navigate({ to: "/goals/$parentId", params: { parentId: "root" }, replace: true });
      return;
    }
    navigate({ to: "/partners" });
  };

  useEffect(() => {
    const timer = isFlipping ? setTimeout(() => setIsFlipping(false), 500) : undefined;
    return () => clearTimeout(timer);
  }, [isFlipping]);

  const currentHour = new Date().getHours();
  const isNighttime = currentHour >= 18 || currentHour < 6;

  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);

  const handleDarkModeClick = () => {
    localStorage.setItem(LocalStorageKeys.DARK_MODE, darkModeStatus ? "off" : "on");
    setDarkModeStatus(!darkModeStatus);
  };

  const handleLightModeClick = () => {
    localStorage.setItem(LocalStorageKeys.DARK_MODE, darkModeStatus ? "off" : "on");
    setDarkModeStatus(!darkModeStatus);
  };

  return (
    <div className="header">
      <div className="header-logo-title">
        <div className="header-logo-wrapper" onClickCapture={handlePartner}>
          <img className={isFlipping ? "logo-flip" : ""} src={zinzenLightLogo} alt="ZinZen" ref={zinZenLogoRef} />
        </div>

        <PartnerModeTour refTarget={zinZenLogoRef} />
        <h6
          onClickCapture={() => {
            if (title === "myGoals") {
              if (!parentGoal) return;
              window.history.go(-parentGoal.depth || 0);
            }
          }}
        >
          {t(title)}
        </h6>
      </div>
      <div className="header-items">
        {isNighttime || darkModeStatus ? (
          <HeaderBtn
            path={darkModeStatus ? lightModeIcon : darkModeIcon}
            alt={`${darkModeStatus ? "light" : "dark"} mode`}
            onClick={handleDarkModeClick}
          />
        ) : (
          <HeaderBtn path={darkModeIcon} alt="light mode" onClick={handleLightModeClick} />
        )}
        {title === "myGoals" && (
          <HeaderBtn path={searchIcon} alt="zinzen search" onClick={() => setShowSearch(!showSearch)} />
        )}
        <HeaderBtn path="" alt="zinzen settings" />
      </div>
    </div>
  );
};

export default React.memo(Header);
