import React from "react";
import { useTranslation } from "react-i18next";
import { GoalItem } from "@src/models/GoalItem";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ISubGoalHistory } from "@src/store/GoalsState";
import { getHistoryUptoGoal } from "@src/helpers/GoalProcessor";
import { ILocationState } from "@src/Interfaces";
import { useSetRecoilState } from "recoil";
import { suggestedGoalState } from "@src/store/SuggestedGoalState";
import useGoalStore from "@src/hooks/useGoalStore";
import { FormState } from "../ConfigGoal.helper";
import ColorPicker from "./ColorPicker";
import ArchivedAutoComplete from "./ArchivedAutoComplete";

interface ConfigGoalHeaderProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  isModal?: boolean;
  debouncedSave: (editMode: boolean, newFormState: FormState) => Promise<void>;
  isEditMode: boolean;
}

const ConfigGoalHeader: React.FC<ConfigGoalHeaderProps> = ({
  formState,
  setFormState,
  isModal,
  debouncedSave,
  isEditMode,
}) => {
  const { t } = useTranslation();
  const { openEditMode } = useGoalStore();

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const location = useLocation();

  const prevGoalHistory = location.state?.goalsHistory as ISubGoalHistory[];

  const titlePlaceholder = t(`${type !== "Budget" ? "goal" : "budget"}Title`);

  const handleTitleChange = (value: string) => {
    const newState = { ...formState, title: value };
    setFormState(newState);
    if (!isModal) {
      const currentGoalsHistory = location.state?.goalsHistory || [];
      const updatedGoalsHistory =
        currentGoalsHistory.length > 0
          ? [
              ...currentGoalsHistory.slice(0, -1),
              {
                ...currentGoalsHistory[currentGoalsHistory.length - 1],
                goalTitle: value,
              },
            ]
          : [
              {
                goalID: prevGoalHistory?.[prevGoalHistory.length - 1]?.goalID || "",
                goalTitle: value,
                goalColor: formState.goalColor,
              },
            ];

      navigate(".", {
        replace: true,
        state: {
          goalsHistory: updatedGoalsHistory,
        },
      });
    }
    debouncedSave(isEditMode, newState);
  };

  const setSuggestedGoal = useSetRecoilState(suggestedGoalState);

  const onSuggestionClick = async (selectedGoal: GoalItem) => {
    const updatedGoalsHistory = await getHistoryUptoGoal(selectedGoal.parentGoalId);
    const newState: ILocationState = {
      ...location.state,
      goalsHistory: updatedGoalsHistory,
    };
    setSuggestedGoal(selectedGoal);
    openEditMode(selectedGoal, newState);
  };

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
        isModal={isModal}
        onInputChange={(value) => handleTitleChange(value)}
      />
    </div>
  );
};

export default ConfigGoalHeader;
