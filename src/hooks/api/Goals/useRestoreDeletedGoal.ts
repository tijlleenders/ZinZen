import { useMutation, useQueryClient } from "react-query";
import { displayToast } from "@src/store";
import plingSound from "@assets/pling.mp3";
import { restoreUserGoal } from "@src/api/TrashAPI";
import { GoalItem } from "@src/models/GoalItem";
import { useSetRecoilState } from "recoil";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";

const restoreGoalSound = new Audio(plingSound);

export const useRestoreDeletedGoal = () => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);

  const { mutate: restoreDeletedGoalMutation, isLoading } = useMutation({
    mutationFn: ({ goal }: { goal: GoalItem }) => {
      console.time("goal-restore-mutation-execution");
      return restoreUserGoal(goal, goal.typeOfGoal === "shared");
    },
    mutationKey: ["goals"],
    onMutate: async ({ goal }) => {
      window.history.back();
      console.time("goal-restore-optimistic-update");
      await queryClient.cancelQueries({ queryKey: GOAL_QUERY_KEYS.list("trash", "") });

      const previousGoals = queryClient.getQueryData(GOAL_QUERY_KEYS.list("trash", ""));

      queryClient.setQueryData(GOAL_QUERY_KEYS.list("trash", ""), (old: GoalItem[] = []) => {
        return old.filter((g) => g.id !== goal.id);
      });

      // Optimistically add to active goals
      queryClient.setQueryData(GOAL_QUERY_KEYS.list("active", goal.parentGoalId), (old: GoalItem[] = []) => {
        return [goal, ...old];
      });
      console.timeEnd("goal-restore-optimistic-update");
      setShowToast({
        open: true,
        message: "Deleted goal restored successfully",
        extra: "",
      });
      restoreGoalSound.play();
      return { previousGoals };
    },
    onError: (error, { goal }, context) => {
      window.history.back();
      console.timeEnd("goal-restore-mutation-execution");
      if (context?.previousGoals) {
        queryClient.setQueryData(GOAL_QUERY_KEYS.list("trash", ""), context.previousGoals);
        // Remove from active goals if it was added
        queryClient.setQueryData(GOAL_QUERY_KEYS.list("active", goal.parentGoalId), (old: GoalItem[] = []) => {
          return old.filter((g) => g.id !== goal.id);
        });
      }
      console.error(error);
      setShowToast({
        open: true,
        message: "Failed to restore deleted goal",
        extra: "",
      });
    },
    onSettled: (_, __, { goal }) => {
      console.timeEnd("goal-restore-mutation-execution");
      queryClient.invalidateQueries(GOAL_QUERY_KEYS.list("trash", ""));
      queryClient.invalidateQueries(GOAL_QUERY_KEYS.list("active", goal.parentGoalId));
    },
  });

  return { restoreDeletedGoalMutation, isLoading };
};
