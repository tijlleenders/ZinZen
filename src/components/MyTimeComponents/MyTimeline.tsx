/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-key */
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import archiveTune from "@assets/archive.mp3";
import forgetTune from "@assets/forget.mp3";
import chevronLeftIcon from "@assets/images/chevronLeft.svg";

import { ITask } from "@src/Interfaces/Task";
import { TaskItem } from "@src/models/TaskItem";
import { displayReschedule } from "@src/store/TaskState";
import { darkModeState, displayToast, lastAction, openDevMode } from "@src/store";
import { addBlockedSlot, addTask, completeTask, forgetTask, getTaskByGoalId } from "@src/api/TasksAPI";

import "./MyTimeline.scss";

interface MyTimelineProps {
  day: string,
  taskDetails: { [goalid: string] : TaskItem},
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

  const devMode = useRecoilValue(openDevMode);
  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);
  const setOpenReschedule = useSetRecoilState(displayReschedule);

  const [showScheduled, setShowScheduled] = useState(true);
  const [displayOptionsIndex, setDisplayOptionsIndex] = useState("root");

  const handleView = () => { setShowScheduled(!showScheduled); };
  // console.log(devMode);
  const handleActionClick = async (actionName: "Forget" | "Reschedule" | "Done", task: ITask) => {
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
          hoursSpent: actionName !== "Reschedule" ? Number(task.duration) : 0,
          lastCompleted: actionName === "Done" ? new Date().toLocaleDateString() : "",
          lastForget: actionName === "Forget" ? new Date().toLocaleDateString() : "",
          blockedSlots: actionName === "Reschedule" ? [{ start: task.start, end: task.deadline }] : []
        });
      } else if (actionName === "Done") {
        await completeTask(taskItem.id, Number(task.duration));
      } else if (actionName === "Forget") {
        await forgetTask(taskItem.id, Number(task.duration));
      } else if (actionName === "Reschedule") {
        await addBlockedSlot(task.goalid, { start: task.start, end: task.deadline });
      }
      if (actionName === "Done") {
        await doneSound.play();
        setTaskDetails({ ...taskDetails, [task.goalid]: { ...taskDetails[task.goalid], lastCompleted: new Date().toLocaleDateString() } });
      } else if (actionName === "Forget") {
        await forgetSound.play();
        setTaskDetails({ ...taskDetails, [task.goalid]: { ...taskDetails[task.goalid], lastForget: new Date().toLocaleDateString() } });
      } else {
        setLastAction("TaskRescheduled");
      }
    } else {
      setShowToast({ open: true, message: "Let's focus on Today :)", extra: "" });
    }
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
        { myTasks[showScheduled ? "scheduled" : "impossible"].map((task) => {
          const startTime = task.start ? task.start.split("T")[1].slice(0, 2) : null;
          const endTime = task.deadline ? task.deadline.split("T")[1].slice(0, 2) : null;
          const completedToday = taskDetails[task.goalid] ? taskDetails[task.goalid].lastCompleted === new Date().toLocaleDateString() : false;
          const forgotToday = taskDetails[task.goalid] ? taskDetails[task.goalid].lastForget === new Date().toLocaleDateString() : false;
          return (day === "Today" ? !forgotToday : true) && (
            <button
              className={`${day === "Today" ? completedToday ? "completedTask" : forgotToday ? "forgot" : "" : ""}`}
              type="button"
              style={displayOptionsIndex !== task.goalid ? { cursor: "pointer" } : {}}
              onClick={() => {
                if (displayOptionsIndex !== task.goalid) {
                  setDisplayOptionsIndex(task.goalid);
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
                    type="button"
                    className="MTL-taskTitle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplayOptionsIndex(task.goalid);
                      if (displayOptionsIndex === task.goalid) {
                        navigate("/MyGoals", { state: { isRootGoal: task.parentGoalId === "root", openGoalOfId: task.goalid } });
                      }
                    }}
                  >
                    {task.title}
                  </button>
                  <p className="MTL-goalTiming">
                    {startTime ? `${startTime}:00` : ""}-{endTime ? `${endTime}:00` : ""}
                  </p>
                </div>

                { displayOptionsIndex === task.goalid && (
                  <button
                    type="button"
                    onClick={() => setDisplayOptionsIndex("")}
                    className="MyTime-expand-btw task-dropdown"
                  > <div><img src={chevronLeftIcon} className="chevronDown theme-icon" alt="zinzen schedule" /></div>
                  </button>
                )}
              </div>
              { displayOptionsIndex === task.goalid ? (
                <div className="MTL-options">
                  <button type="button" onClick={() => handleActionClick("Forget", task)}> Forget</button><div />
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
