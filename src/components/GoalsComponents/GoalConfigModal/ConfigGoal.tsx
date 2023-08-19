import moment from "moment";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Checkbox, Modal } from "antd";
import { darkModeState, displayToast, openDevMode } from "@src/store";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";


import {
  displayAddGoal,
  selectedColorIndex,
  displayUpdateGoal,
  goalsHistory,
  displayGoalId,
} from "@src/store/GoalsState";
import { GoalItem } from "@src/models/GoalItem";
import { themeState } from "@src/store/ThemeState";
import { ICustomInputProps } from "@src/Interfaces/IPopupModals";
import { modifyGoal, createGoal } from "@src/helpers/GoalController";

import { colorPalleteList, calDays, convertOnFilterToArray } from "../../../utils";
import "./ConfigGoal.scss";
import ConfigOption from "./ConfigOption";
import CustomDatePicker from "./CustomDatePicker";
import ColorPalette from "@src/common/ColorPalette";

const onDays = [...calDays.slice(1), "Sun"];

const CustomInput: React.FC<ICustomInputProps> = ({ placeholder, value, handleChange, style }) => (
  <input
    type="number"
    placeholder={placeholder || ""}
    style={{ textAlign: "center", maxWidth: 25, ...(style || {}) }}
    className="default-input"
    value={value}
    onChange={(e) => {
      handleChange(e.target.value);
    }}
  />
);

const ConfigGoal = ({ goal, action }: { action: "Update" | "Create", goal: GoalItem }) => {
  const { t } = useTranslation();
  const theme = useRecoilValue(themeState);
  const today = moment(new Date()).format("YYYY-MM-DD");
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
  const [due, setDue] = useState(goal.due ? new Date(goal.due).toISOString().slice(0, 10) : "");
  const [start, setStart] = useState((goal.start ? new Date(goal.start) : new Date()).toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState(goal.start ? new Date(goal.start).getHours() : 0);
  const [endTime, setEndTime] = useState(goal.due ? new Date(goal.due).getHours() : 0);

  const [tags, setTags] = useState({
    on: goal.on || convertOnFilterToArray("weekdays"),
    repeatWeekly: goal.habit === "weekly",
    duration: goal.duration || "",
    afterTime: `${goal.afterTime || ""}`,
    beforeTime: `${goal.beforeTime || ""}`,
    perDay: goal.timeBudget?.perDay || "",
    perWeek: goal.timeBudget?.perWeek || "",
  });

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
    habit: tags.repeatWeekly ? "weekly" : null,
    on: calDays.filter((ele) => tags.on.includes(ele)),
    timeBudget: {
      perDay: tags.perDay || null,
      perWeek: tags.perWeek || null,
    },
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
      subGoalsHistory.length,
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
    document.getElementById("title-field")?.focus();
  }, []);

  return (
    <Modal
      className={`configModal popupModal${darkModeStatus ? "-dark" : ""} 
        ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`}
      open={open}
      width={360}
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
          className="ordinary-element"
          id="title-field"
          placeholder={t("Goal Title")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginTop: 24,
          paddingLeft: 18,
        }}
      >
        <ConfigOption
          label={
            <CustomInput
              value={tags.duration}
              handleChange={(value: string) => {
                setTags({ ...tags, duration: value });
              }}
              style={{}}
            />
          }
        >
          hours
        </ConfigOption>
        <ConfigOption label="on">
          {onDays.map((d) => (
            <span
              onClickCapture={() => {
                setTags({
                  ...tags,
                  on: tags.on.includes(d) ? [...tags.on.filter((ele) => ele !== d)] : [...tags.on, d],
                });
              }}
              className={`on_day ${tags.on.includes(d) ? "selected" : ""}`}
              key={d}
            >
              {d[0]}
            </span>
          ))}
        </ConfigOption>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center", marginRight: 25 }}>
          <div>between</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <CustomInput
              value={tags.afterTime}
              handleChange={(value: string) => {
                setTags({ ...tags, afterTime: value });
              }}
              style={{}}
            />
            <span>-</span>
            <CustomInput
              value={tags.beforeTime}
              handleChange={(value: string) => {
                setTags({ ...tags, beforeTime: value });
              }}
              style={{}}
            />
          </div>
        </div>
        <ConfigOption label="max">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <CustomInput
                value={tags.perDay}
                handleChange={(value: string) => {
                  setTags({ ...tags, perDay: value });
                }}
                style={{}}
              />
              <span>hours / day</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <CustomInput
                value={tags.perWeek}
                handleChange={(value: string) => {
                  setTags({ ...tags, perWeek: value });
                }}
                style={{}}
              />
              <span>hours / week</span>
            </div>
          </div>
        </ConfigOption>
        <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
          <CustomDatePicker
            handleDateChange={(value) => {
              setStart(value);
            }}
            handleTimeChange={(value) => setStartTime(value)}
            label="starts"
            dateValue={
              start
                ? moment(start).format("YYYY-MM-DD")
                : goal?.createdAt
                  ? moment(goal.createdAt).format("YYYY-MM-DD")
                  : today
            }
            timeValue={startTime}
          />
          <CustomDatePicker
            handleDateChange={(value) => {
              setDue(value);
            }}
            handleTimeChange={(value) => setEndTime(value)}
            label="ends"
            dateValue={due}
            timeValue={endTime}
          />
        </div>
        <Checkbox
          className="checkbox"
          checked={tags.repeatWeekly}
          onChange={(e) => {
            setTags({ ...tags, repeatWeekly: e.target.checked });
          }}
        >
          repeats weekly
        </Checkbox>
        <ColorPalette colorIndex={colorIndex} setColorIndex={setColorIndex} />

        <div style={{ marginTop: 14, textAlign: "center" }}>
          <button type="button" className="action-btn" onClick={handleSave}>
            {t(`${action} Goal`)}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfigGoal;
