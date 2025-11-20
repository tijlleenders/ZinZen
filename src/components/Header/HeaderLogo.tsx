import React, { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useRecoilState, useSetRecoilState } from "recoil";

import zinzenLightLogo from "@assets/images/zinzenLightLogo.svg";
import { getAllContacts } from "@src/api/ContactsAPI";
import { displayToast, flipAnimationState } from "@src/store";
import { displayPartnerModeTour } from "@src/store/TourState";
import "./HeaderLogo.scss";

interface HeaderLogoProps {
  onLogoClick?: () => void;
}

const HeaderLogo = ({ onLogoClick }: HeaderLogoProps) => {
  const navigate = useNavigate();
  const setShowToast = useSetRecoilState(displayToast);

  const [partnerModeTour, setPartnerModeTour] = useRecoilState(displayPartnerModeTour);
  const [isFlipping, setIsFlipping] = useRecoilState(flipAnimationState);

  const zinZenLogoRef = useRef<HTMLImageElement>(null);

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
  }, [isFlipping, setIsFlipping]);

  const handleClick = onLogoClick || handlePartner;

  return (
    <>
      <img
        className={`header-logo ${isFlipping ? "logo-flip" : ""}`}
        src={zinzenLightLogo}
        alt="ZinZen"
        ref={zinZenLogoRef}
        onClickCapture={handleClick}
      />
      {/* <PartnerModeTour refTarget={zinZenLogoRef} /> */}
    </>
  );
};

export default React.memo(HeaderLogo);
