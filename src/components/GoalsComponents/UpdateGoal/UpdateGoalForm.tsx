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

  const daily = /daily/;
  const once = /once/;
  const weekly = /weekly/;

  const lowercaseInput = formInputData.inputGoal.toLowerCase();

  function handleGoalRepeat() {
    const freqDaily = lowercaseInput.match(daily);
    const freqOnce = lowercaseInput.match(once);
    const freqWeekly = lowercaseInput.match(weekly);
    if (lowercaseInput.indexOf(`${freqDaily}`) !== -1) {
      if (goalRepeats !== "Daily") { setGoalRepeats("Daily"); }
      return;
    }
    if (lowercaseInput.indexOf(`${freqOnce}`) !== -1) {
      if (goalRepeats !== "Once") { setGoalRepeats("Once"); }
      return;
    }
    if (lowercaseInput.indexOf(`${freqWeekly}`) !== -1) {
      if (goalRepeats !== "Weekly") { setGoalRepeats("Weekly"); }
      return;
    }
    setGoalRepeats(null);
  }
  function handleGoalLink() {
    const detector = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/;
    const linkIndex = formInputData.inputGoal.search(detector);
    if (linkIndex !== -1) {
      const link = formInputData.inputGoal.slice(linkIndex).split(" ")[0];
      if (goalLink !== link) { setGoalLink(link); }
      return;
    }
    setGoalLink(null);
  }
  function handleGoalDuration() {
    const tracker = /(1[0-9]|2[0-4]|[1-9])+h/i;
    const checkGoalHr = parseInt(String(lowercaseInput.match(tracker)), 10);
    if (checkGoalHr === goalDuration) { return; }

    const parseGoal = parseInt(String(lowercaseInput.match(tracker)), 10) <= 24;
    if (formInputData.inputGoal.search(tracker) !== -1 && parseGoal) {
      setGoalDuration(checkGoalHr);
      return;
    }
    setGoalDuration(null);
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

  const handleSubmit =
  async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (goalTitle.length === 0) {
      setError("Enter a goal title!");
      return;
    }
    await updateGoal(goalId,
      { title: goalTitle,
        goalColor: colorPallete[selectedColorIndex],
        duration: goalDuration,
        repeat: goalRepeats,
        link: goalLink
      });
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
        inputGoal: `${goal.title} ${goal.duration ? `${goal.duration}hours` : ""} ${goal.repeat ? `${goal.repeat}` : ""} ${goal.link ? `${goal.link}` : ""}`
      });
      setGoalDuration(goal.duration);
      setGoalRepeats(goal.repeat);
      setGoalLink(goal.link);
      if (goal.language) setGoalLang(goal.language);
    });
  }, []);

  useEffect(() => {
    setGoalTitle(formInputData.inputGoal.slice(0));
    handleGoalDuration();
    handleGoalLink();
    handleGoalRepeat();
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
          className={goalDuration ? "form-tag" : "blank"}
        >
          {`${goalDuration} hours`}
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
