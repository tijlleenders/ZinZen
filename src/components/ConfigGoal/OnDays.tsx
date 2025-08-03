import React from "react";
import { t } from "i18next";
import { FormState } from "./ConfigGoal.helper";
import "./OnDays.scss";

interface OnDaysProps {
  onDays: string[];
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  budgetGoal: FormState["budgetGoal"];
  debouncedSave: (editMode: boolean, newFormState: FormState) => Promise<void>;
  isEditMode: boolean;
  formState: FormState;
}

const OnDays = ({ onDays, setFormState, budgetGoal, debouncedSave, isEditMode, formState }: OnDaysProps) => {
  return (
    <>
      {onDays.map((d) => (
        <span
          onClickCapture={() => {
            const newOnArray = budgetGoal?.on.includes(d)
              ? [...(budgetGoal?.on?.filter((ele: string) => ele !== d) ?? [])]
              : [...(budgetGoal?.on ?? []), d];

            const newNumberOfDays = newOnArray.length;

            const newState = {
              ...formState,
              budgetGoal: {
                ...budgetGoal!,
                on: newOnArray,
                perWeekHrs: {
                  min: (budgetGoal?.perDayHrs?.min ?? 0) * newNumberOfDays,
                  max: (budgetGoal?.perDayHrs?.max ?? 0) * newNumberOfDays,
                },
              },
            };

            setFormState(newState);
            debouncedSave(isEditMode, newState);
          }}
          className={`on_day ${budgetGoal?.on.includes(d) ? "selected" : ""}`}
          key={d}
        >
          {t(d)[0]}
        </span>
      ))}
    </>
  );
};

export default OnDays;
