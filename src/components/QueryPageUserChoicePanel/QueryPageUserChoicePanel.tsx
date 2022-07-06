import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import "@translations/i18n";
import "./QueryPageUserChoicePanel.scss";

export const QueryPageUserChoicePanel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <div className="slide">
      <Container fluid>
        <Row>
          <h4 className="left-panel-font1-query">Realize dreams</h4>
          <h4 className="left-panel-font2-query">
            <i>together</i>
          </h4>
        </Row>
        <Row>
          <Button
            variant={darkModeStatus ? "brown" : "peach"}
            size="lg"
            className={darkModeStatus ? "query-choice-dark1" : "query-choice-light1"}
            onClick={() => {
              navigate("/ZinZenFAQ");
            }}
          >
            {t("ihavequestions")}
          </Button>
          <Button
            variant={darkModeStatus ? "brown" : "peach"}
            size="lg"
            className={darkModeStatus ? "query-choice-dark" : "query-choice-light"}
            onClick={() => {
              navigate("/Home");
            }}
          >
            <div style={{ display: "flex" }}>
              {t("ialreadyknowZinZen")}
              <div style={{ fontSize: "small" }}>
                ®
              </div>
            </div>
          </Button>
        </Row>
      </Container>
    </div>
  );
};
