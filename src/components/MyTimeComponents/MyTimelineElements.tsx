import { ITask } from "@src/Interfaces/Task";
import React from "react";

interface GoalTimingProps {
  startTime: string | null;
  endTime: string | null;
}

interface TaskOptionsProps {
  task: ITask;
  handleActionClick: (action: string, task: ITask) => void;
}

export const GoalTiming: React.FC<GoalTimingProps> = ({ startTime, endTime }) => {
  return (
    <div className="MTL-goalTiming">
      {startTime ? (
        <>
          <span>{parseInt(startTime, 10)}</span>
          <sup>00</sup>
        </>
      ) : (
        ""
      )}
      <span>&nbsp;-&nbsp;</span>
      {endTime ? (
        <>
          <span>{parseInt(endTime, 10)}</span>
          <sup>00</sup>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

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
