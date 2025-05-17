import { useMutation, useQueryClient } from "react-query";
import { GoalItem } from "@src/models/GoalItem";
import useGoalActions from "@src/hooks/useGoalActions";
import { GoalActions } from "@src/constants/actions";
import { useSetRecoilState } from "recoil";
import { displayToast, lastAction } from "@src/store";
import pageCrumplingSound from "@assets/page-crumpling-sound.mp3";

const pageCrumpleSound = new Audio(pageCrumplingSound);

export const useDeleteGoal = () => {
  const { deleteGoalAction } = useGoalActions();
  const queryClient = useQueryClient();
  const setLastAction = useSetRecoilState(lastAction);
  const setShowToast = useSetRecoilState(displayToast);

  const { mutate: deleteGoalMutation, isLoading: isDeletingGoal } = useMutation({
    mutationFn: (goal: GoalItem) => deleteGoalAction(goal),
    onSuccess: (_, { parentGoalId }) => {
      queryClient.invalidateQueries({ queryKey: ["activeGoals", parentGoalId] });
      queryClient.invalidateQueries({ queryKey: ["deletedGoals", parentGoalId] });
      queryClient.invalidateQueries({ queryKey: ["archivedGoals", parentGoalId] });
      setLastAction(GoalActions.GOAL_DELETED);
      setShowToast({
        open: true,
        message: "Moved to trash!",
        extra: "We'll delete it in 7 days.",
      });
      pageCrumpleSound.play();
    },
  });

  return { deleteGoalMutation, isDeletingGoal };
};
