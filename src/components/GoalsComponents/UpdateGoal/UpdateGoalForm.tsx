import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { getGoal, updateGoal } from "@src/api/GoalsAPI";
import { darkModeState } from "@store";
import { colorPallete } from "@src/utils";

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
  const [goalDuration, setGoalDuration] = useState<null | number>(null);
  const [goalRepeats, setGoalRepeats] = useState<"Once" | "Daily" | "Weekly" | null>(null);
  const [goalLink, setGoalLink] = useState<string | null>(null);
  const [goalLang, setGoalLang] = useState("english");
  const [goalStart, setGoalStart] = useState<number | null>(null);
  const [goalDeadline, setGoalDeadline] = useState<number | null>(null);

  const daily = /daily/;
  const once = /once/;
  const weekly = /weekly/;

  const lowercaseInput = formInputData.inputGoal.toLowerCase();

  function handleTiming() {
    const onlyStart = /\sstart\s@(\d{2}|\d{1})/i;
    const onlyEnd = /\sbefore\s@(\d{2}|\d{1})/i;
    const bothTimings = /\s(\d{2}|\d{1})-(\d{2}|\d{1})/i;
    const bothIndex = lowercaseInput.search(bothTimings);
    const onlyStartIndex = lowercaseInput.search(onlyStart);
    const onlyEndIndex = lowercaseInput.search(onlyEnd);
    if (bothIndex !== -1) {
      const temp = lowercaseInput.slice(bothIndex + 1).split(" ")[0].split("-");
      return { index: bothIndex, start: Number(temp[0]), end: Number(temp[1]) };
    }
    if (onlyStartIndex !== -1) {
      return { index: onlyStartIndex, start: Number(lowercaseInput.slice(onlyStartIndex + 1).split(" ")[1].split("@")[1]), end: null };
    }
    if (onlyEndIndex !== -1) {
      return { index: onlyEndIndex, start: null, end: Number(lowercaseInput.slice(onlyEndIndex + 1).split(" ")[1].split("@")[1]) };
    }
    return { index: -1, start: null, end: null };
  }
  function handleGoalRepeat() {
    if (!lowercaseInput) { setGoalRepeats(null); return -1; }
    const freqDailyIndex = lowercaseInput.lastIndexOf(lowercaseInput.match(daily));
    const freqOnceIndex = lowercaseInput.lastIndexOf(lowercaseInput.match(once));
    const freqWeeklyIndex = lowercaseInput.lastIndexOf(lowercaseInput.match(weekly));
    const tempIndex = Math.max(freqDailyIndex, freqOnceIndex, freqWeeklyIndex);
    if (tempIndex === -1) { setGoalRepeats(null); } else if (tempIndex === freqDailyIndex) setGoalRepeats("Daily");
    else if (tempIndex === freqOnceIndex) setGoalRepeats("Once");
    else if (tempIndex === freqWeeklyIndex) setGoalRepeats("Weekly");
    return tempIndex - 1;
  }
  function handleGoalLink() {
    const detector = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])|(www)([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/i;
    const linkIndex = formInputData.inputGoal.search(detector);
    if (linkIndex !== -1) {
      const link = formInputData.inputGoal.slice(linkIndex).split(" ")[0];
      setGoalLink(link);
    } else setGoalLink(null);
    return linkIndex - 1;
  }
  function handleGoalDuration() {
    const tracker = /(1[0-9]|2[0-4]|[1-9])+h/i;
    const reverseInputArr = lowercaseInput.split(" ");
    let lastIndex = -1;
    let tmpSum = 0;
    for (let i = 0; i < reverseInputArr.length; i += 1) {
      const reverseInput = reverseInputArr[i];
      const checkGoalHr = parseInt(String(reverseInput.match(tracker)), 10);
      const parseGoal = parseInt(String(reverseInput.match(tracker)), 10) <= 24;
      const tempIndex = reverseInput.search(tracker);
      if (tempIndex !== -1 && parseGoal) {
        setGoalDuration(checkGoalHr);
        lastIndex += tmpSum;
      }
      tmpSum += reverseInput.length + 1;
    }
    if (lastIndex < 0) { setGoalDuration(null); }
    return lastIndex;
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
      {
        title: goalTitle,
        goalColor: colorPallete[selectedColorIndex],
        duration: goalDuration,
        repeat: goalRepeats,
        link: goalLink,
        start: goalStart ? new Date(new Date(new Date().setHours(goalStart)).setMinutes(0)) : null,
        finish: goalDeadline ? new Date(new Date(new Date().setHours(goalDeadline)).setMinutes(0)) : null,
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
      if (goal.start && goal.finish) {
        tmpTiming = ` ${goal.start.getHours()}-${goal.finish.getHours()}`;
      } else if (goal.start) {
        tmpTiming = ` start @${goal.start.getHours()}`;
      } else if (goal.finish) {
        tmpTiming = ` before @${goal.finish.getHours()}`;
      }
      setFormInputData({
        id: crypto.randomUUID(),
        inputGoal: `${goal.title}${goal.duration ? ` ${goal.duration}hours` : ""}${goal.repeat ? ` ${goal.repeat}` : ""}${tmpTiming}${goal.link ? ` ${goal.link}` : ""}`
      });
      setGoalDuration(goal.duration);
      setGoalRepeats(goal.repeat);
      setGoalLink(goal.link);
      setGoalStart(goal.start ? goal.start.getHours() : null);
      setGoalDeadline(goal.finish ? goal.finish.getHours() : null);
      if (goal.language) setGoalLang(goal.language);
    });
  }, []);

  useEffect(() => {
    const durIndx = handleGoalDuration();
    const linkIndx = handleGoalLink();
    const repeatIndx = handleGoalRepeat();
    const goalTiming = handleTiming();
    setGoalStart(goalTiming.start);
    setGoalDeadline(goalTiming.end);

    let tmpTitleEnd = formInputData.inputGoal.length;
    if (durIndx > 0) {
      tmpTitleEnd = durIndx > tmpTitleEnd ? tmpTitleEnd : durIndx;
    }
    if (goalTiming.index > 0) {
      tmpTitleEnd = goalTiming.index > tmpTitleEnd ? tmpTitleEnd : goalTiming.index;
    }
    if (linkIndx > 0) {
      tmpTitleEnd = linkIndx > tmpTitleEnd ? tmpTitleEnd : linkIndx;
    }
    if (repeatIndx > 0) {
      tmpTitleEnd = repeatIndx > tmpTitleEnd ? tmpTitleEnd : repeatIndx;
    }
    setGoalTitle(formInputData.inputGoal.slice(0, tmpTitleEnd));
  }, [formInputData.inputGoal]);

  return (
    <form id="todo-form" className="todo-form" onSubmit={handleSubmit}>
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
          className={goalStart ? "form-tag" : "blank"}
        >
          {`Start ${goalStart}:00`}
        </button>
        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalDeadline ? "form-tag" : "blank"}
        >
          {`Deadline ${goalDeadline}:00`}
        </button>
        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalDuration ? "form-tag" : "blank"}
        >
          {`Start ${goalStart}:00`}
        </button>
        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalDeadline ? "form-tag" : "blank"}
        >
          {`Deadline ${goalDeadline}:00`}
        </button>
        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalDuration ? "form-tag" : "blank"}
        >
          {`${goalDuration} hours`}
        </button>
        <button
          id="updateTask-button"
          className={darkModeStatus ? "mygoalsbutton-dark" : "mygoalsbutton-light"}
          type="button"
          onClick={handleSubmit}
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
        >
          Update Goal
        </button>
        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalRepeats ? "form-tag" : "blank"}
        >
          {goalRepeats}
        </button>
        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={goalLink ? "form-tag" : "blank"}
        >
          URL
        </button>
      </div>
      <div style={{ marginLeft: "10px", marginTop: "10px", color: "red", fontWeight: "lighter" }}>{error}</div>
    </form>
  );
};
