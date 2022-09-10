import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { getGoal, updateGoal } from "@src/api/GoalsAPI";
import { darkModeState } from "@store";
import { colorPallete } from "@src/utils";
import { goalDurationHandler } from "@src/helpers/GoalDurationHandler";
import { goalLinkHandler } from "@src/helpers/GoalLinkHandler";
import { goalRepeatHandler } from "@src/helpers/GoalRepeatHandler";
import { goalTimingHandler } from "@src/helpers/GoalTimingHandler";

import "@translations/i18n";
import "./UpdateGoalForm.scss";

interface UpdateGoalFormProps {
  goalId: number | undefined,
  selectedColorIndex: number,
  setShowUpdateGoal: React.Dispatch<React.SetStateAction<{
    open: boolean;
    goalId: number;
  }>>
}

export const UpdateGoalForm: React.FC<UpdateGoalFormProps> = ({ goalId, selectedColorIndex, setShowUpdateGoal }) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [formInputData, setFormInputData] = useState({
    inputGoal: "",
    id: "",
  });

  const [error, setError] = useState("");

  const [goalTitle, setGoalTitle] = useState("");
  const [goalLink, setGoalLink] = useState<{index:number, value: null | string} | null>(null);
  const [goalRepeats, setGoalRepeats] = useState<{ index: number, value: "Once" | "Daily" | "Weekly" | "Mondays" | "Tuesdays"| "Wednesdays"| "Thursdays" | "Fridays" | "Saturdays" | "Sundays" } | null>(null);
  const [goalDuration, setGoalDuration] = useState<{index:number, value: null | number} | null>(null);
  const [goalStartDT, setGoalStartDT] = useState<{ index: number, value: Date | null} | null>(null);
  const [goalDueDT, setGoalDueDT] = useState<{ index: number, value: Date | null} | null>(null);
  const [goalStartTime, setGoalStartTime] = useState<{index:number, value: null | number} | null>(null);
  const [goalEndTime, setGoalEndTime] = useState<{index:number, value: null | number} | null>(null);
  const [magicIndices, setMagicIndices] = useState<{word: string, index: number}[]>([]);
  const [goalLang, setGoalLang] = useState("english");

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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (goalTitle.length === 0) {
      setError("Enter a goal title!");
      return;
    }
    await updateGoal(goalId,
      { title: goalTitle.split(' ').filter((ele) => ele !== '').join(' '),
        goalColor: colorPallete[selectedColorIndex],
        duration: goalDuration?.value,
        repeat: goalRepeats?.value.trim(),
        link: goalLink?.value.trim(),
        start: goalStartDT ? goalStartDT?.value : null,
        due: goalDueDT ? goalDueDT.value : null,
        startTime: goalStartTime ? goalStartTime.value : null,
        endTime: goalEndTime ? goalEndTime.value : null,
      });
    setFormInputData({
      inputGoal: "",
      id: "",
    });
    setGoalTitle("");
    setShowUpdateGoal({ open: false, id: -1 });
  };

  useEffect(() => {
    getGoal(goalId).then((goal) => {
      let tmpTiming = "";
      if (goal.startTime && goal.endTime) {
        tmpTiming = ` ${goal.startTime}-${goal.endTime}`;
      } else if (goal.startTime) {
        tmpTiming = ` after ${goal.startTime}`;
      } else if (goal.endTime) {
        tmpTiming = ` before ${goal.endTime}`;
      }
      setFormInputData({ id: crypto.randomUUID(),
        inputGoal: `${goal.title}${goal.duration ? ` ${goal.duration}hours` : ""}${goal.start ? ` start ${goal.start.getDate()}/${goal.start.getMonth() + 1}` : ""}${goal.due ? ` due ${goal.due.getDate()}/${goal.due.getMonth() + 1}` : ""}${goal.repeat ? ` ${goal.repeat}` : ""}${tmpTiming}${goal.link ? ` ${goal.link}` : ""}`
      });
      if (goal.language) setGoalLang(goal.language);
    });
  }, []);

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
          Update Goal
        </Button>
      </div>
      <div style={{ marginLeft: "10px", marginTop: "10px", color: "red", fontWeight: "lighter" }}>{error}</div>
    </form>
  );
};
