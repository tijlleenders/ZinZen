import { getDeletedGoalById } from "@src/api/TrashAPI";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";

export const useGetDeletedGoalById = (goalId: string | undefined, disabled = false) => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: GOAL_QUERY_KEYS.detail(goalId || ""),
    queryFn: () => {
      if (!goalId) {
        throw new Error("Goal ID is required");
      }
      return getDeletedGoalById(goalId);
    },
    enabled: !disabled && !!goalId,
  });

  return { data, isLoading, isError, isSuccess };
};
