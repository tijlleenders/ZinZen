import React, { useEffect, useState } from "react";
import { Checkbox, Col, Modal, Radio, Row } from "antd";
import { darkModeState, displayToast, openDevMode } from "@src/store";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import deleteIcon from "@assets/images/deleteIcon.svg";

import ColorPalette from "@src/common/ColorPalette";
import { GoalItem } from "@src/models/GoalItem";
import { themeState } from "@src/store/ThemeState";
import { modifyGoal, createGoal } from "@src/helpers/GoalController";
import { displayAddGoal, selectedColorIndex, displayUpdateGoal, goalsHistory } from "@src/store/GoalsState";
import { colorPalleteList, days } from "../../../utils";

import "./ConfigGoal.scss";

const ConfigGoal = ({ goal, action } : { action: "Update" | "Create", goal: GoalItem }) => {
  const theme = useRecoilValue(themeState);
  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalsHistory = useRecoilValue(goalsHistory);

  const setDevMode = useSetRecoilState(openDevMode);
  const setShowToast = useSetRecoilState(displayToast);

  const [colorIndex, setColorIndex] = useRecoilState(selectedColorIndex);
  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);

  const open = !!showAddGoal || !!showUpdateGoal;
  const [title, setTitle] = useState(goal.title);
  const [isDetailsActive, setIsDetailsActive] = useState(true);

  const [daysGroup, setDaysGroup] = useState(days);
  const [selectedTag, setSelectedTag] = useState("");
  const [isPerSelected, setIsPerSelected] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  const [due, setDue] = useState(goal.due ? new Date(goal.due).toISOString().slice(0, 10) : "");
  const [start, setStart] = useState(goal.start ? new Date(goal.start).toISOString().slice(0, 10) : "");
  const [tags, setTags] = useState({
    on: goal.on || "",
    every: goal.habit ? goal.habit === "daily" ? "day" : "week" : "",
    duration: goal.duration || "",
    afterTime: goal.afterTime ? `${goal.afterTime}` : "",
    beforeTime: goal.beforeTime ? `${goal.beforeTime}` : "",
    budgetDuration: goal.timeBudget?.duration || "",
    budgetPeriod: goal.timeBudget?.period || "day"
  });

  const handleDateChange = (type: "From" | "To", value: string) => {
    if (type === "From") {
      setStart(value);
    } else { setDue(value); }
  };

  const deleteTag = () => {
    const deletion = {};
    if (isPerSelected) {
      deletion.budgetDuration = "";
      deletion.budgetPeriod = "";
      setIsPerSelected(false);
    } else if (["on", "every"].includes(selectedTag)) {
      deletion[selectedTag] = "";
    } else if (selectedTag === "before" || selectedTag === "between") {
      deletion.beforeTime = "";
    } else if (selectedTag === "after" || selectedTag === "between") {
      deletion.afterTime = "";
    }
    setTags({ ...tags, ...deletion });
    setSelectedTag("");
  };

  const handleFieldChange = (key: string, value: string) => {
    if (key === "duration") {
      setTags({ ...tags, duration: value });
      return;
    } if (isPerSelected) {
      const obj = { budgetDuration: value, budgetPeriod: tags.budgetPeriod };
      if (Number(value) > 24) { obj.budgetPeriod = "week"; setSelectedTag("hrs / week"); }
      setTags({ ...tags, ...obj });
    } else if (selectedTag === "before" || key === "beforeTime") {
      setTags({ ...tags, beforeTime: value });
    } else if (selectedTag === "after" || key === "afterTime") {
      setTags({ ...tags, afterTime: value });
    }
    setShowDeleteIcon(true);
  };

  const handleTagClick = (value:string) => {
    const isPer = value.includes("/");
    if (isPer) {
      setTags({ ...tags, budgetPeriod: value.split(" / ")[1] });
      setIsPerSelected(true);
    } else if (isPerSelected) {
      setIsPerSelected(false);
    }
    setSelectedTag(value);
  };

  const handleRadioClick = (val: string) => {
    if (selectedTag === "on") {
      setTags({ ...tags, on: val, every: "" });
    } else if (selectedTag === "every") {
      setTags({ ...tags, every: val, on: "" });
    }
    setShowDeleteIcon(true);
  };

  const getDateField = (type: string, style: object = {}) => (
    <Col span={12}>
      <div className="date-div" style={style}>
        <p>{type}: </p>
        <input type="date" value={type === "From" ? start : due} onChange={(e) => { handleDateChange(type, e.target.value); }} className="datepicker" />
      </div>
    </Col>
  );

  const getInputField = (key: string) => (
    <input
      type="number"
      style={{ width: 55, textAlign: "center" }}
      className="default-input"
      placeholder="0"
      value={tags[key]}
      onChange={(e) => handleFieldChange(key, e.target.value)}
    />
  );

  const getWeekdaysGroup = () => (
    <Row>
      {days.map((ele) => (
        <Col key={ele} span={6}>
          <Checkbox
            value={ele}
            checked={daysGroup.includes(ele)}
            onChange={() => { setDaysGroup([...daysGroup.filter((d) => d !== ele)]); }}
            style={{ margin: "4px 0" }}
          >
            {ele}
          </Checkbox>
        </Col>
      ))}
    </Row>
  );

  const getTagSelector = (items: string[]) => (
    <ul className="dropdown">
      {items.map((ele) => (
        <li key={ele}>
          <button type="button" className={ele === selectedTag ? "selected" : ""} onClick={() => { handleTagClick(ele); }}>
            {ele}
          </button>
        </li>
      ))}
    </ul>
  );

  const getRadioGroup = (options: string[], selectedValue: string) => (
    <Radio.Group onChange={(e) => handleRadioClick(e.target.value)} value={selectedValue}>
      {options.map((ele) => (<Radio className="checkbox" key={ele} value={ele}>{ele}</Radio>))}
    </Radio.Group>
  );

  const isTitleEmpty = () => {
    if (title.length === 0) { setShowToast({ open: true, message: `Goal cannot be ${showAddGoal ? "added" : "updated"} without title`, extra: "" }); }
    return title.length === 0;
  };

  const getFinalTags = () => ({
    ...goal,
    due: due && due !== "" ? new Date(due).toString() : null,
    start: start && start !== "" ? new Date(start).toString() : null,
    duration: tags.duration !== "" ? `${tags.duration}` : null,
    afterTime: tags.afterTime !== "" ? Number(tags.afterTime) : null,
    beforeTime: tags.beforeTime !== "" ? Number(tags.beforeTime) : null,
    habit: tags.every !== "" ? tags.every === "day" ? "daily" : "weekly" : null,
    on: tags.on !== "" ? tags.on === "weekend" ? "weekends" : "weekdays" : null,
    timeBudget: tags.budgetDuration !== "" ? { duration: Number(tags.budgetDuration), period: tags.budgetPeriod } : null
  });

  const updateThisGoal = async () => {
    if (!showUpdateGoal || isTitleEmpty()) { return; }
    await modifyGoal(
      goal.id,
      getFinalTags(),
      title,
      colorPalleteList[colorIndex],
      subGoalsHistory.length);
  };

  const addThisGoal = async () => {
    if (!showAddGoal || isTitleEmpty()) { return; }
    const { parentGoal } = await createGoal(showAddGoal.goalId, getFinalTags(), title, colorPalleteList[colorIndex], subGoalsHistory.length);
    // @ts-ignore
    if (parentGoal && selectedGoalId !== parentGoal.id) { addInHistory(parentGoal); }
    if (!parentGoal && title === "magic") {
      setDevMode(true);
      setShowToast({ open: true, message: "Congratulations, you activated DEV mode", extra: "Explore what's hidden" });
    }
  };

  const handleSave = async () => {
    if (showAddGoal) {
      await addThisGoal();
      setShowAddGoal(null);
    } else if (showUpdateGoal) {
      await updateThisGoal();
      setShowUpdateGoal(null);
    }
  };

  useEffect(() => {
    if (selectedTag === "") {
      setShowDeleteIcon(false);
    } else if (
      (isPerSelected && tags.budgetDuration !== "") ||
      (selectedTag === "on" && tags.on !== "") ||
      (selectedTag === "every" && tags.every !== "") ||
      (selectedTag === "before" && tags.beforeTime !== "") ||
      (selectedTag === "after" && tags.afterTime !== "") ||
      (selectedTag === "between" && tags.beforeTime !== "" && tags.afterTime)
    ) {
      setShowDeleteIcon(true);
    }
  }, [selectedTag]);

  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      onCancel={() => {
        if (showAddGoal) {
          setShowAddGoal(null);
        } else if (showUpdateGoal) {
          setShowUpdateGoal(null);
        }
      }}
      className={`configModal popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`}
    >
      <div style={{ textAlign: "left" }} className="header-title"><h4>{title === "" ? "Goal Title" : title}</h4></div>
      <Row gutter={24} className="goal-dates">
        { getDateField("From") }
        { getDateField("To", { justifyContent: "flex-end" }) }
      </Row>

      <div className="goal-sent">
        <p>
          {tags.duration ? `${tags.duration}h ` : ""}
          {tags.beforeTime !== "" && tags.afterTime !== "" ? `between ${tags.afterTime}-${tags.beforeTime} ` :
            tags.beforeTime !== "" ? `before ${tags.beforeTime} ` :
              tags.afterTime !== "" ? `after ${tags.afterTime} ` : ""}
          {tags.on !== "" && `on ${tags.on} `}
          {tags.every !== "" && `every ${tags.every} `}
          {tags.budgetDuration !== "" && `${tags.budgetDuration}h per ${tags.budgetPeriod}`}
        </p>
      </div>
      <div className="goal-config">
        <Row className="config-tabs">
          <Col style={{ borderRadius: "8px 0px 0px 0px" }} className={isDetailsActive ? "selected" : ""} onClick={() => { if (!isDetailsActive) { setIsDetailsActive(true); } }} span={12}>Details</Col>
          <Col style={{ borderRadius: "0px 8px 0px 0px" }} className={isDetailsActive ? "" : "selected"} onClick={() => { if (isDetailsActive) { setIsDetailsActive(false); } }} span={12}>Timings</Col>
        </Row>
        {
          isDetailsActive ? (
            <div className="details">
              <div>
                <p>Title: </p>
                <input type="text" className="default-input" placeholder="Goal Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
                <div style={{ width: 75 }}>
                  <p>Duration: </p>
                  <input type="number" className="default-input" value={tags.duration} onChange={(e) => { handleFieldChange("duration", e.target.value); }} />
                </div>
                <ColorPalette colorIndex={colorIndex} setColorIndex={setColorIndex} />
              </div>
            </div>
          ) : (
            <div className="timings">
              <div className="tag-input">
                <span>{["after", "before", "between"].includes(selectedTag) && selectedTag}</span>
                {(isPerSelected || selectedTag === "between") && getInputField(isPerSelected ? "budgetDuration" : "afterTime")}

                {selectedTag === "between" && <span>-</span>}
                {isPerSelected && <span>{selectedTag}</span>}

                {(["before", "after", "between"].includes(selectedTag)) && (
                  getInputField(selectedTag === "between" ? "beforeTime" : `${selectedTag}Time`)
                )}

                {selectedTag === "on" && getRadioGroup(["weekdays", "weekend"], tags.on)}
                {selectedTag === "every" && getRadioGroup(["day", "week"], tags.every)}
                { showDeleteIcon && (
                  <button type="button" className="ordinary-element" onClick={deleteTag}>
                    <img alt="delete tag" className={`${darkModeStatus ? "dark-svg" : ""}`} src={deleteIcon} />
                  </button>
                )}
              </div>
              <div className="sent-tags">
                {getTagSelector(["after", "before", "between"])}
                {getTagSelector(["on", "every"])}
                {getTagSelector(["hrs / day", "hrs / week"])}
              </div>
            </div>
          )
        }
      </div>
      <div style={{ textAlign: "center" }}>
        <button type="button" className="action-btn" onClick={handleSave}> {action} Goal </button>
      </div>
    </Modal>
  );
};

export default ConfigGoal;
