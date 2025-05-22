import React from "react";
import Settings from "./Settings";

const HeaderBtn = ({ path, alt, onClick }: { path: string; alt: string; onClick?: () => void }) => {
  return (
    <div style={{ alignSelf: "center", display: "flex" }}>
      {alt === "zinzen settings" ? (
        <Settings />
      ) : (
        <img
          onClickCapture={onClick}
          className="theme-icon header-icon"
          src={path}
          alt={alt}
          style={{ padding: "10px" }}
        />
      )}
    </div>
  );
};

export default HeaderBtn;
