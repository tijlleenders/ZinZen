import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

import zinzenLightLogo from "@assets/images/zinzenLightLogo.svg";
import { flipAnimationState } from "@src/store";
import "./HeaderLogo.scss";

interface HeaderLogoProps {
  onLogoClick?: () => void;
}

const HeaderLogo = ({ onLogoClick }: HeaderLogoProps) => {
  const [isFlipping, setIsFlipping] = useRecoilState(flipAnimationState);
  const zinZenLogoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const timer = isFlipping ? setTimeout(() => setIsFlipping(false), 500) : undefined;
    return () => clearTimeout(timer);
  }, [isFlipping, setIsFlipping]);

  return (
    <>
      <img
        className={`header-logo ${isFlipping ? "logo-flip" : ""}`}
        src={zinzenLightLogo}
        alt="ZinZen"
        ref={zinZenLogoRef}
        onClickCapture={onLogoClick}
      />
      {/* <PartnerModeTour refTarget={zinZenLogoRef} /> */}
    </>
  );
};

export default React.memo(HeaderLogo);
