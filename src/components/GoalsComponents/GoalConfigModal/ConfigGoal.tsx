import { SliderMarks } from "antd/es/slider";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Modal, Slider } from "antd";
import { darkModeState, displayToast, openDevMode } from "@src/store";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useLocation } from "react-router-dom";

import plingSound from "@assets/pling.mp3";

import ZAccordion from "@src/common/Accordion";
import ColorPalette from "@src/common/ColorPalette";
import { GoalItem } from "@src/models/GoalItem";
import { themeState } from "@src/store/ThemeState";
import { ILocationState } from "@src/Interfaces";
import { getSharedWMGoal } from "@src/api/SharedWMAPI";
import { ICustomInputProps } from "@src/Interfaces/IPopupModals";
import { modifyGoal, createGoal } from "@src/helpers/GoalController";
import { suggestChanges, suggestNewGoal } from "@src/helpers/PartnerController";
import { displayAddGoal, selectedColorIndex, displayUpdateGoal, goalsHistory } from "@src/store/GoalsState";
import { colorPalleteList, calDays, convertOnFilterToArray } from "../../../utils";

import "./ConfigGoal.scss";

const onDays = [...calDays.slice(1), "Sun"];

const CustomInput: React.FC<ICustomInputProps> = ({ placeholder, value, handleChange, style }) => (
  <input
    type="number"
    placeholder={placeholder || ""}
    style={{ textAlign: "center", maxWidth: 30, ...(style || {}) }}
    className="default-input"
    value={value}
    onChange={(e) => {
      handleChange(e.target.value);
    }}
  />
);

const roundOffHours = (hrsValue: string) => {
  return hrsValue === "" ? "" : String(Math.min(Math.max(Math.round(Number(hrsValue)), 0), 99));
};

