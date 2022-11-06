/* eslint-disable */
import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { useNavigate } from "react-router";

import { addGoal, createGoal, getGoal, updateGoal } from "@src/api/GoalsAPI";
import { darkModeState } from "@store";
import { colorPallete } from "@src/utils";
import { languagesFullForms } from "@translations/i18n";
import {
  addInGoalsHistory,
  displayAddGoal,
  displayGoalId,
  extractedTitle,
  inputGoalTags,
  selectedColorIndex
} from "@src/store/GoalsState";
import InputGoal from "../InputGoal";

import "@translations/i18n";
import "./AddGoalForm.scss";

interface AddGoalFormProps {
  parentGoalId: number | -1,
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ parentGoalId }) => {
  const navigate = useNavigate();

  const darkModeStatus = useRecoilValue(darkModeState);
  const goalID = useRecoilValue(displayGoalId);

  const addInHistory = useSetRecoilState(addInGoalsHistory);
  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [goalTags, setGoalTags] = useRecoilState(inputGoalTags);
  const [goalTitle, setGoalTitle] = useRecoilState(extractedTitle);
  const [colorIndex, setColorIndex] = useRecoilState(selectedColorIndex);
  const [error, setError] = useState("");

  const lang = localStorage.getItem("language")?.slice(1, -1);
  const goalLang = lang ? languagesFullForms[lang] : languagesFullForms.en;

  const changeColor = () => {
    const newColorIndex = colorIndex + 1;
    if (colorPallete[newColorIndex]) setColorIndex(newColorIndex);
    else setColorIndex(0);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (goalTitle.length === 0) {
      setError("Enter a goal title!");
      return;
    }
    const newGoal = createGoal(
      goalTitle.split(" ").filter((ele) => ele !== "").join(" "),
      goalTags.repeats ? goalTags?.repeats.value.trim() : null,
      goalTags.duration ? goalTags.duration.value : null,
      goalTags.start ? goalTags.start.value : null,
      goalTags.due ? goalTags.due.value : null,
      goalTags.afterTime ? goalTags.afterTime.value : null,
      goalTags.beforeTime ? goalTags.beforeTime.value : null,
      0,
      parentGoalId!,
      colorPallete[colorIndex], // goalColor
      goalLang,
      goalTags.link ? goalTags.link.value.trim() : null
    );
    const newGoalId = await addGoal(newGoal);
    if (parentGoalId) {
      const parentGoal = await getGoal(parentGoalId);
      const newSublist = parentGoal && parentGoal.sublist ? [...parentGoal.sublist, newGoalId] : [newGoalId];
      await updateGoal(parentGoalId, { sublist: newSublist });
      if (goalID !== showAddGoal?.goalId) { addInHistory(parentGoal); }
    }

    const typeOfPage = window.location.href.split("/").slice(-1)[0];
    setShowAddGoal(null);
    setGoalTags({});
    setGoalTitle("");
    setColorIndex(0);
    if (typeOfPage === "AddGoals") { navigate("/Home/MyGoals", { replace: true }); }
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
      <div style={{ marginLeft: "10px", marginTop: "10px", color: "red", fontWeight: "lighter" }}>{error}</div>
    </form>
  );
};
