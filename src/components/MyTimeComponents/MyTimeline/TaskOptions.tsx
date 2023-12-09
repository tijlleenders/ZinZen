import React from "react";
import { ITask } from "@src/Interfaces/Task";

interface TaskOptionsProps {
  task: ITask;
  handleActionClick: (action: string, task: ITask) => void;
}

export const TaskOptions: React.FC<TaskOptionsProps> = ({ task, handleActionClick }) => {
  return (
    <div className="MTL-options">
      <button type="button" onClick={() => handleActionClick("Skip", task)}>
        Skip
      </button>
      <div />
      <button type="button" onClick={() => handleActionClick("Reschedule", task)}>
        Reschedule
      </button>
      <div />
      <button type="button" onClick={() => handleActionClick("Done", task)}>
        Done
      </button>
      <div />
      <button type="button" onClick={() => handleActionClick("Focus", task)}>
        Focus
      </button>
      <div />
    </div>
  );
};
