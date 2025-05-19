import { useMutation } from "react-query";
import { GoalItem } from "@src/models/GoalItem";
import useGoalActions from "@src/hooks/useGoalActions";
import { GoalActions } from "@src/constants/actions";
import { useSetRecoilState } from "recoil";
import { displayToast, lastAction } from "@src/store";
import pageCrumplingSound from "@assets/page-crumpling-sound.mp3";

const pageCrumpleSound = new Audio(pageCrumplingSound);

export const useDeleteGoal = () => {
  const { deleteGoalAction } = useGoalActions();
  const setLastAction = useSetRecoilState(lastAction);
  const setShowToast = useSetRecoilState(displayToast);

  const { mutate: deleteGoalMutation, isLoading: isDeletingGoal } = useMutation({
    mutationFn: (goal: GoalItem) => deleteGoalAction(goal),
    mutationKey: ["goals"],
    onSuccess: () => {
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
