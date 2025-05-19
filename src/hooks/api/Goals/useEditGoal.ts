import useGoalActions from "@src/hooks/useGoalActions";
import { GoalItem } from "@src/models/GoalItem";
import { displayToast, lastAction } from "@src/store";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import plingSound from "@assets/pling.mp3";
import { suggestedGoalState } from "@src/store/SuggestedGoalState";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { GoalActions } from "@src/constants/actions";

const editGoalSound = new Audio(plingSound);

type EditGoalMutation = {
  goal: GoalItem;
  hintOption: boolean;
};

export const useEditGoal = () => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);
  const suggestedGoal = useRecoilValue(suggestedGoalState);
  const { updateGoal } = useGoalActions();
  const setLastAction = useSetRecoilState(lastAction);

  const { mutate: editGoalMutation, isLoading: isEditingGoal } = useMutation({
    mutationFn: ({ goal, hintOption }: EditGoalMutation) => updateGoal(goal, hintOption),

    onSuccess: (_, { goal }) => {
      queryClient.invalidateQueries({
        queryKey: [["scheduler"], ["reminders"]],
      });
      queryClient.invalidateQueries({ queryKey: GOAL_QUERY_KEYS.list("active", goal.parentGoalId) });

      setShowToast({
        open: true,
        message: suggestedGoal ? "Goal (re)created!" : "Goal updated!",
        extra: "",
      });

      editGoalSound.play();
      setLastAction(GoalActions.GOAL_UPDATED);
    },

    onError: (error: Error) => {
      console.error("Failed to update goal:", error);
      setShowToast({
        open: true,
        message: "Failed to update goal. Please try again.",
        extra: "",
      });
    },
  });

  return { editGoalMutation, isEditingGoal };
};
