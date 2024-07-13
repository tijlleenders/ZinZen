import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { submitFeedback } from "@src/api/FeedbackAPI";
import OnboardingLayout from "@src/layouts/OnboardingLayout";
import { darkModeState, displayLoader, displayToast } from "@store";

import releaseInfo from "../../version.json";

import "@translations/i18n";
import "./feedbackpage.scss";

export const FeedbackPage = () => {
  const [userRating, setUserRating] = useState(3);
  const [userFeedback, setUserFeedback] = useState("");
  const darkModeStatus = useRecoilValue(darkModeState);
  const setLoading = useSetRecoilState(displayLoader);
  const setDisplayToast = useSetRecoilState(displayToast);

  async function submitToAPI(feedback: string) {
    const updatedFeedback = `Rating : ${userRating}\n${feedback}\n\nBuild Info:\nVersion numbers: ${releaseInfo.buildHash}\nRelease Date: ${releaseInfo.buildDate}`;
    setLoading(true);
    const res = await submitFeedback(updatedFeedback);
    setLoading(false);
    if (res.status === "success") {
      setUserFeedback("");
      setUserRating(0);
    }
    setDisplayToast({ open: true, message: res.message, extra: "" });
  }
  const { t } = useTranslation();

  return (
    <OnboardingLayout>
      <div style={{ color: `${darkModeStatus ? "white" : "black"}` }}>
        <p id="feedback-line-1">{t("opinion")}</p>
        <p id="feedback-line-2"> {t("rate")}</p>
        <div className="rating">
          {[...Array(5).keys()].map((index) => {
            const idx = index + 1;
            return (
              <button
                type="button"
                key={idx}
                className={`userRating-btn ${idx <= userRating ? "decided" : "notDecided"}`}
                onClick={() => {
                  setUserRating(idx);
                }}
              >
                <span
                  style={idx > userRating ? { color: `${darkModeStatus ? "#2e2e2e" : "#f1f1f1"}` } : {}}
                  className="star"
                >
                  &#9733;
                </span>
              </button>
            );
          })}
        </div>
        <p id="feedback-line-3">{t("experience")}</p>
        <textarea
          id={`feedback-textbox${darkModeStatus ? "-dark" : ""}`}
          value={userFeedback}
          onChange={(e) => {
            setUserFeedback(e.target.value);
          }}
          placeholder={t("feedbackPlaceholder")}
        />
        <p id="feedback-line-4">{t("anonymousFeedback")}</p>
        <button
          type="button"
          className="action-btn"
          id="feedback-submit-btn"
          onClick={() => {
            submitToAPI(userFeedback);
          }}
        >
          {t("submit")}
        </button>
      </div>
      {releaseInfo && (
        <div id="build-info-line">
          <p>Version numbers: {releaseInfo.buildHash}</p>
          <p>Release date: {new Date(releaseInfo.buildDate).toDateString()}</p>
        </div>
      )}
    </OnboardingLayout>
  );
};
