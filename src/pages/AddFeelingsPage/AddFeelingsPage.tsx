// @ts-nocheck
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";

import { getJustDate } from "@utils";
import { darkModeState } from "@store";
import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { AddFeelingsChoices } from "./AddFeelingsChoices";

import "@translations/i18n";
import "./AddFeelingsPage.scss";

export const AddFeelingsPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const date = location?.state?.feelingDate !== undefined
    ? getJustDate(location?.state?.feelingDate)
    : getJustDate(new Date());
  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
      </Container>
      <Container fluid className="slide add-feelings__container">
        <Row>
          <Col>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 className={darkModeStatus ? "my-feelings-font-dark" : "my-feelings-font-light"}>
                {date.getTime() === getJustDate(new Date()).getTime()
                  ? t("feelingsmessage")
                  : `${t("feelingsMessagePast")} ${date.toDateString()}`}
              </h3>
              <Button
                id="myFeelings-redirect-btn-desktop"
                onClick={() => navigate("/Home/MyFeelings")}
              >View My Feelings
              </Button>
            </div>
            <AddFeelingsChoices date={date} />
          </Col>
        </Row>
        <Button
          id="myFeelings-redirect-btn-mobile"
          onClick={() => navigate("/Home/MyFeelings")}
        >View My Feelings
        </Button>
      </Container>
    </div>
  );
};
