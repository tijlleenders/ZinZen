import { GoalItem } from "@src/models/GoalItem";
import { updatePositionIndex } from "@src/api/GCustomAPI";
import { useMutation, useQueryClient } from "react-query";
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
        queryKey: ["activeGoals", parentId],
      });

      const previousGoals = queryClient.getQueryData<GoalItem[]>(["activeGoals", parentId]);

      queryClient.setQueryData<GoalItem[]>(["activeGoals", parentId], goals);

      return { previousGoals, parentId };
    },
    onError: (err, variables, context) => {
      if (context?.previousGoals && context?.parentId) {
        queryClient.setQueryData<GoalItem[]>(["activeGoals", context.parentId], context.previousGoals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["activeGoals", parentId],
      });
    },
  });
};
