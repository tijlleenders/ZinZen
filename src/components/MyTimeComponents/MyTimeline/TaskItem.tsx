import React from "react";

import chevronLeftIcon from "@assets/images/chevronLeft.svg";
import { useTranslation } from "react-i18next";
import { TaskItem } from "@src/models/TaskItem";
import { ITask } from "@src/Interfaces/Task";
import { GoalTiming } from "./GoalTiming";
import { TaskOptions } from "./TaskOptions";
import { getTimePart } from "@src/utils";

interface TaskItemProps {
  task: ITask;
  handleActionClick: (action: string) => void;
  showTaskOptions: boolean;
  displayEndTime: boolean;
  handleToggleDisplayOptions: (taskId: string, isTaskCompleted: boolean) => void;
  taskDetails: { [goalid: string]: TaskItem };
}

const TaskItemComponent = ({
  task,
  handleActionClick,
  showTaskOptions,
  displayEndTime,
  handleToggleDisplayOptions,
  taskDetails,
}: TaskItemProps) => {
  const { t } = useTranslation();

  const startTime = getTimePart(task.start);
  const endTime = getTimePart(task.deadline);

  const markDone = !!taskDetails[task.goalid]?.completedTodayTimings.find(
    (ele) => ele.start === task.start && ele.deadline === task.deadline,
  );

  return (
    <button
      key={task.taskid}
      className={`${markDone ? "completedTask" : ""}`}
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
};

export default TaskItemComponent;
