import React, { ChangeEvent, useState } from "react";
import { Button } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { darkModeState } from "@store";

import "@translations/i18n";
import "./GoalsComponents.scss";
import { addGoal, createGoal } from "@src/api/GoalsAPI";
import { useNavigate } from "react-router";

export const GoalsForm = ({ selectedColorIndex }: { selectedColorIndex: number }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const darkrooms = ["#443027", "#9C4663", "#646464", "#2B517B", " #612854"];
  const lightcolors = [" #EDC7B7", "#AC3B61", " #BAB2BC", " #3B6899", " #8E3379"];

  const [formInputData, setFormInputData] = useState({
    inputGoal: "",
    id: "",
  });
  const [goalTitle, setGoalTitle] = useState("");

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
    const newGoal = createGoal(goalTitle, suggestion() === "daily", Number(duration().split(" ")[0]), null, null, 0);
    await addGoal(newGoal);
    setFormInputData({
      inputGoal: "",
      id: "",
    });
    setGoalTitle("");
    setTimeout(() => {
      navigate("/Home/MyGoals");
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
          onChange={handleChange}
        />
      </div>
      <div className="tags">
        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: darkrooms[selectedColorIndex] }
              : { backgroundColor: lightcolors[selectedColorIndex] }
          }
          className={duration() !== "" ? "duration" : "blank"}
        >
          {duration()}
        </button>
        <button
          type="button"
          style={
            darkModeStatus
              ? { backgroundColor: darkrooms[selectedColorIndex] }
              : { backgroundColor: lightcolors[selectedColorIndex] }
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
              ? { backgroundColor: darkrooms[selectedColorIndex] }
              : { backgroundColor: lightcolors[selectedColorIndex] }
          }
        >
          Add Goal
        </Button>
      </div>
    </form>
  );
};
