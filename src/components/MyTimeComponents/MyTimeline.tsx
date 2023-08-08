/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-key */
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import archiveTune from "@assets/archive.mp3";
import forgetTune from "@assets/forget.mp3";
import chevronLeftIcon from "@assets/images/chevronLeft.svg";

import { ITask } from "@src/Interfaces/Task";
import { getGoal } from "@src/api/GoalsAPI";
import { TaskItem } from "@src/models/TaskItem";
import { GoalItem } from "@src/models/GoalItem";
import { displayReschedule } from "@src/store/TaskState";
import { getHrFromDateString } from "@src/utils/SchedulerUtils";
import { darkModeState, displayToast, lastAction, openDevMode } from "@src/store";
import { addBlockedSlot, addTask, completeTask, forgetTask, getTaskByGoalId } from "@src/api/TasksAPI";

import "./index.scss";

interface MyTimelineProps {
  day: string,
  taskDetails: { [goalid: string]: TaskItem },
  setTaskDetails: React.Dispatch<React.SetStateAction<{
    [goalid: string]: TaskItem;
  }>>
  myTasks: {
    scheduled: ITask[],
    impossible: ITask[],
    freeHrsOfDay: number,
    scheduledHrs: number
  }
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

  const [showScheduled, setShowScheduled] = useState(true);
  const tasksDone: { [id: string]: number } = {};

  Object.keys(taskDetails).forEach((ele) => {
    tasksDone[taskDetails[ele].goalId] = taskDetails[ele].completedToday;
  });

  const [displayOptionsIndex, setDisplayOptionsIndex] = useState("root");

  const handleView = () => { setShowScheduled(!showScheduled); };
  // console.log(devMode);
  const handleActionClick = async (actionName: "Skip" | "Reschedule" | "Done", task: ITask) => {
    if (day === "Today") {
      if (actionName === "Reschedule" && devMode) {
        setOpenReschedule(true);
        return;
      }
      const taskItem = await getTaskByGoalId(task.goalid);
      if (!taskItem) {
        // @ts-ignore
        await addTask({
          id: uuidv4(),
          goalId: task.goalid,
          title: task.title,
          forgotToday: actionName === "Skip" ? [`${getHrFromDateString(task.start)}-${getHrFromDateString(task.deadline)}`] : [],
          completedToday: actionName === "Done" ? Number(task.duration) : 0,
          lastForget: actionName === "Skip" ? new Date().toLocaleDateString() : "",
          lastCompleted: actionName === "Done" ? new Date().toLocaleDateString() : "",
          hoursSpent: 0,
          blockedSlots: actionName === "Reschedule" ? [{ start: task.start, end: task.deadline }] : []
        });
      } else if (actionName === "Done") {
        await completeTask(taskItem.id, Number(task.duration));
      } else if (actionName === "Skip") {
        await forgetTask(taskItem.id, `${getHrFromDateString(task.start)}-${getHrFromDateString(task.deadline)}`);
      } else if (actionName === "Reschedule") {
        await addBlockedSlot(task.goalid, { start: task.start, end: task.deadline });
      }
      if (actionName === "Done") {
        await doneSound.play();
        const updatedTask = { ...await getTaskByGoalId(task.goalid) };
        if (updatedTask) {
          setTaskDetails({
            ...taskDetails,
            [task.goalid]: updatedTask
          });
        }
      } else if (actionName === "Skip") {
        await forgetSound.play();
        setLastAction("TaskSkipped");
      } else {
        setLastAction("TaskRescheduled");
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
    if (!openGoalId) { return; }
    while (openGoalId !== "root") {
      tmpGoal = await getGoal(openGoalId);
      if (!tmpGoal) { break; }
      goalsHistory.push(({
        goalID: tmpGoal.id || "root",
        goalColor: tmpGoal.goalColor || "#ffffff",
        goalTitle: tmpGoal.title || "",
      }));
      openGoalId = tmpGoal.parentGoalId;
    }
    goalsHistory.reverse();
    navigate("/MyGoals", {
      state: {
        ...locationState,
        from: "",
        goalsHistory,
        activeGoalId: parentGoalId,
        expandedGoalId: goalId
      }
    });
  };
  return (
    <>
      {myTasks.impossible.length > 0 && (
        <div className={`timeline-view${darkModeStatus ? "-dark" : ""}`}>
          <button type="button" className={`${showScheduled && "activeView"}`} onClick={handleView}>Scheduled</button>
          <button type="button" className={`${!showScheduled && "activeView"}`} onClick={handleView}>Impossible</button>
        </div>
      )}
      <div className="MTL-display">
        {myTasks[showScheduled ? "scheduled" : "impossible"].map((task) => {
          const startTime = task.start ? task.start.split("T")[1].slice(0, 2) : null;
          const endTime = task.deadline ? task.deadline.split("T")[1].slice(0, 2) : null;
          let markDone = false;
          if (showScheduled) {
            if (tasksDone[task.goalid] > 0) {
              tasksDone[task.goalid] -= Number(task.duration);
              markDone = true;
            }
          }
          return (
            <button
              className={`${day === "Today" && markDone ? "completedTask" : ""}`}
              type="button"
              style={displayOptionsIndex !== task.taskid ? { cursor: "pointer" } : {}}
              onClick={() => {
                if (displayOptionsIndex !== task.taskid) {
                  setDisplayOptionsIndex(task.taskid);
                } else setDisplayOptionsIndex("");
              }}
            >
              <div style={{ display: "flex", position: "relative" }}>
                <button
                  type="button"
                  className="MTL-circle"
                  style={{ backgroundColor: `${task.goalColor}` }}
                />
                <div style={{ marginLeft: "11px", color: `${task.goalColor}` }}>
                  <button
                    style={{ textDecorationColor: task.goalColor }}
                    type="button"
                    className="MTL-taskTitle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplayOptionsIndex(task.taskid);
                      if (displayOptionsIndex === task.taskid) {
                        handleOpenGoal(task.goalid);
                      }
                    }}
                  >
                    {task.title}
                  </button>
                  <p className="MTL-goalTiming">
                    {startTime ? `${startTime}:00` : ""}-{endTime ? `${endTime}:00` : ""}
                  </p>
                </div>

                {displayOptionsIndex === task.taskid && (
                  <button
                    type="button"
                    onClick={() => setDisplayOptionsIndex("")}
                    className="MyTime-expand-btw task-dropdown"
                  > <div><img src={chevronLeftIcon} className="chevronDown theme-icon" alt="zinzen schedule" /></div>
                  </button>
                )}
              </div>
              {displayOptionsIndex === task.taskid ? (
                <div className="MTL-options">
                  <button type="button" onClick={() => handleActionClick("Skip", task)}> Skip</button><div />
                  <button type="button" onClick={() => handleActionClick("Reschedule", task)}> Reschedule</button><div />
                  <button type="button" onClick={() => handleActionClick("Done", task)}> Done</button><div />
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </>
  );
};
