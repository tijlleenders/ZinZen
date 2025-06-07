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
            setFormState((prev) => ({
              ...prev,
              budgetGoal: {
                ...prev.budgetGoal!,
                on: prev.budgetGoal?.on.includes(d)
                  ? [...(prev.budgetGoal?.on?.filter((ele: string) => ele !== d) ?? [])]
                  : [...(prev.budgetGoal?.on ?? []), d],
              },
            }));
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
