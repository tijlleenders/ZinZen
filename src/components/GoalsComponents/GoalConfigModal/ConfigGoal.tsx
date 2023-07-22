import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Checkbox, Col, Modal, Radio, Row } from "antd";
import { darkModeState, displayToast, openDevMode } from "@src/store";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import deleteIcon from "@assets/images/deleteIcon.svg";

import {
  displayAddGoal,
  selectedColorIndex,
  displayUpdateGoal,
  goalsHistory,
  displayGoalId,
} from "@src/store/GoalsState";
import { expandIcon } from "@src/assets";
import { GoalItem } from "@src/models/GoalItem";
import { themeState } from "@src/store/ThemeState";
import ColorPalette from "@src/common/ColorPalette";
import { modifyGoal, createGoal } from "@src/helpers/GoalController";

import { colorPalleteList, calDays } from "../../../utils";
import "./ConfigGoal.scss";

const ConfigGoal = ({ goal, action }: { action: "Update" | "Create"; goal: GoalItem }) => {
  const { t } = useTranslation();
  const theme = useRecoilValue(themeState);
  const darkModeStatus = useRecoilValue(darkModeState);
  const selectedGoalId = useRecoilValue(displayGoalId);
  const subGoalsHistory = useRecoilValue(goalsHistory);

  const setDevMode = useSetRecoilState(openDevMode);
  const setShowToast = useSetRecoilState(displayToast);

  const [colorIndex, setColorIndex] = useRecoilState(selectedColorIndex);
  const showAddGoal = useRecoilValue(displayAddGoal);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);

  const open = !!showAddGoal || !!showUpdateGoal;
  const [title, setTitle] = useState(goal.title);
  const [isDetailsActive, setIsDetailsActive] = useState(true);

  const [daysGroup, setDaysGroup] = useState(calDays);
  const [selectedTag, setSelectedTag] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [isPerSelected, setIsPerSelected] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  const [showAllSettings, setShowAllSettings] = useState(false);

  const [due, setDue] = useState(goal.due ? new Date(goal.due).toISOString().slice(0, 10) : "");
  const [start, setStart] = useState(goal.start ? new Date(goal.start).toISOString().slice(0, 10) : "");
  const [tags, setTags] = useState({
    on: goal.on || "",
    every: goal.habit ? (goal.habit === "daily" ? "day" : "week") : "",
    duration: goal.duration || "",
    afterTime: goal.afterTime ? `${goal.afterTime}` : "",
    beforeTime: goal.beforeTime ? `${goal.beforeTime}` : "",
    budgetDuration: goal.timeBudget?.duration || "",
    budgetPeriod: goal.timeBudget?.period || "once",
  });

  const handleDateChange = (type: "From" | "To", value: string) => {
    if (type === "From") {
      setStart(value);
    } else {
      setDue(value);
    }
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
    }
    if (isPerSelected) {
      const obj = { budgetDuration: value, budgetPeriod: tags.budgetPeriod };
      if (Number(value) > 24) {
        obj.budgetPeriod = "week";
        setSelectedTag("hrs / week");
      }
      setTags({ ...tags, ...obj });
    } else if (selectedTag === "before" || key === "beforeTime") {
      setTags({ ...tags, beforeTime: value });
    } else if (selectedTag === "after" || key === "afterTime") {
      setTags({ ...tags, afterTime: value });
    }
    setShowDeleteIcon(true);
  };

  const handleTagClick = (value: string) => {
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
        <p>{t(type)}: </p>
        <input
          type="date"
          value={type === "From" ? start : due}
          onChange={(e) => {
            handleDateChange(type, e.target.value);
          }}
          className="datepicker"
        />
      </div>
    </Col>
  );

  const getInputField = (key: string) => (
    <input
      type="number"
      style={{ textAlign: "center", maxWidth: 25 }}
      className="default-input"
      placeholder="0"
      value={tags[key]}
      onChange={(e) => handleFieldChange(key, e.target.value)}
    />
  );

  const getWeekdaysGroup = () => (
    <Row>
      {calDays.map((ele) => (
        <Col key={ele} span={6}>
          <Checkbox
            value={ele}
            checked={daysGroup.includes(ele)}
            onChange={() => {
              setDaysGroup([...daysGroup.filter((d) => d !== ele)]);
            }}
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
          <button
            type="button"
            className={ele === selectedTag || activeTags.includes(ele) ? "selected" : ""}
            onClick={() => {
              setActiveTags([...activeTags.filter((activeTag) => !items.includes(activeTag)), ele])
              handleTagClick(ele);
            }}
          >
            {t(ele)}
          </button>
        </li>
      ))}
    </ul>
  );

  const getRadioGroup = (options: string[], selectedValue: string) => (
    <Radio.Group onChange={(e) => handleRadioClick(e.target.value)} value={selectedValue}>
      {options.map((ele) => (
        <Radio className="checkbox" key={ele} value={ele}>
          {t(ele)}
        </Radio>
      ))}
    </Radio.Group>
  );

  const isTitleEmpty = () => {
    if (title.length === 0) {
      setShowToast({
        open: true,
        message: `Goal cannot be ${showAddGoal ? "added" : "updated"} without title`,
        extra: "",
      });
    }
    return title.length === 0;
  };

  const getFinalTags = () => ({
    ...goal,
    due: due && due !== "" ? new Date(due).toString() : null,
    start: start && start !== "" ? new Date(start).toString() : null,
    duration: tags.duration !== "" ? `${tags.duration}` : null,
    afterTime: tags.afterTime !== "" ? Number(tags.afterTime) : null,
    beforeTime: tags.beforeTime !== "" ? Number(tags.beforeTime) : null,
    habit: tags.every !== "" ? (tags.every === "day" ? "daily" : "weekly") : null,
    on: tags.on !== "" ? (tags.on === "weekend" ? "weekends" : "weekdays") : null,
    timeBudget:
      tags.budgetDuration !== "" ? { duration: Number(tags.budgetDuration), period: tags.budgetPeriod } : null,
  });

  const updateThisGoal = async () => {
    if (!showUpdateGoal || isTitleEmpty()) {
      return;
    }
    await modifyGoal(goal.id, getFinalTags(), title, colorPalleteList[colorIndex], subGoalsHistory.length);
  };

  const addThisGoal = async () => {
    if (!showAddGoal || isTitleEmpty()) {
      return;
    }
    const { parentGoal } = await createGoal(
      showAddGoal.goalId,
      getFinalTags(),
      title,
      colorPalleteList[colorIndex],
      subGoalsHistory.length
    );
    // @ts-ignore
    if (parentGoal && selectedGoalId !== parentGoal.id) {
      addInHistory(parentGoal);
    }
    if (!parentGoal && title === "magic") {
      setDevMode(true);
      setShowToast({ open: true, message: "Congratulations, you activated DEV mode", extra: "Explore what's hidden" });
    }
  };

  const handleSave = async () => {
    if (showAddGoal?.open) {
      await addThisGoal();
    } else if (showUpdateGoal?.open) {
      await updateThisGoal();
    }
    window.history.back();
  };

  useEffect(() => {
    if (goal.goalColor) {
      setColorIndex(colorPalleteList.indexOf(goal.goalColor));
    }
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

  useEffect(() => {
    document.getElementById("title-field")?.focus();
  }, []);

  useEffect(() => {
    const currentTags = getFinalTags();
    const updatedActiveTags = [];
    if (currentTags.on && currentTags.on !== "") {
      updatedActiveTags.push("on");
    } else if (currentTags.habit && currentTags.habit !== "") {
      updatedActiveTags.push("every");
    }
    if (currentTags.afterTime && currentTags.afterTime >= 0
      && currentTags.beforeTime && currentTags.beforeTime >= 0) {
      updatedActiveTags.push("between");
    } else if (currentTags.afterTime && currentTags.afterTime >= 0) {
      updatedActiveTags.push("after");
    } else if (currentTags.beforeTime && currentTags.beforeTime >= 0) {
      updatedActiveTags.push("before");
    }
    if ((currentTags.timeBudget?.duration || 0) > 0 && currentTags.timeBudget?.period !== "once") {
      updatedActiveTags.push(`hrs / ${currentTags.timeBudget?.period}`);
    }
    setActiveTags([...updatedActiveTags]);
  }, [tags]);

  return (
    <Modal
      className={`configModal popupModal${darkModeStatus ? "-dark" : ""} 
        ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`}
      open={open}
      closable={false}
      footer={null}
      onCancel={async () => {
        if (title !== "") {
          await handleSave();
        } else {
          window.history.back();
        }
      }}
    >
      <div style={{ textAlign: "left" }} className="header-title">
        <input
          onFocus={() => { setShowAllSettings(false); }}
          className="ordinary-element"
          id="title-field"
          placeholder={t("Goal Title")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="button" style={{ position: "absolute", top: 29, right: 24 }} className="ordinary-element" onClick={() => setShowAllSettings(!showAllSettings)}>
          <img src={expandIcon} alt="maximize edit window" style={{ width: 18, height: 18 }} />
        </button>
      </div>
      <div style={{ padding: "0 24px" }}>
        <div style={{ display: "flex", gap: 15, padding: "12px 0" }}>
          <div>
            <p>{showAllSettings ? "Budget" : t("Duration")}: </p>
            <input
              style={{ width: 45 }}
              type="number"
              placeholder="in hrs"
              className="default-input"
              value={showAllSettings ? tags.duration : tags.budgetDuration}
              onChange={(e) => {
                if (showAllSettings) {
                  handleFieldChange("duration", e.target.value);
                } else {
                  setTags({ ...tags, budgetDuration: e.target.value });
                }
              }}
            />
          </div>
          <ColorPalette colorIndex={colorIndex} setColorIndex={setColorIndex} />
        </div>
      </div>
      {!showAllSettings && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Radio.Group
            options={["once", "per day", "per week"]}
            onChange={(e) => {
              const { value } = e.target;
              if (value === "once") {
                setTags({ ...tags, budgetPeriod: "once" });
              } else {
                setTags({ ...tags, budgetPeriod: value.split(" ")[1] });
              }
            }}
            value={tags.budgetPeriod !== "once" ? `per ${tags.budgetPeriod}` : "once"}
          />
        </div>
      )}

      {showAllSettings && (
        <>
          <div className="goal-sent">
            <p>
              {tags.duration ? `${tags.duration}h ` : ""}
              {tags.on !== "" && `${t("on")} ${tags.on} `}
              {tags.every !== "" && `${t("every")} ${tags.every} `}
              {tags.budgetDuration !== "" && `(${tags.budgetDuration}h / ${tags.budgetPeriod}) `}
              {tags.beforeTime !== "" && tags.afterTime !== ""
                ? `${t("between")} ${tags.afterTime}-${tags.beforeTime} `
                : tags.beforeTime !== ""
                  ? `${t("before")} ${tags.beforeTime} `
                  : tags.afterTime !== ""
                    ? `${t("after")} ${tags.afterTime} `
                    : ""}
            </p>
          </div>
          <div className="goal-config">
            <Row className="config-tabs">
              <Col
                style={{ borderRadius: "8px 0px 0px 0px", cursor: "pointer" }}
                className={isDetailsActive ? "selected" : ""}
                onClick={() => {
                  if (!isDetailsActive) {
                    setIsDetailsActive(true);
                  }
                }}
                span={12}
              >
                {t("Period")}
              </Col>
              <Col
                style={{ borderRadius: "0px 8px 0px 0px", cursor: "pointer" }}
                className={isDetailsActive ? "" : "selected"}
                onClick={() => {
                  if (isDetailsActive) {
                    setIsDetailsActive(false);
                  }
                }}
                span={12}
              >
                {t("Timings")}
              </Col>
            </Row>
            {isDetailsActive ? (
              <Row gutter={24} className="goal-dates">
                {getDateField("From")}
                {getDateField("To", { justifyContent: "flex-end" })}
              </Row>
            ) : (
              <div className="timings">
                <div className="tag-input">
                  <span>{["after", "before", "between"].includes(selectedTag) && t(selectedTag)}</span>
                  {(isPerSelected || selectedTag === "between") &&
                    getInputField(isPerSelected ? "budgetDuration" : "afterTime")}

                  {selectedTag === t("between") && <span>-</span>}
                  {isPerSelected && <span>{t(selectedTag)}</span>}

                  {["before", "after", "between"].includes(selectedTag) &&
                    getInputField(selectedTag === "between" ? "beforeTime" : `${selectedTag}Time`)}

                  {selectedTag === "on" && getRadioGroup(["weekdays", "weekend"], tags.on)}
                  {selectedTag === "every" && getRadioGroup(["day", "week"], tags.every)}
                  {showDeleteIcon && (
                    <button type="button" className="ordinary-element" onClick={deleteTag}>
                      <img alt="delete tag" className={`${darkModeStatus ? "dark-svg" : ""}`} src={deleteIcon} />
                    </button>
                  )}
                </div>
                <div className="sent-tags">
                  {getTagSelector(["on", "every"])}
                  {getTagSelector(["hrs / day", "hrs / week"])}
                  {getTagSelector(["after", "before", "between"])}
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <div style={{ marginTop: 14, textAlign: "center" }}>
        <button type="button" className="action-btn" onClick={handleSave}>
          {t(`${action} Goal`)}
        </button>
      </div>
    </Modal>
  );
};

export default ConfigGoal;
