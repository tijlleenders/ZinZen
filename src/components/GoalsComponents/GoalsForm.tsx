import React, { ChangeEvent, useState } from "react";
import { Button } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { addGoal, createGoal, getGoal, updateGoal } from "@src/api/GoalsAPI";
import { darkModeState } from "@store";

import "@translations/i18n";
import "./GoalsComponents.scss";

interface GoalsFormProps {
  selectedColorIndex: number;
  parentGoalId?: number | -1;
}

export const GoalsForm: React.FC<GoalsFormProps> = ({ selectedColorIndex, parentGoalId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const darkColors = ["#EDC7B7", "#9C4663", "#646464", "#2B517B", " #612854"];
  const lightColors = [" #EDC7B7", "#AC3B61", " #BAB2BC", " #3B6899", " #8E3379"];

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

  function suggestion() {
    if (formInputData.inputGoal.indexOf("daily") !== -1) {
      return "daily";
    }
    if (formInputData.inputGoal.indexOf("once") !== -1) {
      return "once";
    }
    return "";
  }
  function duration() {
    const tracker = /(1[0-9]|2[0-4]|[1-9])+(h)/;
    const checkGoal = parseInt(String(formInputData.inputGoal.match(tracker)), 10);
    const parseGoal = parseInt(String(formInputData.inputGoal.match(tracker)), 10) <= 24;
    if (formInputData.inputGoal.search(tracker) !== -1 && parseGoal) {
      if (goalTitle.length === 0) {
        const titleEndIndex = formInputData.inputGoal.search(tracker);
        setGoalTitle(formInputData.inputGoal.slice(0, titleEndIndex - 1));
      }
      return `${checkGoal} hours`;
    }
    return "";
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const goalFrequency = suggestion();
    const goalDuration = duration();
    if (goalTitle.length === 0) {
      setError("Enter a goal title! (P.S. Enter the duration of the goal and hit enter to get rid of this message)");
      return;
    }
    if (goalDuration.length === 0) {
      setError("Enter the duration of the goal!");
      return;
    }
    if (goalFrequency.length === 0) {
      setError("Enter goal's frequency as 'daily' or 'once'!");
      return;
    }
    if (goalTitle.length === 1) {
      setError("Enter a goal title! (P.S. the problem could also be with the sequence of goal-duration-frequency)");
      return;
    }
    const newGoal = createGoal(
      goalTitle,
      goalFrequency === "daily",
      Number(goalDuration.split(" ")[0]),
      null,
      null,
      0,
      parentGoalId!,
      darkModeStatus ? darkColors[selectedColorIndex] : lightColors[selectedColorIndex]
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
    setTimeout(() => {
      navigate(parentGoalId === -1 ? "/Home/MyGoals" : `/Home/MyGoals/${parentGoalId}`);
    }, 100);
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
              ? { backgroundColor: darkColors[selectedColorIndex] }
              : { backgroundColor: lightColors[selectedColorIndex] }
          }
          className={duration() !== "" ? "duration" : "blank"}
        >
          {duration()}
        </button>
        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: darkColors[selectedColorIndex] }
              : { backgroundColor: lightColors[selectedColorIndex] }
          }
          className={suggestion() === "once" || suggestion() === "daily" ? "suggestion" : "blank"}
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
              ? { backgroundColor: darkColors[selectedColorIndex] }
              : { backgroundColor: lightColors[selectedColorIndex] }
          }
        >
          Add Goal
        </Button>
      </div>
      <div style={{ marginLeft: "10px", marginTop: "10px", color: "red", fontWeight: "lighter" }}>{error}</div>
    </form>
  );
};

GoalsForm.defaultProps = {
  parentGoalId: -1,
};
