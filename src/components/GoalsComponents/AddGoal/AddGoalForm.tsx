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
  const [goalDuration, setGoalDuration] = useState<null | number>(null);
  const [goalRepeats, setGoalRepeats] = useState<"Once" | "Daily" | "Weekly" | null>(null);
  const [goalLink, setGoalLink] = useState<string | null>(null);

  const daily = /daily/;
  const once = /once/;
  const weekly = /weekly/;

  const lang = localStorage.getItem("language")?.slice(1, -1);
  const goalLang = lang ? languagesFullForms[lang] : languagesFullForms.en;

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
    const detector = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])|(www)([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/i;
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

  useEffect(() => {
    setGoalTitle(formInputData.inputGoal.slice(0));
    handleGoalDuration();
    handleGoalLink();
    handleGoalRepeat();
  }, [formInputData.inputGoal]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (goalTitle.length === 0) {
      setError("Enter a goal title!");
      return;
    }
    const newGoal = createGoal(
      goalTitle,
      goalRepeats,
      goalDuration,
      null,
      null,
      0,
      parentGoalId!,
      colorPallete[selectedColorIndex], // goalColor
      goalLang,
      goalLink
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

  useEffect(() => {
    const tracker = /(1[0-9]|2[0-4]|[1-9])+(h)/;
    const titleEndIndex = formInputData.inputGoal.search(tracker);
    if (titleEndIndex !== -1) setGoalTitle(formInputData.inputGoal.slice(0, titleEndIndex - 1));
  }, [handleSubmit]);

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
          Add Goal
        </Button>
      </div>
      <div style={{ marginLeft: "10px", marginTop: "10px", color: "red", fontWeight: "lighter" }}>{error}</div>
    </form>
  );
};
