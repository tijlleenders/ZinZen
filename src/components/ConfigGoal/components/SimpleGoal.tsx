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
  debouncedSave: (editMode: boolean, newFormState: FormState) => Promise<void>;
  isEditMode: boolean;
}

const SimpleGoal: React.FC<SimpleGoalProps> = ({
  formState,
  setFormState,
  scheduleStatus,
  getScheduleStatusText,
  debouncedSave,
  isEditMode,
}) => {
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
              const newState = { ...formState, simpleGoal: { due: formState.simpleGoal.due, duration: value } };
              setFormState(newState);
              debouncedSave(isEditMode, newState);
            }
          }}
        />

        <DueDate
          dateValue={formState.simpleGoal?.due ?? ""}
          handleDateChange={(newDate) => {
            const newState = { ...formState, simpleGoal: { due: newDate, duration: formState.simpleGoal!.duration } };
            setFormState(newState);
            debouncedSave(isEditMode, newState);
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
