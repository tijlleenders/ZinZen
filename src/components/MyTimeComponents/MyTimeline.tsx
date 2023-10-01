/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-key */
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import archiveTune from "@assets/archive.mp3";
import forgetTune from "@assets/forget.mp3";
import chevronLeftIcon from "@assets/images/chevronLeft.svg";

import { ITask } from "@src/Interfaces/Task";
import { getGoal } from "@src/api/GoalsAPI";
import { TaskItem } from "@src/models/TaskItem";
import { GoalItem } from "@src/models/GoalItem";
import { displayReschedule } from "@src/store/TaskState";
import { getHrFromDateString } from "@src/utils/SchedulerUtils";
import { darkModeState, displayToast, lastAction, openDevMode, selectedMyTimeView, focusTaskTitle } from "@src/store";
import { addTask, completeTask, forgetTask, getTaskByGoalId } from "@src/api/TasksAPI";

import "./index.scss";

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
    impossible: ITask[];
    freeHrsOfDay: number;
    scheduledHrs: number;
  };
}

export const MyTimeline: React.FC<MyTimelineProps> = ({ day, myTasks, taskDetails, setTaskDetails }) => {
  const navigate = useNavigate();
  const doneSound = new Audio(archiveTune);
  const forgetSound = new Audio(forgetTune);

  const { state: locationState } = useLocation();
  const devMode = useRecoilValue(openDevMode);
  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);
  const setOpenReschedule = useSetRecoilState(displayReschedule);
  const setCurrentView = useSetRecoilState(selectedMyTimeView);
  const setTaskTitle = useSetRecoilState(focusTaskTitle);

  const [showScheduled, setShowScheduled] = useState(true);

  const [displayOptionsIndex, setDisplayOptionsIndex] = useState("root");

  const handleView = () => {
    setShowScheduled(!showScheduled);
  };
  // console.log(devMode);
  const handleActionClick = async (actionName: "Skip" | "Reschedule" | "Done" | "Focus", task: ITask) => {
    if (day === "Today") {
      const taskItem = await getTaskByGoalId(task.goalid);
      if (!taskItem) {
        // @ts-ignore
        await addTask({
          id: uuidv4(),
          goalId: task.goalid,
          title: task.title,
          completedTodayIds: [task.taskid],
          forgotToday:
            actionName === "Skip" ? [`${getHrFromDateString(task.start)}-${getHrFromDateString(task.deadline)}`] : [],
          completedToday: actionName === "Done" ? Number(task.duration) : 0,
          lastForget: actionName === "Skip" ? new Date().toLocaleDateString() : "",
          lastCompleted: actionName === "Done" ? new Date().toLocaleDateString() : "",
          hoursSpent: 0,
          blockedSlots: [], // actionName === "Reschedule" ? [{ start: task.start, end: task.deadline }] : [],
        });
        // if (actionName === "Reschedule") {
        //   setOpenReschedule({ ...task });
        // }
      } else if (actionName === "Done") {
        await completeTask(taskItem.id, Number(task.duration), task.taskid);
      } else if (actionName === "Skip") {
        await forgetTask(taskItem.id, `${getHrFromDateString(task.start)}-${getHrFromDateString(task.deadline)}`);
      } else if (actionName === "Reschedule") {
        // setOpenReschedule({ ...task });
      }
      if (actionName === "Done") {
        await doneSound.play();
        const updatedTask = await getTaskByGoalId(task.goalid);
        if (updatedTask) {
          setTaskDetails({
            ...taskDetails,
            [task.goalid]: updatedTask,
          });
        }
      } else if (actionName === "Skip") {
        await forgetSound.play();
        setLastAction("TaskSkipped");
      } else if (actionName === "Focus") {
        setTaskTitle(task.title);
        setCurrentView("focus");
      }
    } else {
      setShowToast({ open: true, message: "Let's focus on Today :)", extra: "" });
    }
  };
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
    navigate("/MyGoals", {
      state: {
        ...locationState,
        from: "",
        goalsHistory,
        activeGoalId: parentGoalId,
        expandedGoalId: goalId,
      },
    });
  };
  const currentHour = new Date().getHours();
  const currentActiveTask = myTasks.scheduled.filter((task) => {
    if (task.start) {
      const startHour = parseInt(task.start.split("T")[1].slice(0, 2), 10);
      if (startHour < currentHour) {
        return false;
      }
    }
    return true;
  });
  if (currentActiveTask[0] === undefined) {
    setTaskTitle("No Scheduled Tasks");
  } else {
    setTaskTitle(currentActiveTask[0]?.title);
  }
  console.log("currentActiveTask", currentActiveTask[0]);
  return (
    <>
      {myTasks.impossible.length > 0 && (
        <div className={`timeline-view${darkModeStatus ? "-dark" : ""}`}>
          <button type="button" className={`${showScheduled && "activeView"}`} onClick={handleView}>
            Scheduled
          </button>
          <button type="button" className={`${!showScheduled && "activeView"}`} onClick={handleView}>
            Impossible
          </button>
        </div>
      )}
      <div className="MTL-display" style={{ paddingTop: `${myTasks.scheduled.length > 0 ? "" : "1.125rem"}` }}>
        {myTasks[showScheduled ? "scheduled" : "impossible"].map((task) => {
          const startTime = task.start ? task.start.split("T")[1].slice(0, 2) : null;
          const endTime = task.deadline ? task.deadline.split("T")[1].slice(0, 2) : null;
          const markDone = !!taskDetails[task.goalid]?.completedTodayIds.includes(task.taskid);
          return (
            <button
              className={`${day === "Today" && markDone ? "completedTask" : ""}`}
              type="button"
              style={displayOptionsIndex !== task.taskid ? { cursor: "pointer" } : {}}
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
              <div style={{ display: "flex", position: "relative" }}>
                <button type="button" className="MTL-circle" style={{ backgroundColor: `${task.goalColor}` }} />
                <div style={{ marginLeft: "11px", color: `${task.goalColor}` }}>
                  <button
                    style={{ textDecorationColor: task.goalColor }}
                    type="button"
                    className="MTL-taskTitle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplayOptionsIndex(task.taskid);
                      if (displayOptionsIndex === task.taskid || markDone) {
                        handleOpenGoal(task.goalid);
                      }
                    }}
                  >
                    {task.title}
                  </button>
                  <div className="MTL-goalTiming">
                    {startTime ? (
                      <>
                        <span>{parseInt(startTime, 10)}</span>
                        <sup>00</sup>
                      </>
                    ) : (
                      ""
                    )}
                    <span>&nbsp;-&nbsp;</span>
                    {endTime ? (
                      <>
                        <span>{parseInt(endTime, 10)}</span>
                        <sup>00</sup>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                {displayOptionsIndex === task.taskid && (
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
              {!markDone && displayOptionsIndex === task.taskid ? (
                <div className="MTL-options">
                  <button type="button" onClick={() => handleActionClick("Skip", task)}>
                    Skip
                  </button>
                  <div />
                  <button type="button" onClick={() => handleActionClick("Reschedule", task)}>
                    Reschedule
                  </button>
                  <div />
                  <button type="button" onClick={() => handleActionClick("Done", task)}>
                    Done
                  </button>
                  <div />
                  <button type="button" onClick={() => handleActionClick("Focus", task)}>
                    Focus
                  </button>
                  <div />
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </>
  );
};
