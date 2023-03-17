import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import settings from "@assets/images/settings.svg";

import { getGoal } from "@src/api/GoalsAPI";
import { colorPalleteList } from "@src/utils";
import { displayInbox, lastAction } from "@store";
import ColorPalette from "@src/common/ColorPalette";
import { getSharedWMGoal } from "@src/api/SharedWMAPI";
import { formatTagsToText } from "@src/helpers/GoalProcessor";
import { displayUpdateGoal, selectedColorIndex } from "@src/store/GoalsState";
import InputGoal from "../InputGoal";

import "@translations/i18n";
import "./UpdateGoalForm.scss";
import GoalConfigModal from "../GoalConfigModal/GoalConfigModal";
import { GoalItem } from "@src/models/GoalItem";

export const UpdateGoalForm = () => {
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const openInbox = useRecoilValue(displayInbox);
  const [thisGoal, setThisGoal] = useState<GoalItem | null>(null);
  const [goalInput, setGoalInput] = useState("");
  const [goalLang, setGoalLang] = useState("english");
  const [openGoalConfig, setOpenGoalConfig] = useState(false);
  const [colorIndex, setColorIndex] = useRecoilState(selectedColorIndex);
  const setLastAction = useSetRecoilState(lastAction);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLastAction("updateGoal");
  };

  useEffect(() => {
    if (showUpdateGoal) {
      (openInbox ? getSharedWMGoal(showUpdateGoal.goalId) : getGoal(showUpdateGoal.goalId)).then((goal) => {
        setThisGoal(goal);
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
      <div>
        <ColorPalette colorIndex={colorIndex} setColorIndex={setColorIndex} />
        <button type="button" onClick={() => { setOpenGoalConfig(!openGoalConfig); }} className="ordinary-btn" style={{ marginLeft: "20px" }}> <img src={settings} alt="update goal" /></button>
      </div>
      { openGoalConfig && thisGoal && <GoalConfigModal goal={thisGoal} />}
    </form>
  );
};
