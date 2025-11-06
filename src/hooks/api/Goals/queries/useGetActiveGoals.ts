import { getActiveGoals } from "@src/api/GoalsAPI";
import { useQuery } from "react-query";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { priotizeImpossibleGoals } from "@src/utils/priotizeImpossibleGoals";
import { GoalItem } from "@src/models/GoalItem";
import { QueryResult } from "@src/hooks/types";

export const useGetActiveGoals = (parentGoalId: string): QueryResult<GoalItem[]> => {
  const { data: activeGoals, isLoading } = useQuery({
    queryKey: GOAL_QUERY_KEYS.list("active", parentGoalId),
    queryFn: async () => {
      const goals = await getActiveGoals(parentGoalId);
      try {
        return await priotizeImpossibleGoals(goals);
      } catch (prioritizationError) {
        console.error("Error prioritizing impossible goals:", prioritizationError);
        return goals;
      }
    },
  });
  return { data: activeGoals, isLoading };
};
