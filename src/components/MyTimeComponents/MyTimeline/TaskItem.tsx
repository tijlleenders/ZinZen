import React from "react";

import chevronLeftIcon from "@assets/images/chevronLeft.svg";
import { useTranslation } from "react-i18next";
import { TaskItem } from "@src/models/TaskItem";
import { ITask, TaskAction } from "@src/Interfaces/Task";
import { getTimePart } from "@src/utils";
import { GoalTiming } from "./GoalTiming";
import { TaskOptions } from "./TaskOptions";

interface TaskItemProps {
  task: ITask;
  handleActionClick: (actionName: TaskAction, task: ITask) => Promise<void | null>;
  showTaskOptions: boolean;
  displayEndTime: boolean;
  handleClick: (task: ITask, isTaskCompleted: boolean) => void;
  taskDetails: { [goalid: string]: TaskItem };
}

const TaskItemComponent = ({
  task,
  handleActionClick,
  showTaskOptions,
  displayEndTime,
  handleClick,
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
      className={`MTL-taskItem simple ${markDone ? "completedTask" : ""}`}
      style={{ borderLeft: `6px solid ${task.goalColor}` }}
      type="button"
      onClick={() => handleClick(task, markDone)}
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
        {showTaskOptions && <TaskOptions task={task} handleActionClick={handleActionClick} />}
      </div>

      {showTaskOptions && (
        <img src={chevronLeftIcon} className="MyTime-expand-btw chevronDown theme-icon" alt="zinzen schedule" />
      )}
    </button>
  );
};

export default TaskItemComponent;
