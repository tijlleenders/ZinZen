import React from "react";

import chevronLeftIcon from "@assets/images/chevronLeft.svg";
import { useTranslation } from "react-i18next";
import { TaskItem } from "@src/models/TaskItem";
import { ITask } from "@src/Interfaces/Task";
import classNames from "classnames";
import { TaskOptions } from "./TaskOptions";
import TaskTiming from "./TaskTiming";

interface TaskItemProps {
  task: ITask;
  handleActionClick: (action: string) => void;
  isExpanded: boolean;
  onToggleExpand: (taskId: string, isTaskCompleted: boolean) => void;
  displayEndTime: boolean;
  taskDetails: { [goalid: string]: TaskItem };
}

const TaskItemComponent: React.FC<TaskItemProps> = ({
  task,
  handleActionClick,
  isExpanded,
  onToggleExpand,
  displayEndTime,
  taskDetails,
}) => {
  const { t } = useTranslation();

  const markDone = !!taskDetails[task.goalid]?.completedTodayTimings.find(
    (ele) => ele.start === task.start && ele.deadline === task.deadline,
  );

  return (
    <button
      className={classNames("MTL-taskItem simple", { completedTask: markDone })}
      style={{ borderLeft: `6px solid ${task.goalColor}` }}
      type="button"
      onClick={() => onToggleExpand(task.taskid, markDone)}
    >
      <div className={classNames("MTL-taskTiming-wrapper", { "show-end-time": isExpanded && displayEndTime })}>
        <TaskTiming start={task.start} deadline={task.deadline} />
      </div>
      <div className="MTL-taskTitleActionWrapper">
        <span style={{ textDecorationColor: task.goalColor }} className="MTL-taskTitle">
          {t(`${task.title}`)}
        </span>
        {isExpanded && <TaskOptions task={task} handleActionClick={handleActionClick} />}
      </div>

      {isExpanded && (
        <img src={chevronLeftIcon} className="MyTime-free-hours-text chevronDown theme-icon" alt="zinzen schedule" />
      )}
    </button>
  );
};

export default TaskItemComponent;
