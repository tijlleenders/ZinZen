import React from "react";
import { displayToast, darkModeState } from "@src/store";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilState } from "recoil";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import Settings from "./Settings";

const HeaderBtn = ({ path, alt }: { path: string; alt: string }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const setShowToast = useSetRecoilState(displayToast);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);

  const handleClick = async () => {
    if (alt === "zinzen hints") {
      setShowToast({ open: true, message: "Coming soon...", extra: "" });
    } else if (alt === "zinzen search") {
      navigate("/goals", { state: { ...state, displaySearch: true } });
    } else if (alt === "light mode") {
      localStorage.setItem(LocalStorageKeys.DARK_MODE, darkModeStatus ? "off" : "on");
      setDarkModeStatus(!darkModeStatus);
    } else if (alt === "dark mode") {
      localStorage.setItem(LocalStorageKeys.DARK_MODE, darkModeStatus ? "off" : "on");
      setDarkModeStatus(!darkModeStatus);
    }
  };

  return (
    <div style={{ alignSelf: "center", display: "flex" }}>
      {alt === "zinzen settings" ? (
        <Settings />
      ) : (
        <img
          onClickCapture={handleClick}
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
