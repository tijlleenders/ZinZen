import { getArchivedGoals } from "@src/api/GoalsAPI";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";

export const useGetArchivedGoals = (parentGoalId: string) => {
  const {
    data: archivedGoals,
    isLoading,
    error,
  } = useQuery({
    queryKey: GOAL_QUERY_KEYS.list("archived", parentGoalId),
    queryFn: () => {
      return getArchivedGoals(parentGoalId);
    },
  });
  return { archivedGoals, isLoading, error };
};
