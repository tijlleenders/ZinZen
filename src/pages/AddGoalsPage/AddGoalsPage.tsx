import React, { useState } from "react";
import { Container, Row, Button, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { darkModeState } from "@store";
import { GoalsForm } from "@components/GoalsComponents/GoalsForm";
import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import paintBrush from "@assets/images/paintBrush.svg";

import "@translations/i18n";
import "@components/GoalsComponents/GoalsComponents.scss";

export const AddGoalsPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();

  const [selectedColorIndex, setColorIndex] = useState(0);

  const darkrooms = ["#443027", "#9C4663", "#646464", "#2B517B", " #612854"];
  const lightcolors = [" #EDC7B7", "#AC3B61", " #BAB2BC", " #3B6899", " #8E3379"];

  const changeColor = () => {
    const newColorIndex = selectedColorIndex + 1;
    if (darkrooms[newColorIndex]) setColorIndex(newColorIndex);
    else setColorIndex(0);
  };
  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
      </Container>
      <Container fluid id="addGoals-container">
        <Row className="position">
          <div>
            <h2 className={darkModeStatus ? "mygoals-font-dark" : "mygoals-font-light"}>{t("myGoalsMessage")}</h2>
            <div className={darkModeStatus ? "goalsubtext-font-dark" : "goalsubtext-font-light"}>
              <p>
                {t("goalsubtext")}
                <br />
                {" "}
                {t("format")}
              </p>
            </div>
          </div>
          <button
            id="changeColor-btn"
            type="button"
            style={
                darkModeStatus
                  ? { backgroundColor: darkrooms[selectedColorIndex] }
                  : { backgroundColor: lightcolors[selectedColorIndex] }
              }
            onClick={changeColor}
          ><img src={paintBrush} alt="change-color" />
          </button>
        </Row>
        <Row>
          <GoalsForm selectedColorIndex={selectedColorIndex} />
        </Row>
      </Container>
    </div>
  );
};
