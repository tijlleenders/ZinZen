import { useMutation, useQueryClient } from "react-query";
import { GoalItem } from "@src/models/GoalItem";
import useGoalActions from "@src/hooks/useGoalActions";
import { useSetRecoilState } from "recoil";
import { displayToast } from "@src/store";
import pageCrumplingSound from "@assets/page-crumpling-sound.mp3";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { ILocationState } from "@src/Interfaces";
import { useLocation } from "react-router-dom";
import { sendFinalUpdateOnGoal } from "@src/controllers/PubSubController";

const pageCrumpleSound = new Audio(pageCrumplingSound);

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  const { deleteGoalAction } = useGoalActions();
  const setShowToast = useSetRecoilState(displayToast);
  const { state }: { state: ILocationState } = useLocation();
  const subGoalsHistory = state?.goalsHistory || [];

  const ancestors = subGoalsHistory.map((ele) => ele.goalID);

  const { mutate: deleteGoalMutation, isLoading: isDeletingGoal } = useMutation({
    mutationFn: (goal: GoalItem) => {
      return deleteGoalAction(goal);
    },
    mutationKey: ["goals"],
    onMutate: async (goal: GoalItem) => {
      window.history.back();
      setShowToast({
        open: true,
        message: "Moved to trash!",
        extra: "We'll delete it in 7 days.",
      });
      pageCrumpleSound.play();

      await queryClient.cancelQueries({ queryKey: GOAL_QUERY_KEYS.list("active", goal.parentGoalId) });
      await queryClient.cancelQueries({ queryKey: GOAL_QUERY_KEYS.list("deleted", goal.parentGoalId) });

      console.time("goal-delete-optimistic-update");
      const previousActiveGoals = queryClient.getQueryData(GOAL_QUERY_KEYS.list("active", goal.parentGoalId));
      const previousTrashGoals = queryClient.getQueryData(GOAL_QUERY_KEYS.list("deleted", goal.parentGoalId));

      // Remove from active goals
      queryClient.setQueryData(GOAL_QUERY_KEYS.list("active", goal.parentGoalId), (old: GoalItem[] = []) => {
        return old.filter((g) => g.id !== goal.id);
      });

      // Add to trash
      queryClient.setQueryData(GOAL_QUERY_KEYS.list("deleted", goal.parentGoalId), (old: GoalItem[] = []) => {
        return [goal, ...old];
      });

      return { previousActiveGoals, previousTrashGoals };
    },
    onError: (error, goal, context) => {
      if (context?.previousActiveGoals) {
        queryClient.setQueryData(GOAL_QUERY_KEYS.list("active", goal.parentGoalId), context.previousActiveGoals);
      }
      if (context?.previousTrashGoals) {
        queryClient.setQueryData(GOAL_QUERY_KEYS.list("deleted", goal.parentGoalId), context.previousTrashGoals);
      }
      console.error(error);
      setShowToast({
        open: true,
        message: "Failed to delete goal",
        extra: "Please try again",
      });
    },
    onSettled: (_, __, goal) => {
      queryClient.invalidateQueries(GOAL_QUERY_KEYS.list("active", goal.parentGoalId));
      queryClient.invalidateQueries(GOAL_QUERY_KEYS.list("deleted", goal.parentGoalId));
    },
    onSuccess: (_, goal) => {
      sendFinalUpdateOnGoal(goal.id, "deleted", [...ancestors, goal.id], false).then(() => {
        console.log("Update Sent");
      });
    },
  });

  return { deleteGoalMutation, isDeletingGoal };
};
