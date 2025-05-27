/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";

import chevronLeftIcon from "@assets/images/chevronLeft.svg";

import { ITask, TaskStatusFromScheduler } from "@src/Interfaces/Task";
import { useTranslation } from "react-i18next";

import "./index.scss";
import { getTimePart } from "@src/utils";
import { TaskOptions } from "./TaskOptions";
import { updateImpossibleGoals } from "./updateImpossibleGoals";
import { useMyTimelineStore } from "./useMyTimelineStore";
import GoalTiming from "./GoalTiming";

type ImpossibleTaskId = string;

interface MyTimelineProps {
  day: string;
  myTasks: {
    scheduled: ITask[];
    impossible: ImpossibleTaskId[];
    freeHrsOfDay: number;
    scheduledHrs: number;
  };
}

const MyTimeline: React.FC<MyTimelineProps> = ({ day, myTasks }) => {
  const { t } = useTranslation();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const { handleActionClick, handleOpenGoal } = useMyTimelineStore(day);

  const toggleTaskOptions = (taskId: string) => {
    setActiveTaskId((prevTaskId) => (prevTaskId === taskId ? null : taskId));
  };

  useEffect(() => {
    updateImpossibleGoals(myTasks.impossible);
  }, []);

  return (
    <div className="MTL-display" style={{ paddingTop: `${myTasks.scheduled.length > 0 ? "" : "1.125rem"}` }}>
      <h4 className="MTL-header">Tasks</h4>
      {myTasks.scheduled.map((task, index) => {
        const startTime = getTimePart(task.start);
        const endTime = getTimePart(task.deadline);
        const nextTask = myTasks.scheduled[index + 1];
        const nextStartTime = getTimePart(nextTask?.start);
        const displayEndTime = endTime !== nextStartTime;
        const showTaskOptions = activeTaskId === task.taskid;
        const isTaskCompleted = task.status === TaskStatusFromScheduler.TaskDone;

        const handleTaskClick = () => {
          if (isTaskCompleted) {
            handleOpenGoal(task.goalid);
          } else {
            toggleTaskOptions(task.taskid);
          }
        };
        return (
          <button
            key={task.taskid}
            className={`MTL-taskItem simple ${isTaskCompleted ? "completedTask" : ""}`}
            type="button"
            style={{ borderLeft: `6px solid ${task.goalColor}` }}
            onClick={handleTaskClick}
          >
            <GoalTiming
              startTime={startTime}
              endTime={endTime}
              showTaskOptions={showTaskOptions}
              displayEndTime={displayEndTime}
            />
            <div className="MTL-taskTitleActionWrapper">
              <span style={{ textDecorationColor: task.goalColor }} className="MTL-taskTitle">
                {t(`${task.title}`)}
              </span>
              {showTaskOptions ? <TaskOptions task={task} handleActionClick={handleActionClick} /> : null}
            </div>
            {showTaskOptions && (
              <img src={chevronLeftIcon} className="MyTime-expand-btw chevronDown theme-icon" alt="zinzen schedule" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MyTimeline;
