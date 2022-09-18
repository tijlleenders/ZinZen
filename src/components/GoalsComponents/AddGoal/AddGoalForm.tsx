
/* eslint-disable import/no-duplicates */
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { addGoal, createGoal, getGoal, updateGoal } from "@src/api/GoalsAPI";
import { darkModeState } from "@store";
import { colorPallete } from "@src/utils";
import { languagesFullForms } from "@translations/i18n";

import { TagsExtractor } from '@src/helpers/TagsExtractor';
import ITagExtractor, { ITagIndices, ITags } from '@src/Interfaces/ITagExtractor';

import "@translations/i18n";
import "./AddGoalForm.scss";
import { addInGoalsHistory, displayAddGoal, displayGoalId } from "@src/store/GoalsHistoryState";
import GoalTags from "../GoalTags/GoalTags";

interface AddGoalFormProps {
  selectedColorIndex: number,
  parentGoalId: number | -1,
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ selectedColorIndex, parentGoalId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const darkModeStatus = useRecoilValue(darkModeState);
  const goalID = useRecoilValue(displayGoalId);

  const addInHistory = useSetRecoilState(addInGoalsHistory);
  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);

  const [error, setError] = useState("");
  const [goalTitle, setGoalTitle] = useState("");
  const [formInputData, setFormInputData] = useState('');
  const [goalTags, setGoalTags] = useState<ITags>({});
  const [magicIndices, setMagicIndices] = useState<ITagIndices[]>([]);

  const lang = localStorage.getItem("language")?.slice(1, -1);
  const goalLang = lang ? languagesFullForms[lang] : languagesFullForms.en;

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
      goalTags.startTime ? goalTags.startTime.value : null,
      goalTags.endTime ? goalTags.endTime.value : null,
      0,
      parentGoalId!,
      colorPallete[selectedColorIndex], // goalColor
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
    setFormInputData('');
    setGoalTitle("");
    const typeOfPage = window.location.href.split("/").slice(-1)[0];
    setShowAddGoal(null);
    if (typeOfPage === "AddGoals") { navigate("/Home/MyGoals", { replace: true }); }
  };

  
  useEffect(() => {
    const output: ITagExtractor = TagsExtractor(formInputData);
    if (output.occurences.length > 0) setGoalTitle(formInputData.slice(0, output.occurences[0].index));
    else setGoalTitle(formInputData.trim());
    setGoalTags(output.tags);
    setMagicIndices(output.occurences);
  }, [formInputData]);
  
  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div>
        <input
          autoComplete="off"
          className={darkModeStatus ? "addtask-dark" : "addtask-light"}
          type="text"
          name="inputGoal"
          placeholder={t("addGoalPlaceholder")}
          value={formInputData}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={(e) => setFormInputData(e.target.value)}
        />
      </div>
      {
        formInputData !== '' && 
        <GoalTags 
          selectedColorIndex={selectedColorIndex}
          goalLang = {goalLang}
          magicIndices={magicIndices}
          goalTags={goalTags}
          setGoalTags={setGoalTags}
          formInputData={formInputData}
          setFormInputData={setFormInputData}
        />
      }
      <div className={darkModeStatus ? "mygoalsbutton-dark" : "mygoalsbutton-light"}>
        <Button
          onClick={handleSubmit}
          className="addtask-button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
        >
          Add Goal
        </Button>
      </div>
      <div style={{ marginLeft: "10px", marginTop: "10px", color: "red", fontWeight: "lighter" }}>{error}</div>
    </form>
  );
};
