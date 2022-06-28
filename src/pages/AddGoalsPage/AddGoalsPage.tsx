import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { useLocation } from "react-router";

import { darkModeState } from "@store";
import { GoalsForm } from "@components/GoalsComponents/GoalsForm";
import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { getGoal } from "@src/api/GoalsAPI";
import paintBrush from "@assets/images/paintBrush.svg";

import "@translations/i18n";
import "@components/GoalsComponents/GoalsComponents.scss";

interface locationProps {
  goalId: number;
}

export const AddGoalsPage: React.FC = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  const locationState = useLocation().state as locationProps;

  const [selectedColorIndex, setColorIndex] = useState(0);
  const [parentGoalId, setParentGoalId] = useState<number | -1>();
  const [parentGoalTitle, setParentGoalTitle] = useState("");
  const darkrooms = ["#EDC7B7", "#9C4663", "#646464", "#2B517B", " #612854"];
  const lightcolors = [" #EDC7B7", "#AC3B61", " #BAB2BC", " #3B6899", " #8E3379"];

  useEffect(() => {
    if (locationState) {
      setParentGoalId(locationState.goalId);
    } else setParentGoalId(-1);
    if (parentGoalId !== -1 && parentGoalId !== undefined) {
      getGoal(parentGoalId!).then((parentGoal) => setParentGoalTitle(parentGoal.title));
    }
  }, [parentGoalId]);

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
              <p style={{ fontStyle: "normal" }}>
                {parentGoalId !== -1 ? (
                  <>
                    for sublist <span style={{ color: "#BA0880" }}>{parentGoalTitle}</span>
                  </>
                ) : (
                  ""
                )}
                <br />
                {t("goalsubtext")}
                <br /> {t("format")}
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
          >
            <img src={paintBrush} alt="change-color" />
          </button>
        </Row>
        <Row>
          <GoalsForm selectedColorIndex={selectedColorIndex} parentGoalId={parentGoalId} />
        </Row>
      </Container>
    </div>
  );
};
