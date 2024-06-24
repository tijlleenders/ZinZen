import React from "react";
import zinzenLightLogo from "@assets/images/zinzenLightLogo.svg";

const LoadingContainer = () => {
  return (
    <div
      style={{
        opacity: 0.8,
        gap: 8,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        placeContent: "center",
      }}
    >
      <img className="logo-flip" src={zinzenLightLogo} alt="ZinZen" />
      <p>loading...</p>
    </div>
  );
};

export default LoadingContainer;
