import React from "react";
import { ScheduleStatus } from "@src/Interfaces";
import HintToggle from "./HintToggle";
import { FormState } from "../ConfigGoal.helper";
import Duration from "../Duration";
import DueDate from "../DueDate";

interface SimpleGoalProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  scheduleStatus: ScheduleStatus | null;
  getScheduleStatusText: (status: ScheduleStatus) => string;
}

const SimpleGoal: React.FC<SimpleGoalProps> = ({ formState, setFormState, scheduleStatus, getScheduleStatusText }) => {
  return (
    <div className="d-flex f-col gap-16">
      <div className="action-btn-container">
        <HintToggle
          setHints={(value: boolean) => setFormState((prev) => ({ ...prev, hintOption: value }))}
          defaultValue={formState.hintOption}
        />
      </div>
      <div className="place-middle justify-fs gap-16">
        <Duration
          value={formState.simpleGoal?.duration ?? ""}
          onChange={(value) => {
            if (formState.simpleGoal) {
              setFormState((prev) => ({
                ...prev,
                simpleGoal: {
                  due: prev.simpleGoal!.due,
                  duration: value,
                },
              }));
            }
          }}
        />

        <DueDate
          dateValue={formState.simpleGoal?.due ?? ""}
          handleDateChange={(newDate) => {
            setFormState((prev) => ({
              ...prev,
              simpleGoal: { due: newDate, duration: prev.simpleGoal!.duration },
            }));
          }}
        />
      </div>
      {scheduleStatus && formState.simpleGoal?.duration && (
        <div className={`schedule-status ${scheduleStatus}`}>{getScheduleStatusText(scheduleStatus)}</div>
      )}
    </div>
  );
};

export default SimpleGoal;
