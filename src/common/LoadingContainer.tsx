import React from "react";
import zinzenLightLogo from "@assets/images/zinzenLightLogo.svg";

const LoadingContainer = () => {
  return (
    <div
      className="place-middle f-col gap-8"
      style={{
        gap: 8,
        height: "100%",
      }}
    >
      <img className="logo-flip" src={zinzenLightLogo} alt="ZinZen" />
      <p>loading...</p>
    </div>
  );
};

export default LoadingContainer;