const ConfigGoal = ({ goal, action }: { action: "Update" | "Create"; goal: GoalItem }) => {
  const { t } = useTranslation();
  const { state }: { state: ILocationState } = useLocation();
  const mySound = new Audio(plingSound);

  const theme = useRecoilValue(themeState);
  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalsHistory = useRecoilValue(goalsHistory);
  const ancestors = subGoalsHistory.map((ele) => ele.goalID);

  const setDevMode = useSetRecoilState(openDevMode);
  const setShowToast = useSetRecoilState(displayToast);

  const [colorIndex, setColorIndex] = useRecoilState(selectedColorIndex);
  const showAddGoal = useRecoilValue(displayAddGoal);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);

  const open = !!showAddGoal || !!showUpdateGoal;

  const [title, setTitle] = useState(goal.title);
  // const [due, setDue] = useState(goal.due ? new Date(goal.due).toISOString().slice(0, 10) : "");
  // const [start, setStart] = useState((goal.start ? new Date(goal.start) : new Date()).toISOString().slice(0, 10));
  // const [endTime, setEndTime] = useState(goal.due ? new Date(goal.due).getHours() : 0);
  // const [startTime, setStartTime] = useState(goal.start ? new Date(goal.start).getHours() : 0);
  const [tags, setTags] = useState({
    on: goal.on || convertOnFilterToArray("weekdays"),
    repeatWeekly: goal.habit === "weekly",
    duration: goal.duration || "",
  });
  const numberOfDays = tags.on.length;

  const [afterTime, setAfterTime] = useState(showUpdateGoal ? goal.afterTime || 9 : 9);
  const [beforeTime, setBeforeTime] = useState(showUpdateGoal ? goal.beforeTime || 18 : 18);
  const [budgetPanelIsOpen, setBudgetPanelIsOpen] = useState(false);
  const timeDiff = beforeTime - afterTime;
  const perDayBudget = (goal.timeBudget.perDay?.includes("-") ? goal.timeBudget.perDay : `${timeDiff}-${timeDiff}`)
    .split("-")
    .map((ele) => Number(ele));
  const perWeekBudget = (
    goal.timeBudget.perWeek?.includes("-")
      ? goal.timeBudget.perWeek
      : `${timeDiff * numberOfDays}-${timeDiff * numberOfDays}`
  )
    .split("-")
    .map((ele) => Number(ele));

  const [perDayHrs, setPerDayHrs] = useState(perDayBudget);
  const [perWeekHrs, setPerWeekHrs] = useState(perWeekBudget);

  const marks: SliderMarks = { 0: "0", 24: "24" };

  const isTitleEmpty = () => {
    if (title.length === 0 || title.trim() === "") {
      setShowToast({
        open: true,
        message: `Goal cannot be ${showAddGoal ? "added" : "updated"} without title`,
        extra: "",
      });
    }
    return title.length === 0 || title.trim() === "";
  };

  const getFinalTags = () => ({
    ...goal,
    // due: due && due !== "" ? new Date(due).toString() : null,
    // start: start && start !== "" ? new Date(start).toString() : null,
    duration: tags.duration !== "" ? `${tags.duration}` : null,
    afterTime,
    beforeTime,
    habit: tags.repeatWeekly ? "weekly" : null,
    on: calDays.filter((ele) => tags.on.includes(ele)),
    timeBudget: {
      perDay: state.goalType === "Budget" ? perDayHrs.join("-") : null,
      perWeek: state.goalType === "Budget" ? perWeekHrs.join("-") : null,
    },
  });

  const updateThisGoal = async () => {
    if (!showUpdateGoal) {
      return;
    }
    const goalColor = colorPalleteList[colorIndex];
    if (state.displayPartnerMode) {
      let rootGoal = goal;
      if (state.goalsHistory && state.goalsHistory.length > 0) {
        const rootGoalId = state.goalsHistory[0].goalID;
        rootGoal = await getSharedWMGoal(rootGoalId);
      }
      suggestChanges(rootGoal, getFinalTags(), title, goalColor, subGoalsHistory.length);
    } else {
      await modifyGoal(goal.id, getFinalTags(), title, goalColor, [...ancestors, goal.id]);
    }
  };

  const addThisGoal = async () => {
    if (!showAddGoal) {
      return;
    }
    if (state.displayPartnerMode && state.goalsHistory) {
      const parentId = state.goalsHistory.slice(-1)[0].goalID;
      const rootGoalId = state.goalsHistory[0].goalID;
      const rootGoal = await getSharedWMGoal(rootGoalId);
      const parentGoal = parentId === rootGoalId ? rootGoal : await getSharedWMGoal(parentId);
      if (!parentGoal || !rootGoal) {
        return;
      }
      suggestNewGoal(rootGoal, parentGoal, getFinalTags(), title, colorPalleteList[colorIndex], subGoalsHistory.length);
    } else {
      const { parentGoal } = await createGoal(
        showAddGoal.goalId,
        getFinalTags(),
        title,
        colorPalleteList[colorIndex],
        ancestors,
      );
      if (!parentGoal && title === "magic") {
        setDevMode(true);
        setShowToast({
          open: true,
          message: "Congratulations, you activated DEV mode",
          extra: "Explore what's hidden",
        });
      }
    }
    await mySound.play();
  };

  const handleSave = async () => {
    if (isTitleEmpty()) {
      setShowToast({
        open: true,
        message: `Goal cannot be ${showAddGoal ? "added" : "updated"} without title`,
        extra: "",
      });
      setTitle("");
      return;
    }

    if (showAddGoal?.open) {
      await addThisGoal();
    } else if (showUpdateGoal?.open) {
      await updateThisGoal();
    }
    window.history.back();
  };

  useEffect(() => {
    if (goal) setColorIndex(colorPalleteList.indexOf(goal.goalColor));
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
          placeholder={t(`${state.goalType !== "Budget" ? "Goal" : "Budget"} title`)}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDownCapture={async (e) => {
            if (e.key === "Enter") {
              if (state.goalType === "Goal") {
                e.preventDefault();
                await handleSave();
              } else {
                e.preventDefault();
                document.getElementById("title-field")?.blur();
              }
            }
          }}
          inputMode="text"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginTop: 24,
          padding: "0 18px",
        }}
      >
        {state.goalType === "Budget" ? (
          <>
            <div>
              <span>Between</span>
              <Slider
                min={0}
                max={24}
                marks={{
                  ...marks,
                  [afterTime]: `${afterTime}`,
                  [beforeTime]: `${beforeTime}`,
                }}
                range
                defaultValue={[afterTime, beforeTime]}
                onAfterChange={(val) => {
                  if (!budgetPanelIsOpen) {
                    const calculatedDayBudget = Number([val[1] - val[0]]);
                    const calculatedWeekBudget = Number([val[1] - val[0]]) * numberOfDays;
                    setPerDayHrs([calculatedDayBudget, calculatedDayBudget]);
                    setPerWeekHrs([calculatedWeekBudget, calculatedWeekBudget]);
                  }
                  setAfterTime(val[0]);
                  setBeforeTime(val[1]);
                }}
              />
            </div>
            <ZAccordion
              showCount={false}
              style={{
                border: "none",
                background: "var(--secondary-background)",
              }}
              onChange={() => {
                if (!budgetPanelIsOpen) {
                  setBudgetPanelIsOpen(true);
                }
              }}
              panels={[
                {
                  header: "Set Your Budget",
                  body: (
                    <div>
                      <div>
                        <span>
                          {perDayHrs[0] === perDayHrs[1] ? perDayHrs[0] : `${perDayHrs[0]} - ${perDayHrs[1]}`} hrs / day
                        </span>
                        <Slider
                          min={1}
                          max={beforeTime - afterTime}
                          marks={{
                            1: "1",
                            [perDayHrs[0]]: `${perDayHrs[0]}`,
                            [perDayHrs[1]]: `${perDayHrs[1]}`,
                            [beforeTime - afterTime]: `${beforeTime - afterTime}`,
                          }}
                          range
                          defaultValue={perDayHrs}
                          onAfterChange={(val) => {
                            setPerDayHrs(val);
                          }}
                        />
                      </div>
                      <div>
                        <span>
                          {perWeekHrs[0] === perWeekHrs[1] ? perWeekHrs[0] : `${perWeekHrs[0]} - ${perWeekHrs[1]}`} hrs
                          / week
                        </span>
                        <Slider
                          min={1}
                          max={(beforeTime - afterTime) * numberOfDays}
                          marks={{
                            1: "1",
                            [perWeekHrs[0]]: `${perWeekHrs[0]}`,
                            [perWeekHrs[1]]: `${perWeekHrs[1]}`,
                            [(beforeTime - afterTime) * numberOfDays]: `${(beforeTime - afterTime) * numberOfDays}`,
                          }}
                          range
                          defaultValue={perWeekHrs}
                          onAfterChange={(val) => {
                            setPerWeekHrs(val);
                          }}
                        />
                      </div>
                    </div>
                  ),
                },
              ]}
            />

            <div
              style={{
                display: "flex",
                gap: 6,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
                  {t(d)[0]}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
            }}
          >
            <span>Duration</span>
            <CustomInput
              value={tags.duration}
              handleChange={(value: string) => {
                setTags({ ...tags, duration: roundOffHours(value) });
              }}
              style={{
                maxWidth: 50,
                boxShadow: "var(--shadow)",
              }}
            />
          </div>
        )}
        <ColorPalette colorIndex={colorIndex} setColorIndex={setColorIndex} />
        <button type="button" className="action-btn" onClick={handleSave}>
          {t(`${action} ${state.goalType === "Budget" ? "Budget" : "Goal"}`)}
        </button>
      </div>
    </Modal>
  );
};

export default ConfigGoal;
