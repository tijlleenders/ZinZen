/* eslint-disable */
import React from "react";
import { useRecoilValue, useRecoilState } from "recoil";

import { darkModeState } from "@store";
import { colorPallete } from "@src/utils";
import { languagesFullForms } from "@translations/i18n";
import {
  selectedColorIndex
} from "@src/store/GoalsState";
import InputGoal from "../InputGoal";

import "@translations/i18n";
import "./AddGoalForm.scss";

interface AddGoalFormProps {
  parentGoalId: string,
  addThisGoal: (e: React.SyntheticEvent) => Promise<void>
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ parentGoalId, addThisGoal }) => {

  const darkModeStatus = useRecoilValue(darkModeState);
  const [colorIndex, setColorIndex] = useRecoilState(selectedColorIndex);

  const lang = localStorage.getItem("language")?.slice(1, -1);
  const goalLang = lang ? languagesFullForms[lang] : languagesFullForms.en;

  const changeColor = () => {
    const newColorIndex = colorIndex + 1;
    if (colorPallete[newColorIndex]) setColorIndex(newColorIndex);
    else setColorIndex(0);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    await addThisGoal(e);
  };

  return (
    <form id="addGoalForm" className="todo-form" onSubmit={handleSubmit}>
      <InputGoal
        goalInput=""
        selectedColor={colorPallete[colorIndex]}
        goalLang={goalLang}
      />
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
