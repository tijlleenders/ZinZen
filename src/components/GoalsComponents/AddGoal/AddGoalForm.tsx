/* eslint-disable import/no-duplicates */
import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { addGoal, createGoal, getGoal, updateGoal } from "@src/api/GoalsAPI";
import { darkModeState } from "@store";
import { colorPallete } from "@src/utils";
import { languagesFullForms } from "@translations/i18n";
import { goalTimingHandler } from "@src/helpers/GoalTimingHandler";
import { goalLinkHandler } from "@src/helpers/GoalLinkHandler";
import { goalDurationHandler } from "@src/helpers/GoalDurationHandler";
import { goalRepeatHandler } from "@src/helpers/GoalRepeatHandler";

import "@translations/i18n";
import "./AddGoalForm.scss";

interface AddGoalFormProps {
  goalId: number | undefined,
  setShowAddGoals: React.Dispatch<React.SetStateAction<{
    open: boolean;
    goalId: number;
  }>>,
  selectedColorIndex: number,
  parentGoalId: number | -1,
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ goalId, setShowAddGoals, selectedColorIndex, parentGoalId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [error, setError] = useState("");
  const [formInputData, setFormInputData] = useState({
    inputGoal: "",
    id: "",
  });
  const [goalTitle, setGoalTitle] = useState("");
  const [goalLink, setGoalLink] = useState<{index:number, value: null | string} | null>(null);
  const [goalRepeats, setGoalRepeats] = useState<{ index: number, value: "Once" | "Daily" | "Weekly" | "Mondays" | "Tuesdays"| "Wednesdays"| "Thursdays" | "Fridays" | "Saturdays" | "Sundays" } | null>(null);
  const [goalDuration, setGoalDuration] = useState<{index:number, value: null | number} | null>(null);
  const [goalStartDT, setGoalStartDT] = useState<{ index: number, value: Date | null} | null>(null);
  const [goalDueDT, setGoalDueDT] = useState<{ index: number, value: Date | null} | null>(null);
  const [goalStartTime, setGoalStartTime] = useState<{index:number, value: null | number} | null>(null);
  const [goalEndTime, setGoalEndTime] = useState<{index:number, value: null | number} | null>(null);

  const lang = localStorage.getItem("language")?.slice(1, -1);
  const goalLang = lang ? languagesFullForms[lang] : languagesFullForms.en;

  function handleTiming() {
    const handlerOutput = goalTimingHandler(formInputData.inputGoal);
    setGoalStartDT(handlerOutput.start ? handlerOutput.start : null);
    setGoalDueDT(handlerOutput.end ? handlerOutput.end : null);
    setGoalStartTime(handlerOutput.startTime ? handlerOutput.startTime : null);
    setGoalEndTime(handlerOutput.endTime ? handlerOutput.endTime : null);
    console.log(handlerOutput);
    return handlerOutput;
  }
  function handleGoalLink() {
    const handlerOutput = goalLinkHandler(formInputData.inputGoal);
    setGoalLink(handlerOutput.value);
    return handlerOutput.status && handlerOutput.value ? handlerOutput.value.index : -1;
  }
  function handleGoalDuration() {
    const handlerOutput = goalDurationHandler(formInputData.inputGoal);
    setGoalDuration(handlerOutput.value);
    return handlerOutput.status && handlerOutput.value ? handlerOutput.value.index : -1;
  }
  function handleGoalRepeat() {
    const handlerOutput = goalRepeatHandler(formInputData.inputGoal);
    setGoalRepeats(handlerOutput.value);
    return handlerOutput.status && handlerOutput.value ? handlerOutput.value.index : -1;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const idNum = crypto.randomUUID();

    setFormInputData({
      ...formInputData,
      id: idNum,
      [e.target.name]: value,
    });
  };

