/* eslint-disable react/jsx-key */
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "react-bootstrap-icons";
import { useRecoilValue, useSetRecoilState } from "recoil";

import archiveTune from "@assets/archive.mp3";
import forgetTune from "@assets/forget.mp3";

import { ITask } from "@src/Interfaces/Task";
import { TaskItem } from "@src/models/TaskItem";
import { darkModeState, displayToast, lastAction } from "@src/store";
import { addTask, completeTask, forgetTask, getTaskByGoalId } from "@src/api/TasksAPI";

import "./MyTimeline.scss";

interface MyTimelineProps {
  day: string,
  tasksStatus: { [goalid: string] : TaskItem},
  setTasksStatus: React.Dispatch<React.SetStateAction<{
    [goalid: string]: TaskItem;
  }>>
  myTasks: {
    scheduled: ITask[],
    impossible: ITask[],
    freeHrsOfDay: number,
    scheduledHrs: number
  },
  devMode: boolean,
}

export const MyTimeline: React.FC<MyTimelineProps> = ({ devMode, day, myTasks, tasksStatus, setTasksStatus }) => {
  const navigate = useNavigate();
  const today = new Date();
  if (devMode) {
    today.setDate(today.getDate() + 1);
  }
  const doneSound = new Audio(archiveTune);
  const forgetSound = new Audio(forgetTune);
  const darkModeStatus = useRecoilValue(darkModeState);
  const [showScheduled, setShowScheduled] = useState(true);
  const [displayOptionsIndex, setDisplayOptionsIndex] = useState(-1);
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);

  const handleView = () => { setShowScheduled(!showScheduled); };

  const handleActionClick = async (actionName: "Forget" | "Reschedule" | "Done", task: ITask) => {
    if (day === "Today") {
      const taskItem = await getTaskByGoalId(task.goalid);
      if (!taskItem) {
        // @ts-ignore
        await addTask({
          id: uuidv4(),
          goalId: task.goalid,
          title: task.title,
          hoursSpent: actionName !== "Reschedule" ? Number(task.duration) : 0,
          currentStatus: actionName !== "Reschedule" ? { date: today.toLocaleDateString(), count: Number(task.duration) } : null,
          lastCompleted: actionName === "Done" ? { taskIds: [task.taskid], date: today.toLocaleDateString() } : { taskIds: [], date: "" },
          lastForget: actionName === "Forget" ? { taskIds: [task.taskid], date: today.toLocaleDateString() } : { taskIds: [], date: "" },
        });
      } else if (actionName === "Done") {
        await completeTask(taskItem.id, task.taskid, Number(task.duration));
      } else if (actionName === "Forget") {
        await forgetTask(taskItem.id, task.taskid, Number(task.duration));
      }
      // if (actionName === "Done") {
      //   await doneSound.play();
      // } else {
      //   await forgetSound.play();
      // }
      setLastAction("tasksUpdated");
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
      <div className={`MTL-display${darkModeStatus ? "-dark" : ""}`}>
        { myTasks[showScheduled ? "scheduled" : "impossible"].map((task) => {
          const taskId = Number(task.taskid);
          const startTime = task.start ? task.start.split("T")[1].slice(0, 2) : null;
          const endTime = task.deadline ? task.deadline.split("T")[1].slice(0, 2) : null;
          const completedToday = tasksStatus[task.goalid] ? tasksStatus[task.goalid].lastCompleted.taskIds.includes(task.taskid) &&
            tasksStatus[task.goalid].lastCompleted.date === today.toLocaleDateString() : false;
          const forgotToday = tasksStatus[task.goalid] ? tasksStatus[task.goalid].lastForget.taskIds.includes(task.taskid) &&
            tasksStatus[task.goalid].lastForget.date === today.toLocaleDateString() : false;
          return (day === "Today" ? !forgotToday : true) && (
            <button
              className={`${day === "Today" ? completedToday ? "completedTask" : forgotToday ? "forgot" : "" : ""}`}
              type="button"
              style={displayOptionsIndex !== taskId ? { cursor: "pointer" } : {}}
              onClick={() => {
                if (displayOptionsIndex !== taskId) {
                  setDisplayOptionsIndex(taskId);
                } else setDisplayOptionsIndex(-1);
              }}
            >
              <div style={{ display: "flex", position: "relative" }}>
                <button
                  type="button"
                  className="MTL-circle"
                  style={{ backgroundColor: `${task.goalColor}` }}
                >.
                </button>
                <div style={{ marginLeft: "11px", color: `${task.goalColor}` }}>
                  <button
                    type="button"
                    className="MTL-taskTitle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplayOptionsIndex(taskId);
                      if (displayOptionsIndex === taskId) {
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

                { displayOptionsIndex === taskId && (
                  <button
                    type="button"
                    onClick={() => setDisplayOptionsIndex(-1)}
                    className={`MyTime-expand-btw${darkModeStatus ? "-dark" : ""} task-dropdown${darkModeStatus ? "-dark" : ""}`}
                  > <div><ChevronDown /></div>
                  </button>
                )}
              </div>
              { displayOptionsIndex === taskId ? (
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
