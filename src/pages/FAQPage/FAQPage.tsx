/* eslint-disable no-unused-expressions */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import chevronLeftIcon from "@assets/images/chevronLeft.svg";

import ZAccordion from "@src/common/Accordion";
import { vibrateWorks } from "@src/constants/vibrateCheck";
import OnboardingLayout from "@src/layouts/OnboardingLayout";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import "@translations/i18n";

const customStyle = {
  display: "flex",
  alignItems: "flex-end",
  border: "none",
  background: "var(--selection-color)",
  borderRadius: 8,
  padding: 8,
  fontSize: "0.875rem",
  fontWeight: 500,
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
  margin: "14px auto 0",
};

export const FAQPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const QnA = [
    { header: t("qWhatIsZinZen"), body: t("ansWhatIsZinZen") },
    { header: t("qIsZinZenPrivate"), body: t("AnsIsZinZenPrivate") },
    { header: t("qIsZinZenExpensive"), body: t("ansIsZinZenExpensive") },
    { header: t("qTooGoodToBeTrue"), body: t("ansTooGoodToBeTrue") },
  ];

  const handleClick = () => {
    localStorage.setItem("checkedIn", "yes");
    const invite = localStorage.getItem("pendingInvite");
    localStorage.removeItem("pendingInvite");
    vibrateWorks ? navigator.vibrate(100) : null;
    if (invite && invite !== "none") {
      navigate(`/invite/${invite}`);
    } else {
      navigate("/");
    }
  };

  return (
    <OnboardingLayout>
      <p className={`faqpage-about${darkModeStatus ? "-dark" : ""}`}>
        <span style={{ color: darkModeStatus ? "#AB9ED8" : "#C6441D" }}>Better together </span>
      </p>
      <div style={{ marginTop: 8, width: "100%" }}>
        <ZAccordion
          defaultActiveKey={["1"]}
          showCount={false}
          style={{ background: "var(--bottom-nav-color)" }}
          panels={QnA.map((ele) => ({
            header: ele.header,
            body: (
              <p style={{ textAlign: "left", fontWeight: 500, color: "#000" }}>
                {ele.body.split(" ")[0].includes("ZinZen") ? (
                  <>
                    {" "}
                    ZinZen<sup>®</sup> {ele.body.split(" ").slice(1).join(" ")}{" "}
                  </>
                ) : (
                  ele.body
                )}
              </p>
            ),
          }))}
        />
        <button style={customStyle} type="button" onClick={handleClick}>
          {" "}
          {t("continue")}{" "}
          <img
            className="chevronRight theme-icon"
            src={chevronLeftIcon}
            alt="zinzen faq"
            style={{ marginLeft: 6, paddingBottom: 2 }}
          />
        </button>
      </div>
    </OnboardingLayout>
  );
};
