import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { addGoal, createGoal, getGoal, updateGoal } from "@src/api/GoalsAPI";
import { darkModeState } from "@store";
import { colorPallete } from "@src/utils";

import "@translations/i18n";
import "./GoalsComponents.scss";

interface GoalsFormProps {
  selectedColorIndex: number;
  parentGoalId?: number | -1;
}

export const GoalsForm: React.FC<GoalsFormProps> = ({ goalId, setShowAddGoals, selectedColorIndex, parentGoalId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
  function suggestion() {
    if (formInputData.inputGoal.indexOf("daily") !== -1) {
      return "daily";
    }
    if (formInputData.inputGoal.indexOf("once") !== -1) {
      return "once";
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
    const tracker = /(1[0-9]|2[0-4]|[1-9])+(h)/;
    const checkGoal = parseInt(String(formInputData.inputGoal.match(tracker)), 10);
    const parseGoal = parseInt(String(formInputData.inputGoal.match(tracker)), 10) <= 24;
    if (formInputData.inputGoal.search(tracker) !== -1 && parseGoal) {
      return `${checkGoal} hours`;
    }
    return "";
  }

  useEffect(() => {
    setGoalTitle(formInputData.inputGoal.slice(0));
  }, [formInputData.inputGoal]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const goalFrequency = suggestion() === "" ? null : suggestion() === "daily";
    const goalDuration = duration() === "" ? null : Number(duration().split("")[0]);
    if (goalTitle.length === 0) {
      setError("Enter a goal title!");
      return;
    }
    const newGoal = createGoal(
      goalTitle,
      goalFrequency,
      goalDuration,
      null,
      null,
      0,
      parentGoalId!,
      darkModeStatus ? colorPallete[selectedColorIndex] : colorPallete[selectedColorIndex] // goalColor
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
    setShowAddGoals({open: false, id: goalId})
    // setTimeout(() => {
    //   navigate("/Home/MyGoals", { state: { id: parentGoalId } });
    // }, 100);
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

GoalsForm.defaultProps = {
  parentGoalId: -1,
};
