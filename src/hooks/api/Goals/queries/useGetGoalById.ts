import { getGoalById } from "@src/api/GoalsAPI";
import { useQuery } from "react-query";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { GoalItem } from "@src/models/GoalItem";
import { QueryResult } from "@src/hooks/types";

export const useGetGoalById = (goalId: string | undefined, disabled = false): QueryResult<GoalItem> => {
  const { data, isLoading } = useQuery({
    queryKey: GOAL_QUERY_KEYS.detail(goalId || ""),
    queryFn: () => {
      if (!goalId) {
        throw new Error("Goal ID is required");
      }
      return getGoalById(goalId);
    },
    enabled: !disabled && !!goalId,
  });

  return { data, isLoading };
};
