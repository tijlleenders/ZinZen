/* eslint-disable react/require-default-props */
import React, { useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { GoalItem } from "@src/models/GoalItem";
import { useLocation, useSearchParams } from "react-router-dom";
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
const ConfigGoalHeader = memo(function ConfigGoalHeader({
  formState,
  setFormState,
  isModal,
  debouncedSave,
  isEditMode,
}: ConfigGoalHeaderProps) {
  const { t } = useTranslation();
  const { openEditMode } = useGoalStore();

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const location = useLocation();

  const titlePlaceholder = t(`${type !== "Budget" ? "goal" : "budget"}Title`);

  const handleTitleChange = useCallback(
    (value: string) => {
      const newState = { ...formState, title: value };
      setFormState(newState);
      debouncedSave(isEditMode, newState);
    },
    [formState, setFormState, debouncedSave, isEditMode],
  );

  const setSuggestedGoal = useSetRecoilState(suggestedGoalState);

  const onSuggestionClick = useCallback(
    async (selectedGoal: GoalItem) => {
      const updatedGoalsHistory = await getHistoryUptoGoal(selectedGoal.parentGoalId);
      const newState: ILocationState = {
        ...location.state,
        goalsHistory: updatedGoalsHistory,
      };
      setSuggestedGoal(selectedGoal);
      openEditMode(selectedGoal, newState);
    },
    [location.state, setSuggestedGoal, openEditMode],
  );

  const handleColorChange = useCallback(
    (color: string) => setFormState((prev) => ({ ...prev, goalColor: color })),
    [setFormState],
  );

  return (
    <div style={{ textAlign: "left" }} className="header-title">
      {isModal && <ColorPicker color={formState.goalColor} setColor={handleColorChange} className="modal-position" />}
      <ArchivedAutoComplete
        placeholder={titlePlaceholder}
        inputValue={formState.title}
        onGoalSelect={onSuggestionClick}
        isModal={isModal}
        onInputChange={handleTitleChange}
      />
    </div>
  );
});

export default ConfigGoalHeader;
