import React, { useEffect, useState } from "react";
import chevronLeftIcon from "@assets/images/chevronLeft.svg";
import { ITask } from "@src/Interfaces/Task";
import { TaskItem } from "@src/models/TaskItem";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { getTimePart } from "@src/utils";
import { GoalTiming } from "./GoalTiming";
import { TaskOptions } from "./TaskOptions";
import { updateImpossibleGoals } from "./updateImpossibleGoals";
import { useMyTimelineStore } from "./useMyTimelineStore";

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
  const [displayOptionsIndex, setDisplayOptionsIndex] = useState<string | null>(null);
  const { handleActionClick } = useMyTimelineStore(day, taskDetails, setTaskDetails);

  useEffect(() => {
    updateImpossibleGoals(myTasks.impossible);
  }, [myTasks.impossible]);

  const handleToggleDisplayOptions = (taskId: string, isTaskCompleted: boolean) => {
    if (!isTaskCompleted) {
      setDisplayOptionsIndex(displayOptionsIndex === taskId ? null : taskId);
    }
  };

  return (
    <div className="MTL-display" style={{ paddingTop: `${myTasks.scheduled.length > 0 ? "" : "1.125rem"}` }}>
      {myTasks.scheduled.map((task, index) => {
        const startTime = getTimePart(task.start);
        const endTime = getTimePart(task.deadline);
        const nextTask = myTasks.scheduled[index + 1];
        const nextStartTime = getTimePart(nextTask?.start);
        const displayEndTime = endTime !== nextStartTime;
        const markDone = !!taskDetails[task.goalid]?.completedTodayTimings.find(
          (ele) => ele.start === task.start && ele.deadline === task.deadline,
        );
        const showTaskOptions = displayOptionsIndex === task.taskid;

        return (
          <button
            key={task.taskid}
            className={`${day === "Today" && markDone ? "completedTask" : ""}`}
            type="button"
            style={{ cursor: "pointer", display: "flex", flexDirection: "row" }}
            onClick={() => handleToggleDisplayOptions(task.taskid, markDone)}
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
                <button style={{ textDecorationColor: task.goalColor }} type="button" className="MTL-taskTitle">
                  {t(`${task.title}`)}
                </button>
                {showTaskOptions && (
                  <img
                    src={chevronLeftIcon}
                    className="MyTime-expand-btw task-dropdown chevronDown theme-icon"
                    alt="zinzen schedule"
                  />
                )}
              </div>
              {showTaskOptions && <TaskOptions task={task} handleActionClick={handleActionClick} />}
            </div>
          </button>
        );
      })}
    </div>
  );
};
