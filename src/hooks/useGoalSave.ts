import { GoalItem, TGoalCategory } from "@src/models/GoalItem";
import { FormState, getFinalTags } from "@src/components/ConfigGoal/ConfigGoal.helper";
import { useAddGoal } from "@src/hooks/api/Goals/mutations/useAddGoal";
import { useEditGoal } from "@src/hooks/api/Goals/mutations/useEditGoal";

interface UseGoalSaveProps {
  goal: GoalItem;
  parentGoal: GoalItem | undefined;
  activeGoalId: string;
  type: TGoalCategory;
  isModal: boolean;
}

export const useGoalSave = ({ goal, parentGoal, activeGoalId, type, isModal }: UseGoalSaveProps) => {
  const { addGoalMutation } = useAddGoal();
  const { editGoalMutation } = useEditGoal(activeGoalId, isModal);

  const handleSave = async (editMode: boolean, formState: FormState) => {
    if (formState.title.trim().length) {
      if (editMode) {
        editGoalMutation({
          goal: getFinalTags({ goal, formState, type }),
          hintOption: formState.hintOption,
        });
      } else {
        addGoalMutation({
          newGoal: getFinalTags({ goal, formState, type, parentGoal }),
          hintOption: formState.hintOption,
          parentGoal,
        });
      }
    }
  };

  return { handleSave };
};
