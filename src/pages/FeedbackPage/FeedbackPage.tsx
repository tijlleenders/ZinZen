/* eslint-disable no-alert */
import React, { useState } from "react";
import { Container, Button, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { darkModeState } from "@store";
import { submitFeedback } from "@src/api/FeedbackAPI";

import "@translations/i18n";
import "./feedbackpage.scss";
import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";

export const FeedbackPage = () => {
  const [userRating, setUserRating] = useState(5);
  const [userFeedback, setUserFeedback] = useState("");
  const darkModeStatus = useRecoilValue(darkModeState);

  async function submitToAPI(feedback: string) {
    const updatedFeedback = `Rating : ${userRating}\n${feedback}`;
    const res = await submitFeedback(updatedFeedback);
    if (res.status === "success") {
      alert(res.message);
      setUserFeedback("");
      setUserRating(0);
    } else {
      alert(res.message);
    }
  }
  const { t } = useTranslation();

  return (
    <div id="feedback-container">
      <MainHeaderDashboard />
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
            id="feedback-textbox"
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
