import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { getGoal } from "@src/api/GoalsAPI";
import { displayInbox, lastAction } from "@store";
import { colorPalleteList } from "@src/utils";
import { displayUpdateGoal, selectedColorIndex } from "@src/store/GoalsState";
import { formatTagsToText } from "@src/helpers/GoalProcessor";
import { getSharedWMGoal } from "@src/api/SharedWMAPI";
import ColorPalette from "@src/common/ColorPalette";
import InputGoal from "../InputGoal";

import "@translations/i18n";
import "./UpdateGoalForm.scss";

export const UpdateGoalForm = () => {
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
        setColorIndex(colorPalleteList.indexOf(goal.goalColor));
        setGoalInput(res.inputText);
      });
    }
  }, []);

  return (
    <form id="updateGoalForm" className="todo-form" onSubmit={handleSubmit}>
      {
        goalInput !== "" && (
          <InputGoal
            goalInput={goalInput}
            selectedColor={colorPalleteList[colorIndex]}
            goalLang={goalLang}
          />
        )
      }
      <ColorPalette colorIndex={colorIndex} setColorIndex={setColorIndex} />
    </form>
  );
};
