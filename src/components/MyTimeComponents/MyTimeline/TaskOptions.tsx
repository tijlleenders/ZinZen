import React from "react";
import { ITask } from "@src/Interfaces/Task";

type TaskAction = "Skip" | "Reschedule" | "Done" | "Focus" | "Goal";

interface TaskOptionsProps {
  task: ITask;
  handleActionClick: (action: TaskAction, task: ITask) => void;
}

const ActionButton: React.FC<{
  action: TaskAction;
  task: ITask;
  last?: boolean;
  onActionClick: (action: TaskAction, task: ITask) => void;
}> = ({ action, task, last, onActionClick }) => (
  <button type="button" onClick={() => onActionClick(action, task)} className={last ? "last-btn" : ""}>
    {action}
  </button>
);

ActionButton.defaultProps = {
  last: false,
};

export const TaskOptions: React.FC<TaskOptionsProps> = ({ task, handleActionClick }) => {
  return (
    <div className="MTL-options">
      <ActionButton action="Skip" task={task} onActionClick={handleActionClick} />
      <ActionButton action="Reschedule" task={task} onActionClick={handleActionClick} />
      <ActionButton action="Done" task={task} onActionClick={handleActionClick} />
      <ActionButton action="Focus" task={task} onActionClick={handleActionClick} />
      <ActionButton action="Goal" task={task} onActionClick={handleActionClick} last />
    </div>
  );
};
