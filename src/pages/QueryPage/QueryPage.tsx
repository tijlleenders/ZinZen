import React from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { queryStyle } from "@src/constants/booleanScreen";
import { LandingHeader } from "@components/HeaderDashboard/LandingHeader";

export const QueryPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div id="query-container">
      <LandingHeader avatar={null} />
      <div style={{ ...queryStyle.main }}>
        <p className="landing-about" style={{ paddingTop: "100px", margin: 0 }}>
          <span> a platform for </span>
          <span>self-actualization </span>
          <br style={{ marginTop: "5px" }} />
          <span>and </span>
          <span>collaboration</span>
        </p>
        <button
          type="button"
          style={queryStyle.question}
          onClick={() => { navigate("/ZinZenFAQ"); }}
        >
          {t("ihavequestions")}
        </button>
        <button
          type="button"
          style={queryStyle.question}
          onClick={() => { navigate("/"); }}
        >
          {t("ialreadyknowZinZen")}
        </button>
      </div>
    </div>
  );
};
