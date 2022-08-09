import React, { useEffect, useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import paintBrush from "@assets/images/paintBrush.svg";
import { darkModeState } from "@store";
import { colorPallete } from "@src/utils";
import { getGoal } from "@src/api/GoalsAPI";
import { UpdateGoalForm } from "./UpdateGoalForm";

import "@translations/i18n";
import "./UpdateGoalForm.scss";

interface UpdateGoalProps {
  goalId: number,
  setShowUpdateGoal: React.Dispatch<React.SetStateAction<{
    open: boolean;
    goalId: number;
  }>>
}

export const UpdateGoal: React.FC<UpdateGoalProps> = ({ goalId, setShowUpdateGoal }) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [selectedColorIndex, setColorIndex] = useState(0);

  const changeColor = () => {
    const newColorIndex = selectedColorIndex + 1;
    if (colorPallete[newColorIndex]) setColorIndex(newColorIndex);
    else setColorIndex(0);
  };

  useEffect(() => {
    const getGoalColor = async () => {
      const goal = await getGoal(Number(goalId));
      setColorIndex(colorPallete.indexOf(goal.goalColor));
    };
    getGoalColor();
  }, []);

  return (
    <Container fluid id="addGoals-container">
      <Row className="position">
        <div
          className="alignment-div"
        >
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
        </div>

        <div>
          <div className={darkModeStatus ? "goalsubtext-font-dark" : "goalsubtext-font-light"}>
            <p style={{ fontStyle: "normal" }}>
              {t("goalsubtext")}
              <br /> {t("format")}
            </p>
          </div>
        </div>
      </Row>
      <Row>
        <UpdateGoalForm goalId={goalId} setShowUpdateGoal={setShowUpdateGoal} selectedColorIndex={selectedColorIndex} />
      </Row>
    </Container>
  );
};
