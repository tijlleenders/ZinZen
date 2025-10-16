import { darkModeState } from "@src/store";
import React from "react";
import { useRecoilValue } from "recoil";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

const ZinZenBgImage = ({ activeGoalsPresent = false }: { activeGoalsPresent?: boolean }) => {
  const darkModeStatus = useRecoilValue(darkModeState);

  const zinZenLogoHeight = activeGoalsPresent ? 125 : 350;
  return (
    <img
      style={{ width: 180, height: zinZenLogoHeight, opacity: 0.3 }}
      src={darkModeStatus ? ZinZenTextDark : ZinZenTextLight}
      alt="Zinzen"
    />
  );
};

export default ZinZenBgImage;
