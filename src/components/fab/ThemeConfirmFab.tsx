import React from "react";
import correct from "@assets/images/correct.svg";
import FabButton from "./FabButton";

const ThemeConfirmFab: React.FC = () => {
  const handleClick = () => {
    window.history.back();
  };

  return <FabButton icon={<img src={correct} alt="confirm theme" />} onClick={handleClick} />;
};

export default ThemeConfirmFab;
