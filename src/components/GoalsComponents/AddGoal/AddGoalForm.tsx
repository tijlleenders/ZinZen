/* eslint-disable */
import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import { lastAction } from "@store";
import { colorPalleteList } from "@src/utils";
import { languagesFullForms } from "@translations/i18n";
import {
  selectedColorIndex
} from "@src/store/GoalsState";
import InputGoal from "../InputGoal";

import "@translations/i18n";
import "./AddGoalForm.scss";
import ColorPalette from "@src/common/ColorPalette";

export const AddGoalForm = () => {

  const [colorIndex, setColorIndex] = useRecoilState(selectedColorIndex);
  const setLastAction = useSetRecoilState(lastAction);
  const lang = localStorage.getItem("language")?.slice(1, -1);
  const goalLang = lang ? languagesFullForms[lang] : languagesFullForms.en;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLastAction("addGoal");
  };

  return (
    <form id="addGoalForm" className="todo-form" onSubmit={handleSubmit}>
      <InputGoal
        goalInput=""
        selectedColor={colorPalleteList[colorIndex]}
        goalLang={goalLang}
      />
      <ColorPalette colorIndex={colorIndex} setColorIndex={setColorIndex} />
      
    </form>
  );
};

