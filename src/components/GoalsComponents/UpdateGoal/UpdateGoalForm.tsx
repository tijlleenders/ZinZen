import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { getGoal, updateGoal } from "@src/api/GoalsAPI";
import { darkModeState } from "@store";
import { colorPallete } from "@src/utils";

import "@translations/i18n";
import "./UpdateGoalForm.scss";
import { displayUpdateGoal } from "@src/store/GoalsHistoryState";
import { TagsExtractor } from "@src/helpers/TagsExtractor";
import ITagExtractor, { ITags, ITagIndices } from "@src/Interfaces/ITagExtractor";
import GoalTags from "../GoalTags/GoalTags";

interface UpdateGoalFormProps {
  selectedColorIndex: number,
}

export const UpdateGoalForm: React.FC<UpdateGoalFormProps> = ({ selectedColorIndex }) => {
  const { t } = useTranslation();

  const darkModeStatus = useRecoilValue(darkModeState);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);

  const [error, setError] = useState("");
  const [goalTitle, setGoalTitle] = useState("");
  const [formInputData, setFormInputData] = useState('');
  const [goalTags, setGoalTags] = useState<ITags>({});
  const [magicIndices, setMagicIndices] = useState<ITagIndices[]>([]);
  const [goalLang, setGoalLang] = useState("english");


  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (goalTitle.length === 0) {
      setError("Enter a goal title!");
      return;
    }
    console.log({
      title: goalTitle.split(" ").filter((ele) => ele !== "").join(" "),
        goalColor: colorPallete[selectedColorIndex],
        duration: goalTags.duration ? goalTags.duration.value : null,
        repeat: goalTags.repeats ? goalTags.repeats.value : null,
        link: goalTags.link ? goalTags.link.value?.trim() : null,
        start: goalTags.start ? goalTags.start.value : null,
        due: goalTags.due ? goalTags.due.value : null,
        startTime: goalTags.startTime ? goalTags.startTime.value : null,
        endTime: goalTags.endTime ? goalTags.endTime.value : null,
    })
    await updateGoal(showUpdateGoal?.goalId,
      { title: goalTitle.split(" ").filter((ele) => ele !== "").join(" "),
        goalColor: colorPallete[selectedColorIndex],
        duration: goalTags.duration ? goalTags.duration.value : null,
        repeat: goalTags.repeats ? goalTags.repeats.value : null,
        link: goalTags.link ? goalTags.link.value?.trim() : null,
        start: goalTags.start ? goalTags.start.value : null,
        due: goalTags.due ? goalTags.due.value : null,
        startTime: goalTags.startTime ? goalTags.startTime.value : null,
        endTime: goalTags.endTime ? goalTags.endTime.value : null,
      });
    setFormInputData('');
    setGoalTitle("");
    setShowUpdateGoal(null);
  };

  useEffect(() => {
    getGoal(showUpdateGoal?.goalId).then((goal) => {
      let tmpTiming = "";
      if (goal.startTime && goal.endTime) {
        tmpTiming = ` ${goal.startTime}-${goal.endTime}`;
      } else if (goal.startTime) {
        tmpTiming = ` after ${goal.startTime}`;
      } else if (goal.endTime) {
        tmpTiming = ` before ${goal.endTime}`;
      }
      console.log(goal)
      setFormInputData(`${goal.title}${goal.duration ? ` ${goal.duration}hours` : ""}${goal.start ? ` start ${goal.start.getDate()}/${goal.start.getMonth() + 1}` : ""}${goal.due ? ` due ${goal.due.getDate()}/${goal.due.getMonth() + 1}` : ""}${goal.repeat ? ` ${goal.repeat}` : ""}${tmpTiming}${goal.link ? ` ${goal.link}` : ""}`);
      if (goal.language) setGoalLang(goal.language);
    });
  }, []);

  
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
          Update Goal
        </Button>
      </div>
      <div style={{ marginLeft: "10px", marginTop: "10px", color: "red", fontWeight: "lighter" }}>{error}</div>
    </form>
  );
};
