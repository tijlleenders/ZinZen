import React from "react";
import { Container, Button } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";
import { truncateContent } from "@utils";

import "@translations/i18n";
import "./ZinZenMenuPage.scss";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";

export const ZinZenMenuPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div>
      <MainHeaderDashboard />
      <Container id="menu-container" fluid>
        <div>
          <a href="https://github.com/tijlleenders/ZinZen">
            <Button
              variant={darkModeStatus ? "bdivn" : "peach"}
              size="lg"
              className={darkModeStatus ? "zinzen-menu-choice-dark1" : "zinzen-menu-choice-light1"}
            >
              {truncateContent(t("discover"))}
            </Button>
          </a>
        </div>
        <div>
          <a href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate">
            <Button
              variant={darkModeStatus ? "dark-pink" : "pink"}
              size="lg"
              className={darkModeStatus ? "zinzen-menu-choice-dark" : "zinzen-menu-choice-light"}
            >
              {truncateContent(t("donate"))}
            </Button>
          </a>
        </div>
        <div>
          <a href="##">
            <Button
              variant={darkModeStatus ? "dark-grey" : "grey-base"}
              size="lg"
              className={darkModeStatus ? "zinzen-menu-choice-dark" : "zinzen-menu-choice-light"}
              onClick={(e) => {
                e.preventDefault();
                navigate("/Home/ZinZen/Feedback");
              }}
            >
              {truncateContent(t("feedback"))}
            </Button>
          </a>
        </div>
        <div>
          <a href="https://blog.zinzen.me/">
            <Button
              variant={darkModeStatus ? "dark-blue" : "pale-blue"}
              size="lg"
              className={darkModeStatus ? "zinzen-menu-choice-dark" : "zinzen-menu-choice-light"}
            >
              {truncateContent(t("blog"))}
            </Button>
          </a>
        </div>
      </Container>
    </div>
  );
};
