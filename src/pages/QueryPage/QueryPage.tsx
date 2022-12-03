import React from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { queryStyle } from "@src/constants/booleanScreen";
import { LandingHeader } from "@components/HeaderDashboard/LandingHeader";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

export const QueryPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <div id="query-container">
      <LandingHeader avatar={null} />
      <div style={{ ...queryStyle.main }}>
        <p className={`landing-about${darkModeStatus ? "-dark" : ""}`} style={{ paddingTop: "100px", margin: 0 }}>
          <span> a platform for </span>
          <span style={{ color: darkModeStatus ? "#AB9ED8" : "#C6441D" }}>self-actualization </span>
          <br style={{ marginTop: "5px" }} />
          <span>and </span>
          <span style={{ color: darkModeStatus ? "#AB9ED8" : "#C6441D" }}>collaboration</span>
        </p>
        <button
          type="button"
          style={{
            background: localStorage.getItem("theme") === "dark" ? "rgba(57, 57, 57, 0.4)" : "rgba(246, 246, 246, 0.4)",
            color: localStorage.getItem("theme") === "dark" ? "white" : "black",
            ...queryStyle.question
          }}
          onClick={() => {
            navigator.vibrate(100);
            navigate("/ZinZenFAQ");
          }}
        >
          {t("ihavequestions")}
        </button>
        <button
          type="button"
          style={{
            background: localStorage.getItem("theme") === "dark" ? "rgba(57, 57, 57, 0.4)" : "rgba(246, 246, 246, 0.4)",
            color: localStorage.getItem("theme") === "dark" ? "white" : "black",
            ...queryStyle.question
          }}
          onClick={() => {
            navigator.vibrate(100);
            navigate("/");
          }}
        >
          {t("ialreadyknowZinZen")}
        </button>
      </div>
    </div>
  );
};
