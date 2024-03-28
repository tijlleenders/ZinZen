import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import ArrowIcon from "@assets/images/ArrowIcon.svg";
import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";
import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import { darkModeState } from "@store";
import { displaySidebar } from "@src/store/SidebarState";

import "@translations/i18n";
import "./HeaderDashboard.scss";

export const LandingHeader = ({ avatar }: { avatar: string | null }) => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowSidebar = useSetRecoilState(displaySidebar);

  return (
    <>
      {avatar === "back" ? (
        <img
          role="presentation"
          src={ArrowIcon}
          alt="Back arrow"
          id="main-header-homeLogo"
          onClick={() => {
            if (localStorage.getItem("checkedIn") !== "yes") {
              localStorage.setItem("checkedIn", "yes");
              const invite = localStorage.getItem("pendingInvite");
              localStorage.removeItem("pendingInvite");
              if (invite && invite !== "none") {
                navigate(`/invite/${invite}`);
              } else {
                navigate("/");
              }
            } else {
              navigate(-1);
            }
          }}
        />
      ) : avatar === "sidebar" ? (
        <img
          role="presentation"
          src={darkModeStatus ? mainAvatarDark : mainAvatarLight}
          alt="avatar"
          style={{ width: "50px" }}
          id="main-header-homeLogo"
          onClick={() => setShowSidebar(true)}
        />
      ) : null}
      <img
        role="presentation"
        src={darkModeStatus ? ZinZenTextDark : ZinZenTextLight}
        alt="ZinZen Text Logo"
        className="main-header-TextLogo"
      />
    </>
  );
};
