import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { darkModeState } from "@store";
import { getGoal } from "@src/api/GoalsAPI";
import { colorPallete } from "@src/utils";
import { AddGoalForm } from "./AddGoalForm";
import paintBrush from "@assets/images/paintBrush.svg";

import "@translations/i18n";
import "./AddGoalForm.scss";

interface AddGoalProps {
  goalId: number,
  setShowAddGoals: React.Dispatch<React.SetStateAction<{
    open: boolean;
    goalId: number;
    }>>
}

export const AddGoal: React.FC<AddGoalProps> = ({ goalId, setShowAddGoals }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  // const locationState = useLocation().state as locationProps;

  const [selectedColorIndex, setColorIndex] = useState(0);
  const [parentGoalId, setParentGoalId] = useState<number | -1>();
  const [parentGoalTitle, setParentGoalTitle] = useState("");

  useEffect(() => {
    setParentGoalId(goalId || -1);
    if (parentGoalId !== -1 && parentGoalId !== undefined) {
      getGoal(parentGoalId!).then((parentGoal) => setParentGoalTitle(parentGoal.title));
    }
  }, [parentGoalId]);

  const changeColor = () => {
    const newColorIndex = selectedColorIndex + 1;
    if (colorPallete[newColorIndex]) setColorIndex(newColorIndex);
    else setColorIndex(0);
  };

  return (
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
                ? { backgroundColor: colorPallete[selectedColorIndex] }
                : { backgroundColor: colorPallete[selectedColorIndex] }
            }
          onClick={changeColor}
        >
          <img src={paintBrush} alt="change-color" />
        </button>
      </Row>
      <Row>
        <AddGoalForm goalId={goalId} setShowAddGoals={setShowAddGoals} selectedColorIndex={selectedColorIndex} parentGoalId={parentGoalId} />
      </Row>
    </Container>
  );
};
