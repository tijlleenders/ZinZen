import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { getGoal } from "@src/api/GoalsAPI";
import { darkModeState } from "@store";
import { colorPallete } from "@src/utils";
import { displayUpdateGoal, selectedColorIndex } from "@src/store/GoalsState";
import { formatTagsToText } from "@src/helpers/GoalProcessor";
import InputGoal from "../InputGoal";

import "@translations/i18n";
import "./UpdateGoalForm.scss";

interface UpdateGoalFormProps {
  updateThisGoal: (e: React.SyntheticEvent) => Promise<void>
}
export const UpdateGoalForm : React.FC<UpdateGoalFormProps> = ({ updateThisGoal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);

  const [goalInput, setGoalInput] = useState("");
  const [goalLang, setGoalLang] = useState("english");
  const [colorIndex, setColorIndex] = useRecoilState(selectedColorIndex);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    await updateThisGoal(e);
  };

  useEffect(() => {
    if (showUpdateGoal) {
      getGoal(showUpdateGoal.goalId).then((goal) => {
        const res = formatTagsToText(goal);
        if (goal.language) setGoalLang(goal.language);
        setColorIndex(colorPallete.indexOf(goal.goalColor));
        setGoalInput(res.inputText);
      });
    }
  }, []);

  const changeColor = () => {
    const newColorIndex = colorIndex + 1;
    if (colorPallete[newColorIndex]) setColorIndex(newColorIndex);
    else setColorIndex(0);
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
