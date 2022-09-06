// @ts-nocheck

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
  const [magicIndices, setMagicIndices] = useState<{word: string, index: number}[]>([]);

  const lang = localStorage.getItem("language")?.slice(1, -1);
  const goalLang = lang ? languagesFullForms[lang] : languagesFullForms.en;

  function handleTiming() {
    const handlerOutput = goalTimingHandler(formInputData.inputGoal);
    const temp : {word: string, index: number}[] = [];
    setGoalStartDT(handlerOutput.start ? handlerOutput.start : null);
    setGoalDueDT(handlerOutput.end ? handlerOutput.end : null);
    setGoalStartTime(handlerOutput.startTime ? handlerOutput.startTime : null);
    setGoalEndTime(handlerOutput.endTime ? handlerOutput.endTime : null);
    if (handlerOutput.start) { temp.push({ word: "start", index: handlerOutput.start.index }); }
    if (handlerOutput.end) { temp.push({ word: "due", index: handlerOutput.end.index }); }
    if (handlerOutput.startTime) { temp.push({ word: "startTime", index: handlerOutput.startTime.index }); }
    if (handlerOutput.endTime) { temp.push({ word: "endTime", index: handlerOutput.endTime.index }); }
    return temp;
  }
  function handleGoalLink() {
    const handlerOutput = goalLinkHandler(formInputData.inputGoal);
    setGoalLink(handlerOutput.value);
    return handlerOutput.value ? [{ word: "link", index: handlerOutput.value.index }] : [];
  }
  function handleGoalDuration() {
    const handlerOutput = goalDurationHandler(formInputData.inputGoal);
    setGoalDuration(handlerOutput.value);
    return handlerOutput.value ? [{ word: "duration", index: handlerOutput.value.index }] : [];
  }
  function handleGoalRepeat() {
    const handlerOutput = goalRepeatHandler(formInputData.inputGoal);
    setGoalRepeats(handlerOutput.value);
    return handlerOutput.value ? [{ word: "repeats", index: handlerOutput.value.index }] : [];
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
    let tmpMagicIndices : { word: string; index: any; }[] = [];
    tmpMagicIndices = [...handleGoalDuration()];
    tmpMagicIndices = [...tmpMagicIndices, ...handleGoalLink()];
    tmpMagicIndices = [...tmpMagicIndices, ...handleGoalRepeat()];
    tmpMagicIndices = [...tmpMagicIndices, ...handleTiming()];

    tmpMagicIndices.sort((a, b) => a.index - b.index);
    if (tmpMagicIndices.length > 0) setGoalTitle(formInputData.inputGoal.slice(0, tmpMagicIndices[0].index));
    setMagicIndices([...tmpMagicIndices]);
  }, [formInputData.inputGoal]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (goalTitle.length === 0) {
      setError("Enter a goal title!");
      return;
    }
    const newGoal = createGoal(
      goalTitle,
      goalRepeats ? goalRepeats.value : null,
      goalDuration ? goalDuration.value : null,
      goalStartDT ? goalStartDT.value : null,
      goalDueDT ? goalDueDT.value : null,
      goalStartTime ? goalStartTime.value : null,
      goalEndTime ? goalEndTime.value : null,
      0,
      parentGoalId!,
      colorPallete[selectedColorIndex], // goalColor
      goalLang,
      goalLink ? goalLink.value : null
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
    let tmpString = formInputData.inputGoal;
    const idNum = crypto.randomUUID();
    const index = magicIndices.findIndex((ele) => ele.word === tagType);

    let nextIndex = index + 1;
    while (nextIndex < magicIndices.length && magicIndices[nextIndex].index === magicIndices[index].index) { nextIndex += 1; }

    if (index + 1 === magicIndices.length) {
      tmpString = tmpString.slice(0, magicIndices[index]?.index);
    } else {
      tmpString = `${tmpString.slice(0, magicIndices[index]?.index)} ${tmpString.slice(magicIndices[nextIndex].index)}`;
    }
    console.log(tmpString);
    if (tagType === "duration") {
      setGoalDuration(null);
    } else if (tagType === "repeats") {
      setGoalRepeats(null);
    } else if (tagType === "link") {
      setGoalLink(null);
    } else if (tagType === "start") {
      setGoalStartDT(null);
    } else if (tagType === "due") {
      setGoalDueDT(null);
    } else if (tagType === "startTime") {
      setGoalStartTime(null);
    } else if (tagType === "endTime") {
      setGoalEndTime(null);
    }
    setFormInputData({
      id: idNum,
      inputGoal: tmpString.trim(),
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
          {`Start ${goalStartDT?.value.toLocaleDateString()}${goalStartTime?.value ? "" : `, ${goalStartDT?.value?.toTimeString().slice(0, 5)}`}`}
        </button>

        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalStartTime?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("startTime"); }}
        >
          {`After ${goalStartTime?.value}:00`}
        </button>

        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalDueDT?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("due"); }}
        >
          {`Due ${goalDueDT?.value.toLocaleDateString()}${goalEndTime?.value ? "" : `, ${goalDueDT?.value?.toTimeString().slice(0, 5)}`}`}
        </button>

        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalEndTime?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("endTime"); }}
        >
          {`Before ${goalEndTime?.value}:00`}
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
