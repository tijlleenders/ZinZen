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
import "./FAQPage.scss";
import "@translations/i18n";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";

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
    localStorage.setItem(LocalStorageKeys.CHECKED_IN, "yes");
    const invite = localStorage.getItem(LocalStorageKeys.PENDING_INVITE);
    localStorage.removeItem(LocalStorageKeys.PENDING_INVITE);
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
        <span style={{ color: darkModeStatus ? "#AB9ED8" : "#C6441D", fontSize: "18px" }}>Better together </span>
      </p>
      <div className="intro-features-drawer">
        <ZAccordion
          defaultActiveKey={["1"]}
          showCount={false}
          style={{ background: "var(--bottom-nav-color)" }}
          panels={QnA.map((ele) => ({
            header: ele.header,
            body: (
              <p className="faq-question-content">
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
        <button className="action-btn" type="button" tabIndex={0} onKeyDown={handleClick} onClick={handleClick}>
          {t("continue")} <img className="chevronRight theme-icon" src={chevronLeftIcon} alt="zinzen faq" />
        </button>
      </div>
    </OnboardingLayout>
  );
};
