import { getGoalById } from "@src/api/GoalsAPI";
import { useQuery } from "react-query";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";

export const useGetGoalById = (goalId: string | undefined, disabled = false) => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: GOAL_QUERY_KEYS.detail(goalId || ""),
    queryFn: () => {
      if (!goalId) {
        throw new Error("Goal ID is required");
      }
      return getGoalById(goalId);
    },
    cacheTime: 0,
    enabled: !disabled && !!goalId,
  });

  return { data, isLoading, isError, isSuccess };
};
