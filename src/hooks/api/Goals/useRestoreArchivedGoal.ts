import { unarchiveUserGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { useMutation, useQueryClient } from "react-query";

import plingSound from "@assets/pling.mp3";
import { displayToast, lastAction } from "@src/store";
import { useSetRecoilState } from "recoil";
import { GoalActions } from "@src/constants/actions";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";

const restoreGoalSound = new Audio(plingSound);

export const useRestoreArchivedGoal = () => {
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ goal }: { goal: GoalItem }) => unarchiveUserGoal(goal),
    onSuccess: (_data, { goal }) => {
      setLastAction(GoalActions.GOAL_RESTORED);
      queryClient.invalidateQueries(GOAL_QUERY_KEYS.list("archived", goal.parentGoalId));
      queryClient.invalidateQueries(GOAL_QUERY_KEYS.list("active", goal.parentGoalId));
      queryClient.invalidateQueries(["reminders"]);
      restoreGoalSound.play();
    },
    onError: () => {
      setShowToast({
        open: true,
        message: "Failed to restore archived goal",
        extra: "",
      });
    },
  });

  return { mutate, isLoading };
};
