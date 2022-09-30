// @ts-nocheck

import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import AddIconLight from "@assets/images/AddIconLight.png";
import AddIconDark from "@assets/images/AddIconDark.png";
import { darkModeState } from "@store";
import { truncateContent } from "@utils";

import "@translations/i18n";
import "./DashboardUserChoicePanel.scss";
import "@pages/Dashboard/Dashboard.scss";

export const DashboardUserChoicePanel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <div className="slide">
      <Container fluid>
        <Row>
          <Button
            variant={darkModeStatus ? "brown" : "peach"}
            size="lg"
            className={`no-add ${darkModeStatus ? "dashboard-choice-dark1" : "dashboard-choice-light1"}`}
            onClick={() => {
              navigate("/Home/MyGoals");
            }}
          >
            {truncateContent(t("mygoals"))}
          </Button>
        </Row>
        <Row>
          <Button
            variant={darkModeStatus ? "dark-pink" : "pink"}
            size="lg"
            className={darkModeStatus ? "dashboard-choice-dark no-add" : "dashboard-choice-light no-add"}
            onClick={() => {
              navigate("/Home/MyFeelings");
            }}
          >
            {truncateContent(t("myfeelings"))}
          </Button>
        </Row>
        <Row>
          <Button
            variant={darkModeStatus ? "dark-grey" : "grey-base"}
            size="lg"
            onClick={() => {
              navigate("/Home/MyTime");
            }}
            className={darkModeStatus ? "dashboard-choice-dark no-add" : "dashboard-choice-light no-add"}
          >
            {truncateContent(t("mytime"))}
          </Button>
        </Row>
        <Row>
          <Button
            variant={darkModeStatus ? "dark-blue" : "pale-blue"}
            size="lg"
            className={darkModeStatus ? "dashboard-choice-dark no-add" : "dashboard-choice-light no-add"}
            onClick={() => {
              navigate("/Home/Explore");
            }}
          >
            {truncateContent(t("explore"))}
          </Button>
        </Row>
        <Row>
          <Button
            variant={darkModeStatus ? "dark-purple" : "purple"}
            size="lg"
            className={darkModeStatus ? "dashboard-choice-dark no-add" : "dashboard-choice-light no-add"}
            onClick={() => {
              navigate("/Home/ZinZen");
            }}
          >
            <div style={{ display: "flex" }}>
              <div>
                ZinZen
              </div>
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
