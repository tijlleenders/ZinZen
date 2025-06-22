import React from "react";
import { t } from "i18next";
import { FormState } from "./ConfigGoal.helper";
import "./OnDays.scss";

interface OnDaysProps {
  onDays: string[];
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  budgetGoal: FormState["budgetGoal"];
}

const OnDays = ({ onDays, setFormState, budgetGoal }: OnDaysProps) => {
  return (
    <>
      {onDays.map((d) => (
        <span
          onClickCapture={() => {
            setFormState((prev) => {
              const newOnArray = prev.budgetGoal?.on.includes(d)
                ? [...(prev.budgetGoal?.on?.filter((ele: string) => ele !== d) ?? [])]
                : [...(prev.budgetGoal?.on ?? []), d];

              const newNumberOfDays = newOnArray.length;

              return {
                ...prev,
                budgetGoal: {
                  ...prev.budgetGoal!,
                  on: newOnArray,
                  perWeekHrs: {
                    min: (prev.budgetGoal?.perDayHrs?.min ?? 0) * newNumberOfDays,
                    max: (prev.budgetGoal?.perDayHrs?.max ?? 0) * newNumberOfDays,
                  },
                },
              };
            });
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
