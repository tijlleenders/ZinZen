/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";

import chevronLeftIcon from "@assets/images/chevronLeft.svg";

import { ITask } from "@src/Interfaces/Task";
import { useTranslation } from "react-i18next";

import "./index.scss";
import { TasksDoneTodayItem } from "@src/models/TasksDoneTodayItem";
import { GoalTiming } from "./GoalTiming";
import { TaskOptions } from "./TaskOptions";
import { updateImpossibleGoals } from "./updateImpossibleGoals";
import { useMyTimelineStore } from "./useMyTimelineStore";

type ImpossibleTaskId = string;

interface MyTimelineProps {
  day: string;
  myTasks: {
    scheduled: ITask[];
    impossible: ImpossibleTaskId[];
    freeHrsOfDay: number;
    scheduledHrs: number;
  };
  doneTasks: TasksDoneTodayItem[];
}

export const MyTimeline: React.FC<MyTimelineProps> = ({ day, myTasks, doneTasks }) => {
  const { t } = useTranslation();
  const [displayOptionsIndex, setDisplayOptionsIndex] = useState("root");

  const { handleActionClick, handleOpenGoal } = useMyTimelineStore(day);

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
        const markDone = doneTasks.some((doneTask) => doneTask.scheduledTaskId === task.taskid);
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
