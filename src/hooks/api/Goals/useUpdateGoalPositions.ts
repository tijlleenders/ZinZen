import { GoalItem } from "@src/models/GoalItem";
import { updatePositionIndex } from "@src/api/GCustomAPI";
import { useMutation, useQueryClient } from "react-query";

interface UpdateGoalPositionsParams {
  goals: GoalItem[];
}

export const useUpdateGoalPositions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goals }: UpdateGoalPositionsParams) => {
      const posIndexPromises = goals.map(async (goal, index) => updatePositionIndex(goal.id, index));
      await Promise.all(posIndexPromises);
    },
    onMutate: async ({ goals }) => {
      await queryClient.cancelQueries({ queryKey: ["activeRootGoals"] });
      const previousGoals = queryClient.getQueryData(["activeRootGoals"]);
      queryClient.setQueryData(["activeRootGoals"], goals);
      return { previousGoals };
    },
    onError: (err, newGoals, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(["activeRootGoals"], context.previousGoals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["activeRootGoals"] });
    },
  });
};
