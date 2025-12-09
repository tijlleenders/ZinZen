import { getDeletedGoalById } from "@src/api/TrashAPI";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";
import { TrashItem } from "@src/models/TrashItem";
import { QueryResult } from "@src/hooks/types";

export const useGetDeletedGoalById = (goalId: string | undefined, disabled = false): QueryResult<TrashItem> => {
  const { data, isLoading } = useQuery({
    queryKey: GOAL_QUERY_KEYS.detail(goalId || ""),
    queryFn: () => {
      if (!goalId) {
        throw new Error("Goal ID is required");
      }
      return getDeletedGoalById(goalId);
    },
    enabled: !disabled && !!goalId,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading };
};
