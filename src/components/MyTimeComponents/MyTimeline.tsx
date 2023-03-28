/* eslint-disable react/jsx-key */
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "react-bootstrap-icons";
import { useRecoilValue, useSetRecoilState } from "recoil";

import archiveSound from "@assets/archive.mp3";

import { ITask } from "@src/Interfaces/Task";
import { TaskItem } from "@src/models/TaskItem";
import { darkModeState, displayToast } from "@src/store";
import { addTask, completeTask, getTaskByGoalId } from "@src/api/TasksAPI";

import "./MyTimeline.scss";

interface MyTimelineProps {
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

export const MyTimeline: React.FC<MyTimelineProps> = ({ myTasks, taskDetails, setTaskDetails }) => {
  const navigate = useNavigate();
  const mySound = new Audio(archiveSound);

  const darkModeStatus = useRecoilValue(darkModeState);
  const [showScheduled, setShowScheduled] = useState(true);
  const [displayOptionsIndex, setDisplayOptionsIndex] = useState("root");

  const setShowToast = useSetRecoilState(displayToast);

  const handleView = () => { setShowScheduled(!showScheduled); };

  const handleActionClick = async (actionName: "Forget" | "Reschedule" | "Done", task: ITask) => {
    const taskItem = await getTaskByGoalId(task.goalid);
    if (!taskItem) {
      // @ts-ignore
      await addTask({
        id: uuidv4(),
        goalId: task.goalid,
        title: task.title,
        hoursSpent: actionName === "Done" ? Number(task.duration) : 0,
        lastCompleted: actionName === "Done" ? new Date().toLocaleDateString() : "",
        forget: actionName === "Reschedule",
      });
    } else if (actionName === "Done") {
      await completeTask(taskItem.id);
    }
    if (actionName !== "Done") {
      setShowToast({ open: true, message: "Consider donating...", extra: "Feature coming soon..." });
    } else {
      await mySound.play();
      setTaskDetails({ ...taskDetails, [task.goalid]: { ...taskDetails[task.goalid], lastCompleted: new Date().toLocaleDateString() } });
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
          const startTime = task.start ? task.start.split("T")[1].slice(0, 2) : null;
          const endTime = task.deadline ? task.deadline.split("T")[1].slice(0, 2) : null;
          const completedToday = taskDetails[task.goalid] ? taskDetails[task.goalid].lastCompleted === new Date().toLocaleDateString() : false;
          return (
            <button
              className={completedToday ? "completedTask" : ""}
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
                >.
                </button>
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
                    className={`MyTime-expand-btw${darkModeStatus ? "-dark" : ""} task-dropdown${darkModeStatus ? "-dark" : ""}`}
                  > <div><ChevronDown /></div>
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
