/* eslint-disable no-unused-expressions */
import React from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { darkModeState } from "@src/store";
import { queryStyle } from "@src/constants/booleanScreen";
import { vibrateWorks } from "@src/constants/vibrateCheck";
import { LandingHeader } from "@components/HeaderDashboard/LandingHeader";

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
            (vibrateWorks) ? navigator.vibrate(100) : null;
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
            localStorage.setItem("checkedIn", "yes");
            const invite = localStorage.getItem("pendingInvite");
            (vibrateWorks) ? navigator.vibrate(100) : null;
            if (invite && invite !== "none") {
              localStorage.removeItem("pendingInvite");
              navigate(`/invite/${invite}`);
            } else {
              navigate("/");
            }
          }}
        >
          {t("ialreadyknowZinZen")}
        </button>
      </div>
    </div>
  );
};
