import { getDeletedGoals } from "@src/api/TrashAPI";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";

export const useGetDeletedGoals = (parentGoalId: string) => {
  const {
    data: deletedGoals,
    isLoading,
    error,
  } = useQuery({
    queryKey: GOAL_QUERY_KEYS.list("deleted", parentGoalId),
    queryFn: () => getDeletedGoals(parentGoalId),
  });
  return { deletedGoals, isLoading, error };
};
