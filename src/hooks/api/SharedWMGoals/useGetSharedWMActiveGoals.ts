import { getActiveSharedWMGoals } from "@src/api/SharedWMAPI";
import { SHARED_WM_GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";
import { GoalItem } from "@src/models/GoalItem";
import { QueryResult } from "@src/hooks/types";

export const useGetSharedWMActiveGoals = (parentGoalId: string, relId?: string): QueryResult<GoalItem[]> => {
  const { data, isLoading } = useQuery({
    queryFn: () => getActiveSharedWMGoals(parentGoalId, relId),
    queryKey: SHARED_WM_GOAL_QUERY_KEYS.list("active", parentGoalId),
    enabled: !!parentGoalId,
  });

  return { data, isLoading };
};
