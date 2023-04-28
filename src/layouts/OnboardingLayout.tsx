import React from "react";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";

const OnboardingLayout = ({ children }: {children: React.ReactNode}) => (
  <div style={{
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "transparent",
    paddingBottom: 16,
    borderRadius: "1.275em",
    maxWidth: 320,
    paddingTop: 16,
    width: "100%",
  }}
  >
    <img
      role="presentation"
      src={ZinZenTextLight}
      alt="ZinZen Text Logo"
      className="zinzen-textLogo"
    />
    {children}
  </div>
);

export default OnboardingLayout;
