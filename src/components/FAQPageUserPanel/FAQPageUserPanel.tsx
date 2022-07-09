import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import "@translations/i18n";
import "./FAQPageUserPanel.scss";

export const FAQPageUserPanel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <div className="slide">
      <Container fluid>
        <Row>
          <h3 className={darkModeStatus ? "faq-question-text-dark" : "faq-question-text-light"}>
            {t("Qwhatiszinzen")}
          </h3>
          <p className={darkModeStatus ? "faq-answer-text-dark" : "faq-answer-text-light"}>{t("AnsWhatiszinzen")}</p>
        </Row>
        <Row>
          <h3 className={darkModeStatus ? "faq-question-text-dark" : "faq-question-text-light"}>
            {t("Qiszinzenprivate")}
          </h3>
          <p className={darkModeStatus ? "faq-answer-text-dark" : "faq-answer-text-light"}>{t("Ansiszinzenprivate")}</p>
        </Row>
        <Row>
          <h3 className={darkModeStatus ? "faq-question-text-dark" : "faq-question-text-light"}>
            {t("Qiszinzenexpensive")}
          </h3>
          <p className={darkModeStatus ? "faq-answer-text-dark" : "faq-answer-text-light"}>
            {t("Ansiszinzenexpensive")}
          </p>
        </Row>
        <Row>
          <h3 className={darkModeStatus ? "faq-question-text-dark" : "faq-question-text-light"}>
            {t("Qtoogoodtobetrue")}
          </h3>
          <p className={darkModeStatus ? "faq-answer-text-dark" : "faq-answer-text-light"}>{t("Anstoogoodtobetrue")}</p>
        </Row>
        <Row>
          <Button
            variant={darkModeStatus ? "brown" : "peach"}
            size="lg"
            className={darkModeStatus ? "faq-choice-dark" : "faq-choice-light"}
            onClick={() => {
              navigate("/Home/ZinZen/Feedback");
            }}
          >
            {t("ihavedifferentquestions")}
          </Button>
          <Button
            variant={darkModeStatus ? "brown" : "peach"}
            size="lg"
            className={darkModeStatus ? "faq-choice-dark" : "faq-choice-light"}
            onClick={() => {
              navigate("/Home/MyTime");
            }}
          >
            {t("ihavenomorequestions")}
          </Button>
        </Row>
      </Container>
    </div>
  );
};
