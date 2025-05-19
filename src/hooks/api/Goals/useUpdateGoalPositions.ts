import { GoalItem } from "@src/models/GoalItem";
import { useMutation, useQueryClient } from "react-query";
import { updatePositionIndex } from "@src/api/GCustomAPI";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useParams } from "react-router-dom";

interface UpdateGoalPositionsParams {
  goals: GoalItem[];
}

export const useUpdateGoalPositions = () => {
  const queryClient = useQueryClient();
  const { parentId = "root" } = useParams();

  return useMutation({
    mutationFn: async ({ goals }: UpdateGoalPositionsParams) => {
      const posIndexPromises = goals.map(async (goal, index) => updatePositionIndex(goal.id, index));
      await Promise.all(posIndexPromises);
    },
    onMutate: async ({ goals }) => {
      await queryClient.cancelQueries({
        queryKey: GOAL_QUERY_KEYS.list("active", parentId),
      });

      const previousGoals = queryClient.getQueryData<GoalItem[]>(GOAL_QUERY_KEYS.list("active", parentId));

      queryClient.setQueryData<GoalItem[]>(GOAL_QUERY_KEYS.list("active", parentId), goals);

      return { previousGoals, parentId };
    },
    onError: (err, variables, context) => {
      if (context?.previousGoals && context?.parentId) {
        queryClient.setQueryData<GoalItem[]>(GOAL_QUERY_KEYS.list("active", context.parentId), context.previousGoals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(GOAL_QUERY_KEYS.list("active", parentId));
    },
  });
};
