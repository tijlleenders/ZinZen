/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-key */
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import archiveTune from "@assets/archive.mp3";
import chevronLeftIcon from "@assets/images/chevronLeft.svg";

import { ITask, TaskAction } from "@src/Interfaces/Task";
import { getGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { useTranslation } from "react-i18next";
import { displayToast, focusTaskTitle, lastAction } from "@src/store";
import { addTask, getTaskByGoalId } from "@src/api/TasksAPI";

import "./index.scss";
import { displayReschedule } from "@src/store/TaskState";
import { TaskHistoryItem } from "@src/models/TaskHistoryItem";
import { addTaskCompletedEvent } from "@src/api/TaskHistoryAPI";
import { GoalTiming } from "./GoalTiming";
import { TaskOptions } from "./TaskOptions";
import { updateImpossibleGoals } from "./updateImpossibleGoals";

type ImpossibleTaskId = string;

interface MyTimelineProps {
  day: string;
  myTasks: {
    scheduled: ITask[];
    impossible: ImpossibleTaskId[];
    freeHrsOfDay: number;
    scheduledHrs: number;
  };
  doneTasks: TaskHistoryItem[];
}

export const MyTimeline: React.FC<MyTimelineProps> = ({ day, myTasks, doneTasks }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const doneSound = new Audio(archiveTune);
  const { state: locationState } = useLocation();
  const setShowToast = useSetRecoilState(displayToast);
  const setTaskTitle = useSetRecoilState(focusTaskTitle);
  const setOpenReschedule = useSetRecoilState(displayReschedule);
  const setLastAction = useSetRecoilState(lastAction);
  const [displayOptionsIndex, setDisplayOptionsIndex] = useState("root");

  const handleOpenGoal = async (goalId: string) => {
    const goalsHistory = [];
    let tmpGoal: GoalItem | null = await getGoal(goalId);
    let openGoalId = tmpGoal?.parentGoalId;
    const parentGoalId = openGoalId;
    if (!openGoalId) {
      return;
    }
    while (openGoalId !== "root") {
      tmpGoal = await getGoal(openGoalId);
      if (!tmpGoal) {
        break;
      }
      goalsHistory.push({
        goalID: tmpGoal.id || "root",
        goalColor: tmpGoal.goalColor || "#ffffff",
        goalTitle: tmpGoal.title || "",
      });
      openGoalId = tmpGoal.parentGoalId;
    }
    goalsHistory.reverse();
    navigate("/goals", {
      state: {
        ...locationState,
        from: "",
        goalsHistory,
        activeGoalId: parentGoalId,
        expandedGoalId: goalId,
      },
    });
  };
  const handleFocusClick = (task: ITask) => {
    setTaskTitle(task.title);
    navigate("/", { state: { ...state, displayFocus: true } });
  };

  const handleDoneClick = async (task: ITask) => {
    await addTaskCompletedEvent(task);
    await doneSound.play();
    setLastAction("TaskCompleted");
  };

  const handleActionClick = async (actionName: TaskAction, task: ITask) => {
    if (actionName === TaskAction.Goal) {
      return handleOpenGoal(task.goalid);
    }
    if (actionName === TaskAction.Focus) {
      return handleFocusClick(task);
    }
    if (actionName === TaskAction.Done && day === "Today") {
      return handleDoneClick(task);
    }

    if (day !== "Today") {
      setShowToast({ open: true, message: "Let's focus on Today :)", extra: "" });
      return null;
    }

    if (actionName === TaskAction.NotNow) {
      const taskItem = await getTaskByGoalId(task.goalid);
      if (!taskItem) {
        await addTask({
          id: uuidv4(),
          goalId: task.goalid,
          title: task.title,
          blockedSlots: [],
        });
      }
      return setOpenReschedule({ ...task });
    }

    return null;
  };

  useEffect(() => {
    updateImpossibleGoals(myTasks.impossible);
  }, []);

  return (
    <div className="MTL-display" style={{ paddingTop: `${myTasks.scheduled.length > 0 ? "" : "1.125rem"}` }}>
      {myTasks.scheduled.map((task, index) => {
        const startTime = task.start ? task.start.split("T")[1].slice(0, 2) : null;
        const endTime = task.deadline ? task.deadline.split("T")[1].slice(0, 2) : null;
        const nextTask = myTasks.scheduled[index + 1];
        const nextStartTime = nextTask ? nextTask.start.split("T")[1].slice(0, 2) : null;
        const displayEndTime = endTime !== nextStartTime;
        const markDone = doneTasks.some((doneTask) => doneTask.taskId === task.taskid);
        const showTaskOptions = displayOptionsIndex === task.taskid;
        return (
          <button
            className={`${day === "Today" && markDone ? "completedTask" : ""}`}
            type="button"
            style={
              displayOptionsIndex !== task.taskid
                ? { cursor: "pointer", display: "flex", flexDirection: "row" }
                : { display: "flex", flexDirection: "row" }
            }
            onClick={() => {
              if (displayOptionsIndex !== task.taskid) {
                if (markDone) {
                  handleOpenGoal(task.goalid);
                } else {
                  setDisplayOptionsIndex(task.taskid);
                }
              } else setDisplayOptionsIndex("");
            }}
          >
            <div className="MTL-color-block" style={{ backgroundColor: `${task.goalColor}` }} />
            <GoalTiming
              startTime={startTime}
              endTime={endTime}
              showTaskOptions={showTaskOptions}
              displayEndTime={displayEndTime}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", position: "relative" }}>
                <div style={{ marginLeft: "11px", color: `${task.goalColor}` }}>
                  <button
                    style={{ textDecorationColor: task.goalColor }}
                    type="button"
                    className="MTL-taskTitle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplayOptionsIndex(displayOptionsIndex !== task.taskid ? task.taskid : "");
                      if (displayOptionsIndex === task.taskid || markDone) {
                        setDisplayOptionsIndex("");
                      }
                    }}
                  >
                    {t(`${task.title}`)}
                  </button>
                </div>

                {showTaskOptions && (
                  <button
                    type="button"
                    onClick={() => setDisplayOptionsIndex("")}
                    className="MyTime-expand-btw task-dropdown"
                  >
                    <div>
                      <img src={chevronLeftIcon} className="chevronDown theme-icon" alt="zinzen schedule" />
                    </div>
                  </button>
                )}
              </div>
              {showTaskOptions ? <TaskOptions task={task} handleActionClick={handleActionClick} /> : null}
            </div>
          </button>
        );
      })}
    </div>
  );
};
