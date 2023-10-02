import React from "react";
import { openInbox, displayToast, darkModeState } from "@src/store";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import Settings from "./Settings";

const HeaderBtn = ({ path, alt }: { path: string; alt: string }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isInboxOpen = useRecoilValue(openInbox);
  const setShowToast = useSetRecoilState(displayToast);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);

  const handleClick = async () => {
    if (alt === "zinzen hints") {
      setShowToast({ open: true, message: "Coming soon...", extra: "" });
    } else if (alt === "zinzen search") {
      navigate("/MyGoals", { state: { ...state, displaySearch: true } });
    } else if (alt === "zinzen inbox") {
      if (isInboxOpen) {
        window.history.go(-((state?.goalsHistory?.length || 0) + 1));
      } else {
        const newState = { ...state };
        if (newState.goalsHistory) {
          delete newState.goalsHistory;
        }
        if (newState.activeGoalId) {
          delete newState.activeGoalId;
        }
        navigate("/MyGoals", { state: { ...newState, goalsHistory: [], isInboxOpen: true } });
      }
    } else if (alt === "light mode") {
      localStorage.setItem("darkMode", darkModeStatus ? "off" : "on");
      setDarkModeStatus(!darkModeStatus);
    } else if (alt == "dark mode") {
      localStorage.setItem("darkMode", darkModeStatus ? "off" : "on");
      setDarkModeStatus(!darkModeStatus);
    } 
  };

  return (
    <div style={{ alignSelf: "center", display: "flex" }}>
      {alt === "zinzen settings" ? (
        <Settings />
      ) : (
        <img onClickCapture={handleClick} className="theme-icon header-icon" src={path} alt={alt} />
      )}
    </div>
  );
};

export default HeaderBtn;
