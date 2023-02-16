import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Container, Button } from "react-bootstrap";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { darkModeState, displayLoader, displayToast } from "@store";
import { submitFeedback } from "@src/api/FeedbackAPI";
import { LandingHeader } from "@components/HeaderDashboard/LandingHeader";

import "@translations/i18n";
import "./feedbackpage.scss";

export const FeedbackPage = () => {
  const [userRating, setUserRating] = useState(3);
  const [userFeedback, setUserFeedback] = useState("");
  const darkModeStatus = useRecoilValue(darkModeState);
  const setLoading = useSetRecoilState(displayLoader);
  const setDisplayToast = useSetRecoilState(displayToast);

  async function submitToAPI(feedback: string) {
    const updatedFeedback = `Rating : ${userRating}\n${feedback}`;
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
    <div id="feedback-container">
      <LandingHeader avatar="back" />
      <Container className="slide" fluid>
        {userRating === 0 ? <h1>hello</h1> : null}
        <div style={{ color: `${darkModeStatus ? "white" : "black"}` }}>
          <p id="feedback-line-1">{t("opinion")}</p>
          <h1 id="feedback-line-2">
            {" "}
            {t("rate")}
          </h1>
          <div className="rating">
            {[...Array(5).keys()].map((index) => {
              const idx = index + 1;
              return (
                <button
                  id="userRating-btn"
                  type="button"
                  key={idx}
                  className={idx <= userRating ? "decided" : "notDecided"}
                  onClick={() => { setUserRating(idx); }}
                >
                  <span className="star">&#9733;</span>
                </button>
              );
            })}
          </div>
          <h5 id="feedback-line-3">{t("experience")}</h5>
          <textarea
            id={`feedback-textbox${darkModeStatus ? "-dark" : ""}`}
            value={userFeedback}
            onChange={(e) => { setUserFeedback(e.target.value); }}
            placeholder={t("feedbackPlaceholder")}
          />
          <p id="feedback-line-4">{t("anonymousFeedback")}</p>
          <Button id="feedback-submit-btn" onClick={() => { submitToAPI(userFeedback); }}>
            {" "}
            {t("submit")}
          </Button>
        </div>
      </Container>
    </div>
  );
};
