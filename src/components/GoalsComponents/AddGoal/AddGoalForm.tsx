/* eslint-disable */
import React from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";

import { darkModeState, lastAction } from "@store";
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
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ parentGoalId }) => {

  const darkModeStatus = useRecoilValue(darkModeState);
  const [colorIndex, setColorIndex] = useRecoilState(selectedColorIndex);
  const setLastAction = useSetRecoilState(lastAction);
  const lang = localStorage.getItem("language")?.slice(1, -1);
  const goalLang = lang ? languagesFullForms[lang] : languagesFullForms.en;

  const changeColor = () => {
    const newColorIndex = colorIndex + 1;
    if (colorPallete[newColorIndex]) setColorIndex(newColorIndex);
    else setColorIndex(0);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLastAction("addGoal");
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