  useEffect(() => {
    const durIndx = handleGoalDuration();
    const linkIndx = handleGoalLink();
    const repeatIndx = handleGoalRepeat();
    const goalTiming = handleTiming();

    let tmpTitleEnd = formInputData.inputGoal.length;
    if (durIndx > 0) {
      tmpTitleEnd = durIndx > tmpTitleEnd ? tmpTitleEnd : durIndx;
    }
    if (linkIndx > 0) {
      tmpTitleEnd = linkIndx > tmpTitleEnd ? tmpTitleEnd : linkIndx;
    }
    if (goalTiming.start && goalTiming.start.index > 0) {
      tmpTitleEnd = goalTiming.start.index > tmpTitleEnd ? tmpTitleEnd : goalTiming.start.index;
    }
    if (goalTiming.end && goalTiming.end.index > 0) {
      tmpTitleEnd = goalTiming.end.index > tmpTitleEnd ? tmpTitleEnd : goalTiming.end.index;
    }
    if (goalTiming.startTime && goalTiming.startTime.index > 0) {
      tmpTitleEnd = goalTiming.startTime.index > tmpTitleEnd ? tmpTitleEnd : goalTiming.startTime.index;
    }
    if (goalTiming.endTime && goalTiming.endTime.index > 0) {
      tmpTitleEnd = goalTiming.endTime.index > tmpTitleEnd ? tmpTitleEnd : goalTiming.endTime.index;
    }
    if (repeatIndx > 0) {
      tmpTitleEnd = repeatIndx > tmpTitleEnd ? tmpTitleEnd : repeatIndx;
    }
    setGoalTitle(formInputData.inputGoal.slice(0, tmpTitleEnd));
  }, [formInputData.inputGoal]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (goalTitle.length === 0) {
      setError("Enter a goal title!");
      return;
    }
    const newGoal = createGoal(
      goalTitle,
      goalRepeats?.value,
      goalDuration?.value,
      goalStartTime?.value ? new Date(new Date(new Date().setHours(goalStartTime?.value)).setMinutes(0)) : null,
      goalEndTime?.value ? new Date(new Date(new Date().setHours(goalEndTime?.value)).setMinutes(0)) : null,
      0,
      parentGoalId!,
      colorPallete[selectedColorIndex], // goalColor
      goalLang,
      goalLink?.value
    );
    const newGoalId = await addGoal(newGoal);
    if (parentGoalId) {
      const parentGoal = await getGoal(parentGoalId);
      const newSublist = parentGoal && parentGoal.sublist ? [...parentGoal.sublist, newGoalId] : [newGoalId];
      await updateGoal(parentGoalId, { sublist: newSublist });
    }
    setFormInputData({
      inputGoal: "",
      id: "",
    });
    setGoalTitle("");
    const typeOfPage = window.location.href.split("/").slice(-1)[0];
    setShowAddGoals({ open: false, id: goalId || -1 });
    if (typeOfPage === "AddGoals") { navigate("/Home/MyGoals", { replace: true }); }
  };

  const handleTagClick = (tagType: string) => {
    const idNum = crypto.randomUUID();
    let tmpString = formInputData.inputGoal;
    if (tagType === "duration") {
      const end = tmpString.slice(goalDuration?.index).split(" ")[0].length;
      tmpString = `${tmpString.slice(0, goalDuration?.index).trim()}${tmpString.slice(goalDuration?.index + end)}`;
      setGoalDuration(null);
    } else if (tagType === "repeats") {
      const end = tmpString.slice(goalRepeats?.index).split(" ")[0].length;
      tmpString = `${tmpString.slice(0, goalRepeats?.index).trim()}${tmpString.slice(goalRepeats?.index + end)}`;
      setGoalRepeats(null);
    } else if (tagType === "link") {
      const end = tmpString.slice(goalLink?.index).split(" ")[0].length;
      tmpString = `${tmpString.slice(0, goalLink?.index).trim()}${tmpString.slice(goalLink?.index + end)}`;
      setGoalLink(null);
    } else if (goalStartTime && goalStartTime.index !== -1 && goalEndTime && goalEndTime.index !== -1) {
      const end = `${goalStartTime.value}-${goalEndTime.value}`.length;
      if (tagType === "start") {
        tmpString = `${tmpString.slice(0, goalStartTime?.index).trim()} before @${goalEndTime.value} ${tmpString.slice(goalStartTime?.index + end + 1).trim()}`;
        setGoalStartTime(null);
      } else if (tagType === "deadline") {
        tmpString = `${tmpString.slice(0, goalEndTime?.index).trim()} start @${goalStartTime.value} ${tmpString.slice(goalEndTime?.index + end + 1).trim()}`;
        setGoalEndTime(null);
      }
    } else if (tagType === "start") {
      const end = 7 + `${goalStartTime.value}`.length;
      tmpString = `${tmpString.slice(0, goalStartTime?.index).trim()}${tmpString.slice(goalStartTime?.index + end + 1).trim()}`;
      setGoalStartTime(null);
    } else if (tagType === "deadline") {
      const end = 8 + `${goalEndTime.value}`.length;
      tmpString = `${tmpString.slice(0, goalEndTime?.index).trim()}${tmpString.slice(goalEndTime?.index + end + 1).trim()}`;
      setGoalEndTime(null);
    }
    setFormInputData({
      id: idNum,
      inputGoal: tmpString,
    });
  };
  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div>
        <input
          className={darkModeStatus ? "addtask-dark" : "addtask-light"}
          type="text"
          name="inputGoal"
          placeholder={t("addGoalPlaceholder")}
          value={formInputData.inputGoal}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={handleChange}
        />
      </div>
      <div className="tags">
        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className="language"
        >
          {goalLang}
        </button>

        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalStartDT?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("start"); }}
        >
          {`Start ${goalStartTime?.value ? goalStartDT?.value.toLocaleDateString() : goalStartDT?.value.toLocaleString()}`}
        </button>

        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalStartTime?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("start"); }}
        >
          {`StartTime ${goalStartTime?.value}:00`}
        </button>

        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalDueDT?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("start"); }}
        >
          {`Start ${goalEndTime?.value ?
            goalDueDT?.value.toLocaleDateString()
            :
            goalDueDT?.value.toLocaleString()}`}
        </button>

        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalEndTime?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("deadline"); }}
        >
          {`Deadline ${goalEndTime?.value}:00`}
        </button>

        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalDuration?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("duration"); }}
        >
          {`${goalDuration?.value} hours`}
        </button>

        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalRepeats?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("repeats"); }}
        >
          {goalRepeats?.value}
        </button>

        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalLink?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("link"); }}
        >
          URL
        </button>

      </div>
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
