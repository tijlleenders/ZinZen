import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { getGoal } from "@src/api/GoalsAPI";
import { darkModeState, displayInbox, lastAction } from "@store";
import { colorPallete } from "@src/utils";
import { displayUpdateGoal, selectedColorIndex } from "@src/store/GoalsState";
import { formatTagsToText } from "@src/helpers/GoalProcessor";
import { getSharedWMGoal } from "@src/api/SharedWMAPI";
import InputGoal from "../InputGoal";

import "@translations/i18n";
import "./UpdateGoalForm.scss";

export const UpdateGoalForm = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const openInbox = useRecoilValue(displayInbox);
  const [goalInput, setGoalInput] = useState("");
  const [goalLang, setGoalLang] = useState("english");
  const [colorIndex, setColorIndex] = useRecoilState(selectedColorIndex);
  const setLastAction = useSetRecoilState(lastAction);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLastAction("updateGoal");
  };

  useEffect(() => {
    if (showUpdateGoal) {
      (openInbox ? getSharedWMGoal(showUpdateGoal.goalId) : getGoal(showUpdateGoal.goalId)).then((goal) => {
        const res = formatTagsToText(goal);
        if (goal.language) setGoalLang(goal.language);
        setColorIndex(colorPallete.indexOf(goal.goalColor));
        setGoalInput(res.inputText);
      });
    }
  }, []);

  const changeColor = () => {
    if (!openInbox) {
      const newColorIndex = colorIndex + 1;
      if (colorPallete[newColorIndex]) setColorIndex(newColorIndex);
      else setColorIndex(0);
    }
  };

  return (
    <form id="updateGoalForm" className="todo-form" onSubmit={handleSubmit}>
      {
        goalInput !== "" && (
          <InputGoal
            goalInput={goalInput}
            selectedColor={colorPallete[colorIndex]}
            goalLang={goalLang}
          />
        )
      }
      <button
        type="button"
        style={
          darkModeStatus
            ? { backgroundColor: colorPallete[colorIndex] }
            : { backgroundColor: colorPallete[colorIndex] }
        }
        id="changeColor-btn"
        className="form-tag"
        onClick={changeColor}
      >
        Color
      </button>
    </form>
  );
};
