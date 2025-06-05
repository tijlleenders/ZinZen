import React from "react";
import { useTranslation } from "react-i18next";
import { GoalItem } from "@src/models/GoalItem";
import { useSearchParams } from "react-router-dom";
import ColorPicker from "./ColorPicker";
import ArchivedAutoComplete from "./ArchivedAutoComplete";
import { FormState } from "../ConfigGoal.helper";

interface ConfigGoalHeaderProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onSuggestionClick: (selectedGoal: GoalItem) => Promise<void>;
  isModal?: boolean;
}

const ConfigGoalHeader: React.FC<ConfigGoalHeaderProps> = ({ formState, setFormState, onSuggestionClick, isModal }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const titlePlaceholder = t(`${type !== "Budget" ? "goal" : "budget"}Title`);

  return (
    <div style={{ textAlign: "left" }} className="header-title">
      {isModal && (
        <ColorPicker
          color={formState.goalColor}
          setColor={(color: string) => setFormState((prev) => ({ ...prev, goalColor: color }))}
          className="modal-position"
        />
      )}
      <ArchivedAutoComplete
        placeholder={titlePlaceholder}
        inputValue={formState.title}
        onGoalSelect={onSuggestionClick}
        onInputChange={(value) => setFormState((prev) => ({ ...prev, title: value }))}
      />
    </div>
  );
};

export default ConfigGoalHeader;
