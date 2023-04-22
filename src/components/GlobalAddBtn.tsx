import React from "react";

import GlobalAddIcon from "@assets/images/globalAdd.svg";

const GlobalAddBtn = ({ add }: { add: string }) => {
  const handleClick = () => "hello";
  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: 100,
        borderRadius: "50%",
        border: "none",
        background: "var(--primary-background)",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        padding: 23,
      }}
    >
      <img width={35} src={GlobalAddIcon} alt="add goal | add feeling | add group" />
    </button>
  );
};

export default GlobalAddBtn;
