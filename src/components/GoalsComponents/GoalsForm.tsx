// @ts-nocheck

import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { darkModeState } from "@store";

import "@translations/i18n";
import "./GoalsComponents.scss";

export const GoalsForm = (
  { selectedColorIndex }:{ selectedColorIndex: number }
) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  // const [selectedColorIndex, setColorIndex] = useState(0);

  const darkModeStatus = useRecoilValue(darkModeState);
  const darkrooms = ["#443027", "#9C4663", "#646464", "#2B517B", " #612854"];
  const lightcolors = [" #EDC7B7", "#AC3B61", " #BAB2BC", " #3B6899", " #8E3379"];

  const [formInputData, setFormInputData] = useState({
    inputGoal: "",
    id: "",
  });

  const handleChange = (e: any) => {
    const { value } = e.target;
    const idNum = crypto.randomUUID();

    setFormInputData({
      ...formInputData,
      id: idNum,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    if (formInputData.inputGoal) {
      const newData = (data: []) => [...data, formInputData];
      setTableData(newData);
    }
    setFormInputData({
      inputGoal: "",
      id: "",
    });
    e.preventDefault();
  };

  const removeItem = () => {
    setTableData([]);
  };
  function suggestion() {
    if (formInputData.inputGoal.indexOf("daily") !== -1) {
      return "daily";
    }
    return "";
  }
  function duration() {
    const tracker = /(1[0-9]|2[0-4]|[1-9])+(h)/;
    const checkGoal = parseInt(formInputData.inputGoal.match(tracker), 10);
    const parseGoal = parseInt(formInputData.inputGoal.match(tracker), 10) <= 24;
    if (formInputData.inputGoal.search(tracker) !== -1 && parseGoal) {
      return `${checkGoal} hours`;
    }
    return "";
  }
  const changeColor = () => {
    const newColorIndex = selectedColorIndex + 1;
    if (darkrooms[newColorIndex]) setColorIndex(newColorIndex);
    else setColorIndex(0);
  };
  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div>
        <input
          // style={
          //   darkModeStatus
          //     ? { backgroundColor: darkrooms[selectedColorIndex] }
          //     : { backgroundColor: lightcolors[selectedColorIndex] }
          // }
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
          className={suggestion() === "daily" ? "suggestion" : "blank"}
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
      <div className="inputs">
        {tableData.map((data, index) => (
          <div
            key={crypto.randomUUID()}
            style={
              darkModeStatus ? { backgroundColor: darkrooms[index % 5] } : { backgroundColor: lightcolors[index % 5] }
            }
            className={darkModeStatus ? "addtask-dark" : "addtask-light"}
          >
            <div
              role="button"
              tabIndex={0}
              className={darkModeStatus ? "deletetodo-dark" : "deletetodo-light"}
              aria-label="Remove Item"
              onClick={removeItem}
              onKeyDown={removeItem}
            />
            <div className="input-goal">{data.inputGoal}</div>
          </div>
        ))}
      </div>
    </form>
  );
};
