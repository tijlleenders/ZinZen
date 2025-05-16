import { useMutation, useQueryClient } from "react-query";
import { displayToast, lastAction } from "@src/store";

import plingSound from "@assets/pling.mp3";
import { restoreUserGoal } from "@src/api/TrashAPI";
import { GoalActions } from "@src/constants/actions";
import { GoalItem } from "@src/models/GoalItem";
import { useSetRecoilState } from "recoil";

const restoreGoalSound = new Audio(plingSound);

export const useRestoreDeletedGoal = () => {
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);
  const queryClient = useQueryClient();

  const { mutate: restoreDeletedGoalMutation, isLoading } = useMutation({
    mutationFn: ({ goal }: { goal: GoalItem }) => {
      return restoreUserGoal(goal, goal.typeOfGoal === "shared");
    },
    onSuccess: (_data, { goal }) => {
      setLastAction(GoalActions.GOAL_RESTORED);
      queryClient.invalidateQueries({ queryKey: ["activeRootGoals"] });
      queryClient.invalidateQueries({ queryKey: ["deletedGoals", goal.parentGoalId] });
      setShowToast({
        open: true,
        message: "Deleted goal restored successfully",
        extra: "",
      });
      restoreGoalSound.play();
    },
    onError: () => {
      setShowToast({
        open: true,
        message: "Failed to restore deleted goal",
        extra: "",
      });
    },
  });

  return { restoreDeletedGoalMutation, isLoading };
};
