import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import paintBrush from "@assets/images/paintBrush.svg";
import { darkModeState } from "@store";
import { colorPallete } from "@src/utils";
import { getGoal } from "@src/api/GoalsAPI";
import { displayUpdateGoal } from "@src/store/GoalsHistoryState";
import { UpdateGoalForm } from "./UpdateGoalForm";

import "@translations/i18n";
import "./UpdateGoalForm.scss";

export const UpdateGoal = () => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);

  const [selectedColorIndex, setColorIndex] = useState(0);

  const changeColor = () => {
    const newColorIndex = selectedColorIndex + 1;
    if (colorPallete[newColorIndex]) setColorIndex(newColorIndex);
    else setColorIndex(0);
  };

  useEffect(() => {
    const getGoalColor = async () => {
      const goal = await getGoal(Number(showUpdateGoal?.goalId));
      setColorIndex(colorPallete.indexOf(goal.goalColor));
    };
    getGoalColor();
  }, []);

  return (
    <Container fluid id="addGoals-container">
      <Row className="position">
        <div>
          <h2 className={darkModeStatus ? "mygoals-font-dark" : "mygoals-font-light"}>Update Goal</h2>
          <div className={darkModeStatus ? "goalsubtext-font-dark" : "goalsubtext-font-light"}>
            <p style={{ fontStyle: "normal" }}>
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
                ? { backgroundColor: colorPallete[selectedColorIndex] }
                : { backgroundColor: colorPallete[selectedColorIndex] }
            }
          onClick={changeColor}
        >
          <img src={paintBrush} alt="change-color" />
        </button>
      </Row>
      <Row>
        <UpdateGoalForm selectedColorIndex={selectedColorIndex} />
      </Row>
    </Container>
  );
};
