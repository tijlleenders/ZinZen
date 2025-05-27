import { getActiveSharedWMGoals } from "@src/api/SharedWMAPI";
import { SHARED_WM_GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";

export const useGetSharedWMActiveGoals = (parentGoalId: string, relId?: string) => {
  const {
    data: activeSharedWMGoals,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryFn: () => getActiveSharedWMGoals(parentGoalId, relId),
    queryKey: SHARED_WM_GOAL_QUERY_KEYS.list("active", parentGoalId),
    enabled: !!parentGoalId,
  });

  return { activeSharedWMGoals, isLoading, isError, isSuccess };
};
