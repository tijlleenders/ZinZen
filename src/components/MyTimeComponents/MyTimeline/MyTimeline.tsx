/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-key */
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import archiveTune from "@assets/archive.mp3";
import forgetTune from "@assets/forget.mp3";
import chevronLeftIcon from "@assets/images/chevronLeft.svg";

import { ITask, TaskAction } from "@src/Interfaces/Task";
import { getGoal } from "@src/api/GoalsAPI";
import { TaskItem } from "@src/models/TaskItem";
import { GoalItem } from "@src/models/GoalItem";
import { getHrFromDateString } from "@src/utils/SchedulerUtils";
import { useTranslation } from "react-i18next";
import { displayToast, lastAction, focusTaskTitle } from "@src/store";
import { addTask, completeTask, forgetTask, getTaskByGoalId } from "@src/api/TasksAPI";

import "./index.scss";
import { displayReschedule } from "@src/store/TaskState";
import { GoalTiming } from "./GoalTiming";
import { TaskOptions } from "./TaskOptions";
import { updateImpossibleGoals } from "./updateImpossibleGoals";

type ImpossibleTaskId = string;

interface MyTimelineProps {
  day: string;
  taskDetails: { [goalid: string]: TaskItem };
  setTaskDetails: React.Dispatch<
    React.SetStateAction<{
      [goalid: string]: TaskItem;
    }>
  >;
  myTasks: {
    scheduled: ITask[];
    impossible: ImpossibleTaskId[];
    freeHrsOfDay: number;
    scheduledHrs: number;
  };
}

export const MyTimeline: React.FC<MyTimelineProps> = ({ day, myTasks, taskDetails, setTaskDetails }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const doneSound = new Audio(archiveTune);
  const forgetSound = new Audio(forgetTune);

  const { state: locationState } = useLocation();
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);
  const setTaskTitle = useSetRecoilState(focusTaskTitle);
  const setOpenReschedule = useSetRecoilState(displayReschedule);

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
  // console.log(devMode);
  const handleFocusClick = (task: ITask) => {
    setTaskTitle(task.title);
    navigate("/", { state: { ...state, displayFocus: true } });
  };

  const handleActionClick = async (actionName: TaskAction, task: ITask) => {
    if (actionName === TaskAction.Goal) {
      return handleOpenGoal(task.goalid);
    }
    if (actionName === TaskAction.Focus) {
      return handleFocusClick(task);
    }
    if (day === "Today") {
      const taskItem = await getTaskByGoalId(task.goalid);
      if (!taskItem) {
        console.log("task not found");

        await addTask({
          id: uuidv4(),
          goalId: task.goalid,
          title: task.title,
          completedTodayIds: [],
          forgotToday:
            actionName === TaskAction.Skip
              ? [`${getHrFromDateString(task.start)}-${getHrFromDateString(task.deadline)}`]
              : [],
          completedToday: actionName === TaskAction.Done ? Number(task.duration) : 0,
          lastForget: actionName === TaskAction.Skip ? new Date().toLocaleDateString() : "",
          lastCompleted: actionName === TaskAction.Done ? new Date().toLocaleDateString() : "",
          hoursSpent: 0,
          completedTodayTimings:
            actionName === TaskAction.Done
              ? [
                  {
                    goalid: task.goalid,
                    start: task.start,
                    deadline: task.deadline,
                  },
                ]
              : [],
          blockedSlots: [],
        });
      } else if (actionName === TaskAction.Done) {
        const markDone = !!taskDetails[task.goalid]?.completedTodayIds.includes(task.taskid);
        if (markDone) return null;
        await completeTask(taskItem.id, Number(task.duration), task);
      } else if (actionName === TaskAction.Skip) {
        await forgetTask(taskItem.id, `${getHrFromDateString(task.start)}-${getHrFromDateString(task.deadline)}`, task);
      } else if (actionName === TaskAction.Reschedule) {
        setOpenReschedule(task);
      }
      if (actionName === TaskAction.Done) {
        await doneSound.play();
        const updatedTask = await getTaskByGoalId(task.goalid);
        if (updatedTask) {
          setTaskDetails({
            ...taskDetails,
            [task.goalid]: updatedTask,
          });
        }
      } else if (actionName === TaskAction.Skip) {
        await forgetSound.play();
        setLastAction("TaskSkipped");
      } else if (actionName === TaskAction.Reschedule) {
        setOpenReschedule({ ...task });
      }
    } else {
      setShowToast({ open: true, message: "Let's focus on Today :)", extra: "" });
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
        const markDone = !!taskDetails[task.goalid]?.completedTodayTimings.find(
          (ele) => ele.start === task.start && ele.deadline === task.deadline,
        );
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
