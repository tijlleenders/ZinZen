import { getActiveGoals } from "@src/api/GoalsAPI";
import { useQuery } from "react-query";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";

export const useGetActiveGoals = (parentGoalId: string) => {
  const {
    data: activeGoals,
    isLoading,
    error,
  } = useQuery({
    queryKey: GOAL_QUERY_KEYS.list("active", parentGoalId),
    queryFn: () => getActiveGoals(parentGoalId),
  });
  return { activeGoals, isLoading, error };
};
