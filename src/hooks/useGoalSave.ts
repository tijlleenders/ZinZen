import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { GoalItem, TGoalCategory } from "@src/models/GoalItem";
import { FormState, getFinalTags } from "@src/components/ConfigGoal/ConfigGoal.helper";
import { unarchiveUserGoal } from "@src/api/GoalsAPI";
import { suggestedGoalState } from "@src/store/SuggestedGoalState";
import { useAddGoal } from "@src/hooks/api/Goals/mutations/useAddGoal";
import { useEditGoal } from "@src/hooks/api/Goals/mutations/useEditGoal";
import { ILocationState } from "@src/Interfaces";

interface UseGoalSaveProps {
  goal: GoalItem;
  parentGoal: GoalItem | undefined;
  activeGoalId: string;
  type: TGoalCategory;
  isModal: boolean;
}

export const useGoalSave = ({ goal, parentGoal, activeGoalId, type, isModal }: UseGoalSaveProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [suggestedGoal, setSuggestedGoal] = useRecoilState(suggestedGoalState);
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

    if (suggestedGoal) {
      await unarchiveUserGoal(suggestedGoal);
      navigate(`/goals/${suggestedGoal.parentGoalId === "root" ? "" : suggestedGoal.parentGoalId}`, {
        state: { ...location.state } as ILocationState,
        replace: true,
      });
      setSuggestedGoal(null);
    }
  };

  return { handleSave };
};
