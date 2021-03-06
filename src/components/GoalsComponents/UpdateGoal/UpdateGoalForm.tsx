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
  const [goalTitle, setGoalTitle] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const idNum = crypto.randomUUID();

    setFormInputData({
      ...formInputData,
      id: idNum,
      [e.target.name]: value,
    });
  };
  const daily = /daily/;
  const once = /once/;
  const weekly = /weekly/;
  const lowercaseInput = formInputData.inputGoal.toLowerCase();
  const freqDaily = lowercaseInput.match(daily);
  const freqOnce = lowercaseInput.match(once);
  const freqWeekly = lowercaseInput.match(weekly);
  function suggestion() {
    if (lowercaseInput.indexOf(`${freqDaily}`) !== -1) {
      return "daily";
    }
    if (lowercaseInput.indexOf(`${freqOnce}`) !== -1) {
      return "once";
    }
    if (lowercaseInput.indexOf(`${freqWeekly}`) !== -1) {
      return "weekly";
    }
    return "";
  }
  function urlDetection() {
    const detector = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/;
    if (formInputData.inputGoal.search(detector) !== -1) {
      return "Link";
    }
    return "";
  }
  function duration() {
    const tracker = /(1[0-9]|2[0-4]|[1-9])+h/i;
    const checkGoal = parseInt(String(lowercaseInput.match(tracker)), 10);
    const parseGoal = parseInt(String(lowercaseInput.match(tracker)), 10) <= 24;
    if (formInputData.inputGoal.search(tracker) !== -1 && parseGoal) {
      return `${checkGoal} hours`;
    }
    return "";
  }

  const handleSubmit =
  async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const goalFrequency = suggestion();
    const goalDuration = duration() === "" ? null : Number(duration().split("")[0]);
    if (goalTitle.length === 0) {
      setError("Enter a goal title!");
      return;
    }
    await updateGoal(goalId, { title: goalTitle, goalColor: colorPallete[selectedColorIndex], duration: goalDuration, repeat: goalFrequency === "" ? null : goalFrequency });
    setFormInputData({
      inputGoal: "",
      id: "",
    });
    setGoalTitle("");
    setShowUpdateGoal({ open: false, id: -1 });
  };

  useEffect(() => {
    const tracker = /(1[0-9]|2[0-4]|[1-9])+(h)/;
    const titleEndIndex = formInputData.inputGoal.search(tracker);
    if (titleEndIndex !== -1) setGoalTitle(formInputData.inputGoal.slice(0, titleEndIndex - 1));
  }, [handleSubmit]);

  useEffect(() => {
    getGoal(goalId).then((goal) => {
      setFormInputData({ id: crypto.randomUUID(),
        inputGoal: `${goal.title} ${goal.duration ? `${goal.duration}hours` : ""} ${goal.repeat ? `${goal.repeat}` : ""}`
      });
    });
  }, []);

  useEffect(() => {
    setGoalTitle(formInputData.inputGoal.slice(0));
  }, [formInputData.inputGoal]);

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
          className={duration() !== "" ? "duration" : "blank"}
        >
          {duration()}
        </button>
        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={urlDetection() !== "" ? "duration" : "blank"}
        >
          {urlDetection()}
        </button>
        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: colorPallete[selectedColorIndex] }
              : { backgroundColor: colorPallete[selectedColorIndex] }
          }
          className={suggestion() === "once" || suggestion() === "daily" || suggestion() === "weekly" ? "suggestion" : "blank"}
        >
          {suggestion()}
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
